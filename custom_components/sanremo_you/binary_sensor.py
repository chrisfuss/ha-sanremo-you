"""Binary sensor entities for the Sanremo YOU integration."""

from __future__ import annotations

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import EntityCategory
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
        SanremoYouScaleConnectionSensor(coordinator, entry.entry_id),
        SanremoYouWebSocketSensor(coordinator, entry.entry_id),
        SanremoYouOtaSensor(coordinator, entry.entry_id),
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
        self._object_id_key = "water_tank"

    @property
    def is_on(self) -> bool:
        """Return True if water tank has a problem (empty)."""
        # level_sensor_status: 1 = OK, 0 = empty/problem
        return self.coordinator.data.level_sensor_status == 0


class SanremoYouScaleConnectionSensor(SanremoYouEntity, BinarySensorEntity):
    """Binary sensor for Beanconqueror external scale connection."""

    _attr_translation_key = "scale_connection"
    _attr_device_class = BinarySensorDeviceClass.CONNECTIVITY
    _attr_icon = "mdi:scale"

    def __init__(self, coordinator: SanremoYouCoordinator, entry_id: str) -> None:
        """Initialize the binary sensor."""
        super().__init__(coordinator, entry_id)
        self._attr_unique_id = f"{entry_id}_scale_connection"
        self._object_id_key = "scale_connection"

    @property
    def is_on(self) -> bool:
        """Return True if an external scale is connected."""
        # appScaleConnection: 0=disconnected, 1=connected, 2=active brew
        return self.coordinator.data.app_scale_connection > 0


class SanremoYouWebSocketSensor(SanremoYouEntity, BinarySensorEntity):
    """Binary sensor for WebSocket connection status."""

    _attr_translation_key = "websocket_connected"
    _attr_device_class = BinarySensorDeviceClass.CONNECTIVITY
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_icon = "mdi:lan-connect"

    def __init__(self, coordinator: SanremoYouCoordinator, entry_id: str) -> None:
        """Initialize the binary sensor."""
        super().__init__(coordinator, entry_id)
        self._attr_unique_id = f"{entry_id}_websocket_connected"
        self._object_id_key = "websocket_connected"

    @property
    def is_on(self) -> bool:
        """Return True if WebSocket is connected."""
        return self.coordinator.ws_connected


class SanremoYouOtaSensor(SanremoYouEntity, BinarySensorEntity):
    """Binary sensor for OTA firmware update availability."""

    _attr_translation_key = "ota_available"
    _attr_device_class = BinarySensorDeviceClass.UPDATE
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_icon = "mdi:cellphone-arrow-down"

    def __init__(self, coordinator: SanremoYouCoordinator, entry_id: str) -> None:
        """Initialize the binary sensor."""
        super().__init__(coordinator, entry_id)
        self._attr_unique_id = f"{entry_id}_ota_available"
        self._object_id_key = "ota_available"

    @property
    def is_on(self) -> bool:
        """Return True if a firmware update is available."""
        return self.coordinator.data.ota_available
