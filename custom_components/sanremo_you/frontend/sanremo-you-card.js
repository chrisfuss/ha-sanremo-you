/* ── Translations ── */
const _TRANSLATIONS = {
  en: {
    // Main view
    connected: 'Connected', disconnected: 'Disconnected',
    steam: 'Steam', tank: 'Tank', infusion: 'Infusion',
    extraction: 'Extraction', daily: 'Daily', current: 'current',
    set: 'set', low: 'LOW', ok: 'OK',
    // Settings menu
    wifi_network_status: 'Wi-Fi network status',
    programming: 'Programming', counters: 'Counters',
    alarms: 'Alarms', user_settings: 'User Settings',
    // Programming
    time_slot: 'Time slot',
    // Counters
    coffee_counters: 'Coffee counters',
    dose_1: 'Dose 1', dose_2: 'Dose 2', dose_3: 'Dose 3',
    continuous: 'Continuous', paddle: 'Paddle',
    steam_activation: 'Steam Activation', tea: 'Tea',
    // Alarms
    active_alarms: 'Active alarms',
    no_active_alarm: 'No active alarm', no_active_warning: 'No active warning',
    // User settings
    coffee_boiler_temperature: 'Coffee boiler temperature',
    group_temperature: 'Group temperature',
    service_boiler_pressure: 'Service boiler pressure',
    clock_settings: 'Clock settings',
    // Setpoints
    coffee_boiler_settings: 'Coffee boiler settings',
    filter_holder_settings: 'Coffee filter holder settings',
    steam_boiler_settings: 'Steam boiler settings',
    // Clock
    clock: 'Clock', sync_clock: 'Sync Clock',
    // Wi-Fi
    cloud_connection_status: 'Cloud connection status',
    wifi_device_information: 'Wi-Fi device information',
    firmware_version: 'Firmware version',
    network_addresses: 'Network addresses',
    ip_obtained_connected: 'Ip obtained [Connected]',
    // Config editor
    coffee_machine: 'Coffee Machine',
    select_device: 'Select your Sanremo YOU device',
    card_name: 'Card Name (optional)',
    card_name_desc: 'Override the displayed machine name',
    card_name_placeholder: 'Auto-detected from device',
  },
  de: {
    connected: 'Verbunden', disconnected: 'Getrennt',
    steam: 'Dampf', tank: 'Tank', infusion: 'Brühung',
    extraction: 'Extraktion', daily: 'Heute', current: 'aktuell',
    set: 'Soll', low: 'NIEDRIG', ok: 'OK',
    wifi_network_status: 'WLAN-Netzwerkstatus',
    programming: 'Programmierung', counters: 'Zähler',
    alarms: 'Alarme', user_settings: 'Einstellungen',
    time_slot: 'Zeitfenster',
    coffee_counters: 'Kaffeezähler',
    dose_1: 'Dosis 1', dose_2: 'Dosis 2', dose_3: 'Dosis 3',
    continuous: 'Dauerbezug', paddle: 'Hebel',
    steam_activation: 'Dampf', tea: 'Tee',
    active_alarms: 'Aktive Alarme',
    no_active_alarm: 'Kein aktiver Alarm', no_active_warning: 'Keine aktive Warnung',
    coffee_boiler_temperature: 'Kaffeeboiler-Temperatur',
    group_temperature: 'Brühgruppentemperatur',
    service_boiler_pressure: 'Dampfkesseldruck',
    clock_settings: 'Uhreinstellungen',
    coffee_boiler_settings: 'Kaffeeboiler-Einstellungen',
    filter_holder_settings: 'Siebträger-Einstellungen',
    steam_boiler_settings: 'Dampfkessel-Einstellungen',
    clock: 'Uhr', sync_clock: 'Uhr synchronisieren',
    cloud_connection_status: 'Cloud-Verbindungsstatus',
    wifi_device_information: 'WLAN-Geräteinformationen',
    firmware_version: 'Firmware-Version',
    network_addresses: 'Netzwerkadressen',
    ip_obtained_connected: 'IP erhalten [Verbunden]',
    coffee_machine: 'Kaffeemaschine',
    select_device: 'Wähle dein Sanremo YOU Gerät',
    card_name: 'Kartenname (optional)',
    card_name_desc: 'Angezeigten Maschinennamen überschreiben',
    card_name_placeholder: 'Automatisch vom Gerät erkannt',
  },
  fr: {
    connected: 'Connecté', disconnected: 'Déconnecté',
    steam: 'Vapeur', tank: 'Réservoir', infusion: 'Infusion',
    extraction: 'Extraction', daily: 'Aujourd\'hui', current: 'actuel',
    set: 'consigne', low: 'BAS', ok: 'OK',
    wifi_network_status: 'État du réseau Wi-Fi',
    programming: 'Programmation', counters: 'Compteurs',
    alarms: 'Alarmes', user_settings: 'Paramètres',
    time_slot: 'Créneau',
    coffee_counters: 'Compteurs de café',
    dose_1: 'Dose 1', dose_2: 'Dose 2', dose_3: 'Dose 3',
    continuous: 'Continu', paddle: 'Levier',
    steam_activation: 'Vapeur', tea: 'Thé',
    active_alarms: 'Alarmes actives',
    no_active_alarm: 'Aucune alarme active', no_active_warning: 'Aucun avertissement actif',
    coffee_boiler_temperature: 'Température chaudière café',
    group_temperature: 'Température du groupe',
    service_boiler_pressure: 'Pression chaudière vapeur',
    clock_settings: 'Réglages horloge',
    coffee_boiler_settings: 'Réglages chaudière café',
    filter_holder_settings: 'Réglages porte-filtre',
    steam_boiler_settings: 'Réglages chaudière vapeur',
    clock: 'Horloge', sync_clock: 'Synchroniser l\'horloge',
    cloud_connection_status: 'État connexion cloud',
    wifi_device_information: 'Informations appareil Wi-Fi',
    firmware_version: 'Version du firmware',
    network_addresses: 'Adresses réseau',
    ip_obtained_connected: 'IP obtenue [Connecté]',
    coffee_machine: 'Machine à café',
    select_device: 'Sélectionnez votre Sanremo YOU',
    card_name: 'Nom de la carte (optionnel)',
    card_name_desc: 'Remplacer le nom affiché de la machine',
    card_name_placeholder: 'Détecté automatiquement',
  },
  es: {
    connected: 'Conectado', disconnected: 'Desconectado',
    steam: 'Vapor', tank: 'Depósito', infusion: 'Infusión',
    extraction: 'Extracción', daily: 'Hoy', current: 'actual',
    set: 'objetivo', low: 'BAJO', ok: 'OK',
    wifi_network_status: 'Estado de red Wi-Fi',
    programming: 'Programación', counters: 'Contadores',
    alarms: 'Alarmas', user_settings: 'Ajustes',
    time_slot: 'Franja',
    coffee_counters: 'Contadores de café',
    dose_1: 'Dosis 1', dose_2: 'Dosis 2', dose_3: 'Dosis 3',
    continuous: 'Continuo', paddle: 'Palanca',
    steam_activation: 'Vapor', tea: 'Té',
    active_alarms: 'Alarmas activas',
    no_active_alarm: 'Sin alarma activa', no_active_warning: 'Sin advertencia activa',
    coffee_boiler_temperature: 'Temperatura caldera café',
    group_temperature: 'Temperatura del grupo',
    service_boiler_pressure: 'Presión caldera de vapor',
    clock_settings: 'Ajustes de reloj',
    coffee_boiler_settings: 'Ajustes caldera de café',
    filter_holder_settings: 'Ajustes portafiltro',
    steam_boiler_settings: 'Ajustes caldera de vapor',
    clock: 'Reloj', sync_clock: 'Sincronizar reloj',
    cloud_connection_status: 'Estado conexión cloud',
    wifi_device_information: 'Información del dispositivo Wi-Fi',
    firmware_version: 'Versión de firmware',
    network_addresses: 'Direcciones de red',
    ip_obtained_connected: 'IP obtenida [Conectado]',
    coffee_machine: 'Máquina de café',
    select_device: 'Selecciona tu Sanremo YOU',
    card_name: 'Nombre de la tarjeta (opcional)',
    card_name_desc: 'Anular el nombre mostrado de la máquina',
    card_name_placeholder: 'Detectado automáticamente',
  },
};

