"""Button entities for the Sanremo YOU integration."""

from __future__ import annotations

from datetime import datetime
import logging

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    DOMAIN,
    GROUP_STATUS_IDLE,
    GROUP_STATUS_MANUAL,
    GROUP_STATUS_P1,
    GROUP_STATUS_P2,
    GROUP_STATUS_P3,
    SHOT_MODE_MAP,
)
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
        SanremoYouStartShotButton(coordinator, entry.entry_id, GROUP_STATUS_P1),
        SanremoYouStartShotButton(coordinator, entry.entry_id, GROUP_STATUS_P2),
        SanremoYouStartShotButton(coordinator, entry.entry_id, GROUP_STATUS_P3),
        SanremoYouStartShotButton(coordinator, entry.entry_id, GROUP_STATUS_MANUAL),
        SanremoYouStopShotButton(coordinator, entry.entry_id),
    ])


class SanremoYouSyncClockButton(SanremoYouEntity, ButtonEntity):
    """Button to sync the machine clock to the current time."""

    _attr_translation_key = "sync_clock"
    _attr_icon = "mdi:clock-check"

    def __init__(self, coordinator: SanremoYouCoordinator, entry_id: str) -> None:
        """Initialize the sync clock button."""
        super().__init__(coordinator, entry_id)
        self._attr_unique_id = f"{entry_id}_sync_clock"
        self._object_id_key = "sync_clock"

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


_SHOT_MODE_NAMES = {
    GROUP_STATUS_P1: ("start_shot_p1", "Profile 1"),
    GROUP_STATUS_P2: ("start_shot_p2", "Profile 2"),
    GROUP_STATUS_P3: ("start_shot_p3", "Profile 3"),
    GROUP_STATUS_MANUAL: ("start_shot_manual", "Manual"),
}


class SanremoYouStartShotButton(SanremoYouEntity, ButtonEntity):
    """Button to start a shot with a specific profile."""

    _attr_icon = "mdi:play"

    def __init__(
        self, coordinator: SanremoYouCoordinator, entry_id: str, mode: int
    ) -> None:
        """Initialize the start shot button."""
        super().__init__(coordinator, entry_id)
        self._mode = mode
        key, _label = _SHOT_MODE_NAMES[mode]
        self._attr_unique_id = f"{entry_id}_{key}"
        self._attr_translation_key = key
        self._object_id_key = key

    async def async_press(self) -> None:
        """Start a shot."""
        mode_str = SHOT_MODE_MAP.get(self._mode, "?")
        success = await self.coordinator.api.start_shot(self._mode)
        if success:
            _LOGGER.debug("Started shot: %s", mode_str)
        else:
            _LOGGER.warning("Failed to start shot: %s", mode_str)


class SanremoYouStopShotButton(SanremoYouEntity, ButtonEntity):
    """Button to stop the currently running shot."""

    _attr_translation_key = "stop_shot"
    _attr_icon = "mdi:stop"

    def __init__(self, coordinator: SanremoYouCoordinator, entry_id: str) -> None:
        """Initialize the stop shot button."""
        super().__init__(coordinator, entry_id)
        self._attr_unique_id = f"{entry_id}_stop_shot"
        self._object_id_key = "stop_shot"

    async def async_press(self) -> None:
        """Stop the currently running shot."""
        group_status = self.coordinator.data.group_status
        if group_status == GROUP_STATUS_IDLE:
            _LOGGER.debug("No shot running, nothing to stop")
            return

        success = await self.coordinator.api.stop_shot(group_status)
        if success:
            _LOGGER.debug("Stopped shot (group_status=%d)", group_status)
        else:
            _LOGGER.warning("Failed to stop shot (group_status=%d)", group_status)
