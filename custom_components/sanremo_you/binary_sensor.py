"""Binary sensor entities for the Sanremo YOU integration."""

from __future__ import annotations

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .coordinator import SanremoYouCoordinator
from .entity import SanremoYouEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up binary sensor entities."""
    coordinator: SanremoYouCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([
        SanremoYouWaterTankSensor(coordinator, entry.entry_id),
    ])


class SanremoYouWaterTankSensor(SanremoYouEntity, BinarySensorEntity):
    """Binary sensor for the water tank level."""

    _attr_translation_key = "water_tank"
    _attr_device_class = BinarySensorDeviceClass.PROBLEM
    _attr_icon = "mdi:water"

    def __init__(self, coordinator: SanremoYouCoordinator, entry_id: str) -> None:
        """Initialize the binary sensor."""
        super().__init__(coordinator, entry_id)
        self._attr_unique_id = f"{entry_id}_water_tank"

    @property
    def is_on(self) -> bool:
        """Return True if water tank has a problem (empty)."""
        # level_sensor_status: 1 = OK, 0 = empty/problem
        return self.coordinator.data.level_sensor_status == 0
