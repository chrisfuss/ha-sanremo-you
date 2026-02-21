"""Number entities for the Sanremo YOU integration."""

from __future__ import annotations

from collections.abc import Callable, Coroutine
from dataclasses import dataclass
import logging
from typing import Any

from homeassistant.components.number import (
    NumberDeviceClass,
    NumberEntity,
    NumberEntityDescription,
    NumberMode,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfPressure, UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .api import SanremoYouApi, SanremoYouData
from .const import DOMAIN
from .coordinator import SanremoYouCoordinator
from .entity import SanremoYouEntity

_LOGGER = logging.getLogger(__name__)


@dataclass(frozen=True, kw_only=True)
class SanremoYouNumberDescription(NumberEntityDescription):
    """Number entity description for Sanremo YOU."""

    value_fn: Callable[[SanremoYouData], float]
    set_fn: Callable[[SanremoYouApi, float], Coroutine[Any, Any, bool]]


NUMBER_DESCRIPTIONS: tuple[SanremoYouNumberDescription, ...] = (
    SanremoYouNumberDescription(
        key="coffee_boiler_setpoint",
        translation_key="coffee_boiler_setpoint",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        device_class=NumberDeviceClass.TEMPERATURE,
        native_min_value=80.0,
        native_max_value=100.0,
        native_step=0.1,
        mode=NumberMode.BOX,
        icon="mdi:thermometer",
        value_fn=lambda d: d.setpoint_group_temp,
        set_fn=lambda api, v: api.set_coffee_boiler_temp(v),
    ),
    SanremoYouNumberDescription(
        key="group_temp_setpoint",
        translation_key="group_temp_setpoint",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        device_class=NumberDeviceClass.TEMPERATURE,
        native_min_value=80.0,
        native_max_value=100.0,
        native_step=0.1,
        mode=NumberMode.BOX,
        icon="mdi:coffee",
        value_fn=lambda d: d.setpoint_filter_holder_temp,
        set_fn=lambda api, v: api.set_group_temp(v),
    ),
    SanremoYouNumberDescription(
        key="steam_pressure_setpoint",
        translation_key="steam_pressure_setpoint",
        native_unit_of_measurement=UnitOfPressure.BAR,
        device_class=NumberDeviceClass.PRESSURE,
        native_min_value=0.5,
        native_max_value=2.0,
        native_step=0.1,
        mode=NumberMode.BOX,
        icon="mdi:gauge",
        value_fn=lambda d: d.setpoint_pressure_steam,
        set_fn=lambda api, v: api.set_steam_pressure(v),
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up number entities."""
    coordinator: SanremoYouCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities(
        SanremoYouNumber(coordinator, entry.entry_id, description)
        for description in NUMBER_DESCRIPTIONS
    )


class SanremoYouNumber(SanremoYouEntity, NumberEntity):
    """Number entity for Sanremo YOU setpoints."""

    entity_description: SanremoYouNumberDescription

    def __init__(
        self,
        coordinator: SanremoYouCoordinator,
        entry_id: str,
        description: SanremoYouNumberDescription,
    ) -> None:
        """Initialize the number entity."""
        super().__init__(coordinator, entry_id)
        self.entity_description = description
        self._attr_unique_id = f"{entry_id}_{description.key}"
        self._object_id_key = description.key

    @property
    def native_value(self) -> float:
        """Return the current setpoint value."""
        return self.entity_description.value_fn(self.coordinator.data)

    async def async_set_native_value(self, value: float) -> None:
        """Set the setpoint value."""
        success = await self.entity_description.set_fn(self.coordinator.api, value)
        if success:
            _LOGGER.debug(
                "Set %s to %s", self.entity_description.key, value
            )
            await self.coordinator.async_request_refresh()
        else:
            _LOGGER.warning(
                "Failed to set %s to %s", self.entity_description.key, value
            )
