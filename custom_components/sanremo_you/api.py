"""API client for the Sanremo YOU coffee machine."""

from __future__ import annotations

import asyncio
import json
import logging
from dataclasses import dataclass, field
from typing import Any

import aiohttp

from .const import (
    ALARM_BITS,
    API_KEY_GET_DEVICE_INFO,
    API_KEY_GET_LIGHTWEIGHT_STATUS,
    API_KEY_GET_SYSTEM_PARAMS,
    API_KEY_SAVE_SCHEDULER_DAY,
    API_KEY_SET_CLOCK,
    API_KEY_SET_SCHEDULER_DAY_STATUS,
    API_KEY_SET_SCHEDULER_STATUS,
    API_KEY_SET_VALUE,
    API_PATH,
    API_PATH_ACTION_ON,
    API_PATH_ACTION_PREFIX,
    API_PATH_ACTION_STANDBY,
    API_PATH_COUNTERS,
    API_PATH_DOSES,
    DAY_ECO_BIT,
    GROUP_STATUS_MAP,
    MACHINE_STATUS_MAP,
    PARAM_COFFEE_BOILER_TEMP,
    PARAM_GROUP_TEMP,
    PARAM_STEAM_BOILER_PRESSURE,
    SCHEDULER_IDX_DAYS_START,
    SCHEDULER_IDX_ENABLED,
    SCHEDULER_IDX_TIMES_START,
    SCHEDULER_NUM_SLOTS,
    SETTINGS_IDX_FILTER_HOLDER_TEMP_SETPOINT,
    SETTINGS_IDX_GROUP_TEMP_SETPOINT,
    SETTINGS_IDX_PRESSURE_STEAM_SETPOINT,
    SETTINGS_IDX_STEAM_HEATER_SETPOINT,
    SHOT_MODE_MAP,
    STATUS_IDX_ALARMS_CODE,
    STATUS_IDX_DEEP_SLEEP,
    STATUS_IDX_DOSE_TIME,
    STATUS_IDX_GROUP_TEMP,
    STATUS_IDX_HEATER_TEMP,
    STATUS_IDX_LEVEL_SENSOR,
    STATUS_IDX_MACHINE_STATUS,
    STATUS_IDX_COUNTER_VOL,
    STATUS_IDX_PUMP_PRESSURE,
    STATUS_IDX_REALTIME_FLOW,
    STATUS_IDX_SERVICE_HEATER_PRESSURE,
    STATUS_IDX_SERVICE_HEATER_TEMP,
    STATUS_IDX_SET_PRESS_PADDLE,
    STATUS_IDX_STATUS_PHASE,
    STATUS_IDX_WARNINGS,
    WARNING_BITS,
)

_LOGGER = logging.getLogger(__name__)


@dataclass
class SanremoYouData:
    """Parsed data from the Sanremo YOU machine."""

    # Status
    machine_status: int = 0
    machine_status_label: str = "Unknown"
    alarms_code: int = 0
    alarms_text: str = "None"
    warnings_code: int = 0
    warnings_text: str = "None"
    group_temperature: float = 0.0
    heater_temperature: float = 0.0
    service_heater_temperature: int = 0
    service_heater_pressure: float = 0.0
    pump_pressure: float = 0.0
    dose_time: float = 0.0
    level_sensor_status: int = 0
    deep_sleep_enabled: int = 0

    # Real-time brewing data (from WebSocket)
    group_status: int = 0
    group_status_label: str = "Idle"
    status_phase: int = 0
    realtime_flow: float = 0.0
    counter_vol: int = 0
    set_press_paddle: float = 0.0

    # Beanconqueror scale integration (from WebSocket)
    app_scale_connection: int = 0
    recipe_weight_setpoint: float = 0.0
    cup_weight_from_scale: float = 0.0
    realtime_flow_from_scale: float = 0.0

    # Counters
    daily_coffee: int = 0
    counter_dose_1: int = 0
    counter_dose_2: int = 0
    counter_dose_3: int = 0
    counter_continuous: int = 0
    counter_paddle: int = 0
    counter_steam: int = 0
    counter_tea: int = 0
    counter_total: int = 0

    # Settings (setpoints)
    setpoint_steam_heater: float = 0.0
    setpoint_group_temp: float = 0.0
    setpoint_filter_holder_temp: float = 0.0
    setpoint_pressure_steam: float = 0.0

    # Dose settings
    dose_key1: int = 0
    dose_key2: int = 0
    dose_key3: int = 0
    dose_tea: int = 0

    # Device info
    machine_name: str = ""
    firmware_version: str = ""
    wifi_signal: int = 0
    wifi_ssid: str = ""
    ip_address: str = ""
    mac_address: str = ""

    # Scheduler
    scheduler: SchedulerData | None = None

    # Diagnostics (firmware 0.13+)
    rssi: int = 0
    free_memory: int = 0
    ota_available: bool = False

    # Connectivity
    is_available: bool = False


