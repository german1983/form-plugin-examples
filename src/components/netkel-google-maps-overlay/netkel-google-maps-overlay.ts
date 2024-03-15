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
  title = '';

  @property({ type: String })
  description = '';

  @property({ type: Number })
  latitude = 0.0;

  @property({ type: Number })
  longitude = 0.0;

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

    return html`
    <div id="map-container">
        <div id="map"></div>
    </div>
    <div id="info-box">
      <p><strong>Title: </strong> ${this.title}</p>
      <p><strong>Description:</strong> ${this.description}</p>
      <p><strong>ApiKey:</strong> ${this.apiKey}</p>
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
        var anchoImg = 840;
        var proporcion = anchoImg / image.width;
        var newlargo = image.height * proporcion;
        var largoImg = newlargo;
        var centerImg = 0;

        // Calcular las extensiones de latitud y longitud para la imagen
        const latExt = largoImg * 0.01;
        const lngExt = anchoImg * 0.01;

        // limites de la img
        this.imageBounds = {
          north:  {
            lat: centerImg + (latExt / 2),
            long: centerImg
          } ,
          south: {
            lat: centerImg - (latExt / 2),
            long: centerImg
          },
          east: {
            lat: centerImg,
            long: centerImg + (lngExt / 2)
          },
          west: {
            lat: centerImg,
            long: centerImg - (lngExt / 2)
          }
        };

        const mapContainerElement = (this.shadowRoot?.getElementById('map-container') as HTMLElement);
        const mapElement = (this.shadowRoot?.getElementById('map') as HTMLElement);
        
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
          
        // Cargar la imagen como un overlay
        var overlay = new google.maps.GroundOverlay(
          this.overlayImageSourceUrl,
          bounds
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
        this.marker.addListener('dragstart', () =>{
            // Cerrar el InfoWindow si está abierto
            if (this.infoWindow !== null) {
              this.infoWindow.close();
            }
        });

        // evento de arrastre de pin
        this.marker.addListener('dragend', (event: any) => {
          var newPosition = this.marker.getPosition();
          var newLat = newPosition.lat();
          var newLng = newPosition.lng();

          // Verificar si la nueva posición está dentro de los límites de la imagen
          if (newLat > bounds.north || newLat < bounds.south || 
              newLng > bounds.east || newLng < bounds.west) {
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
        this.marker.addListener('click', () => {
          const latlng = this.marker.getPosition();
          const contentString = `<div><strong>Latitud:</strong> ${latlng.lat().toFixed(6)}<br>` +
                                `<strong>Longitud:</strong> ${latlng.lng().toFixed(6)}</div>` + 
                                `<div><strong>Título:</strong> ${this.title}<br>` +         
                                `<strong>Descripción:</strong> ${this.description}</div>`;
      
          if (this.infoWindow && this.infoWindow.getPosition().equals(this.marker.getPosition())) {
              return this.infoWindow.close();
          }
      
          let altura = 10;
          let ancho = 0;
          const pinPosition = this.marker.getPosition();
          const pinLat = pinPosition.lat();
          const pinLng = pinPosition.lng();
      
          if (pinLat > 1.35) {
              altura = 150;
          }
      
          if (pinLng < -2.75) {
              ancho = 125;
          } else if (pinLng > 2.25) {
              ancho = -125;
          }
      
          console.log(pinLng);
      
          this.infoWindow = new google.maps.InfoWindow({
              content: contentString,
              pixelOffset: new google.maps.Size(ancho, altura)
          });
      
          this.infoWindow.open(this.map, this.marker);
        });
      };
      image.src = this.overlayImageSourceUrl;
    }
  }
  
  setPositionFromObject(coordenadasJSON: string) {
    var coordenadasObjeto = JSON.parse(coordenadasJSON);
    var latitud = coordenadasObjeto.latitud;
    var longitud = coordenadasObjeto.longitud;
    this.setPosition(latitud, longitud);
  }
  
  setPosition(latitud: number, longitud: number) {
    var nuevaPosicion = new google.maps.LatLng(latitud, longitud);

    // Crear el evento con todas las propiedades
    var evento = {
        latitud: latitud,
        longitud: longitud,
        titulo: this.title,
        descripcion: this.description
    };

    // Serializar el evento a JSON
    var eventoJSON = JSON.stringify(evento);

    this.marker.setPosition(nuevaPosicion);
    console.log(eventoJSON);
  }
}

// Define the callback function globally
(window as any).googleMapsCallback = () => {
  const component = document.querySelector('netkel-google-maps-overlay') as NetKelGoogleMapsOverlay;
  if (component) {
    component.initMap();
  }
};