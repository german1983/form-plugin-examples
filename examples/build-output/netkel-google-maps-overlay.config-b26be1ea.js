const config = {
  controlName: 'Google Maps Overlay by Netkel',
  description: 'Overlay an image on Google Maps and capture coordinates relative to the overlayed image.',
  groupName: 'Netkel',
  fallbackDisableSubmit: false,
  version: '1.0',
  properties: {
    apiKey: {
      type: 'string',
      title: 'Google Maps API Key',
      description: 'The API Key for the Google Maps service.'
    },
    overlayImageSourceUrl: {
      type: 'string',
      title: 'Overlay image URL',
      description: 'The URL of the image to overlay on the map.'
    },
    title: {
      type: 'string',
      title: 'Title',
      description: 'The name of the object represented by the PIN on the map.'
    },
    description: {
      type: 'string',
      title: 'Description',
      description: 'A description of the object represented by the PIN on the map.'
    },
    latitude: {
      type: 'number',
      title: 'Latitude',
      description: 'The latitude of the object represented by the PIN on the map.'
    },
    longitude: {
      type: 'number',
      title: 'Longitude',
      description: 'The longitude of the object represented by the PIN on the map.'
    }
  }
};

export { config };
