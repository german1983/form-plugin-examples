import { PluginContract } from '@nintex/form-plugin-contract';
export const config: PluginContract = {
  controlName: 'Google Maps Overlay by Netkel',
  description: 'Overlay an image on Google Maps and capture coordinates relative to the overlayed image.',
  groupName: 'Netkel',
  fallbackDisableSubmit: false,
  version: '1.0',
  properties: { 
    apiKey: {
      type: 'string',
      title: 'Google Maps API Key',
    },
    overlayImageSourceUrl: {
      type: 'string',
      title: 'Overlay image URL',
    },
    pinCoordinates: {
      type: 'string',
      title: 'Pin coordinates',
      description: 'Comma separated values of coordinates in the format of "x,y" (e.g. "100,200")',
    },
    pinName: {
      type: 'string',
      title: 'Pin name',
    },
  },
};
