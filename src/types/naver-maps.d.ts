declare global {
    interface Window {
      naver: {
        maps: {
          Map: new (el: HTMLElement, options: object) => any
          LatLng: new (lat: number, lng: number) => any
          Marker: new (options: object) => any
          InfoWindow: new (options: object) => any
        }
      }
    }
  }
  
  export {}