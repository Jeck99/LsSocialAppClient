export const environment = {
  production: true,
  apiUrl: 'https://lssocialwebapi.azurewebsites.net/api/',
  options:{
    'Accept': '*/*', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD', 'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'X-Requested-With,content-type', 'withCredentials': 'true'
  }
};
