import { css } from "lit";

const baseStyle = css`

  #map {
      height: 500px;
      width: 100%;
      margin: 0
  }
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

export const styles = [baseStyle];
