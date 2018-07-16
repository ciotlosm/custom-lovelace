import thermostatDial from '/local/custom-lovelace/thermostat-card/thermostat_lib.js?module';

class ThermostatCard extends HTMLElement  {
  static get properties() {
    return {
      _hass: Object,
      config: Object,
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('Please define an entity');
    }

    const root = this.shadowRoot;
    if (root.lastChild) root.removeChild(root.lastChild);

    const cardConfig = Object.assign({}, config);

    const card = document.createElement('ha-card');
    const shadow = card.attachShadow({ mode: 'open' });
    const content = document.createElement('div');
    const style = document.createElement('style');
    style.textContent = `
    @import url(https://fonts.googleapis.com/css?family=Open+Sans:300);
    body {
      background-color: #CCCCCC;
    }
    #thermostat {
      width: 50vmin;
      height: 50vmin;
      margin: 0 auto;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .dial {
      -webkit-user-select: none;
        -moz-user-select: none;
          -ms-user-select: none;
              user-select: none;
    }
    .dial.away .dial__ico__leaf {
      visibility: hidden;
    }
    .dial.away .dial__lbl--target {
      visibility: hidden;
    }
    .dial.away .dial__lbl--target--half {
      visibility: hidden;
    }
    .dial.away .dial__lbl--away {
      opacity: 1;
    }
    .dial .dial__shape {
      transition: fill 0.5s;
    }
    .dial__ico__leaf {
      fill: #13EB13;
      opacity: 0;
      transition: opacity 0.5s;
      pointer-events: none;
    }
    .dial.has-leaf .dial__ico__leaf {
      display: block;
      opacity: 1;
      pointer-events: initial;
    }
    .dial__editableIndicator {
      fill: white;
      fill-rule: evenodd;
      opacity: 0;
      transition: opacity 0.5s;
    }
    .dial--edit .dial__editableIndicator {
      opacity: 1;
    }
    .dial--state--off .dial__shape {
      fill: #222;
    }
    .dial--state--heating .dial__shape {
      fill: #E36304;
    }
    .dial--state--cooling .dial__shape {
      fill: #007AF1;
    }
    .dial__ticks path {
      fill: rgba(255, 255, 255, 0.3);
    }
    .dial__ticks path.active {
      fill: rgba(255, 255, 255, 0.8);
    }
    .dial text {
      fill: white;
      text-anchor: middle;
      font-family: Helvetica, sans-serif;
      alignment-baseline: central;
    }
    .dial__lbl--target {
      font-size: 120px;
      font-weight: bold;
    }
    .dial__lbl--target--half {
      font-size: 40px;
      font-weight: bold;
      opacity: 0;
      transition: opacity 0.1s;
    }
    .dial__lbl--target--half.shown {
      opacity: 1;
      transition: opacity 0s;
    }
    .dial__lbl--ambient {
      font-size: 22px;
      font-weight: bold;
    }
    .dial__lbl--away {
      font-size: 72px;
      font-weight: bold;
      opacity: 0;
      pointer-events: none;
    }
    #controls {
      font-family: Open Sans;
      background-color: rgba(255, 255, 255, 0.25);
      padding: 20px;
      border-radius: 5px;
      position: absolute;
      left: 50%;
      -webkit-transform: translatex(-50%);
              transform: translatex(-50%);
      margin-top: 20px;
    }
    #controls label {
      text-align: left;
      display: block;
    }
    #controls label span {
      display: inline-block;
      width: 200px;
      text-align: right;
      font-size: 0.8em;
      text-transform: uppercase;
    }
    #controls p {
      margin: 0;
      margin-bottom: 1em;
      padding-bottom: 1em;
      border-bottom: 2px solid #ccc;
    }
    `

    console.log(cardConfig)

    this.thermo = new thermostatDial(content, {
      minValue: cardConfig.min || 60,
      maxValue: cardConfig.max || 80,
      onSetTargetTemperature: this._toggle.bind(this)
    })

    card.appendChild(content);
    card.appendChild(style);

    root.appendChild(card);
    this.config = cardConfig;
  }

  _toggle(temp) {
    // service=set_temperature, domain=climate, service_call_id=1976571824-28797, service_data=target_temp_low=71, target_temp_high=75, entity_id=climate.ecobee>
    this._hass.callService('climate', 'set_temperature', {
      entity_id: this.config.entity,
      target_temp_low: temp,
      target_temp_high: temp,
    });
  }

  set hass(hass) {
    const config = this.config;
    const entity = hass.states[config.entity]
    const entityState = entity.state;
    // const measurement = hass.states[config.entity].attributes.unit_of_measurement;
    this.thermo.ambient_temperature = entity.attributes.current_temperature
    this.thermo.target_temperature = entity.attributes.target_temp_low
    this.thermo.hvac_state = s(entityState)

    this._hass = hass
  }

  getCardSize() {
    return 1;
  }
}

function s(state) {
  return {
    heat: 'heating',
    cool: 'cooling',
    off: 'off',
    auto: null
  }[state]
}

customElements.define('thermostat-card', ThermostatCard);

