"""Switch entities for the Sanremo YOU integration."""

from __future__ import annotations

import copy
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
    entities: list[SanremoYouEntity] = [
        SanremoYouPowerSwitch(coordinator, entry.entry_id),
        SanremoYouSchedulerSwitch(coordinator, entry.entry_id),
    ]
    # Add per-slot enabled and eco switches
    for slot_idx in range(6):
        entities.append(SanremoYouSlotEnabledSwitch(coordinator, entry.entry_id, slot_idx))
        entities.append(SanremoYouSlotEcoSwitch(coordinator, entry.entry_id, slot_idx))
    async_add_entities(entities)


class SanremoYouPowerSwitch(SanremoYouEntity, SwitchEntity):
    """Switch entity for Sanremo YOU power control."""

    _attr_translation_key = "power"
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


class SanremoYouSchedulerSwitch(SanremoYouEntity, SwitchEntity):
    """Switch entity for enabling/disabling the scheduler."""

    _attr_translation_key = "scheduler"
    _attr_icon = "mdi:calendar-clock"

    def __init__(self, coordinator: SanremoYouCoordinator, entry_id: str) -> None:
        """Initialize the scheduler switch."""
        super().__init__(coordinator, entry_id)
        self._attr_unique_id = f"{entry_id}_scheduler"

    @property
    def is_on(self) -> bool | None:
        """Return True if the scheduler is enabled."""
        if self.coordinator.data.scheduler is None:
            return None
        return self.coordinator.data.scheduler.enabled

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable the scheduler."""
        success = await self.coordinator.api.set_scheduler_enabled(True)
        if success:
            _LOGGER.debug("Scheduler enabled")
            await self.coordinator.async_request_refresh()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable the scheduler."""
        success = await self.coordinator.api.set_scheduler_enabled(False)
        if success:
            _LOGGER.debug("Scheduler disabled")
            await self.coordinator.async_request_refresh()


class SanremoYouSlotEnabledSwitch(SanremoYouEntity, SwitchEntity):
    """Switch entity for enabling/disabling a scheduler slot."""

    _attr_icon = "mdi:clock-check-outline"

    def __init__(self, coordinator: SanremoYouCoordinator, entry_id: str, slot_idx: int) -> None:
        """Initialize the slot enabled switch."""
        super().__init__(coordinator, entry_id)
        self._slot_idx = slot_idx
        slot_num = slot_idx + 1
        self._attr_unique_id = f"{entry_id}_scheduler_slot_{slot_num}_enabled"
        self._attr_translation_key = f"scheduler_slot_{slot_num}_enabled"

    @property
    def is_on(self) -> bool | None:
        """Return True if this slot is enabled."""
        if self.coordinator.data.scheduler is None:
            return None
        return self.coordinator.data.scheduler.slots[self._slot_idx].enabled

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable this scheduler slot."""
        success = await self.coordinator.api.set_slot_enabled(self._slot_idx, True)
        if success:
            _LOGGER.debug("Scheduler slot %d enabled", self._slot_idx + 1)
            await self.coordinator.async_request_refresh()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable this scheduler slot."""
        success = await self.coordinator.api.set_slot_enabled(self._slot_idx, False)
        if success:
            _LOGGER.debug("Scheduler slot %d disabled", self._slot_idx + 1)
            await self.coordinator.async_request_refresh()


class SanremoYouSlotEcoSwitch(SanremoYouEntity, SwitchEntity):
    """Switch entity for toggling eco mode on a scheduler slot."""

    _attr_icon = "mdi:leaf"

    def __init__(self, coordinator: SanremoYouCoordinator, entry_id: str, slot_idx: int) -> None:
        """Initialize the slot eco switch."""
        super().__init__(coordinator, entry_id)
        self._slot_idx = slot_idx
        slot_num = slot_idx + 1
        self._attr_unique_id = f"{entry_id}_scheduler_slot_{slot_num}_eco"
        self._attr_translation_key = f"scheduler_slot_{slot_num}_eco"

    @property
    def is_on(self) -> bool | None:
        """Return True if eco mode is enabled for this slot."""
        if self.coordinator.data.scheduler is None:
            return None
        return self.coordinator.data.scheduler.slots[self._slot_idx].eco_mode

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable eco mode for this slot."""
        if self.coordinator.data.scheduler is None:
            return
        slot = copy.deepcopy(self.coordinator.data.scheduler.slots[self._slot_idx])
        slot.eco_mode = True
        success = await self.coordinator.api.save_scheduler_slot(slot)
        if success:
            _LOGGER.debug("Scheduler slot %d eco mode enabled", self._slot_idx + 1)
            await self.coordinator.async_request_refresh()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable eco mode for this slot."""
        if self.coordinator.data.scheduler is None:
            return
        slot = copy.deepcopy(self.coordinator.data.scheduler.slots[self._slot_idx])
        slot.eco_mode = False
        success = await self.coordinator.api.save_scheduler_slot(slot)
        if success:
            _LOGGER.debug("Scheduler slot %d eco mode disabled", self._slot_idx + 1)
            await self.coordinator.async_request_refresh()