function _t(lang, key) {
  const l = lang?.substring(0, 2) || 'en';
  return (_TRANSLATIONS[l] || _TRANSLATIONS.en)[key] || _TRANSLATIONS.en[key] || key;
}

/* ── Config Editor ── */
class SanremoYouCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._hass = null;
    this._root = this.attachShadow({ mode: 'open' });
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  _getDevices() {
    if (!this._hass) return [];
    const devices = [];
    const seen = new Set();
    for (const entityId of Object.keys(this._hass.states)) {
      const match = entityId.match(/^sensor\.(.+)_machine_status$/);
      if (match && !seen.has(match[1])) {
        seen.add(match[1]);
        const friendlyName = this._hass.states[entityId].attributes.friendly_name || match[1];
        devices.push({
          prefix: match[1],
          name: friendlyName.replace(' Machine Status', '')
        });
      }
    }
    return devices;
  }

  _render() {
    if (!this._hass) return;
    const devices = this._getDevices();
    const currentPrefix = this._config.entity_prefix || 'sanremo_you';
    const currentName = this._config.name || '';

    this._root.innerHTML = `
      <style>
        :host { display: block; }
        .editor { padding: 16px; }
        .field { margin-bottom: 16px; }
        .field label {
          display: block; font-weight: 500; margin-bottom: 6px;
          font-size: 14px; color: var(--primary-text-color);
        }
        .field .desc {
          font-size: 12px; color: var(--secondary-text-color);
          margin-bottom: 6px;
        }
        select, input {
          width: 100%; padding: 8px 12px; border-radius: 8px;
          border: 1px solid var(--divider-color, #ccc);
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color);
          font-size: 14px; box-sizing: border-box;
          outline: none;
        }
        select:focus, input:focus {
          border-color: var(--primary-color);
        }
      </style>
      <div class="editor">
        <div class="field">
          <label>${_t(this._hass?.language, 'coffee_machine')}</label>
          <div class="desc">${_t(this._hass?.language, 'select_device')}</div>
          <select id="prefix">
            ${devices.length === 0
              ? `<option value="${currentPrefix}">${currentPrefix}</option>`
              : devices.map(d =>
                  `<option value="${d.prefix}" ${d.prefix === currentPrefix ? 'selected' : ''}>${d.name}</option>`
                ).join('')
            }
          </select>
        </div>
        <div class="field">
          <label>${_t(this._hass?.language, 'card_name')}</label>
          <div class="desc">${_t(this._hass?.language, 'card_name_desc')}</div>
          <input type="text" id="name" value="${currentName}" placeholder="${_t(this._hass?.language, 'card_name_placeholder')}">
        </div>
      </div>`;

    this._root.getElementById('prefix').addEventListener('change', (e) => {
      this._config = { ...this._config, entity_prefix: e.target.value };
      this._fireChanged();
    });
    this._root.getElementById('name').addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val) {
        this._config = { ...this._config, name: val };
      } else {
        const { name, ...rest } = this._config;
        this._config = rest;
      }
      this._fireChanged();
    });
  }

  _fireChanged() {
    this.dispatchEvent(new CustomEvent('config-changed', {
      bubbles: true, composed: true,
      detail: { config: this._config }
    }));
  }
}

customElements.define('sanremo-you-card-editor', SanremoYouCardEditor);

