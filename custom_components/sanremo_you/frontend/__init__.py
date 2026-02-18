"""Frontend card registration for Sanremo YOU integration."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_call_later

from ..const import JSMODULES, URL_BASE

_LOGGER = logging.getLogger(__name__)

FRONTEND_DIR = Path(__file__).parent


class JSModuleRegistration:
    """Register JavaScript modules for the Sanremo YOU Lovelace card."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the registration."""
        self.hass = hass
        self.lovelace = hass.data.get("lovelace")

    async def async_register(self) -> None:
        """Register static path and Lovelace resources."""
        await self._async_register_static_path()

        if self.lovelace is None:
            _LOGGER.warning("Lovelace integration not found, cannot auto-register card")
            return

        if getattr(self.lovelace, "mode", "yaml") != "storage":
            _LOGGER.info(
                "Lovelace is in YAML mode; add the card resource manually: "
                "url: %s/sanremo-you-card.js, type: module",
                URL_BASE,
            )
            return

        await self._async_wait_for_lovelace_resources()

    async def _async_register_static_path(self) -> None:
        """Register the static HTTP path for serving card JS."""
        try:
            await self.hass.http.async_register_static_paths(
                [StaticPathConfig(URL_BASE, str(FRONTEND_DIR), False)]
            )
            _LOGGER.debug("Registered static path: %s -> %s", URL_BASE, FRONTEND_DIR)
        except RuntimeError:
            # Path already registered (e.g., reload)
            pass

    async def _async_wait_for_lovelace_resources(self) -> None:
        """Wait for Lovelace resources to be loaded, then register modules."""
        if self.lovelace.resources.loaded:
            await self._async_register_modules()
        else:
            _LOGGER.debug("Lovelace resources not yet loaded, retrying in 5 seconds")
            async_call_later(
                self.hass, 5, self._async_retry_register_modules
            )

    async def _async_retry_register_modules(self, _now=None) -> None:
        """Retry registering modules after a delay."""
        if self.lovelace.resources.loaded:
            await self._async_register_modules()
        else:
            _LOGGER.debug("Lovelace resources still not loaded, retrying in 5 seconds")
            async_call_later(
                self.hass, 5, self._async_retry_register_modules
            )

    async def _async_register_modules(self) -> None:
        """Register or update JavaScript module resources."""
        existing_resources = [
            r for r in self.lovelace.resources.async_items()
            if r["url"].startswith(URL_BASE)
        ]

        for module in JSMODULES:
            url = f"{URL_BASE}/{module['filename']}"
            registered = False

            for resource in existing_resources:
                if self._get_path(resource["url"]) == url:
                    registered = True
                    # Update if version changed (cache busting)
                    if self._get_version(resource["url"]) != module["version"]:
                        _LOGGER.info(
                            "Updating Lovelace resource %s to v%s",
                            module["name"],
                            module["version"],
                        )
                        await self.lovelace.resources.async_update_item(
                            resource["id"],
                            {
                                "res_type": "module",
                                "url": f"{url}?v={module['version']}",
                            },
                        )
                    break

            if not registered:
                _LOGGER.info(
                    "Registering Lovelace resource: %s v%s",
                    module["name"],
                    module["version"],
                )
                await self.lovelace.resources.async_create_item(
                    {
                        "res_type": "module",
                        "url": f"{url}?v={module['version']}",
                    }
                )

    @staticmethod
    def _get_path(url: str) -> str:
        """Extract path from URL (strip query params)."""
        return url.split("?")[0]

    @staticmethod
    def _get_version(url: str) -> str:
        """Extract version from URL query params."""
        parts = url.split("?")
        if len(parts) > 1:
            return parts[1].replace("v=", "")
        return "0"
