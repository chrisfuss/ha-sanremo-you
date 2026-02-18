"""Constants for the Sanremo YOU integration."""

DOMAIN = "sanremo_you"
CONF_HOST = "host"
DEFAULT_PORT = 80
SCAN_INTERVAL_SECONDS = 5

# API endpoint
API_PATH = "/ajax/post"

# API keys for POST requests
API_KEY_GET_DEVICE_INFO = "105"
API_KEY_GET_SYSTEM_PARAMS = "150"
API_KEY_SET_VALUE = "200"
API_KEY_SET_CLOCK = "249"
API_KEY_SET_SCHEDULER_DAY_STATUS = "250"
API_KEY_SET_MACHINE_NAME = "251"
API_KEY_SET_SCHEDULER_STATUS = "252"
API_KEY_SAVE_SCHEDULER_DAY = "253"

# SetValue parameter IDs
PARAM_COFFEE_BOILER_TEMP = 1
PARAM_STEAM_BOILER_PRESSURE = 2
PARAM_GROUP_TEMP = 3
PARAM_POWER_ON = 11
PARAM_POWER_OFF = 12

# Status array indices
STATUS_IDX_FIRMWARE_TYPE = 0
STATUS_IDX_FIRMWARE_VERSION = 1
STATUS_IDX_MACHINE_STATUS = 12
STATUS_IDX_ALARMS_CODE = 13
STATUS_IDX_WARNINGS = 14
STATUS_IDX_GROUP_TEMP = 15
STATUS_IDX_HEATER_TEMP = 16
STATUS_IDX_SERVICE_HEATER_TEMP = 17
STATUS_IDX_SERVICE_HEATER_PRESSURE = 18
STATUS_IDX_PUMP_PRESSURE = 19
STATUS_IDX_DOSE_TIME = 22
STATUS_IDX_LEVEL_SENSOR = 23
STATUS_IDX_DEEP_SLEEP = 29

# Settings array indices
SETTINGS_IDX_STEAM_HEATER_SETPOINT = 0
SETTINGS_IDX_GROUP_TEMP_SETPOINT = 1
SETTINGS_IDX_FILTER_HOLDER_TEMP_SETPOINT = 2
SETTINGS_IDX_PRESSURE_STEAM_SETPOINT = 3

# Machine status values
MACHINE_STATUS_OFF = 0
MACHINE_STATUS_ON = 1
MACHINE_STATUS_ECO = 2
MACHINE_STATUS_DEEP_SLEEP = 3

# Machine status labels
MACHINE_STATUS_MAP = {
    0: "Off",
    1: "On",
    2: "Eco Mode",
    3: "Deep Sleep",
}

# Alarm bit descriptions
ALARM_BITS = {
    0: "No C.V. pulses",
    1: "No tank level",
    2: "Filling timeout",
    3: "No tank",
    4: "NTC boiler CC",
    5: "NTC boiler CC",
    6: "NTC coffee CC",
    7: "NTC coffee CO",
    8: "NTC group CC",
    9: "NTC group CO",
    10: "Lever transd. CC",
    11: "Lever transd. CO",
    12: "Pump pressure transd. CC",
    13: "Pump pressure transd. CC",
    14: "Boiler pressure transd. CC",
    15: "Boiler pressure transd. CO",
}

WARNING_BITS = {
    0: "Tank filling",
    5: "First tank filling",
    6: "First boiler filling",
    7: "Machine locked",
    8: "Low boiler level",
}

# Scheduler constants
SCHEDULER_NUM_SLOTS = 6
SCHEDULER_IDX_ENABLED = 1
SCHEDULER_IDX_TIMES_START = 2  # scheduler[2 + slot*2] = ON, scheduler[3 + slot*2] = OFF
SCHEDULER_IDX_DAYS_START = 14  # scheduler[14 + slot//2], packed per pair

# Day-of-week bit positions (in days+eco byte)
DAY_MONDAY = 0
DAY_TUESDAY = 1
DAY_WEDNESDAY = 2
DAY_THURSDAY = 3
DAY_FRIDAY = 4
DAY_SATURDAY = 5
DAY_SUNDAY = 6
DAY_ECO_BIT = 7
