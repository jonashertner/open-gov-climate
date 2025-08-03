import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { 
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; 
    color: #222; 
    background: #fff; 
    line-height: 1.6; 
  }
  a { color: #007acc; text-decoration: none; }
  a:hover { text-decoration: underline; }
`;

export default GlobalStyle;
