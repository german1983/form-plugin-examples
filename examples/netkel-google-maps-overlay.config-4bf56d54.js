const config = {
  controlName: 'Google Maps Overlay by Netkel',
  description: 'Overlay an image on Google Maps and capture coordinates relative to the overlayed image.',
  groupName: 'Netkel',
  fallbackDisableSubmit: false,
  version: '1.0',
  properties: {
    apiKey: {
      type: 'string',
      title: 'Google Maps API Key'
    },
    overlayImageSourceUrl: {
      type: 'string',
      title: 'Overlay image URL'
    },
    title: {
      type: 'string',
      title: 'Pin coordinates',
      description: 'Comma separated values of coordinates in the format of "x,y" (e.g. "100,200")'
    },
    description: {
      type: 'string',
      title: 'Pin name'
    },
    latitud: {
      type: 'number',
      title: 'Latitude'
    },
    longitude: {
      type: 'number',
      title: 'Longitude'
    }
  }
};

export { config };
