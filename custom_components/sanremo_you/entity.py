"""Base entity for the Sanremo YOU integration."""

from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import SanremoYouCoordinator


class SanremoYouEntity(CoordinatorEntity[SanremoYouCoordinator]):
    """Base entity for Sanremo YOU."""

    _attr_has_entity_name = True
    _object_id_key: str | None = None

    def __init__(self, coordinator: SanremoYouCoordinator, entry_id: str) -> None:
        """Initialize the entity."""
        super().__init__(coordinator)
        self._entry_id = entry_id

    @property
    def suggested_object_id(self) -> str | None:
        """Return English-based object ID to prevent translated entity IDs.

        HA generates entity IDs from the translated display name when
        translation_key is set and the system language is in NATIVE_ENTITY_IDS.
        Override to always use the English key for stable, language-independent
        entity IDs.
        """
        if self._object_id_key is not None:
            return self._object_id_key
        return super().suggested_object_id

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
