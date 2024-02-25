import { LitElement, html } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { styles } from './netkel-google-maps-overlay.styles';

@customElement('netkel-google-maps-overlay')
export class NetKelGoogleMapsOverlay extends LitElement {
  static styles = styles;

  @property({ type: String })
  apiKey = '';

  @property({ type: String })
  overlayImageSourceUrl = '';

  @property({ type: String })
  pinCoordinates = '';

  @property({ type: String })
  pinName = '';

  static getMetaConfig() {
      return import('./netkel-google-maps-overlay.config')
        .then(({ config }) => {
          return config;
      });
  }

  render() {
      return html`<div id="map">
        <span>This is the apiKey configured:<strong>@this.apiKey</strong></span>
        <ul>
          <li>Overlay Image Source URL: <strong>@this.overlayImageSourceUrl</strong></li>
          <li>Pin Coordinates: <strong>@this.pinCoordinates</strong></li>
          <li>Pin Name: <strong>@this.pinName</strong></li>
        </ul>
      </div>`;
  }

  firstUpdated() {
      // Load the Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=initMap`;
  }
}
