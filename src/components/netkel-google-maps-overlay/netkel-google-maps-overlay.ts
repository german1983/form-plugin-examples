import { LitElement, html } from "lit";
import { customElement, property, query } from 'lit/decorators.js';
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

  map: any = null;

  marker: any = null;

  imageBounds: any = null;

  @query('#map')
  mapElement!: HTMLElement;

  mapInitialized = false;
  infoWindow: google.maps.InfoWindow | null = null;

  static getMetaConfig() {
      return import('./netkel-google-maps-overlay.config')
        .then(({ config }) => {
          return config;
      });
  }

  render() {
    // this.initMap();

    return html` <div id="map-container">
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

  firstUpdated() {
      // // Load the Google Maps API
      // const script = document.createElement('script');
      // script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=initMap`;
  }
  
  connectedCallback() {
    super.connectedCallback();

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
  
  initMap() {
    if (this.mapInitialized) {
      var image = new Image();
      image.onload = () => {
          var anchoImg = image.width;
          var largoImg = image.height;

          // limites de la img
          this.imageBounds = {
              north: largoImg / 2,
              south: -largoImg / 2,
              east: anchoImg / 2,
              west: -anchoImg / 2
          };

          const mapElement = (this.shadowRoot?.getElementById('map') as HTMLElement);
          // ajustar mapa en html al tamaño de la imagen
          mapElement!.style.width = anchoImg + 'px';
          mapElement!.style.height = largoImg + 'px';

          //  mapa
          this.map = new google.maps.Map(mapElement, {
            center: {lat: 0, lng: 0},
            zoom: 0,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            draggable: false,
            gestureHandling: 'none',
            keyboardShortcuts: false,
            zoomControl: false,
            restriction: {
                latLngBounds: bounds,
              }
          });

          // cargar la imagen como un overlay
          var overlay = new google.maps.GroundOverlay(
            this.overlayImageSourceUrl,
            this.imageBounds
          );
          overlay.setMap(this.map);

          // pin
          this.marker = new google.maps.Marker({
              position: {lat: 0, lng: 0},
              map: this.map,
              draggable: true,
              restriction: {
                latLngBounds: bounds,
                strictBounds: true
              },
          });

          marker.addListener('dragstart', () => {
            // Cerrar el InfoWindow si está abierto
            if (infoWindow && infoWindow.getMap()) {
                infoWindow.close();
            }
          });
        

          // evento de arrastre de pin
          this.marker.addListener('dragend', (event: { latLng: any; }) => {
            var newPosition = this.getPosition();
            var newLat = newPosition.lat();
            var newLng = newPosition.lng();
        
            // obtener los límites del mapa
            var mapBounds = map.getBounds();
            var maxLat = mapBounds.getNorthEast().lat(); // Latitud máxima
            var maxLng = mapBounds.getNorthEast().lng(); // Longitud máxima
            var minLat = mapBounds.getSouthWest().lat(); // Latitud mínima
            var minLng = mapBounds.getSouthWest().lng(); // Longitud mínima
      
              // Verificar si la nueva posición está dentro de los límites de la imagen
            if (newLat > bounds.north || newLat < bounds.south || 
                newLng > bounds.east || newLng < bounds.west) {
                // Si la nueva posición está fuera de los límites, restablecer la posición a la inicial
                this.setPosition(this.initialPosition);
            } else {
                // guardar posicion 
                this.initialPosition = newPosition;

                // Convertir las coordenadas a JSON y actualizar la posición
                var coordenadas = {
                    latitud: newLat,
                    longitud: newLng
        };
                var coordenadasJSON = JSON.stringify(coordenadas);
                
                console.log(coordenadasJSON);
                setPosition(coordenadasJSON);
            }
          });

          google.maps.event.addListener(map, 'bounds_changed', () => {
            const overlayBounds = overlay.getBounds();
            const mapBounds = map.getBounds();
            if (!overlayBounds || !mapBounds) return;
        
            const maxLat = overlayBounds.getNorthEast().lat();
            const minLat = overlayBounds.getSouthWest().lat();
            const maxLng = overlayBounds.getNorthEast().lng();
            const minLng = overlayBounds.getSouthWest().lng();
        
            const pinPosition = marker.getPosition();
            const pinLat = pinPosition.lat();
            const pinLng = pinPosition.lng();
        
            if (pinLat > maxLat || pinLat < minLat || pinLng > maxLng || pinLng < minLng) {
                marker.setPosition(marker.initialPosition);
            }
        });
          

          //  clic al marcador para mostrar InfoWindow
          this.marker.addListener('click', () => {
            var latlng = this.marker.getPosition();
            var contentString = '<div><strong>Latitud:</strong> ' + latlng.lat().toFixed(6) + '<br>' +
                                '<strong>Longitud:</strong> ' + latlng.lng().toFixed(6) + '</div>'+
                                '<div><strong>Título:</strong> ' + titulo + '<br>' +         
                                '<strong>Descripción:</strong> ' + descripcion + '</div>';

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

  setPosition(coordenadasJSON: string) {
    var coordenadasObjeto = JSON.parse(coordenadasJSON);
    var latitud: number = coordenadasObjeto.latitud;
    var longitud: number = coordenadasObjeto.longitud;
    var nuevaPosicion: google.maps.LatLng = new google.maps.LatLng(latitud, longitud);

    // Crear el evento con todas las propiedades
    var evento = {
        latitud: latitud,
        longitud: longitud,
        titulo: titulo,
        descripcion: descripcion
    };

    // Serializar el evento a JSON
    const eventoJSON: string = JSON.stringify(evento);

    this.marker.setPosition(nuevaPosicion);
  }

}

// Define the callback function globally
(window as any).googleMapsCallback = () => {
  const component = document.querySelector('netkel-google-maps-overlay') as NetKelGoogleMapsOverlay;
  if (component) {
    component.initMap();
  }
};
