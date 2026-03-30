"""DataUpdateCoordinator for the Sanremo YOU integration."""

from __future__ import annotations

import asyncio
from datetime import timedelta
import logging
import time

import aiohttp

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .api import SanremoYouApi, SanremoYouData, SanremoYouDeviceInfo
from .const import DOMAIN, SCAN_INTERVAL_SECONDS, WS_PORT, WS_RECONNECT_SECONDS, WS_THROTTLE_SECONDS

_LOGGER = logging.getLogger(__name__)


class SanremoYouCoordinator(DataUpdateCoordinator[SanremoYouData]):
    """Coordinator to manage data fetching from the Sanremo YOU machine.

    Uses WebSocket on port 81 for real-time updates (~1 Hz) and falls back
    to HTTP polling (key 150) every 5 seconds for data not available via WS
    (group temperature, settings, scheduler, device info).
    """

    def __init__(self, hass: HomeAssistant, api: SanremoYouApi) -> None:
        """Initialize the coordinator."""
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(seconds=SCAN_INTERVAL_SECONDS),
        )
        self.api = api
        self.device_info: SanremoYouDeviceInfo | None = None
        self._ws_task: asyncio.Task | None = None
        self._ws_connected: bool = False
        self._ws_last_update: float = 0.0

    # ── WebSocket lifecycle ──

    def start_websocket(self) -> None:
        """Start the WebSocket listener as a background task."""
        if self._ws_task is None or self._ws_task.done():
            self._ws_task = self.hass.async_create_background_task(
                self._ws_listener(), f"{DOMAIN}_ws_listener"
            )
            _LOGGER.debug("WebSocket listener task started")

    async def stop_websocket(self) -> None:
        """Stop the WebSocket listener task."""
        if self._ws_task and not self._ws_task.done():
            self._ws_task.cancel()
            try:
                await self._ws_task
            except asyncio.CancelledError:
                pass
            self._ws_task = None
            self._ws_connected = False
            _LOGGER.debug("WebSocket listener task stopped")

    @property
    def ws_connected(self) -> bool:
        """Return True if WebSocket is connected."""
        return self._ws_connected

    # ── WebSocket listener ──

    async def _ws_listener(self) -> None:
        """Listen to the WebSocket for real-time machine data.

        Connects to ws://<host>:81/, receives JSON status broadcasts
        at ~5 Hz, throttles entity updates to ~1 Hz, and reconnects
        on failure with a delay.
        """
        while True:
            try:
                async with aiohttp.ClientSession() as session:
                    url = f"ws://{self.api.host}:{WS_PORT}/"
                    async with session.ws_connect(url, heartbeat=20) as ws:
                        self._ws_connected = True
                        _LOGGER.info(
                            "WebSocket connected to %s:%d", self.api.host, WS_PORT
                        )
                        async for msg in ws:
                            if msg.type == aiohttp.WSMsgType.TEXT:
                                now = time.monotonic()
                                if now - self._ws_last_update >= WS_THROTTLE_SECONDS:
                                    self._process_ws_message(msg.data)
                                    self._ws_last_update = now
                            elif msg.type in (
                                aiohttp.WSMsgType.CLOSED,
                                aiohttp.WSMsgType.ERROR,
                            ):
                                break
            except asyncio.CancelledError:
                _LOGGER.debug("WebSocket listener cancelled")
                return
            except Exception as err:
                _LOGGER.debug("WebSocket error: %s", err)
            finally:
                self._ws_connected = False

            _LOGGER.debug(
                "WebSocket disconnected, reconnecting in %ds", WS_RECONNECT_SECONDS
            )
            try:
                await asyncio.sleep(WS_RECONNECT_SECONDS)
            except asyncio.CancelledError:
                return

    def _process_ws_message(self, raw: str) -> None:
        """Parse a WebSocket message and push updated data to entities."""
        data = self.api.parse_ws_message(raw, self.data)
        if data is not None:
            self.async_set_updated_data(data)

    # ── HTTP polling (fallback & supplementary data) ──

    async def _async_update_data(self) -> SanremoYouData:
        """Fetch data from the Sanremo YOU machine via HTTP.

        This runs on the coordinator's timer (every 5s). It fetches full
        system data via key 150 (which includes group temp, settings,
        scheduler — data not available from the WebSocket).

        When WebSocket is connected, the WS listener also pushes updates
        between HTTP polls for real-time fields.
        """
        try:
            data = await self.api.get_system_data()

            # Fetch device info on first poll
            if self.device_info is None:
                self.device_info = await self.api.get_device_info()

            # Merge static device_info fields into data
            if self.device_info:
                data.ip_address = data.ip_address or self.device_info.ip_address
                data.mac_address = data.mac_address or self.device_info.mac_address
                data.firmware_version = (
                    data.firmware_version or self.device_info.firmware_version
                )

            # Fetch lightweight status for RSSI and OTA (key 151)
            try:
                lw = await self.api.get_lightweight_status()
                if lw:
                    data.rssi = lw.get("rssi", 0)
                    data.ota_available = bool(lw.get("ota", False))
                    data.free_memory = lw.get("mem", data.free_memory)
            except Exception:
                pass  # Lightweight status fetch is best-effort

            # Fetch counters from clean API (includes totals)
            try:
                counters = await self.api.get_counters()
                if counters:
                    data.counter_dose_1 = counters.get("key1", data.counter_dose_1)
                    data.counter_dose_2 = counters.get("key2", data.counter_dose_2)
                    data.counter_dose_3 = counters.get("key3", data.counter_dose_3)
                    data.counter_continuous = counters.get("keyM", data.counter_continuous)
                    data.counter_paddle = counters.get("lever", data.counter_paddle)
                    data.counter_steam = counters.get("steam", data.counter_steam)
                    data.counter_tea = counters.get("tea", data.counter_tea)
                    data.counter_total = counters.get("totals", 0)
            except Exception:
                pass  # Counter fetch is best-effort

            # Preserve real-time WS fields if available
            if self._ws_connected and self.data is not None:
                data.group_status = self.data.group_status
                data.group_status_label = self.data.group_status_label
                data.status_phase = self.data.status_phase
                data.realtime_flow = self.data.realtime_flow
                data.counter_vol = self.data.counter_vol
                data.set_press_paddle = self.data.set_press_paddle
                data.app_scale_connection = self.data.app_scale_connection
                data.recipe_weight_setpoint = self.data.recipe_weight_setpoint
                data.cup_weight_from_scale = self.data.cup_weight_from_scale
                data.realtime_flow_from_scale = self.data.realtime_flow_from_scale

            return data

        except (aiohttp.ClientError, TimeoutError) as err:
            raise UpdateFailed(f"Error communicating with Sanremo YOU: {err}") from err