/* ── Main Card ── */
class SanremoYouCard extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._config = null;
    this._prefix = 'sanremo_you';
    this._initialized = false;
    this._view = 'main';
    this._root = this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    this._config = config;
    this._prefix = config.entity_prefix || 'sanremo_you';
    if (!this._initialized) {
      this._buildDOM();
      this._attachListeners();
      this._initialized = true;
    }
    if (config.name) {
      const el = this._root.getElementById('machine-name');
      if (el) el.textContent = config.name;
    }
  }

  set hass(hass) {
    const langChanged = this._hass && hass.language !== this._hass.language;
    this._hass = hass;
    if (!this._initialized) return;
    if (langChanged) {
      this._buildDOM();
      this._attachListeners();
    }
    this._update();
  }

  _t(key) { return _t(this._hass?.language, key); }

  getCardSize() { return 6; }

  static getStubConfig() {
    return { entity_prefix: 'sanremo_you' };
  }

  static getConfigElement() {
    return document.createElement('sanremo-you-card-editor');
  }

  /* ── entity helpers ── */
  _s(suffix)  { return this._hass?.states[`sensor.${this._prefix}_${suffix}`]; }
  _sw(suffix) { return this._hass?.states[`switch.${this._prefix}_${suffix}`]; }
  _n(suffix)  { return this._hass?.states[`number.${this._prefix}_${suffix}`]; }
  _b(suffix)  { return this._hass?.states[`binary_sensor.${this._prefix}_${suffix}`]; }
  _btn(suffix){ return this._hass?.states[`button.${this._prefix}_${suffix}`]; }
  _$(id) { return this._root.getElementById(id); }

  /* ── navigation ── */
  _showView(view) {
    this._view = view;
    const views = ['main','settings','programming','counters','alarms',
                   'user-settings','setpoint-coffee','setpoint-group',
                   'setpoint-steam','clock','wifi'];
    views.forEach(v => {
      const el = this._$(`view-${v}`);
      if (el) el.style.display = (v === view) ? 'block' : 'none';
    });
    this._update();
  }

  /* ── setpoint adjustment ── */
  _adjustSetpoint(entitySuffix, delta) {
    const entityId = `number.${this._prefix}_${entitySuffix}`;
    const state = this._hass?.states[entityId];
    if (!state) return;
    const current = parseFloat(state.state);
    const step = state.attributes.step || 0.1;
    const min = state.attributes.min ?? 0;
    const max = state.attributes.max ?? 200;
    const newVal = Math.min(max, Math.max(min, +(current + delta * step).toFixed(1)));
    this._hass.callService('number', 'set_value', {
      entity_id: entityId, value: newVal
    });
  }

  /* ── hass-more-info event ── */
  _fire(entityId) {
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      bubbles: true, composed: true,
      detail: { entityId }
    }));
  }

  /* ── update all views ── */
  _update() {
    if (!this._hass) return;
    const v = this._view;

    /* always update status for icon bar */
    const status = this._s('machine_status');
    const statusVal = status?.state ?? 'unavailable';
    const isAvail = statusVal !== 'unavailable' && statusVal !== 'unknown';
    const power = this._sw('power');
    const isOn = power?.state === 'on';
    const isEco = statusVal === 'Eco Mode';
    const sched = this._sw('scheduler');
    const warns = this._s('warnings');
    const alarms = this._s('alarms');
    const hasAlarm = alarms && alarms.state !== 'None' && alarms.state !== 'unknown' && alarms.state !== 'unavailable';
    const hasWarn = warns && warns.state !== 'None' && warns.state !== 'unknown' && warns.state !== 'unavailable';

    if (v === 'main') {
      this._updateMain(status, statusVal, isAvail, power, isOn, isEco, sched, warns, alarms, hasAlarm, hasWarn);
    } else if (v === 'settings') {
      this._updateSettings(statusVal, isAvail, isOn, isEco, sched, hasAlarm, hasWarn);
    } else if (v === 'programming') {
      this._updateProgramming(sched);
    } else if (v === 'counters') {
      this._updateCounters();
    } else if (v === 'alarms') {
      this._updateAlarms(alarms, warns, hasAlarm, hasWarn);
    } else if (v === 'user-settings') {
      this._updateUserSettings();
    } else if (v.startsWith('setpoint-')) {
      this._updateSetpointView(v);
    } else if (v === 'clock') {
      this._updateClock();
    } else if (v === 'wifi') {
      this._updateWifi();
    }
  }

  _updateMain(status, statusVal, isAvail, power, isOn, isEco, sched, warns, alarms, hasAlarm, hasWarn) {
    const nameEl = this._$('machine-name');
    if (!this._config?.name && nameEl) {
      nameEl.textContent = status?.attributes?.friendly_name?.replace(' Machine Status', '') || 'SANREMO-YOU';
    }
    const conn = this._$('connectivity');
    conn.textContent = isAvail ? statusVal : this._t('disconnected');
    conn.className = 'connectivity ' + (isAvail ? 'connected' : 'disconnected');

    this._$('power-toggle').className = 'toggle-track' + (isOn ? ' on' : '');
    this._$('ib-power').className = 'ib-icon' + (isOn ? ' active' : '');
    this._$('lbl-off').className = 'power-label' + (isOn ? '' : ' active');
    this._$('lbl-on').className = 'power-label' + (isOn ? ' active' : '');
    this._$('ib-eco').className = 'ib-icon' + (isEco ? ' active' : '');
    this._$('ib-sched').className = 'ib-icon' + (sched?.state === 'on' ? ' active' : '');
    this._$('ib-warn').className = 'ib-icon' + (hasAlarm ? ' alarm' : hasWarn ? ' warning' : '');

    const steam = this._s('steam_boiler_pressure');
    const steamSet = this._n('steam_pressure_setpoint');
    this._$('steam-val').textContent = steam ? parseFloat(steam.state).toFixed(2) : '--';
    this._$('steam-set').textContent = steamSet ? `/ ${parseFloat(steamSet.state).toFixed(1)} ${this._t('set')}` : '';

    const temp = this._s('group_temperature');
    const tempSet = this._n('group_temperature_setpoint');
    this._$('temp-val').textContent = temp ? parseFloat(temp.state).toFixed(1) : '--';
    this._$('temp-set').textContent = tempSet ? `/ ${parseFloat(tempSet.state).toFixed(1)} ${this._t('set')}` : '';

    const tank = this._b('water_tank');
    const tankLow = tank?.state === 'on';
    const bars = this._$('tank-bars');
    const tankSt = this._$('tank-status');
    const barCount = 5;
    const filled = tankLow ? 1 : barCount;
    bars.innerHTML = '';
    for (let i = 0; i < barCount; i++) {
      const b = document.createElement('div');
      b.className = 'bar ' + (i < filled ? 'filled' : 'empty');
      if (tankLow && i < filled) b.classList.add('low');
      b.style.height = (10 + i * 4) + 'px';
      bars.appendChild(b);
    }
    tankSt.textContent = tankLow ? this._t('low') : this._t('ok');
    tankSt.className = 'g-status ' + (tankLow ? 'bad' : 'good');

    const ext = this._s('extraction_time');
    this._$('ext-val').textContent = ext ? parseFloat(ext.state).toFixed(1) + ' sec' : '-- sec';
    const daily = this._s('daily_shot_count');
    this._$('daily-val').textContent = daily ? String(daily.state).padStart(3, '0') + ` ${this._t('current')}` : '---';
  }

  _updateSettings(statusVal, isAvail, isOn, isEco, sched, hasAlarm, hasWarn) {
    const connVal = this._$('settings-conn-val');
    if (connVal) {
      connVal.textContent = isAvail ? this._t('connected') : this._t('disconnected');
      connVal.style.color = isAvail ? 'var(--grn)' : 'var(--red)';
    }
    this._$('s-ib-eco').className = 'ib-icon' + (isEco ? ' active' : '');
    this._$('s-ib-power').className = 'ib-icon' + (isOn ? ' active' : '');
    this._$('s-ib-sched').className = 'ib-icon' + (sched?.state === 'on' ? ' active' : '');
    this._$('s-ib-warn').className = 'ib-icon' + (hasAlarm ? ' alarm' : hasWarn ? ' warning' : '');
  }

  _updateProgramming(sched) {
    const isOn = sched?.state === 'on';
    this._$('sched-toggle').className = 'toggle-track' + (isOn ? ' on' : '');
    this._$('sched-lbl-off').className = 'power-label' + (isOn ? '' : ' active');
    this._$('sched-lbl-on').className = 'power-label' + (isOn ? ' active' : '');
  }

  _updateCounters() {
    const counters = [
      ['cnt-dose1', 'dose_1_counter', 3],
      ['cnt-dose2', 'dose_2_counter', 3],
      ['cnt-dose3', 'dose_3_counter', 3],
      ['cnt-cont',  'continuous_counter', 3],
      ['cnt-paddle','paddle_counter', 5],
      ['cnt-steam', 'steam_activation_counter', 5],
      ['cnt-tea',   'tea_counter', 5],
    ];
    counters.forEach(([id, suffix, pad]) => {
      const e = this._s(suffix);
      const el = this._$(id);
      if (el) el.textContent = e ? String(e.state).padStart(pad, '0') : '--';
    });
  }

  _updateAlarms(alarms, warns, hasAlarm, hasWarn) {
    const icon = this._$('alarm-icon');
    icon.className = 'alarm-badge ' + (hasAlarm ? 'alarm' : hasWarn ? 'warning' : '');
    this._$('alarm-text').textContent = hasAlarm ? alarms.state : this._t('no_active_alarm');
    this._$('warning-text').textContent = hasWarn ? warns.state : this._t('no_active_warning');
  }

  _updateUserSettings() {
    const cb = this._n('coffee_boiler_setpoint');
    const gt = this._n('group_temperature_setpoint');
    const sp = this._n('steam_pressure_setpoint');
    this._$('us-coffee-val').textContent = cb ? `${parseFloat(cb.state).toFixed(1)} °C` : '--';
    this._$('us-group-val').textContent = gt ? `${parseFloat(gt.state).toFixed(1)} °C` : '--';
    this._$('us-steam-val').textContent = sp ? `${parseFloat(sp.state).toFixed(1)} BAR` : '--';
  }

  _updateSetpointView(view) {
    const map = {
      'setpoint-coffee': ['coffee_boiler_setpoint', 'sp-coffee-val', '°C'],
      'setpoint-group':  ['group_temperature_setpoint', 'sp-group-val', '°C'],
      'setpoint-steam':  ['steam_pressure_setpoint', 'sp-steam-val', 'BAR'],
    };
    const [suffix, elId, unit] = map[view] || [];
    if (!suffix) return;
    const e = this._n(suffix);
    const el = this._$(elId);
    if (el) el.innerHTML = e
      ? `${parseFloat(e.state).toFixed(1)}<span class="sp-unit">${unit}</span>`
      : '--';
  }

  _updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const mo = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    this._$('clock-time').textContent = `${h}:${m}`;
    this._$('clock-date').textContent = `${d}/${mo}/${y}`;
  }

  _updateWifi() {
    const ssid = this._s('wifi_ssid');
    const signal = this._s('wifi_signal');
    const ip = this._s('ip_address');
    const mac = this._s('mac_address');
    const fw = this._s('firmware_version');
    const status = this._s('machine_status');
    const isAvail = status?.state !== 'unavailable' && status?.state !== 'unknown';

    this._$('wifi-ssid').textContent = ssid?.state && ssid.state !== 'unknown' ? ssid.state : '--';
    this._$('wifi-status').textContent = isAvail ? this._t('ip_obtained_connected') : this._t('disconnected');
    this._$('wifi-status').style.color = isAvail ? 'var(--grn)' : 'var(--red)';
    this._$('wifi-ip').textContent = ip?.state && ip.state !== 'unknown' ? ip.state : '--';
    this._$('wifi-mac').textContent = mac?.state && mac.state !== 'unknown' ? mac.state : '--';
    this._$('wifi-fw').textContent = fw?.state && fw.state !== 'unknown' ? fw.state : '--';
    this._$('cloud-status').textContent = isAvail ? this._t('connected') : this._t('disconnected');
    this._$('cloud-status').style.color = isAvail ? 'var(--grn)' : 'var(--red)';

    // Signal strength bars
    // Signal value from API is a raw integer (0-100 typical range)
    const sigVal = parseInt(signal?.state) || 0;
    const barCount = 5;
    const filled = Math.min(barCount, Math.max(0, Math.ceil(sigVal / 20)));
    const barsEl = this._$('wifi-signal-bars');
    barsEl.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'signal-bars';
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'signal-bar' + (i < filled ? ' filled' : '');
      bar.style.height = (6 + i * 4) + 'px';
      container.appendChild(bar);
    }
    barsEl.appendChild(container);
  }

  /* ── event listeners ── */
  _attachListeners() {
    const p = this._prefix;

    /* main view */
    this._$('power-toggle').addEventListener('click', () => {
      this._hass?.callService('switch', 'toggle', { entity_id: `switch.${p}_power` });
    });
    this._$('gauge-steam').addEventListener('click', () => this._fire(`number.${p}_steam_pressure_setpoint`));
    this._$('gauge-temp').addEventListener('click', () => this._fire(`number.${p}_group_temperature_setpoint`));
    this._$('gauge-tank').addEventListener('click', () => this._fire(`binary_sensor.${p}_water_tank`));
    this._$('cell-ext').addEventListener('click', () => this._fire(`sensor.${p}_extraction_time`));
    this._$('cell-daily').addEventListener('click', () => this._fire(`sensor.${p}_daily_shot_count`));
    this._$('ib-eco').addEventListener('click', () => this._fire(`sensor.${p}_machine_status`));
    this._$('ib-power').addEventListener('click', () => this._fire(`switch.${p}_power`));
    this._$('ib-sched').addEventListener('click', () => this._fire(`switch.${p}_scheduler`));
    this._$('ib-warn').addEventListener('click', () => this._fire(`sensor.${p}_warnings`));

    /* gear → settings */
    this._root.querySelectorAll('.gear').forEach(g =>
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this._view === 'main') this._showView('settings');
      })
    );

    /* settings back → main */
    this._$('back-settings').addEventListener('click', () => this._showView('main'));

    /* settings tiles */
    this._$('nav-programming').addEventListener('click', () => this._showView('programming'));
    this._$('nav-counters').addEventListener('click', () => this._showView('counters'));
    this._$('nav-alarms').addEventListener('click', () => this._showView('alarms'));
    this._$('nav-user-settings').addEventListener('click', () => this._showView('user-settings'));
    this._$('nav-wifi').addEventListener('click', () => this._showView('wifi'));

    /* sub-view back buttons → settings */
    ['back-prog','back-cnt','back-alarms','back-us','back-wifi'].forEach(id =>
      this._$(id).addEventListener('click', () => this._showView('settings'))
    );

    /* programming: scheduler toggle */
    this._$('sched-toggle').addEventListener('click', () => {
      this._hass?.callService('switch', 'toggle', { entity_id: `switch.${p}_scheduler` });
    });

    /* programming: slot rows → more-info */
    for (let i = 1; i <= 6; i++) {
      this._$(`slot-row-${i}`).addEventListener('click', () =>
        this._fire(`time.${p}_slot_${i}_start_time`)
      );
    }

    /* user settings rows */
    this._$('us-row-coffee').addEventListener('click', () => this._showView('setpoint-coffee'));
    this._$('us-row-group').addEventListener('click', () => this._showView('setpoint-group'));
    this._$('us-row-steam').addEventListener('click', () => this._showView('setpoint-steam'));
    this._$('us-row-clock').addEventListener('click', () => this._showView('clock'));

    /* setpoint back → user-settings */
    ['back-sp-coffee','back-sp-group','back-sp-steam','back-clock'].forEach(id =>
      this._$(id).addEventListener('click', () => this._showView('user-settings'))
    );

    /* setpoint +/- buttons */
    this._$('sp-coffee-minus').addEventListener('click', () => this._adjustSetpoint('coffee_boiler_setpoint', -1));
    this._$('sp-coffee-plus').addEventListener('click', () => this._adjustSetpoint('coffee_boiler_setpoint', 1));
    this._$('sp-group-minus').addEventListener('click', () => this._adjustSetpoint('group_temperature_setpoint', -1));
    this._$('sp-group-plus').addEventListener('click', () => this._adjustSetpoint('group_temperature_setpoint', 1));
    this._$('sp-steam-minus').addEventListener('click', () => this._adjustSetpoint('steam_pressure_setpoint', -1));
    this._$('sp-steam-plus').addEventListener('click', () => this._adjustSetpoint('steam_pressure_setpoint', 1));

    /* clock sync button */
    this._$('btn-sync-clock').addEventListener('click', () => {
      this._hass?.callService('button', 'press', { entity_id: `button.${p}_sync_clock` });
    });
  }

  /* ── build DOM ── */
  _buildDOM() {
    this._root.innerHTML = `
<style>
:host{display:block;--bg:#1e1e1e;--sf:#2a2a2a;--sf2:#363636;--t1:#e0e0e0;--t2:#888;--grn:#4caf50;--org:#ff9800;--red:#f44336;--blu:#42a5f5;--r:12px;font-family:'Segoe UI',Roboto,sans-serif}
.card{background:var(--bg);border-radius:var(--r);overflow:hidden;color:var(--t1);padding:0}

/* ── header ── */
.hdr{display:flex;align-items:center;justify-content:space-between;padding:16px 16px 8px}
.hdr .logo{font-size:26px;font-weight:800;letter-spacing:4px;color:var(--t1)}
.hdr .mname{font-size:13px;color:var(--t2);margin-top:2px;letter-spacing:1px}
.gear{cursor:pointer;color:var(--t2);transition:color .2s;padding:8px}
.gear:hover{color:var(--t1)}

/* ── sub-view header ── */
.sub-hdr{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--sf);margin:0;border-radius:0}
.sub-hdr .back{cursor:pointer;color:var(--t2);padding:6px;transition:color .2s;font-size:22px;line-height:1}
.sub-hdr .back:hover{color:var(--t1)}
.sub-hdr .logo{font-size:22px;font-weight:800;letter-spacing:4px;color:var(--t1)}
.section-title{background:var(--sf);margin:8px 0 0;padding:10px 16px;font-size:14px;color:var(--t2);font-weight:400}

/* ── icon bar ── */
.icon-bar{display:flex;justify-content:space-around;padding:10px 20px;background:var(--sf);margin:0 12px;border-radius:8px}
.ib-icon{width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:50%;cursor:pointer;transition:all .2s;color:var(--t2)}
.ib-icon:hover{background:var(--sf2)}
.ib-icon.active{color:var(--grn)}
.ib-icon.warning{color:var(--org)}
.ib-icon.alarm{color:var(--red)}

/* ── connectivity ── */
.connectivity{margin:10px 12px;padding:7px 14px;border-radius:8px;font-size:12px;text-align:center;font-weight:600;letter-spacing:.5px;text-transform:uppercase}
.connectivity.connected{background:rgba(76,175,80,.12);color:var(--grn);border:1px solid rgba(76,175,80,.25)}
.connectivity.disconnected{background:rgba(244,67,54,.12);color:var(--red);border:1px solid rgba(244,67,54,.25)}

/* ── gauges ── */
.gauges{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:10px 12px 6px}
.gauge{background:var(--sf);border-radius:10px;padding:14px 8px 12px;text-align:center;cursor:pointer;transition:background .2s}
.gauge:hover{background:var(--sf2)}
.g-icon{margin-bottom:6px}
.g-icon ha-icon{--mdc-icon-size:28px;color:var(--t2)}
.g-label{font-size:10px;text-transform:uppercase;color:var(--t2);letter-spacing:1.5px;margin-bottom:6px;font-weight:600}
.g-value{font-size:26px;font-weight:700;line-height:1.1}
.g-unit{font-size:11px;color:var(--t2);text-transform:uppercase;margin-top:2px;font-weight:600}
.g-setpoint{font-size:10px;color:var(--t2);margin-top:4px}
.g-status{font-size:12px;font-weight:700;margin-top:2px}
.g-status.good{color:var(--grn)}
.g-status.bad{color:var(--red)}
.tank-bars{display:flex;gap:3px;justify-content:center;margin:8px 0 4px;height:32px;align-items:flex-end}
.bar{width:10px;border-radius:2px;transition:background .3s}
.bar.filled{background:var(--grn)}
.bar.filled.low{background:var(--red)}
.bar.empty{background:var(--sf2)}

/* ── info row ── */
.info-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:6px 12px}
.info-cell{background:var(--sf);border-radius:10px;padding:14px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:background .2s}
.info-cell:hover{background:var(--sf2)}
.ic-icon ha-icon{--mdc-icon-size:28px;color:var(--t2)}
.ic-label{font-size:10px;color:var(--t2);text-transform:uppercase;letter-spacing:1px;font-weight:600;margin-bottom:2px}
.ic-value{font-size:20px;font-weight:700}

/* ── power / toggle ── */
.power-row{display:flex;align-items:center;justify-content:center;gap:20px;padding:14px 16px 18px}
.power-label{font-size:14px;font-weight:700;letter-spacing:2px;color:var(--t2);transition:color .3s}
.power-label.active{color:var(--t1)}
.toggle-track{width:56px;height:30px;border-radius:15px;background:var(--sf2);position:relative;cursor:pointer;transition:all .3s;border:2px solid #555}
.toggle-track.on{background:rgba(76,175,80,.25);border-color:var(--grn)}
.toggle-thumb{width:24px;height:24px;border-radius:50%;background:#777;position:absolute;top:3px;left:3px;transition:all .3s;display:flex;align-items:center;justify-content:center}
.toggle-track.on .toggle-thumb{left:27px;background:var(--grn)}
.toggle-thumb ha-icon{--mdc-icon-size:14px;color:var(--bg)}

/* ── settings grid ── */
.settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:12px}
.settings-tile{background:var(--sf);border-radius:10px;padding:28px 16px;text-align:center;cursor:pointer;transition:background .2s;display:flex;flex-direction:column;align-items:center;gap:10px}
.settings-tile:hover{background:var(--sf2)}
.settings-tile ha-icon{--mdc-icon-size:36px;color:var(--t2)}
.settings-tile .tile-label{font-size:15px;font-weight:600}

/* ── nav row (used in programming, user-settings) ── */
.nav-row{display:flex;align-items:center;justify-content:space-between;background:var(--sf);margin:6px 0;padding:18px 16px;cursor:pointer;transition:background .2s;border-radius:0}
.nav-row:hover{background:var(--sf2)}
.nav-row .nr-label{font-size:15px;font-weight:600}
.nav-row .nr-right{display:flex;align-items:center;gap:8px;color:var(--t2)}
.nav-row .nr-value{font-size:15px;color:var(--t2)}
.nav-row .nr-chev{font-size:18px;color:var(--t2)}

/* ── counter row ── */
.counter-row{display:flex;align-items:center;justify-content:space-between;background:var(--sf);margin:6px 0;padding:18px 16px;border-radius:0}
.counter-row .cr-label{font-size:15px;font-weight:600}
.counter-row .cr-value{font-size:15px;font-weight:700;font-family:'Courier New',monospace;letter-spacing:1px}

/* ── alarm panel ── */
.alarm-panel{display:flex;background:var(--sf);margin:6px 0;padding:20px 16px;gap:16px;align-items:flex-start;border-radius:0}
.alarm-badge{width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:var(--sf2);flex-shrink:0}
.alarm-badge ha-icon{--mdc-icon-size:28px;color:var(--t2)}
.alarm-badge.alarm ha-icon{color:var(--red)}
.alarm-badge.warning ha-icon{color:var(--org)}
.alarm-lines{flex:1}
.alarm-line{font-size:14px;padding:6px 0;color:var(--t1)}
.alarm-divider{border-top:1px solid var(--sf2);margin:2px 0}

/* ── setpoint control ── */
.sp-panel{display:flex;background:var(--sf);margin:6px 0;padding:20px 16px;gap:16px;align-items:center;border-radius:0}
.sp-icon{width:56px;height:56px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:var(--sf2);flex-shrink:0}
.sp-icon ha-icon{--mdc-icon-size:30px;color:var(--t2)}
.sp-controls{flex:1;display:flex;align-items:center;justify-content:space-between}
.sp-btn{width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t2);font-size:24px;transition:color .2s;border:none;background:none;border-radius:50%}
.sp-btn:hover{color:var(--t1);background:var(--sf2)}
.sp-val{font-size:32px;font-weight:700;text-align:center;flex:1}
.sp-unit{font-size:14px;color:var(--t2);font-weight:400;margin-left:2px}

/* ── clock panel ── */
.clock-panel{background:var(--sf);margin:6px 0;padding:28px 16px;text-align:center;border-radius:0}
.clock-time{font-size:48px;font-weight:700;letter-spacing:2px}
.clock-date{font-size:18px;color:var(--t2);margin-top:4px}
.sync-btn{display:inline-block;margin-top:20px;padding:10px 32px;background:var(--sf2);border:1px solid #555;border-radius:6px;color:var(--t1);font-size:14px;font-weight:600;cursor:pointer;transition:all .2s}
.sync-btn:hover{background:#444;border-color:var(--t2)}

/* ── scheduler toggle row ── */
.sched-toggle-row{display:flex;align-items:center;background:var(--sf);margin:6px 0;padding:14px 16px;gap:16px;border-radius:0}
.sched-toggle-icon{width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:var(--sf2)}
.sched-toggle-icon ha-icon{--mdc-icon-size:26px;color:var(--t2)}
.sched-toggle-controls{flex:1;display:flex;align-items:center;justify-content:center;gap:20px}

/* ── network info sections ── */
.net-section{background:var(--sf);margin:6px 0;padding:4px 16px;border-radius:0}
.net-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--sf2)}
.net-row:last-child{border-bottom:none}
.net-label{font-size:14px;color:var(--t2)}
.net-value{font-size:14px;font-weight:600;text-align:right}
.signal-bars{display:flex;gap:3px;align-items:flex-end;height:22px}
.signal-bar{width:6px;border-radius:1px;background:var(--sf2)}
.signal-bar.filled{background:var(--grn)}

/* ── responsive ── */
@media(max-width:400px){.gauges{gap:4px}.gauge .g-value{font-size:20px}.gauge{padding:10px 4px 8px}.ic-value{font-size:16px}.sp-val{font-size:24px}}
</style>
<div class="card">

  <!-- ═══ MAIN VIEW ═══ -->
  <div id="view-main">
    <div class="hdr">
      <div>
        <div class="logo">YOU</div>
        <div class="mname" id="machine-name">SANREMO-YOU</div>
      </div>
      <div class="gear"><ha-icon icon="mdi:cog"></ha-icon></div>
    </div>
    <div class="icon-bar">
      <div class="ib-icon" id="ib-eco"><ha-icon icon="mdi:leaf"></ha-icon></div>
      <div class="ib-icon" id="ib-power"><ha-icon icon="mdi:power"></ha-icon></div>
      <div class="ib-icon" id="ib-sched"><ha-icon icon="mdi:calendar-clock"></ha-icon></div>
      <div class="ib-icon" id="ib-warn"><ha-icon icon="mdi:alert-outline"></ha-icon></div>
    </div>
    <div class="connectivity connected" id="connectivity">${this._t('connected')}</div>
    <div class="gauges">
      <div class="gauge" id="gauge-steam">
        <div class="g-icon"><ha-icon icon="mdi:gauge"></ha-icon></div>
        <div class="g-label">${this._t('steam')}</div>
        <div class="g-value" id="steam-val">--</div>
        <div class="g-unit">bar</div>
        <div class="g-setpoint" id="steam-set"></div>
      </div>
      <div class="gauge" id="gauge-tank">
        <div class="g-icon"><ha-icon icon="mdi:water"></ha-icon></div>
        <div class="g-label">${this._t('tank')}</div>
        <div class="tank-bars" id="tank-bars"></div>
        <div class="g-status good" id="tank-status">${this._t('ok')}</div>
      </div>
      <div class="gauge" id="gauge-temp">
        <div class="g-icon"><ha-icon icon="mdi:coffee"></ha-icon></div>
        <div class="g-label">${this._t('infusion')}</div>
        <div class="g-value" id="temp-val">--</div>
        <div class="g-unit">°C</div>
        <div class="g-setpoint" id="temp-set"></div>
      </div>
    </div>
    <div class="info-row">
      <div class="info-cell" id="cell-ext">
        <div class="ic-icon"><ha-icon icon="mdi:timer-outline"></ha-icon></div>
        <div><div class="ic-label">${this._t('extraction')}</div><div class="ic-value" id="ext-val">-- sec</div></div>
      </div>
      <div class="info-cell" id="cell-daily">
        <div class="ic-icon"><ha-icon icon="mdi:coffee"></ha-icon></div>
        <div><div class="ic-label">${this._t('daily')}</div><div class="ic-value" id="daily-val">---</div></div>
      </div>
    </div>
    <div class="power-row">
      <span class="power-label" id="lbl-off">OFF</span>
      <div class="toggle-track" id="power-toggle">
        <div class="toggle-thumb"><ha-icon icon="mdi:power"></ha-icon></div>
      </div>
      <span class="power-label" id="lbl-on">ON</span>
    </div>
  </div>

  <!-- ═══ SETTINGS MENU ═══ -->
  <div id="view-settings" style="display:none">
    <div class="sub-hdr">
      <div class="back" id="back-settings"><ha-icon icon="mdi:chevron-left"></ha-icon></div>
      <div class="logo">YOU</div>
      <div class="gear"><ha-icon icon="mdi:cog"></ha-icon></div>
    </div>
    <div class="section-title">SANREMO-YOU</div>
    <div class="icon-bar" style="margin-top:10px">
      <div class="ib-icon" id="s-ib-eco"><ha-icon icon="mdi:leaf"></ha-icon></div>
      <div class="ib-icon" id="s-ib-power"><ha-icon icon="mdi:power"></ha-icon></div>
      <div class="ib-icon" id="s-ib-sched"><ha-icon icon="mdi:calendar-clock"></ha-icon></div>
      <div class="ib-icon" id="s-ib-warn"><ha-icon icon="mdi:alert-outline"></ha-icon></div>
    </div>
    <div class="nav-row" id="nav-wifi" style="margin-top:10px">
      <span class="nr-label"><ha-icon icon="mdi:wifi" style="--mdc-icon-size:18px;vertical-align:middle;margin-right:8px;color:var(--t2)"></ha-icon>${this._t('wifi_network_status')}</span>
      <div class="nr-right"><span class="nr-value" id="settings-conn-val">${this._t('connected')}</span><span class="nr-chev">›</span></div>
    </div>
    <div class="settings-grid">
      <div class="settings-tile" id="nav-programming">
        <ha-icon icon="mdi:calendar-clock"></ha-icon>
        <span class="tile-label">${this._t('programming')}</span>
      </div>
      <div class="settings-tile" id="nav-counters">
        <ha-icon icon="mdi:clipboard-text-outline"></ha-icon>
        <span class="tile-label">${this._t('counters')}</span>
      </div>
      <div class="settings-tile" id="nav-alarms">
        <ha-icon icon="mdi:alert-outline"></ha-icon>
        <span class="tile-label">${this._t('alarms')}</span>
      </div>
      <div class="settings-tile" id="nav-user-settings">
        <ha-icon icon="mdi:account-outline"></ha-icon>
        <span class="tile-label">${this._t('user_settings')}</span>
      </div>
    </div>
  </div>

  <!-- ═══ PROGRAMMING ═══ -->
  <div id="view-programming" style="display:none">
    <div class="sub-hdr">
      <div class="back" id="back-prog"><ha-icon icon="mdi:chevron-left"></ha-icon></div>
      <div class="logo">YOU</div>
      <div class="gear"><ha-icon icon="mdi:cog"></ha-icon></div>
    </div>
    <div class="section-title">${this._t('programming')}</div>
    <div class="sched-toggle-row">
      <div class="sched-toggle-icon"><ha-icon icon="mdi:calendar-clock"></ha-icon></div>
      <div class="sched-toggle-controls">
        <span class="power-label" id="sched-lbl-off">OFF</span>
        <div class="toggle-track" id="sched-toggle">
          <div class="toggle-thumb"><ha-icon icon="mdi:power"></ha-icon></div>
        </div>
        <span class="power-label" id="sched-lbl-on">ON</span>
      </div>
    </div>
    <div class="nav-row" id="slot-row-1"><span class="nr-label">${this._t('time_slot')} 1</span><span class="nr-chev">›</span></div>
    <div class="nav-row" id="slot-row-2"><span class="nr-label">${this._t('time_slot')} 2</span><span class="nr-chev">›</span></div>
    <div class="nav-row" id="slot-row-3"><span class="nr-label">${this._t('time_slot')} 3</span><span class="nr-chev">›</span></div>
    <div class="nav-row" id="slot-row-4"><span class="nr-label">${this._t('time_slot')} 4</span><span class="nr-chev">›</span></div>
    <div class="nav-row" id="slot-row-5"><span class="nr-label">${this._t('time_slot')} 5</span><span class="nr-chev">›</span></div>
    <div class="nav-row" id="slot-row-6"><span class="nr-label">${this._t('time_slot')} 6</span><span class="nr-chev">›</span></div>
  </div>

  <!-- ═══ COUNTERS ═══ -->
  <div id="view-counters" style="display:none">
    <div class="sub-hdr">
      <div class="back" id="back-cnt"><ha-icon icon="mdi:chevron-left"></ha-icon></div>
      <div class="logo">YOU</div>
      <div class="gear"><ha-icon icon="mdi:cog"></ha-icon></div>
    </div>
    <div class="section-title">${this._t('coffee_counters')}</div>
    <div class="counter-row"><span class="cr-label">${this._t('dose_1')}</span><span class="cr-value" id="cnt-dose1">--</span></div>
    <div class="counter-row"><span class="cr-label">${this._t('dose_2')}</span><span class="cr-value" id="cnt-dose2">--</span></div>
    <div class="counter-row"><span class="cr-label">${this._t('dose_3')}</span><span class="cr-value" id="cnt-dose3">--</span></div>
    <div class="counter-row"><span class="cr-label">${this._t('continuous')}</span><span class="cr-value" id="cnt-cont">--</span></div>
    <div class="counter-row"><span class="cr-label">${this._t('paddle')}</span><span class="cr-value" id="cnt-paddle">--</span></div>
    <div class="counter-row"><span class="cr-label">${this._t('steam_activation')}</span><span class="cr-value" id="cnt-steam">--</span></div>
    <div class="counter-row"><span class="cr-label">${this._t('tea')}</span><span class="cr-value" id="cnt-tea">--</span></div>
  </div>

  <!-- ═══ ALARMS ═══ -->
  <div id="view-alarms" style="display:none">
    <div class="sub-hdr">
      <div class="back" id="back-alarms"><ha-icon icon="mdi:chevron-left"></ha-icon></div>
      <div class="logo">YOU</div>
      <div class="gear"><ha-icon icon="mdi:cog"></ha-icon></div>
    </div>
    <div class="section-title">${this._t('active_alarms')}</div>
    <div class="alarm-panel">
      <div class="alarm-badge" id="alarm-icon"><ha-icon icon="mdi:alert-outline"></ha-icon></div>
      <div class="alarm-lines">
        <div class="alarm-line" id="alarm-text">${this._t('no_active_alarm')}</div>
        <div class="alarm-divider"></div>
        <div class="alarm-line" id="warning-text">${this._t('no_active_warning')}</div>
      </div>
    </div>
  </div>

  <!-- ═══ USER SETTINGS ═══ -->
  <div id="view-user-settings" style="display:none">
    <div class="sub-hdr">
      <div class="back" id="back-us"><ha-icon icon="mdi:chevron-left"></ha-icon></div>
      <div class="logo">YOU</div>
      <div class="gear"><ha-icon icon="mdi:cog"></ha-icon></div>
    </div>
    <div class="section-title">${this._t('user_settings')}</div>
    <div class="nav-row" id="us-row-coffee">
      <span class="nr-label">${this._t('coffee_boiler_temperature')}</span>
      <div class="nr-right"><span class="nr-value" id="us-coffee-val">--</span><span class="nr-chev">›</span></div>
    </div>
    <div class="nav-row" id="us-row-group">
      <span class="nr-label">${this._t('group_temperature')}</span>
      <div class="nr-right"><span class="nr-value" id="us-group-val">--</span><span class="nr-chev">›</span></div>
    </div>
    <div class="nav-row" id="us-row-steam">
      <span class="nr-label">${this._t('service_boiler_pressure')}</span>
      <div class="nr-right"><span class="nr-value" id="us-steam-val">--</span><span class="nr-chev">›</span></div>
    </div>
    <div class="nav-row" id="us-row-clock">
      <span class="nr-label">${this._t('clock_settings')}</span>
      <div class="nr-right"><span class="nr-chev">›</span></div>
    </div>
  </div>

  <!-- ═══ SETPOINT: COFFEE BOILER ═══ -->
  <div id="view-setpoint-coffee" style="display:none">
    <div class="sub-hdr">
      <div class="back" id="back-sp-coffee"><ha-icon icon="mdi:chevron-left"></ha-icon></div>
      <div class="logo">YOU</div>
      <div class="gear"><ha-icon icon="mdi:cog"></ha-icon></div>
    </div>
    <div class="section-title">${this._t('coffee_boiler_settings')}</div>
    <div class="sp-panel">
      <div class="sp-icon"><ha-icon icon="mdi:coffee"></ha-icon></div>
      <div class="sp-controls">
        <button class="sp-btn" id="sp-coffee-minus">−</button>
        <div class="sp-val" id="sp-coffee-val">--</div>
        <button class="sp-btn" id="sp-coffee-plus">+</button>
      </div>
    </div>
  </div>

  <!-- ═══ SETPOINT: GROUP TEMP ═══ -->
  <div id="view-setpoint-group" style="display:none">
    <div class="sub-hdr">
      <div class="back" id="back-sp-group"><ha-icon icon="mdi:chevron-left"></ha-icon></div>
      <div class="logo">YOU</div>
      <div class="gear"><ha-icon icon="mdi:cog"></ha-icon></div>
    </div>
    <div class="section-title">${this._t('filter_holder_settings')}</div>
    <div class="sp-panel">
      <div class="sp-icon"><ha-icon icon="mdi:coffee"></ha-icon></div>
      <div class="sp-controls">
        <button class="sp-btn" id="sp-group-minus">−</button>
        <div class="sp-val" id="sp-group-val">--</div>
        <button class="sp-btn" id="sp-group-plus">+</button>
      </div>
    </div>
  </div>

  <!-- ═══ SETPOINT: STEAM PRESSURE ═══ -->
  <div id="view-setpoint-steam" style="display:none">
    <div class="sub-hdr">
      <div class="back" id="back-sp-steam"><ha-icon icon="mdi:chevron-left"></ha-icon></div>
      <div class="logo">YOU</div>
      <div class="gear"><ha-icon icon="mdi:cog"></ha-icon></div>
    </div>
    <div class="section-title">${this._t('steam_boiler_settings')}</div>
    <div class="sp-panel">
      <div class="sp-icon"><ha-icon icon="mdi:gauge"></ha-icon></div>
      <div class="sp-controls">
        <button class="sp-btn" id="sp-steam-minus">−</button>
        <div class="sp-val" id="sp-steam-val">--</div>
        <button class="sp-btn" id="sp-steam-plus">+</button>
      </div>
    </div>
  </div>

  <!-- ═══ CLOCK SETTINGS ═══ -->
  <div id="view-clock" style="display:none">
    <div class="sub-hdr">
      <div class="back" id="back-clock"><ha-icon icon="mdi:chevron-left"></ha-icon></div>
      <div class="logo">YOU</div>
      <div class="gear"><ha-icon icon="mdi:cog"></ha-icon></div>
    </div>
    <div class="section-title">${this._t('clock')}</div>
    <div class="clock-panel">
      <div class="clock-time" id="clock-time">--:--</div>
      <div class="clock-date" id="clock-date">--/--/----</div>
      <button class="sync-btn" id="btn-sync-clock">${this._t('sync_clock')}</button>
    </div>
  </div>

  <!-- ═══ WI-FI STATUS ═══ -->
  <div id="view-wifi" style="display:none">
    <div class="sub-hdr">
      <div class="back" id="back-wifi"><ha-icon icon="mdi:chevron-left"></ha-icon></div>
      <div class="logo">YOU</div>
      <div class="gear"><ha-icon icon="mdi:cog"></ha-icon></div>
    </div>

    <div class="section-title">${this._t('wifi_network_status')}</div>
    <div class="net-section">
      <div class="net-row"><span class="net-label">SSID:</span><span class="net-value" id="wifi-ssid">--</span></div>
      <div class="net-row"><span class="net-label">Status:</span><span class="net-value" id="wifi-status">--</span></div>
      <div class="net-row"><span class="net-label">Signal:</span><div class="net-value" id="wifi-signal-bars"></div></div>
    </div>

    <div class="section-title">${this._t('cloud_connection_status')}</div>
    <div class="net-section">
      <div class="net-row"><span class="net-label">Status:</span><span class="net-value" id="cloud-status">--</span></div>
    </div>

    <div class="section-title">${this._t('wifi_device_information')}</div>
    <div class="net-section">
      <div class="net-row"><span class="net-label">MAC:</span><span class="net-value" id="wifi-mac">--</span></div>
      <div class="net-row"><span class="net-label">${this._t('firmware_version')}</span><span class="net-value" id="wifi-fw">--</span></div>
    </div>

    <div class="section-title">${this._t('network_addresses')}</div>
    <div class="net-section">
      <div class="net-row"><span class="net-label">IP:</span><span class="net-value" id="wifi-ip">--</span></div>
    </div>
  </div>

</div>`;
  }
}

customElements.define('sanremo-you-card', SanremoYouCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'sanremo-you-card',
  name: 'Sanremo YOU Coffee Machine',
  description: 'Custom status card matching the Sanremo YOU web interface',
  preview: true
});
