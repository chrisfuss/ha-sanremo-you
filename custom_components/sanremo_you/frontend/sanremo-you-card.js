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
    this._hass = hass;
    if (!this._initialized) return;
    this._update();
  }

  getCardSize() { return 6; }

  static getStubConfig() {
    return { entity_prefix: 'sanremo_you' };
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
                   'setpoint-steam','clock'];
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
    }
  }

  _updateMain(status, statusVal, isAvail, power, isOn, isEco, sched, warns, alarms, hasAlarm, hasWarn) {
    const nameEl = this._$('machine-name');
    if (!this._config?.name && nameEl) {
      nameEl.textContent = status?.attributes?.friendly_name?.replace(' Machine Status', '') || 'SANREMO-YOU';
    }
    const conn = this._$('connectivity');
    conn.textContent = isAvail ? statusVal : 'Disconnected';
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
    this._$('steam-set').textContent = steamSet ? `/ ${parseFloat(steamSet.state).toFixed(1)} set` : '';

    const temp = this._s('group_temperature');
    const tempSet = this._n('group_temperature_setpoint');
    this._$('temp-val').textContent = temp ? parseFloat(temp.state).toFixed(1) : '--';
    this._$('temp-set').textContent = tempSet ? `/ ${parseFloat(tempSet.state).toFixed(1)} set` : '';

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
    tankSt.textContent = tankLow ? 'LOW' : 'OK';
    tankSt.className = 'g-status ' + (tankLow ? 'bad' : 'good');

    const ext = this._s('extraction_time');
    this._$('ext-val').textContent = ext ? parseFloat(ext.state).toFixed(1) + ' sec' : '-- sec';
    const daily = this._s('daily_shot_count');
    this._$('daily-val').textContent = daily ? String(daily.state).padStart(3, '0') + ' current' : '---';
  }

  _updateSettings(statusVal, isAvail, isOn, isEco, sched, hasAlarm, hasWarn) {
    const conn2 = this._$('settings-conn');
    conn2.textContent = isAvail ? 'Wi-Fi network status - Connected' : 'Wi-Fi network status - Disconnected';
    conn2.className = 'connectivity ' + (isAvail ? 'connected' : 'disconnected');
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
    this._$('alarm-text').textContent = hasAlarm ? alarms.state : 'No active alarm';
    this._$('warning-text').textContent = hasWarn ? warns.state : 'No active warning';
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

    /* sub-view back buttons → settings */
    ['back-prog','back-cnt','back-alarms','back-us'].forEach(id =>
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
    <div class="connectivity connected" id="connectivity">Connected</div>
    <div class="gauges">
      <div class="gauge" id="gauge-steam">
        <div class="g-icon"><ha-icon icon="mdi:gauge"></ha-icon></div>
        <div class="g-label">Steam</div>
        <div class="g-value" id="steam-val">--</div>
        <div class="g-unit">bar</div>
        <div class="g-setpoint" id="steam-set"></div>
      </div>
      <div class="gauge" id="gauge-tank">
        <div class="g-icon"><ha-icon icon="mdi:water"></ha-icon></div>
        <div class="g-label">Tank</div>
        <div class="tank-bars" id="tank-bars"></div>
        <div class="g-status good" id="tank-status">OK</div>
      </div>
      <div class="gauge" id="gauge-temp">
        <div class="g-icon"><ha-icon icon="mdi:coffee"></ha-icon></div>
        <div class="g-label">Infusion</div>
        <div class="g-value" id="temp-val">--</div>
        <div class="g-unit">°C</div>
        <div class="g-setpoint" id="temp-set"></div>
      </div>
    </div>
    <div class="info-row">
      <div class="info-cell" id="cell-ext">
        <div class="ic-icon"><ha-icon icon="mdi:timer-outline"></ha-icon></div>
        <div><div class="ic-label">Extraction</div><div class="ic-value" id="ext-val">-- sec</div></div>
      </div>
      <div class="info-cell" id="cell-daily">
        <div class="ic-icon"><ha-icon icon="mdi:coffee"></ha-icon></div>
        <div><div class="ic-label">Daily</div><div class="ic-value" id="daily-val">---</div></div>
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
    <div class="connectivity connected" id="settings-conn">Wi-Fi network status - Connected</div>
    <div class="settings-grid">
      <div class="settings-tile" id="nav-programming">
        <ha-icon icon="mdi:calendar-clock"></ha-icon>
        <span class="tile-label">Programming</span>
      </div>
      <div class="settings-tile" id="nav-counters">
        <ha-icon icon="mdi:clipboard-text-outline"></ha-icon>
        <span class="tile-label">Counters</span>
      </div>
      <div class="settings-tile" id="nav-alarms">
        <ha-icon icon="mdi:alert-outline"></ha-icon>
        <span class="tile-label">Alarms</span>
      </div>
      <div class="settings-tile" id="nav-user-settings">
        <ha-icon icon="mdi:account-outline"></ha-icon>
        <span class="tile-label">User Settings</span>
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
    <div class="section-title">Programming</div>
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
    <div class="nav-row" id="slot-row-1"><span class="nr-label">Time slot 1</span><span class="nr-chev">›</span></div>
    <div class="nav-row" id="slot-row-2"><span class="nr-label">Time slot 2</span><span class="nr-chev">›</span></div>
    <div class="nav-row" id="slot-row-3"><span class="nr-label">Time slot 3</span><span class="nr-chev">›</span></div>
    <div class="nav-row" id="slot-row-4"><span class="nr-label">Time slot 4</span><span class="nr-chev">›</span></div>
    <div class="nav-row" id="slot-row-5"><span class="nr-label">Time slot 5</span><span class="nr-chev">›</span></div>
    <div class="nav-row" id="slot-row-6"><span class="nr-label">Time slot 6</span><span class="nr-chev">›</span></div>
  </div>

  <!-- ═══ COUNTERS ═══ -->
  <div id="view-counters" style="display:none">
    <div class="sub-hdr">
      <div class="back" id="back-cnt"><ha-icon icon="mdi:chevron-left"></ha-icon></div>
      <div class="logo">YOU</div>
      <div class="gear"><ha-icon icon="mdi:cog"></ha-icon></div>
    </div>
    <div class="section-title">Coffee counters</div>
    <div class="counter-row"><span class="cr-label">Dose 1</span><span class="cr-value" id="cnt-dose1">--</span></div>
    <div class="counter-row"><span class="cr-label">Dose 2</span><span class="cr-value" id="cnt-dose2">--</span></div>
    <div class="counter-row"><span class="cr-label">Dose 3</span><span class="cr-value" id="cnt-dose3">--</span></div>
    <div class="counter-row"><span class="cr-label">Continuous</span><span class="cr-value" id="cnt-cont">--</span></div>
    <div class="counter-row"><span class="cr-label">Paddle</span><span class="cr-value" id="cnt-paddle">--</span></div>
    <div class="counter-row"><span class="cr-label">Steam Activation</span><span class="cr-value" id="cnt-steam">--</span></div>
    <div class="counter-row"><span class="cr-label">Tea</span><span class="cr-value" id="cnt-tea">--</span></div>
  </div>

  <!-- ═══ ALARMS ═══ -->
  <div id="view-alarms" style="display:none">
    <div class="sub-hdr">
      <div class="back" id="back-alarms"><ha-icon icon="mdi:chevron-left"></ha-icon></div>
      <div class="logo">YOU</div>
      <div class="gear"><ha-icon icon="mdi:cog"></ha-icon></div>
    </div>
    <div class="section-title">Active alarms</div>
    <div class="alarm-panel">
      <div class="alarm-badge" id="alarm-icon"><ha-icon icon="mdi:alert-outline"></ha-icon></div>
      <div class="alarm-lines">
        <div class="alarm-line" id="alarm-text">No active alarm</div>
        <div class="alarm-divider"></div>
        <div class="alarm-line" id="warning-text">No active warning</div>
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
    <div class="section-title">User settings</div>
    <div class="nav-row" id="us-row-coffee">
      <span class="nr-label">Coffee boiler temperature</span>
      <div class="nr-right"><span class="nr-value" id="us-coffee-val">--</span><span class="nr-chev">›</span></div>
    </div>
    <div class="nav-row" id="us-row-group">
      <span class="nr-label">Group temperature</span>
      <div class="nr-right"><span class="nr-value" id="us-group-val">--</span><span class="nr-chev">›</span></div>
    </div>
    <div class="nav-row" id="us-row-steam">
      <span class="nr-label">Service boiler pressure</span>
      <div class="nr-right"><span class="nr-value" id="us-steam-val">--</span><span class="nr-chev">›</span></div>
    </div>
    <div class="nav-row" id="us-row-clock">
      <span class="nr-label">Clock settings</span>
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
    <div class="section-title">Coffee boiler settings</div>
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
    <div class="section-title">Coffee filter holder settings</div>
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
    <div class="section-title">Steam boiler settings</div>
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
    <div class="section-title">Clock</div>
    <div class="clock-panel">
      <div class="clock-time" id="clock-time">--:--</div>
      <div class="clock-date" id="clock-date">--/--/----</div>
      <button class="sync-btn" id="btn-sync-clock">Sync Clock</button>
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
