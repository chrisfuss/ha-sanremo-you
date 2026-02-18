# Sanremo YOU - Home Assistant Integration

[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)

Home Assistant custom integration for the **Sanremo YOU** espresso machine. Provides real-time monitoring and control via the machine's local Wi-Fi interface.

## Features

- **Power control** - Turn the machine on/off from Home Assistant
- **Temperature monitoring** - Coffee boiler, group (infusion), and steam boiler temperatures
- **Pressure monitoring** - Steam boiler pressure and pump pressure
- **Setpoint control** - Adjust coffee boiler temp, group temp, and steam pressure setpoints
- **Shot tracking** - Extraction time and daily shot counter
- **Status monitoring** - Water tank level, alarms, warnings, Wi-Fi status
- **Local polling** - No cloud dependency, communicates directly with the machine on your LAN

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Click the three dots menu > **Custom repositories**
3. Add this repository URL with category **Integration**
4. Search for "Sanremo YOU" and install
5. Restart Home Assistant
6. Go to **Settings > Devices & Services > Add Integration > Sanremo YOU**
7. Enter your machine's IP address (e.g., `192.168.1.100`)

### Manual

1. Copy `custom_components/sanremo_you/` to your HA `config/custom_components/` directory
2. Restart Home Assistant
3. Add the integration via the UI

## Entities

### Sensors
| Entity | Description | Unit |
|--------|-------------|------|
| Coffee Boiler Temperature | Current coffee boiler temp | °C |
| Group Temperature | Current brew group temp | °C |
| Steam Boiler Pressure | Current steam boiler pressure | bar |
| Pump Pressure | Current pump pressure during extraction | bar |
| Extraction Time | Duration of last/current shot | s |
| Daily Shot Count | Number of shots today | shots |
| Machine Status | Current machine state | - |
| Alarms | Active alarm codes | - |
| Warnings | Active warning codes | - |

### Binary Sensors
| Entity | Description |
|--------|-------------|
| Water Tank | Whether the water tank has water |

### Switch
| Entity | Description |
|--------|-------------|
| Power | Turn the machine on/off |

### Number
| Entity | Description | Range |
|--------|-------------|-------|
| Coffee Boiler Setpoint | Target coffee boiler temperature | 80-100 °C |
| Group Temperature Setpoint | Target brew group temperature | 80-100 °C |
| Steam Pressure Setpoint | Target steam boiler pressure | 0.5-2.0 bar |

## Protocol

This integration communicates with the Sanremo YOU via its local HTTP API at `/ajax/post` using form-encoded POST requests. The machine's Wi-Fi module (by Net Software srl) exposes this endpoint for both reading status and writing settings.

## License

MIT
