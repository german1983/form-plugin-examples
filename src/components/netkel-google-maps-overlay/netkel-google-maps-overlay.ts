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

  @property({ type: Object })
  map: any = null;

  @property({ type: Object })
  marker: any = null;

  @property({ type: Object })
  imageBounds: any = null;

  @query('#map')
  mapElement!: HTMLElement;

  infoWindow: google.maps.InfoWindow | null = null;

  static getMetaConfig() {
      return import('./netkel-google-maps-overlay.config')
        .then(({ config }) => {
          return config;
      });
  }

  render() {
    this.initMap();

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

    // Load the Google Maps API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=googleMapsCallback`;
    script.defer = true;
    script.async = true;
    
    // Attach the script to the document
    document.head.appendChild(script);

    // Define the callback function globally
    window['googleMapsCallback'] = this.initMap.bind(this);
  }


  initMap() {
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
            zoom: 2,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            draggable: false,
            zoomControl: false,
            gestureHandling: 'none'
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
            draggable: true
        });

        // evento de arrastre de pin
        this.marker.addListener('dragend', (event: { latLng: any; }) => {
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
          var contentString = '<div><strong>Latitud:</strong> ' + latlng.lat().toFixed(6) + '<br>' +
                              '<strong>Longitud:</strong> ' + latlng.lng().toFixed(6) + '</div>';
         
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

  setPosition(coordenadasJSON: string) {
    var coordenadasObjeto = JSON.parse(coordenadasJSON);
    var latitud = coordenadasObjeto.latitud;
    var longitud = coordenadasObjeto.longitud;
    var nuevaPosicion = new google.maps.LatLng(latitud, longitud);

    this.marker.setPosition(nuevaPosicion);
  }

}
