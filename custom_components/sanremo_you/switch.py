"""Switch entity for the Sanremo YOU integration."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.switch import SwitchDeviceClass, SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, MACHINE_STATUS_OFF
from .coordinator import SanremoYouCoordinator
from .entity import SanremoYouEntity

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up switch entities."""
    coordinator: SanremoYouCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([
        SanremoYouPowerSwitch(coordinator, entry.entry_id),
    ])


class SanremoYouPowerSwitch(SanremoYouEntity, SwitchEntity):
    """Switch entity for Sanremo YOU power control."""

    _attr_name = "Power"
    _attr_device_class = SwitchDeviceClass.SWITCH
    _attr_icon = "mdi:power"

    def __init__(self, coordinator: SanremoYouCoordinator, entry_id: str) -> None:
        """Initialize the switch."""
        super().__init__(coordinator, entry_id)
        self._attr_unique_id = f"{entry_id}_power"

    @property
    def is_on(self) -> bool:
        """Return True if the machine is on."""
        return self.coordinator.data.machine_status != MACHINE_STATUS_OFF

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the machine on."""
        success = await self.coordinator.api.power_on()
        if success:
            _LOGGER.debug("Sanremo YOU power ON command sent")
            await self.coordinator.async_request_refresh()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the machine off."""
        success = await self.coordinator.api.power_off()
        if success:
            _LOGGER.debug("Sanremo YOU power OFF command sent")
            await self.coordinator.async_request_refresh()
