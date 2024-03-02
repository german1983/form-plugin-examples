import { i, _ as _decorate, s, e, x, b as _get, c as _getPrototypeOf, a as e$1 } from './query-assigned-elements-b2b5ede8.js';
import { i as i$1 } from './query-970c10e5.js';

const baseStyle = i`
  :host {
    height: 100%;
    width: 100%;
    display: block;
  }
`;
const styles = [baseStyle];

let NetKelGoogleMapsOverlay = _decorate([e$1('netkel-google-maps-overlay')], function (_initialize, _LitElement) {
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
      decorators: [e({
        type: String
      })],
      key: "apiKey",
      value() {
        return '';
      }
    }, {
      kind: "field",
      decorators: [e({
        type: String
      })],
      key: "overlayImageSourceUrl",
      value() {
        return '';
      }
    }, {
      kind: "field",
      decorators: [e({
        type: String
      })],
      key: "pinCoordinates",
      value() {
        return '';
      }
    }, {
      kind: "field",
      decorators: [e({
        type: String
      })],
      key: "pinName",
      value() {
        return '';
      }
    }, {
      kind: "field",
      key: "map",
      value() {
        return null;
      }
    }, {
      kind: "field",
      key: "marker",
      value() {
        return null;
      }
    }, {
      kind: "field",
      key: "imageBounds",
      value() {
        return null;
      }
    }, {
      kind: "field",
      decorators: [i$1('#map')],
      key: "mapElement",
      value: void 0
    }, {
      kind: "field",
      key: "mapInitialized",
      value() {
        return false;
      }
    }, {
      kind: "field",
      key: "infoWindow",
      value() {
        return null;
      }
    }, {
      kind: "method",
      static: true,
      key: "getMetaConfig",
      value: function getMetaConfig() {
        return import('./netkel-google-maps-overlay.config-099276da.js').then(({
          config
        }) => {
          return config;
        });
      }
    }, {
      kind: "method",
      key: "render",
      value: function render() {
        // this.initMap();

        return x` <div id="map-container">
        <div id="map"></div>
        <div id="map-init">
          <span>This is the apiKey configured:<strong>${this.apiKey}</strong></span>
          <ul>
            <li>Overlay Image Source URL: <strong>${this.overlayImageSourceUrl}</strong></li>
            <li>Pin Coordinates: <strong>${this.pinCoordinates}</strong></li>
            <li>Pin Name: <strong>${this.pinName}</strong></li>
          </ul>
          </div>
        </div>`;
      }
    }, {
      kind: "method",
      key: "firstUpdated",
      value: function firstUpdated() {
        // // Load the Google Maps API
        // const script = document.createElement('script');
        // script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=initMap`;
      }
    }, {
      kind: "method",
      key: "connectedCallback",
      value: function connectedCallback() {
        _get(_getPrototypeOf(NetKelGoogleMapsOverlay.prototype), "connectedCallback", this).call(this);

        // Load the Google Maps API script only if it hasn't been loaded
        if (!this.mapInitialized) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=googleMapsCallback`;
          script.defer = true;
          script.async = true;
          document.head.appendChild(script);

          // Set the flag to true to prevent reloading the script
          this.mapInitialized = true;
        }
      }
    }, {
      kind: "method",
      key: "initMap",
      value: function initMap() {
        if (this.mapInitialized) {
          var image = new Image();
          image.onload = () => {
            var _this$shadowRoot;
            var anchoImg = image.width;
            var largoImg = image.height;

            // limites de la img
            this.imageBounds = {
              north: largoImg / 2,
              south: -largoImg / 2,
              east: anchoImg / 2,
              west: -anchoImg / 2
            };
            const mapElement = (_this$shadowRoot = this.shadowRoot) === null || _this$shadowRoot === void 0 ? void 0 : _this$shadowRoot.getElementById('map');
            // ajustar mapa en html al tamaño de la imagen
            mapElement.style.width = anchoImg + 'px';
            mapElement.style.height = largoImg + 'px';

            //  mapa
            this.map = new google.maps.Map(mapElement, {
              center: {
                lat: 0,
                lng: 0
              },
              zoom: 2,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              draggable: false,
              zoomControl: false,
              gestureHandling: 'none'
            });

            // cargar la imagen como un overlay
            var overlay = new google.maps.GroundOverlay(this.overlayImageSourceUrl, this.imageBounds);
            overlay.setMap(this.map);

            // pin
            this.marker = new google.maps.Marker({
              position: {
                lat: 0,
                lng: 0
              },
              map: this.map,
              draggable: true
            });

            // evento de arrastre de pin
            this.marker.addListener('dragend', event => {
              var newPosition = this.getPosition();
              var newLat = newPosition.lat();
              var newLng = newPosition.lng();

              // Obtener los límites del mapa
              var mapBounds = this.map.getBounds();
              var maxLat = mapBounds.getNorthEast().lat();
              var maxLng = mapBounds.getNorthEast().lng();
              var minLat = mapBounds.getSouthWest().lat();
              var minLng = mapBounds.getSouthWest().lng();

              // verificar si la  posición está dentro de los límites del mapa
              if (newLat > maxLat || newLat < minLat || newLng > maxLng || newLng < minLng) {
                this.setPosition(this.initialPosition);
              } else {
                this.initialPosition = newPosition;
                var coordenadas = {
                  latitud: newLat,
                  longitud: newLng
                };
                var coordenadasJSON = JSON.stringify(coordenadas);
                this.setPosition(coordenadasJSON);
              }

              // var centerLat = (this.imageBounds.north + this.imageBounds.south) / 2;
              // var centerLng = (this.imageBounds.east + this.imageBounds.west) / 2;

              // // calcular la distancia desde el centro hasta el borde en ambas direcciones
              // var distX = Math.abs(this.imageBounds.east - centerLng) + Math.abs(centerLng - this.imageBounds.west);
              // console.log(distX)
              // var distY = Math.abs(this.imageBounds.north - centerLat) + Math.abs(centerLat - this.imageBounds.south);

              // var projection = this.map.getProjection();
              // var pinPixel = projection.fromLatLngToPoint(event.latLng);
              // var centerPixel = projection.fromLatLngToPoint(new google.maps.LatLng(centerLat, centerLng));
              // var distPinX = pinPixel.x - centerPixel.x;
              // var distPinY = -(pinPixel.y - centerPixel.y);

              // // calcular las coordenadas normalizadas en el rango de -100 a 100
              // var coordX = (100 * distPinX) / distX;
              // var coordY = (100 * distPinY) / distY;

              // console.log("Coordenadas normalizadas:");
              // console.log("X:", coordX);
              // console.log("Y:", coordY);
            });

            //  clic al marcador para mostrar InfoWindow
            this.marker.addListener('click', () => {
              var latlng = this.marker.getPosition();
              var contentString = '<div><strong>Latitud:</strong> ' + latlng.lat().toFixed(6) + '<br>' + '<strong>Longitud:</strong> ' + latlng.lng().toFixed(6) + '</div>';
              if (this.infoWindow && this.infoWindow.getMap()) {
                this.infoWindow.close();
                if (this.infoWindow.getPosition().equals(this.marker.getPosition())) {
                  return;
                }
              }
              this.infoWindow = new google.maps.InfoWindow({
                content: contentString,
                anchor: new google.maps.Point(0, -40)
              });
              this.infoWindow.open(this.map, this.marker);
            });
          };
          image.src = this.overlayImageSourceUrl;
        }
      }
    }, {
      kind: "method",
      key: "setPosition",
      value: function setPosition(coordenadasJSON) {
        var coordenadasObjeto = JSON.parse(coordenadasJSON);
        var latitud = coordenadasObjeto.latitud;
        var longitud = coordenadasObjeto.longitud;
        var nuevaPosicion = new google.maps.LatLng(latitud, longitud);
        this.marker.setPosition(nuevaPosicion);
      }
    }]
  };
}, s);

// Define the callback function globally
window.googleMapsCallback = () => {
  const component = document.querySelector('netkel-google-maps-overlay');
  if (component) {
    component.initMap();
  }
};

export { NetKelGoogleMapsOverlay };
