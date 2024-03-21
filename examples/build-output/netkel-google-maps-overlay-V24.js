import { i, _ as _decorate, s, e, x, b as _get, c as _getPrototypeOf, a as e$1 } from './query-assigned-elements-b2b5ede8.js';
import { i as i$1 } from './query-970c10e5.js';

const baseStyle = i`
  #map {
      height: auto;
      width: 840px;
      margin: 0px;
  }

  #info-box {
    background-color: #CDC9C8;
    width: 810px;
      background-color: white;
      border-radius: 0px 0px 10px 10px;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.4);
    font-family: 'Open Sans';
    padding: 10px;
    padding-left: 20px;
  }

  .gm-style-iw-tc {
      display: none !important;
  }
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
      key: "title",
      value() {
        return '';
      }
    }, {
      kind: "field",
      decorators: [e({
        type: String
      })],
      key: "description",
      value() {
        return '';
      }
    }, {
      kind: "field",
      decorators: [e({
        type: Number
      })],
      key: "latitude",
      value() {
        return 0.0;
      }
    }, {
      kind: "field",
      decorators: [e({
        type: Number
      })],
      key: "longitude",
      value() {
        return 0.0;
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
        return import('./netkel-google-maps-overlay.config-cf64b51b.js').then(({
          config
        }) => {
          return config;
        });
      }
    }, {
      kind: "method",
      key: "render",
      value: function render() {
        if (this.apiKey === '' || this.overlayImageSourceUrl === '') {
          return x`<div>Google Maps API Key and Overlay Image Source URL are required</div>`;
        }
        return x`
    <div id="map-container">
        <div id="map"></div>
    </div>`;
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
            var _this$shadowRoot, _this$shadowRoot2;
            defAnchoImg = image.width
            defAltoImg = image.height
            var resolucion = (defAltoImg/defAnchoImg)
            var anchoImg = window.innerWidth    //se adapta al ancho de la ventana
            if (anchoImg > image.width){
                anchoImg = image.width
            }      
            var anchoImg = window.innerWidth    //se adapta al ancho de la ventana       
            var proporcion = anchoImg / image.width;
            var newlargo = Math.min(image.height * proporcion, window.innerHeight);
            anchoImg = (newlargo / resolucion)         
            var largoImg = newlargo;
            var centerImg = 0;

            // Calcular las extensiones de latitud y longitud para la imagen
            const latExt = largoImg * 0.01;
            const lngExt = anchoImg * 0.01;

            // limites de la img
            this.imageBounds = {
              north: {
                lat: centerImg + latExt / 2,
                long: centerImg
              },
              south: {
                lat: centerImg - latExt / 2,
                long: centerImg
              },
              east: {
                lat: centerImg,
                long: centerImg + lngExt / 2
              },
              west: {
                lat: centerImg,
                long: centerImg - lngExt / 2
              }
            };
            const mapContainerElement = (_this$shadowRoot = this.shadowRoot) === null || _this$shadowRoot === void 0 ? void 0 : _this$shadowRoot.getElementById('map-container');
            const mapElement = (_this$shadowRoot2 = this.shadowRoot) === null || _this$shadowRoot2 === void 0 ? void 0 : _this$shadowRoot2.getElementById('map');

            // ajustar mapa en html al tamaño de la imagen
            mapContainerElement.style.width = anchoImg + 'px';
            mapContainerElement.style.height = largoImg + 'px';
            mapElement.style.width = anchoImg + 'px';
            mapElement.style.height = largoImg + 'px';

            // Definir las coordenadas de las esquinas de la imagen
            var bounds = {
              north: this.imageBounds.north.lat,
              south: this.imageBounds.south.lat,
              east: this.imageBounds.east.long,
              west: this.imageBounds.west.long
            };

            //  mapa
            this.map = new google.maps.Map(mapElement, {
              center: {
                lat: 0,
                lng: 0
              },
              zoom: 0,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              draggable: false,
              mapTypeId: 'custom_map',
              gestureHandling: 'none',
              keyboardShortcuts: false,
              zoomControl: false,
              restriction: {
                latLngBounds: bounds
              }
            });
            this.map.mapTypes.set('custom_map', new google.maps.ImageMapType({
              getTileUrl: (coord, zoom) => {
                return ""; // Retornar null para no cargar ninguna imagen de fondo
              },

              tileSize: new google.maps.Size(256, 256),
              name: 'Custom Map',
              maxZoom: 19
            }));
            this.map.setOptions({
              styles: [{
                featureType: 'all',
                elementType: 'labels',
                stylers: [{
                  visibility: 'off'
                }] // Ocultar todas las caracteristicas del mapa 
              }, {
                featureType: 'all',
                stylers: [{
                  visibility: 'off'
                }]
              }, {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [{
                  visibility: 'off'
                }]
              }, {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{
                  visibility: 'off'
                }]
              }, {
                featureType: 'administrative',
                elementType: 'geometry',
                stylers: [{
                  visibility: 'off'
                }]
              }, {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{
                  visibility: 'off'
                }]
              }]
            });

            // Cargar la imagen como un overlay
            var overlay = new google.maps.GroundOverlay(this.overlayImageSourceUrl, bounds);
            overlay.setMap(this.map);

            // pin
            this.marker = new google.maps.Marker({
              position: {
                lat: 0,
                lng: 0
              },
              map: this.map,
              draggable: true,
              restriction: {
                latLngBounds: bounds,
                strictBounds: true
              }
            });
            this.marker.addListener('dragstart', () => {
              // Cerrar el InfoWindow si está abierto
              if (this.infoWindow !== null) {
                this.infoWindow.close();
              }
            });

            // evento de arrastre de pin
            this.marker.addListener('dragend', event => {
              var newPosition = this.marker.getPosition();
              var newLat = newPosition.lat();
              var newLng = newPosition.lng();

              // Verificar si la nueva posición está dentro de los límites de la imagen
              if (newLat > bounds.north || newLat < bounds.south || newLng > bounds.east || newLng < bounds.west) {
                // Si la nueva posición está fuera de los límites, restablecer la posición a la inicial
                this.setPosition(this.latitude, this.longitude);
              } else {
                // guardar posicion 
                this.latitude = newLat;
                this.longitude = newLng;

                // Convertir las coordenadas a JSON y actualizar la posición
                var coordenadas = {
                  latitud: newLat,
                  longitud: newLng
                };
                var coordenadasJSON = JSON.stringify(coordenadas);
                console.log(coordenadasJSON);
                this.setPosition(this.latitude, this.longitude);
              }
            });
            google.maps.event.addListener(this.map, 'bounds_changed', () => {
              var overlayBounds = overlay.getBounds();
              var mapBounds = this.map.getBounds();
              if (!overlayBounds || !mapBounds) return;
              var maxLat = overlayBounds.getNorthEast().lat();
              var minLat = overlayBounds.getSouthWest().lat();
              var maxLng = overlayBounds.getNorthEast().lng();
              var minLng = overlayBounds.getSouthWest().lng();
              var pinPosition = this.marker.getPosition();
              var pinLat = pinPosition.lat();
              var pinLng = pinPosition.lng();
              if (pinLat > maxLat || pinLat < minLat || pinLng > maxLng || pinLng < minLng) {
                this.marker.setPosition(this.marker.initialPosition);
              }
            });

            // evento clic al marcador para mostrar InfoWindow
            marker.addListener('click', function() {
            const latlng = marker.getPosition();
            const contentString = `<div><strong>Latitud:</strong> ${latlng.lat().toFixed(6)}<br>` +
                                  `<strong>Longitud:</strong> ${latlng.lng().toFixed(6)}</div>` + 
                                  `<div><strong>Título:</strong> ${titulo}<br>` +         
                                  `<strong>Descripción:</strong> ${descripcion}</div>`;
        
            if (infoWindow && infoWindow.getMap() && infoWindow.getPosition().equals(marker.getPosition())) {
                return infoWindow.close();
            }
        
            let altura = 0;
            let ancho = 0;
            const pinPosition = marker.getPosition();
            const pinLat = pinPosition.lat();
            const pinLng = pinPosition.lng();
        
            // Obtener el tamaño del mapa
            const mapContainer = document.getElementById('map-container');
            const mapWidth = mapContainer.offsetWidth;
            const mapHeight = mapContainer.offsetHeight;
        
            
            let offsetX = 0;
            let offsetY = 0;
        
            if (pinLat > 1.35) {
                altura = 250;
            }
        
            if (pinLng < -2.75) {
                ancho = 25;
            } else if (pinLng > 2.25) {
                ancho = -25;
            }
        
            // Ajustar la posición del InfoWindow si se sale del mapa
            if (pinLat > 1.35) {
                offsetY = Math.min(mapHeight / 2 - 100, -100);
            } else if (pinLat < -1.35) {
                //offsetY = Math.max(-(mapHeight / 2 - 100), 100);
            }
        
            if (pinLng < -2.75) {
                offsetX = Math.max(-(mapWidth / 2 - 100), 100);
            } else if (pinLng > 2.25) {
                offsetX = Math.min(mapWidth / 2 - 100, -100);
            }
        
            infoWindow = new google.maps.InfoWindow({
                content: contentString,
                pixelOffset: new google.maps.Size(ancho + offsetX, altura + offsetY),
                ariaLabel: "Titulo", 
                ariaLabel: "Descripción",
            });
        
            infoWindow.open(map, marker);
        });
            this.setPosition(this.latitude, this.longitude);
          };
          image.src = this.overlayImageSourceUrl;
        }
      }
    }, {
      kind: "method",
      key: "setPosition",
      value: function setPosition(latitud, longitud) {
        var nuevaPosicion = new google.maps.LatLng(latitud, longitud);
        this.latitude = latitud;
        this.longitude = longitud;

        // Crear el evento con todas las propiedades
        var evento = {
          latitud: latitud,
          longitud: longitud
        };

        // Serializar el evento a JSON
        var eventoJSON = JSON.stringify(evento);
        this.marker.setPosition(nuevaPosicion);
        console.log(eventoJSON);
        const args = {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: eventoJSON
        };
        const event = new CustomEvent('ntx-value-change', args);
        this.dispatchEvent(event);
      }
    }]
  };
}, s);

// Define the callback function globally
window.googleMapsCallback = () => {
  debugger;
  const component = document.querySelector('netkel-google-maps-overlay');
  if (component) {
    component.initMap();
  }
};

export { NetKelGoogleMapsOverlay };
