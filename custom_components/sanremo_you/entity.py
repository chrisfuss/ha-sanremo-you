"""Base entity for the Sanremo YOU integration."""

from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import SanremoYouCoordinator


class SanremoYouEntity(CoordinatorEntity[SanremoYouCoordinator]):
    """Base entity for Sanremo YOU."""

    _attr_has_entity_name = True

    def __init__(self, coordinator: SanremoYouCoordinator, entry_id: str) -> None:
        """Initialize the entity."""
        super().__init__(coordinator)
        self._entry_id = entry_id

    @property
    def device_info(self) -> DeviceInfo:
        """Return device info."""
        device_info = self.coordinator.device_info
        return DeviceInfo(
            identifiers={(DOMAIN, self._entry_id)},
            name=device_info.name if device_info else "Sanremo YOU",
            manufacturer="Sanremo Coffee Machines",
            model="YOU",
            sw_version=device_info.firmware_version if device_info else None,
            configuration_url=f"http://{self.coordinator.api.host}",
        )
