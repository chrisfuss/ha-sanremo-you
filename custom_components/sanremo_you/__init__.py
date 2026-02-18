"""The Sanremo YOU Coffee Machine integration."""

from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .api import SanremoYouApi
from .const import CONF_HOST, DOMAIN
from .coordinator import SanremoYouCoordinator

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [
    Platform.SENSOR,
    Platform.BINARY_SENSOR,
    Platform.SWITCH,
    Platform.NUMBER,
    Platform.TIME,
    Platform.BUTTON,
]

type SanremoYouConfigEntry = ConfigEntry


async def async_setup_entry(hass: HomeAssistant, entry: SanremoYouConfigEntry) -> bool:
    """Set up Sanremo YOU from a config entry."""
    session = async_get_clientsession(hass)
    api = SanremoYouApi(entry.data[CONF_HOST], session)

    coordinator = SanremoYouCoordinator(hass, api)
    await coordinator.async_config_entry_first_refresh()

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: SanremoYouConfigEntry) -> bool:
    """Unload a config entry."""
    if unload_ok := await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        hass.data[DOMAIN].pop(entry.entry_id)
    return unload_ok
