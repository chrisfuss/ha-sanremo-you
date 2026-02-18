"""Time entities for the Sanremo YOU integration (scheduler)."""

from __future__ import annotations

import copy
from collections.abc import Callable, Coroutine
from dataclasses import dataclass
from datetime import time
import logging
from typing import Any

from homeassistant.components.time import TimeEntity, TimeEntityDescription
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .api import SanremoYouApi, SanremoYouData, SchedulerSlot
from .const import DOMAIN
from .coordinator import SanremoYouCoordinator
from .entity import SanremoYouEntity

_LOGGER = logging.getLogger(__name__)


@dataclass(frozen=True, kw_only=True)
class SanremoYouTimeDescription(TimeEntityDescription):
    """Time entity description for Sanremo YOU scheduler."""

    slot_index: int
    is_start: bool  # True = start time, False = stop time
    value_fn: Callable[[SanremoYouData], time | None]
    set_fn: Callable[[SanremoYouApi, SanremoYouData, time], Coroutine[Any, Any, bool]]


def _get_slot_start(data: SanremoYouData, slot_idx: int) -> time | None:
    """Get start time for a scheduler slot."""
    if data.scheduler is None:
        return None
    slot = data.scheduler.slots[slot_idx]
    return time(slot.on_hour, slot.on_minute)


def _get_slot_stop(data: SanremoYouData, slot_idx: int) -> time | None:
    """Get stop time for a scheduler slot."""
    if data.scheduler is None:
        return None
    slot = data.scheduler.slots[slot_idx]
    return time(slot.off_hour, slot.off_minute)


async def _set_slot_start(api: SanremoYouApi, data: SanremoYouData, slot_idx: int, value: time) -> bool:
    """Set start time for a scheduler slot."""
    if data.scheduler is None:
        return False
    slot = copy.deepcopy(data.scheduler.slots[slot_idx])
    slot.on_hour = value.hour
    slot.on_minute = value.minute
    return await api.save_scheduler_slot(slot)


async def _set_slot_stop(api: SanremoYouApi, data: SanremoYouData, slot_idx: int, value: time) -> bool:
    """Set stop time for a scheduler slot."""
    if data.scheduler is None:
        return False
    slot = copy.deepcopy(data.scheduler.slots[slot_idx])
    slot.off_hour = value.hour
    slot.off_minute = value.minute
    return await api.save_scheduler_slot(slot)


def _build_time_descriptions() -> tuple[SanremoYouTimeDescription, ...]:
    """Build time entity descriptions for all 6 slots."""
    descriptions: list[SanremoYouTimeDescription] = []
    for i in range(6):
        slot_num = i + 1
        descriptions.append(
            SanremoYouTimeDescription(
                key=f"scheduler_slot_{slot_num}_start",
                translation_key=f"scheduler_slot_{slot_num}_start",
                name=f"Slot {slot_num} Start Time",
                icon="mdi:clock-start",
                slot_index=i,
                is_start=True,
                value_fn=lambda d, idx=i: _get_slot_start(d, idx),
                set_fn=lambda api, d, v, idx=i: _set_slot_start(api, d, idx, v),
            )
        )
        descriptions.append(
            SanremoYouTimeDescription(
                key=f"scheduler_slot_{slot_num}_stop",
                translation_key=f"scheduler_slot_{slot_num}_stop",
                name=f"Slot {slot_num} Stop Time",
                icon="mdi:clock-end",
                slot_index=i,
                is_start=False,
                value_fn=lambda d, idx=i: _get_slot_stop(d, idx),
                set_fn=lambda api, d, v, idx=i: _set_slot_stop(api, d, idx, v),
            )
        )
    return tuple(descriptions)


TIME_DESCRIPTIONS = _build_time_descriptions()


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up time entities."""
    coordinator: SanremoYouCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities(
        SanremoYouTime(coordinator, entry.entry_id, description)
        for description in TIME_DESCRIPTIONS
    )


class SanremoYouTime(SanremoYouEntity, TimeEntity):
    """Time entity for Sanremo YOU scheduler slots."""

    entity_description: SanremoYouTimeDescription

    def __init__(
        self,
        coordinator: SanremoYouCoordinator,
        entry_id: str,
        description: SanremoYouTimeDescription,
    ) -> None:
        """Initialize the time entity."""
        super().__init__(coordinator, entry_id)
        self.entity_description = description
        self._attr_unique_id = f"{entry_id}_{description.key}"

    @property
    def native_value(self) -> time | None:
        """Return the current time value."""
        return self.entity_description.value_fn(self.coordinator.data)

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return extra state attributes with day-of-week info."""
        if self.coordinator.data.scheduler is None:
            return None
        slot = self.coordinator.data.scheduler.slots[self.entity_description.slot_index]
        day_names = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        attrs: dict[str, Any] = {}
        if self.entity_description.is_start:
            # Only add day/eco attributes on the start time entity to avoid duplication
            for day_idx, day_name in enumerate(day_names):
                attrs[day_name] = slot.days[day_idx]
            attrs["eco_mode"] = slot.eco_mode
            attrs["slot_enabled"] = slot.enabled
        return attrs if attrs else None

    async def async_set_value(self, value: time) -> None:
        """Set the time value."""
        success = await self.entity_description.set_fn(
            self.coordinator.api, self.coordinator.data, value
        )
        if success:
            _LOGGER.debug(
                "Set %s to %s", self.entity_description.key, value
            )
            await self.coordinator.async_request_refresh()
        else:
            _LOGGER.warning(
                "Failed to set %s to %s", self.entity_description.key, value
            )
