import { i, _ as _decorate, s, x } from './lit-element-134c12fd.js';
import { customElement, property } from 'lit/decorators';

const baseStyle = i`
  :host {
    height: 100%;
    width: 100%;
    display: block;
  }
`;
const styles = [baseStyle];

let NetKelGoogleMapsOverlay = _decorate([customElement('netkel-google-maps-overlay')], function (_initialize, _LitElement) {
  class NetKelGoogleMapsOverlay extends _LitElement {
    constructor(...args) {
      super(...args);
      _initialize(this);
    }
  }
  return {
    F: NetKelGoogleMapsOverlay,
    d: [{
      kind: "field",
      static: true,
      key: "styles",
      value() {
        return styles;
      }
    }, {
      kind: "field",
      decorators: [property({
        type: String
      })],
      key: "apiKey",
      value() {
        return '';
      }
    }, {
      kind: "field",
      decorators: [property({
        type: String
      })],
      key: "overlayImageSourceUrl",
      value() {
        return '';
      }
    }, {
      kind: "field",
      decorators: [property({
        type: String
      })],
      key: "pinCoordinates",
      value() {
        return '';
      }
    }, {
      kind: "field",
      decorators: [property({
        type: String
      })],
      key: "pinName",
      value() {
        return '';
      }
    }, {
      kind: "method",
      static: true,
      key: "getMetaConfig",
      value: function getMetaConfig() {
        return import('./netkel-google-maps-overlay.config-948515dd.js').then(({
          config
        }) => {
          return config;
        });
      }
    }, {
      kind: "method",
      key: "render",
      value: function render() {
        return x`<div id="map">
        <span>This is the apiKey configured:<strong>@this.apiKey</strong></span>
        <ul>
          <li>Overlay Image Source URL: <strong>@this.overlayImageSourceUrl</strong></li>
          <li>Pin Coordinates: <strong>@this.pinCoordinates</strong></li>
          <li>Pin Name: <strong>@this.pinName</strong></li>
        </ul>
      </div>`;
      }
    }, {
      kind: "method",
      key: "firstUpdated",
      value: function firstUpdated() {
        // Load the Google Maps API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=initMap`;
      }
    }]
  };
}, s);

export { NetKelGoogleMapsOverlay };
