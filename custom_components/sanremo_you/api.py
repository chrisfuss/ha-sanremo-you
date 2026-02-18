"""API client for the Sanremo YOU coffee machine."""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from typing import Any

import aiohttp

from .const import (
    API_KEY_GET_DEVICE_INFO,
    API_KEY_GET_SYSTEM_PARAMS,
    API_KEY_SET_VALUE,
    API_PATH,
    ALARM_BITS,
    MACHINE_STATUS_MAP,
    MACHINE_STATUS_OFF,
    MACHINE_STATUS_ON,
    PARAM_COFFEE_BOILER_TEMP,
    PARAM_GROUP_TEMP,
    PARAM_POWER_OFF,
    PARAM_POWER_ON,
    PARAM_STEAM_BOILER_PRESSURE,
    SETTINGS_IDX_FILTER_HOLDER_TEMP_SETPOINT,
    SETTINGS_IDX_GROUP_TEMP_SETPOINT,
    SETTINGS_IDX_PRESSURE_STEAM_SETPOINT,
    SETTINGS_IDX_STEAM_HEATER_SETPOINT,
    STATUS_IDX_ALARMS_CODE,
    STATUS_IDX_DEEP_SLEEP,
    STATUS_IDX_DOSE_TIME,
    STATUS_IDX_GROUP_TEMP,
    STATUS_IDX_HEATER_TEMP,
    STATUS_IDX_LEVEL_SENSOR,
    STATUS_IDX_MACHINE_STATUS,
    STATUS_IDX_PUMP_PRESSURE,
    STATUS_IDX_SERVICE_HEATER_PRESSURE,
    STATUS_IDX_SERVICE_HEATER_TEMP,
    STATUS_IDX_WARNINGS,
    WARNING_BITS,
)

_LOGGER = logging.getLogger(__name__)


@dataclass
class SanremoYouData:
    """Parsed data from the Sanremo YOU machine."""

    # Status
    machine_status: int = 0
    machine_status_label: str = "Unknown"
    alarms_code: int = 0
    alarms_text: str = "None"
    warnings_code: int = 0
    warnings_text: str = "None"
    group_temperature: float = 0.0
    heater_temperature: float = 0.0
    service_heater_temperature: int = 0
    service_heater_pressure: float = 0.0
    pump_pressure: float = 0.0
    dose_time: float = 0.0
    level_sensor_status: int = 0
    deep_sleep_enabled: int = 0

    # Counters
    daily_coffee: int = 0

    # Settings (setpoints)
    setpoint_steam_heater: float = 0.0
    setpoint_group_temp: float = 0.0
    setpoint_filter_holder_temp: float = 0.0
    setpoint_pressure_steam: float = 0.0

    # Device info
    machine_name: str = ""
    firmware_version: str = ""
    wifi_signal: int = 0
    wifi_ssid: str = ""
    ip_address: str = ""
    mac_address: str = ""

    # Connectivity
    is_available: bool = False


@dataclass
class SanremoYouDeviceInfo:
    """Device info from key 105."""

    name: str = ""
    firmware_version: str = ""
    ip_address: str = ""
    mac_address: str = ""
    ssid: str = ""
    signal: int = 0


def _decode_alarms(code: int, bit_map: dict[int, str]) -> str:
    """Decode alarm/warning bitfield to human-readable string."""
    if code == 0:
        return "None"
    active = []
    for bit, description in bit_map.items():
        if description and code & (1 << bit):
            active.append(description)
    return ", ".join(active) if active else "None"