@dataclass
class SanremoYouDeviceInfo:
    """Device info from key 105."""

    name: str = ""
    firmware_version: str = ""
    ip_address: str = ""
    mac_address: str = ""
    ssid: str = ""
    signal: int = 0


@dataclass
class SchedulerSlot:
    """A single scheduler time slot."""

    slot_id: int = 0
    enabled: bool = False
    on_hour: int = 0
    on_minute: int = 0
    off_hour: int = 0
    off_minute: int = 0
    eco_mode: bool = False
    days: list[bool] = field(default_factory=lambda: [False] * 7)  # Mon-Sun


@dataclass
class SchedulerData:
    """Scheduler configuration data."""

    enabled: bool = False
    slots: list[SchedulerSlot] = field(default_factory=lambda: [SchedulerSlot(slot_id=i) for i in range(SCHEDULER_NUM_SLOTS)])


def _parse_scheduler(scheduler_array: list[int]) -> SchedulerData:
    """Parse the scheduler array from key 150 response."""
    data = SchedulerData()

    if len(scheduler_array) < 17:
        return data

    data.enabled = bool(scheduler_array[SCHEDULER_IDX_ENABLED])

    for slot_idx in range(SCHEDULER_NUM_SLOTS):
        slot = SchedulerSlot(slot_id=slot_idx)

        # Parse ON/OFF times
        on_raw = scheduler_array[SCHEDULER_IDX_TIMES_START + slot_idx * 2]
        off_raw = scheduler_array[SCHEDULER_IDX_TIMES_START + slot_idx * 2 + 1]
        slot.on_hour = (on_raw >> 8) & 0xFF
        slot.on_minute = on_raw & 0xFF
        slot.off_hour = (off_raw >> 8) & 0xFF
        slot.off_minute = off_raw & 0xFF

        # Parse days + eco from packed byte
        days_raw = scheduler_array[SCHEDULER_IDX_DAYS_START + slot_idx // 2]
        if slot_idx % 2 == 1:
            days_raw = (days_raw >> 8) & 0xFF
        else:
            days_raw = days_raw & 0xFF

        slot.days = [bool(days_raw & (1 << i)) for i in range(7)]
        slot.eco_mode = bool(days_raw & (1 << DAY_ECO_BIT))

        # A slot is considered "enabled" if it has any day selected
        slot.enabled = any(slot.days)

        data.slots[slot_idx] = slot

    return data


def _decode_alarms(code: int, bit_map: dict[int, str]) -> str:
    """Decode alarm/warning bitfield to human-readable string."""
    if code == 0:
        return "None"
    active = []
    for bit, description in bit_map.items():
        if description and code & (1 << bit):
            active.append(description)
    return ", ".join(active) if active else "None"


class SanremoYouApi:
    """API client for the Sanremo YOU coffee machine."""

    def __init__(self, host: str, session: aiohttp.ClientSession) -> None:
        """Initialize the API client."""
        self._host = host
        self._session = session
        self._base_url = f"http://{host}{API_PATH}"

    @property
    def host(self) -> str:
        """Return the host."""
        return self._host

    # ── Low-level request helpers ──

    async def _post(self, data: dict[str, Any]) -> dict[str, Any]:
        """Send a POST request to the legacy /ajax/post endpoint."""
        try:
            async with self._session.post(
                self._base_url,
                data=data,
                timeout=aiohttp.ClientTimeout(total=10),
            ) as response:
                response.raise_for_status()
                return await response.json(content_type=None)
        except (aiohttp.ClientError, asyncio.TimeoutError) as err:
            _LOGGER.debug("API request failed: %s", err)
            raise

    async def _get(self, path: str) -> dict[str, Any] | None:
        """Send a GET request to the new REST API."""
        url = f"http://{self._host}{path}"
        try:
            async with self._session.get(
                url,
                timeout=aiohttp.ClientTimeout(total=10),
            ) as response:
                response.raise_for_status()
                return await response.json(content_type=None)
        except (aiohttp.ClientError, asyncio.TimeoutError) as err:
            _LOGGER.debug("GET %s failed: %s", path, err)
            raise

    # ── Device info ──

    async def get_device_info(self) -> SanremoYouDeviceInfo:
        """Get device info (key 105)."""
        result = await self._post({"key": API_KEY_GET_DEVICE_INFO})
        info = SanremoYouDeviceInfo()
        info.name = result.get("name", "SANREMO-YOU")
        info.firmware_version = result.get("fwVer", "")
        info.ip_address = result.get("currentIp", self._host)
        info.mac_address = result.get("mac", "")
        info.ssid = result.get("ssid", "")
        info.signal = result.get("signal", 0)
        return info

    # ── Lightweight status (key 151 — RSSI, OTA, memory) ──

    async def get_lightweight_status(self) -> dict[str, Any] | None:
        """Get lightweight status (key 151) for RSSI and OTA flag."""
        try:
            return await self._post({"key": API_KEY_GET_LIGHTWEIGHT_STATUS})
        except (aiohttp.ClientError, asyncio.TimeoutError):
            return None

    # ── Full system data (key 150 — used for HTTP polling fallback) ──

    async def get_system_data(self) -> SanremoYouData:
        """Get full system parameters (key 150)."""
        result = await self._post({"key": API_KEY_GET_SYSTEM_PARAMS})
        data = SanremoYouData()
        data.is_available = True

        status = result.get("status", [])
        settings = result.get("settings", [])

        # Parse status array
        if len(status) > STATUS_IDX_DEEP_SLEEP:
            data.machine_status = status[STATUS_IDX_MACHINE_STATUS]
            data.machine_status_label = MACHINE_STATUS_MAP.get(
                data.machine_status, f"Unknown ({data.machine_status})"
            )
            data.alarms_code = status[STATUS_IDX_ALARMS_CODE]
            data.alarms_text = _decode_alarms(data.alarms_code, ALARM_BITS)
            data.warnings_code = status[STATUS_IDX_WARNINGS]
            data.warnings_text = _decode_alarms(data.warnings_code, WARNING_BITS)
            data.group_temperature = status[STATUS_IDX_GROUP_TEMP] / 10
            data.heater_temperature = status[STATUS_IDX_HEATER_TEMP] / 10
            data.service_heater_temperature = status[STATUS_IDX_SERVICE_HEATER_TEMP]
            data.service_heater_pressure = status[STATUS_IDX_SERVICE_HEATER_PRESSURE] / 100
            data.pump_pressure = status[STATUS_IDX_PUMP_PRESSURE] / 10
            data.dose_time = status[STATUS_IDX_DOSE_TIME] / 10
            data.level_sensor_status = status[STATUS_IDX_LEVEL_SENSOR]
            data.deep_sleep_enabled = status[STATUS_IDX_DEEP_SLEEP]

        # Parse new status indices (firmware 0.13+)
        if len(status) > STATUS_IDX_SET_PRESS_PADDLE:
            data.status_phase = status[STATUS_IDX_STATUS_PHASE]
            data.counter_vol = status[STATUS_IDX_COUNTER_VOL]
            data.realtime_flow = status[STATUS_IDX_REALTIME_FLOW]
            data.set_press_paddle = status[STATUS_IDX_SET_PRESS_PADDLE]

        # Parse settings array
        if len(settings) > SETTINGS_IDX_PRESSURE_STEAM_SETPOINT:
            data.setpoint_steam_heater = settings[SETTINGS_IDX_STEAM_HEATER_SETPOINT] / 10
            data.setpoint_group_temp = settings[SETTINGS_IDX_GROUP_TEMP_SETPOINT] / 10
            data.setpoint_filter_holder_temp = settings[SETTINGS_IDX_FILTER_HOLDER_TEMP_SETPOINT] / 10
            data.setpoint_pressure_steam = settings[SETTINGS_IDX_PRESSURE_STEAM_SETPOINT] / 10

        # Parse scheduler
        scheduler_array = result.get("scheduler", [])
        if scheduler_array:
            data.scheduler = _parse_scheduler(scheduler_array)

        # Parse counters
        data.daily_coffee = result.get("dailyCoffee", 0)
        counters = result.get("counters", [])
        if len(counters) >= 14:
            data.counter_dose_1 = (counters[0] << 16) | counters[1]
            data.counter_dose_2 = (counters[2] << 16) | counters[3]
            data.counter_dose_3 = (counters[4] << 16) | counters[5]
            data.counter_continuous = (counters[6] << 16) | counters[7]
            data.counter_paddle = (counters[8] << 16) | counters[9]
            data.counter_steam = (counters[10] << 16) | counters[11]
            data.counter_tea = (counters[12] << 16) | counters[13]

        # Parse dose array (new in firmware 0.12+)
        dose = result.get("dose", [])
        if len(dose) >= 4:
            data.dose_key1 = dose[0]
            data.dose_key2 = dose[1]
            data.dose_key3 = dose[2]
            data.dose_tea = dose[3]

        # Parse device info from this response
        data.machine_name = result.get("name", "SANREMO-YOU")
        data.wifi_signal = result.get("signal", 0)
        data.wifi_ssid = result.get("ssid", "")
        data.free_memory = result.get("mem", 0)

        return data

    # ── WebSocket message parsing ──

    def parse_ws_message(self, raw: str, current_data: SanremoYouData | None = None) -> SanremoYouData | None:
        """Parse a WebSocket broadcast message and merge into current data.

        Returns updated data or None if the message is not a status broadcast.
        """
        try:
            ws = json.loads(raw)
        except json.JSONDecodeError:
            return None

        if "status" not in ws or "tempBoilerCoffe" not in ws:
            return None  # Not a status broadcast

        # Start from current data or empty
        if current_data is not None:
            import copy
            data = copy.copy(current_data)
        else:
            data = SanremoYouData()

        data.is_available = True

        # Machine status
        data.machine_status = ws.get("status", data.machine_status)
        data.machine_status_label = MACHINE_STATUS_MAP.get(
            data.machine_status, ws.get("description", f"Unknown ({data.machine_status})")
        )

        # Alarms & warnings
        data.alarms_code = ws.get("alarms", data.alarms_code)
        data.alarms_text = _decode_alarms(data.alarms_code, ALARM_BITS)
        data.warnings_code = ws.get("warnings", data.warnings_code)
        data.warnings_text = _decode_alarms(data.warnings_code, WARNING_BITS)

        # Temperatures (WS provides pre-divided values in °C)
        data.heater_temperature = ws.get("tempBoilerCoffe", data.heater_temperature)
        # Note: group_temperature is NOT in WS — kept from HTTP poll

        # Pressures
        # pumpServicesPress: raw value, /100 for bar (steam boiler pressure)
        if "pumpServicesPress" in ws:
            data.service_heater_pressure = ws["pumpServicesPress"] / 100
        # pumpPress: raw value, /10 for bar (pump pressure at group)
        # Per Beanconqueror source code scaling
        if "pumpPress" in ws:
            data.pump_pressure = ws["pumpPress"] / 10

        # Real-time brewing data
        data.group_status = ws.get("groupStatus", data.group_status)
        data.group_status_label = GROUP_STATUS_MAP.get(
            data.group_status, f"Unknown ({data.group_status})"
        )
        data.status_phase = ws.get("statusPhase", data.status_phase)
        data.realtime_flow = ws.get("realtimeFlow", data.realtime_flow)
        data.counter_vol = ws.get("counterVol", data.counter_vol)
        data.set_press_paddle = ws.get("setPressPaddle", data.set_press_paddle)

        # Beanconqueror scale integration
        data.app_scale_connection = ws.get("appScaleConnection", data.app_scale_connection)
        data.recipe_weight_setpoint = ws.get("recipeWeightSetPoint", data.recipe_weight_setpoint)
        data.cup_weight_from_scale = ws.get("cupWeightFromExtScale", data.cup_weight_from_scale)
        data.realtime_flow_from_scale = ws.get("realTimeFlowCalcByTheScale", data.realtime_flow_from_scale)

        # Doses from WS
        doses = ws.get("doses", {})
        if doses:
            data.dose_key1 = doses.get("key1", data.dose_key1)
            data.dose_key2 = doses.get("key2", data.dose_key2)
            data.dose_key3 = doses.get("key3", data.dose_key3)
            data.dose_tea = doses.get("keyTea", data.dose_tea)

        return data

    # ── New REST API: Power control ──

    async def power_on(self) -> bool:
        """Turn the machine on via /api/action/on."""
        try:
            result = await self._get(API_PATH_ACTION_ON)
            return result.get("result", False) if result else False
        except (aiohttp.ClientError, asyncio.TimeoutError):
            return False

    async def power_off(self) -> bool:
        """Turn the machine to standby via /api/action/standby."""
        try:
            result = await self._get(API_PATH_ACTION_STANDBY)
            return result.get("result", False) if result else False
        except (aiohttp.ClientError, asyncio.TimeoutError):
            return False

    # ── New REST API: Shot control ──

    async def start_shot(self, mode: int) -> bool:
        """Start a shot. mode: 1=P1, 2=P2, 3=P3, 4=Manual."""
        mode_str = SHOT_MODE_MAP.get(mode)
        if not mode_str:
            return False
        try:
            result = await self._get(f"{API_PATH_ACTION_PREFIX}/{mode_str}/start")
            return result.get("result", False) if result else False
        except (aiohttp.ClientError, asyncio.TimeoutError):
            return False

    async def stop_shot(self, mode: int) -> bool:
        """Stop a shot. mode: 1=P1, 2=P2, 3=P3, 4=Manual."""
        mode_str = SHOT_MODE_MAP.get(mode)
        if not mode_str:
            return False
        try:
            result = await self._get(f"{API_PATH_ACTION_PREFIX}/{mode_str}/stop")
            return result.get("result", False) if result else False
        except (aiohttp.ClientError, asyncio.TimeoutError):
            return False

    # ── New REST API: Doses ──

    async def get_doses(self) -> dict[str, int] | None:
        """Get dose settings via /api/doses."""
        try:
            return await self._get(API_PATH_DOSES)
        except (aiohttp.ClientError, asyncio.TimeoutError):
            return None

    async def set_dose(self, key: str, value: int) -> bool:
        """Set a dose value via /api/doses/{key}/{value}."""
        try:
            result = await self._get(f"{API_PATH_DOSES}/{key}/{value}")
            return result.get("result", False) if result else False
        except (aiohttp.ClientError, asyncio.TimeoutError):
            return False

    # ── New REST API: Counters ──

    async def get_counters(self) -> dict[str, int] | None:
        """Get counter values via /api/counters."""
        try:
            return await self._get(API_PATH_COUNTERS)
        except (aiohttp.ClientError, asyncio.TimeoutError):
            return None

    # ── Legacy API: Setpoints (key 200) ──

    async def set_value(self, param_id: int, value: int) -> bool:
        """Set a parameter value (key 200)."""
        try:
            result = await self._post({
                "key": API_KEY_SET_VALUE,
                "id": str(param_id),
                "value": str(value),
            })
            return result.get("result", False)
        except (aiohttp.ClientError, asyncio.TimeoutError):
            return False

    async def set_coffee_boiler_temp(self, temp_celsius: float) -> bool:
        """Set coffee boiler temperature setpoint."""
        return await self.set_value(PARAM_COFFEE_BOILER_TEMP, int(temp_celsius * 10))

    async def set_group_temp(self, temp_celsius: float) -> bool:
        """Set group (filter holder) temperature setpoint."""
        return await self.set_value(PARAM_GROUP_TEMP, int(temp_celsius * 10))

    async def set_steam_pressure(self, pressure_bar: float) -> bool:
        """Set steam boiler pressure setpoint."""
        return await self.set_value(PARAM_STEAM_BOILER_PRESSURE, int(pressure_bar * 10))

    # ── Legacy API: Scheduler ──

    async def set_scheduler_enabled(self, enabled: bool) -> bool:
        """Enable or disable the scheduler (key 252)."""
        try:
            result = await self._post({
                "key": API_KEY_SET_SCHEDULER_STATUS,
                "enabled": "1" if enabled else "0",
            })
            return result.get("result", False)
        except (aiohttp.ClientError, asyncio.TimeoutError):
            return False

    async def set_slot_enabled(self, slot: int, enabled: bool) -> bool:
        """Enable or disable a single scheduler slot (key 250)."""
        try:
            result = await self._post({
                "key": API_KEY_SET_SCHEDULER_DAY_STATUS,
                "day": str(slot),
                "enabled": "1" if enabled else "0",
            })
            return result.get("result", False)
        except (aiohttp.ClientError, asyncio.TimeoutError):
            return False

    async def save_scheduler_slot(self, slot: SchedulerSlot) -> bool:
        """Save a complete scheduler slot configuration (key 253)."""
        try:
            result = await self._post({
                "key": API_KEY_SAVE_SCHEDULER_DAY,
                "slot": str(slot.slot_id),
                "onH": str(slot.on_hour),
                "onM": str(slot.on_minute),
                "offH": str(slot.off_hour),
                "offM": str(slot.off_minute),
                "ecoOn": "1" if slot.eco_mode else "0",
                "onMon": "1" if slot.days[0] else "0",
                "onTue": "1" if slot.days[1] else "0",
                "onWed": "1" if slot.days[2] else "0",
                "onThu": "1" if slot.days[3] else "0",
                "onFri": "1" if slot.days[4] else "0",
                "onSat": "1" if slot.days[5] else "0",
                "onSun": "1" if slot.days[6] else "0",
            })
            return result.get("result", False)
        except (aiohttp.ClientError, asyncio.TimeoutError):
            return False

    # ── Legacy API: Clock ──

    async def set_clock(self, hour: int, minute: int, day: int, month: int, year: int) -> bool:
        """Set the machine clock (key 249)."""
        try:
            result = await self._post({
                "key": API_KEY_SET_CLOCK,
                "hh": str(hour),
                "mm": str(minute),
                "DD": str(day),
                "MM": str(month),
                "YY": str(year % 100),  # Last 2 digits
            })
            return result.get("result", False)
        except (aiohttp.ClientError, asyncio.TimeoutError):
            return False

    # ── Connection test ──

    async def test_connection(self) -> bool:
        """Test if the machine is reachable."""
        try:
            await self.get_device_info()
            return True
        except (aiohttp.ClientError, asyncio.TimeoutError):
            return False
