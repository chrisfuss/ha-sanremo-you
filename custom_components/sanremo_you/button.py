"""Button entities for the Sanremo YOU integration."""

from __future__ import annotations

from datetime import datetime
import logging

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .coordinator import SanremoYouCoordinator
from .entity import SanremoYouEntity

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up button entities."""
    coordinator: SanremoYouCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([
        SanremoYouSyncClockButton(coordinator, entry.entry_id),
    ])


class SanremoYouSyncClockButton(SanremoYouEntity, ButtonEntity):
    """Button to sync the machine clock to the current time."""

    _attr_translation_key = "sync_clock"
    _attr_icon = "mdi:clock-check"

    def __init__(self, coordinator: SanremoYouCoordinator, entry_id: str) -> None:
        """Initialize the sync clock button."""
        super().__init__(coordinator, entry_id)
        self._attr_unique_id = f"{entry_id}_sync_clock"

    async def async_press(self) -> None:
        """Sync the machine clock to the current HA time."""
        now = datetime.now()
        success = await self.coordinator.api.set_clock(
            hour=now.hour,
            minute=now.minute,
            day=now.day,
            month=now.month,
            year=now.year,
        )
        if success:
            _LOGGER.debug(
                "Machine clock synced to %02d:%02d %02d/%02d/%04d",
                now.hour, now.minute, now.day, now.month, now.year,
            )
        else:
            _LOGGER.warning("Failed to sync machine clock")
