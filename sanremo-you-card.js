class SanremoYouCard extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._config = null;
    this._prefix = 'sanremo_you';
    this._initialized = false;
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

  _s(suffix) {
    return this._hass?.states[`sensor.${this._prefix}_${suffix}`];
  }
  _sw(suffix) {
    return this._hass?.states[`switch.${this._prefix}_${suffix}`];
  }
  _n(suffix) {
    return this._hass?.states[`number.${this._prefix}_${suffix}`];
  }
  _b(suffix) {
    return this._hass?.states[`binary_sensor.${this._prefix}_${suffix}`];
  }
  _$(id) { return this._root.getElementById(id); }

  _update() {
    const status = this._s('machine_status');
    const statusVal = status?.state ?? 'unavailable';
    const isAvail = statusVal !== 'unavailable' && statusVal !== 'unknown';

    // Machine name from device
    const nameEl = this._$('machine-name');
    if (!this._config?.name && nameEl) {
      nameEl.textContent = status?.attributes?.friendly_name?.replace(' Machine Status', '') || 'SANREMO-YOU';
    }

    // Connectivity banner
    const conn = this._$('connectivity');
    if (isAvail) {
      conn.textContent = statusVal;
      conn.className = 'connectivity connected';
    } else {
      conn.textContent = 'Disconnected';
      conn.className = 'connectivity disconnected';
    }

    // Power
    const power = this._sw('power');
    const isOn = power?.state === 'on';
    this._$('power-toggle').className = 'toggle-track' + (isOn ? ' on' : '');
    this._$('ib-power').className = 'ib-icon' + (isOn ? ' active' : '');
    this._$('lbl-off').className = 'power-label' + (isOn ? '' : ' active');
    this._$('lbl-on').className = 'power-label' + (isOn ? ' active' : '');

    // Eco icon — active when status is "Eco Mode"
    const isEco = statusVal === 'Eco Mode';
    this._$('ib-eco').className = 'ib-icon' + (isEco ? ' active' : '');

    // Scheduler icon
    const sched = this._sw('scheduler');
    this._$('ib-sched').className = 'ib-icon' + (sched?.state === 'on' ? ' active' : '');

    // Warnings / Alarms
    const warns = this._s('warnings');
    const alarms = this._s('alarms');
    const hasAlarm = alarms && alarms.state !== 'None' && alarms.state !== 'unknown' && alarms.state !== 'unavailable';
    const hasWarn = warns && warns.state !== 'None' && warns.state !== 'unknown' && warns.state !== 'unavailable';
    const warnIcon = this._$('ib-warn');
    warnIcon.className = 'ib-icon' + (hasAlarm ? ' alarm' : hasWarn ? ' warning' : '');

    // Steam gauge
    const steam = this._s('steam_boiler_pressure');
    const steamSet = this._n('steam_pressure_setpoint');
    this._$('steam-val').textContent = steam ? parseFloat(steam.state).toFixed(2) : '--';
    this._$('steam-set').textContent = steamSet ? `/ ${parseFloat(steamSet.state).toFixed(1)} set` : '';

    // Infusion gauge (group temperature)
    const temp = this._s('group_temperature');
    const tempSet = this._n('group_temperature_setpoint');
    this._$('temp-val').textContent = temp ? parseFloat(temp.state).toFixed(1) : '--';
    this._$('temp-set').textContent = tempSet ? `/ ${parseFloat(tempSet.state).toFixed(1)} set` : '';

    // Tank level
    const tank = this._b('water_tank');
    const tankLow = tank?.state === 'on'; // device_class: problem → on = problem
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

    // Extraction time
    const ext = this._s('extraction_time');
    this._$('ext-val').textContent = ext ? parseFloat(ext.state).toFixed(1) + ' sec' : '-- sec';

    // Daily shots
    const daily = this._s('daily_shot_count');
    this._$('daily-val').textContent = daily ? String(daily.state).padStart(3, '0') + ' current' : '---';
  }

  _fire(entityId) {
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      bubbles: true, composed: true,
      detail: { entityId }
    }));
  }

  _attachListeners() {
    const p = this._prefix;
    this._$('power-toggle').addEventListener('click', () => {
      this._hass?.callService('switch', 'toggle', {
        entity_id: `switch.${p}_power`
      });
    });
    this._$('gauge-steam').addEventListener('click', () =>
      this._fire(`number.${p}_steam_pressure_setpoint`));
    this._$('gauge-temp').addEventListener('click', () =>
      this._fire(`number.${p}_group_temperature_setpoint`));
    this._$('gauge-tank').addEventListener('click', () =>
      this._fire(`binary_sensor.${p}_water_tank`));
    this._$('cell-ext').addEventListener('click', () =>
      this._fire(`sensor.${p}_extraction_time`));
    this._$('cell-daily').addEventListener('click', () =>
      this._fire(`sensor.${p}_daily_shot_count`));
    this._$('ib-eco').addEventListener('click', () =>
      this._fire(`sensor.${p}_machine_status`));
    this._$('ib-power').addEventListener('click', () =>
      this._fire(`switch.${p}_power`));
    this._$('ib-sched').addEventListener('click', () =>
      this._fire(`switch.${p}_scheduler`));
    this._$('ib-warn').addEventListener('click', () =>
      this._fire(`sensor.${p}_warnings`));
    this._root.querySelector('.gear').addEventListener('click', () =>
      this._fire(`sensor.${p}_machine_status`));
  }

  _buildDOM() {
    this._root.innerHTML = `
<style>
:host{display:block;--bg:#1e1e1e;--sf:#2a2a2a;--sf2:#363636;--t1:#e0e0e0;--t2:#888;--grn:#4caf50;--org:#ff9800;--red:#f44336;--blu:#42a5f5;--r:12px;font-family:'Segoe UI',Roboto,sans-serif}
.card{background:var(--bg);border-radius:var(--r);overflow:hidden;color:var(--t1);padding:0}
.hdr{display:flex;align-items:center;justify-content:space-between;padding:16px 16px 8px}
.hdr .logo{font-size:26px;font-weight:800;letter-spacing:4px;color:var(--t1)}
.hdr .mname{font-size:13px;color:var(--t2);margin-top:2px;letter-spacing:1px}
.gear{cursor:pointer;color:var(--t2);transition:color .2s;padding:8px}
.gear:hover{color:var(--t1)}
.icon-bar{display:flex;justify-content:space-around;padding:10px 20px;background:var(--sf);margin:0 12px;border-radius:8px}
.ib-icon{width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:50%;cursor:pointer;transition:all .2s;color:var(--t2)}
.ib-icon:hover{background:var(--sf2)}
.ib-icon.active{color:var(--grn)}
.ib-icon.warning{color:var(--org)}
.ib-icon.alarm{color:var(--red)}
.connectivity{margin:10px 12px;padding:7px 14px;border-radius:8px;font-size:12px;text-align:center;font-weight:600;letter-spacing:.5px;text-transform:uppercase}
.connectivity.connected{background:rgba(76,175,80,.12);color:var(--grn);border:1px solid rgba(76,175,80,.25)}
.connectivity.disconnected{background:rgba(244,67,54,.12);color:var(--red);border:1px solid rgba(244,67,54,.25)}
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
.info-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:6px 12px}
.info-cell{background:var(--sf);border-radius:10px;padding:14px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:background .2s}
.info-cell:hover{background:var(--sf2)}
.ic-icon ha-icon{--mdc-icon-size:28px;color:var(--t2)}
.ic-label{font-size:10px;color:var(--t2);text-transform:uppercase;letter-spacing:1px;font-weight:600;margin-bottom:2px}
.ic-value{font-size:20px;font-weight:700}
.power-row{display:flex;align-items:center;justify-content:center;gap:20px;padding:14px 16px 18px}
.power-label{font-size:14px;font-weight:700;letter-spacing:2px;color:var(--t2);transition:color .3s}
.power-label.active{color:var(--t1)}
.toggle-track{width:56px;height:30px;border-radius:15px;background:var(--sf2);position:relative;cursor:pointer;transition:all .3s;border:2px solid #555}
.toggle-track.on{background:rgba(76,175,80,.25);border-color:var(--grn)}
.toggle-thumb{width:24px;height:24px;border-radius:50%;background:#777;position:absolute;top:3px;left:3px;transition:all .3s;display:flex;align-items:center;justify-content:center}
.toggle-track.on .toggle-thumb{left:27px;background:var(--grn)}
.toggle-thumb ha-icon{--mdc-icon-size:14px;color:var(--bg)}
@media(max-width:400px){.gauges{gap:4px}.gauge .g-value{font-size:20px}.gauge{padding:10px 4px 8px}.ic-value{font-size:16px}}
</style>
<div class="card">
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
      <div>
        <div class="ic-label">Extraction</div>
        <div class="ic-value" id="ext-val">-- sec</div>
      </div>
    </div>
    <div class="info-cell" id="cell-daily">
      <div class="ic-icon"><ha-icon icon="mdi:coffee"></ha-icon></div>
      <div>
        <div class="ic-label">Daily</div>
        <div class="ic-value" id="daily-val">---</div>
      </div>
    </div>
  </div>
  <div class="power-row">
    <span class="power-label" id="lbl-off">OFF</span>
    <div class="toggle-track" id="power-toggle">
      <div class="toggle-thumb"><ha-icon icon="mdi:power"></ha-icon></div>
    </div>
    <span class="power-label" id="lbl-on">ON</span>
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
