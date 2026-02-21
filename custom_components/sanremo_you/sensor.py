"""Sensor entities for the Sanremo YOU integration."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfPressure, UnitOfTemperature, UnitOfTime
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import EntityCategory
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .api import SanremoYouData
from .const import DOMAIN
from .coordinator import SanremoYouCoordinator
from .entity import SanremoYouEntity


@dataclass(frozen=True, kw_only=True)
class SanremoYouSensorDescription(SensorEntityDescription):
    """Sensor entity description for Sanremo YOU."""

    value_fn: Callable[[SanremoYouData], float | int | str | None]


SENSOR_DESCRIPTIONS: tuple[SanremoYouSensorDescription, ...] = (
    SanremoYouSensorDescription(
        key="group_temperature",
        translation_key="group_temperature",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        device_class=SensorDeviceClass.TEMPERATURE,
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=1,
        icon="mdi:coffee",
        value_fn=lambda d: d.group_temperature,
    ),
    SanremoYouSensorDescription(
        key="heater_temperature",
        translation_key="heater_temperature",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        device_class=SensorDeviceClass.TEMPERATURE,
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=1,
        icon="mdi:thermometer",
        value_fn=lambda d: d.heater_temperature,
    ),
    SanremoYouSensorDescription(
        key="steam_boiler_pressure",
        translation_key="steam_boiler_pressure",
        native_unit_of_measurement=UnitOfPressure.BAR,
        device_class=SensorDeviceClass.PRESSURE,
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=1,
        icon="mdi:gauge",
        value_fn=lambda d: d.service_heater_pressure,
    ),
    SanremoYouSensorDescription(
        key="pump_pressure",
        translation_key="pump_pressure",
        native_unit_of_measurement=UnitOfPressure.BAR,
        device_class=SensorDeviceClass.PRESSURE,
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=1,
        icon="mdi:gauge-full",
        value_fn=lambda d: d.pump_pressure,
    ),
    SanremoYouSensorDescription(
        key="extraction_time",
        translation_key="extraction_time",
        native_unit_of_measurement=UnitOfTime.SECONDS,
        device_class=SensorDeviceClass.DURATION,
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=1,
        icon="mdi:timer-outline",
        value_fn=lambda d: d.dose_time,
    ),
    SanremoYouSensorDescription(
        key="daily_shots",
        translation_key="daily_shots",
        state_class=SensorStateClass.TOTAL,
        icon="mdi:counter",
        value_fn=lambda d: d.daily_coffee,
    ),
    SanremoYouSensorDescription(
        key="machine_status",
        translation_key="machine_status",
        icon="mdi:state-machine",
        value_fn=lambda d: d.machine_status_label,
    ),
    SanremoYouSensorDescription(
        key="alarms",
        translation_key="alarms",
        icon="mdi:alert-circle-outline",
        value_fn=lambda d: d.alarms_text,
    ),
    SanremoYouSensorDescription(
        key="warnings",
        translation_key="warnings",
        icon="mdi:alert-outline",
        value_fn=lambda d: d.warnings_text,
    ),
    SanremoYouSensorDescription(
        key="counter_dose_1",
        translation_key="counter_dose_1",
        state_class=SensorStateClass.TOTAL_INCREASING,
        icon="mdi:numeric-1-box",
        value_fn=lambda d: d.counter_dose_1,
    ),
    SanremoYouSensorDescription(
        key="counter_dose_2",
        translation_key="counter_dose_2",
        state_class=SensorStateClass.TOTAL_INCREASING,
        icon="mdi:numeric-2-box",
        value_fn=lambda d: d.counter_dose_2,
    ),
    SanremoYouSensorDescription(
        key="counter_dose_3",
        translation_key="counter_dose_3",
        state_class=SensorStateClass.TOTAL_INCREASING,
        icon="mdi:numeric-3-box",
        value_fn=lambda d: d.counter_dose_3,
    ),
    SanremoYouSensorDescription(
        key="counter_continuous",
        translation_key="counter_continuous",
        state_class=SensorStateClass.TOTAL_INCREASING,
        icon="mdi:coffee",
        value_fn=lambda d: d.counter_continuous,
    ),
    SanremoYouSensorDescription(
        key="counter_paddle",
        translation_key="counter_paddle",
        state_class=SensorStateClass.TOTAL_INCREASING,
        icon="mdi:hand-wave",
        value_fn=lambda d: d.counter_paddle,
    ),
    SanremoYouSensorDescription(
        key="counter_steam",
        translation_key="counter_steam",
        state_class=SensorStateClass.TOTAL_INCREASING,
        icon="mdi:weather-fog",
        value_fn=lambda d: d.counter_steam,
    ),
    SanremoYouSensorDescription(
        key="counter_tea",
        translation_key="counter_tea",
        state_class=SensorStateClass.TOTAL_INCREASING,
        icon="mdi:tea",
        value_fn=lambda d: d.counter_tea,
    ),
    # ── Diagnostic (network/device) sensors ──
    SanremoYouSensorDescription(
        key="wifi_ssid",
        translation_key="wifi_ssid",
        icon="mdi:wifi",
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda d: d.wifi_ssid or None,
    ),
    SanremoYouSensorDescription(
        key="wifi_signal",
        translation_key="wifi_signal",
        icon="mdi:wifi-strength-3",
        state_class=SensorStateClass.MEASUREMENT,
        device_class=SensorDeviceClass.SIGNAL_STRENGTH,
        native_unit_of_measurement="dBm",
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda d: d.wifi_signal if d.wifi_signal else None,
    ),
    SanremoYouSensorDescription(
        key="ip_address",
        translation_key="ip_address",
        icon="mdi:ip-network",
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda d: d.ip_address or None,
    ),
    SanremoYouSensorDescription(
        key="mac_address",
        translation_key="mac_address",
        icon="mdi:network-outline",
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda d: d.mac_address or None,
    ),
    SanremoYouSensorDescription(
        key="firmware_version",
        translation_key="firmware_version",
        icon="mdi:chip",
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda d: d.firmware_version or None,
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up sensor entities."""
    coordinator: SanremoYouCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities(
        SanremoYouSensor(coordinator, entry.entry_id, description)
        for description in SENSOR_DESCRIPTIONS
    )


class SanremoYouSensor(SanremoYouEntity, SensorEntity):
    """Sensor entity for Sanremo YOU."""

    entity_description: SanremoYouSensorDescription

    def __init__(
        self,
        coordinator: SanremoYouCoordinator,
        entry_id: str,
        description: SanremoYouSensorDescription,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, entry_id)
        self.entity_description = description
        self._attr_unique_id = f"{entry_id}_{description.key}"
        self._object_id_key = description.key

    @property
    def native_value(self) -> float | int | str | None:
        """Return the sensor value."""
        return self.entity_description.value_fn(self.coordinator.data)
