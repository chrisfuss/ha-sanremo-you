"""DataUpdateCoordinator for the Sanremo YOU integration."""

from __future__ import annotations

from datetime import timedelta
import logging

import aiohttp

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .api import SanremoYouApi, SanremoYouData, SanremoYouDeviceInfo
from .const import DOMAIN, SCAN_INTERVAL_SECONDS

_LOGGER = logging.getLogger(__name__)


class SanremoYouCoordinator(DataUpdateCoordinator[SanremoYouData]):
    """Coordinator to manage data fetching from the Sanremo YOU machine."""

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

    async def _async_update_data(self) -> SanremoYouData:
        """Fetch data from the Sanremo YOU machine."""
        try:
            data = await self.api.get_system_data()
            # Fetch device info on first poll
            if self.device_info is None:
                self.device_info = await self.api.get_device_info()
            return data
        except (aiohttp.ClientError, TimeoutError) as err:
            raise UpdateFailed(f"Error communicating with Sanremo YOU: {err}") from err