class SanremoYouApi:
    """API client for the Sanremo YOU coffee machine."""

    def __init__(self, host: str, session: aiohttp.ClientSession) -> None:
        """Initialize the API client."""
        self._host = host
        self._session = session
        self._base_url = f"http://{host}{API_PATH}"

    @property
    def host(self) -> str:
        """Return the host."""
        return self._host

    async def _post(self, data: dict[str, Any]) -> dict[str, Any]:
        """Send a POST request to the machine."""
        try:
            async with self._session.post(
                self._base_url,
                data=data,
                timeout=aiohttp.ClientTimeout(total=10),
            ) as response:
                response.raise_for_status()
                return await response.json(content_type=None)
        except (aiohttp.ClientError, asyncio.TimeoutError) as err:
            _LOGGER.debug("API request failed: %s", err)
            raise

    async def get_device_info(self) -> SanremoYouDeviceInfo:
        """Get device info (key 105)."""
        result = await self._post({"key": API_KEY_GET_DEVICE_INFO})
        info = SanremoYouDeviceInfo()
        info.name = result.get("name", "SANREMO-YOU")
        info.firmware_version = result.get("fwVer", "")
        info.ip_address = result.get("currentIp", self._host)
        info.mac_address = result.get("mac", "")
        info.ssid = result.get("ssid", "")
        info.signal = result.get("signal", 0)
        return info

    async def get_system_data(self) -> SanremoYouData:
        """Get full system parameters (key 150)."""
        result = await self._post({"key": API_KEY_GET_SYSTEM_PARAMS})
        data = SanremoYouData()
        data.is_available = True

        status = result.get("status", [])
        settings = result.get("settings", [])

        # Parse status array
        if len(status) > STATUS_IDX_DEEP_SLEEP:
            data.machine_status = status[STATUS_IDX_MACHINE_STATUS]
            data.machine_status_label = MACHINE_STATUS_MAP.get(
                data.machine_status, f"Unknown ({data.machine_status})"
            )
            data.alarms_code = status[STATUS_IDX_ALARMS_CODE]
            data.alarms_text = _decode_alarms(data.alarms_code, ALARM_BITS)
            data.warnings_code = status[STATUS_IDX_WARNINGS]
            data.warnings_text = _decode_alarms(data.warnings_code, WARNING_BITS)
            data.group_temperature = status[STATUS_IDX_GROUP_TEMP] / 10
            data.heater_temperature = status[STATUS_IDX_HEATER_TEMP] / 10
            data.service_heater_temperature = status[STATUS_IDX_SERVICE_HEATER_TEMP]
            data.service_heater_pressure = status[STATUS_IDX_SERVICE_HEATER_PRESSURE] / 100
            data.pump_pressure = status[STATUS_IDX_PUMP_PRESSURE] / 100
            data.dose_time = status[STATUS_IDX_DOSE_TIME] / 10
            data.level_sensor_status = status[STATUS_IDX_LEVEL_SENSOR]
            data.deep_sleep_enabled = status[STATUS_IDX_DEEP_SLEEP]

        # Parse settings array
        if len(settings) > SETTINGS_IDX_PRESSURE_STEAM_SETPOINT:
            data.setpoint_steam_heater = settings[SETTINGS_IDX_STEAM_HEATER_SETPOINT] / 10
            data.setpoint_group_temp = settings[SETTINGS_IDX_GROUP_TEMP_SETPOINT] / 10
            data.setpoint_filter_holder_temp = settings[SETTINGS_IDX_FILTER_HOLDER_TEMP_SETPOINT] / 10
            data.setpoint_pressure_steam = settings[SETTINGS_IDX_PRESSURE_STEAM_SETPOINT] / 10

        # Parse counters
        data.daily_coffee = result.get("dailyCoffee", 0)

        # Parse device info from this response
        data.machine_name = result.get("name", "SANREMO-YOU")
        data.wifi_signal = result.get("signal", 0)
        data.wifi_ssid = result.get("ssid", "")

        return data

    async def set_value(self, param_id: int, value: int) -> bool:
        """Set a parameter value (key 200)."""
        try:
            result = await self._post({
                "key": API_KEY_SET_VALUE,
                "id": str(param_id),
                "value": str(value),
            })
            return result.get("result", False)
        except (aiohttp.ClientError, asyncio.TimeoutError):
            return False

    async def power_on(self) -> bool:
        """Turn the machine on."""
        return await self.set_value(PARAM_POWER_ON, 1)

    async def power_off(self) -> bool:
        """Turn the machine off."""
        return await self.set_value(PARAM_POWER_OFF, 1)

    async def set_coffee_boiler_temp(self, temp_celsius: float) -> bool:
        """Set coffee boiler temperature setpoint."""
        return await self.set_value(PARAM_COFFEE_BOILER_TEMP, int(temp_celsius * 10))

    async def set_group_temp(self, temp_celsius: float) -> bool:
        """Set group (filter holder) temperature setpoint."""
        return await self.set_value(PARAM_GROUP_TEMP, int(temp_celsius * 10))

    async def set_steam_pressure(self, pressure_bar: float) -> bool:
        """Set steam boiler pressure setpoint."""
        return await self.set_value(PARAM_STEAM_BOILER_PRESSURE, int(pressure_bar * 10))

    async def test_connection(self) -> bool:
        """Test if the machine is reachable."""
        try:
            await self.get_device_info()
            return True
        except (aiohttp.ClientError, asyncio.TimeoutError):
            return False
