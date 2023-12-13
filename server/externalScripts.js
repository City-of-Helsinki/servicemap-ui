export const appDynamicsTrackingCode = (appKey) => {
  if (!appKey) {
    return '';
  }
  return `
    <script charset='UTF-8'>
      window['adrum-start-time'] = new Date().getTime();
      (function(config){
          config.appKey = '${appKey}';
          config.adrumExtUrlHttp = 'http://cdn.appdynamics.com';
          config.adrumExtUrlHttps = 'https://cdn.appdynamics.com';
          config.beaconUrlHttp = 'http://fra-col.eum-appdynamics.com';
          config.beaconUrlHttps = 'https://fra-col.eum-appdynamics.com';
          config.xd = {enable : true};
          config.spa = {spa2 : true};
      })(window['adrum-config'] || (window['adrum-config'] = {}));
    </script>
    <script src='//cdn.appdynamics.com/adrum/adrum-20.3.0.3009.js'></script>
    `;
}
