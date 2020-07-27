
export function matomoTrackingCode (analyticsUrl, siteId) {
  if (analyticsUrl === undefined || siteId === undefined) {
      return '';
  }
  return `
<!-- Matomo -->
<script type="text/javascript">
  var _paq = window._paq || [];
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="//${analyticsUrl}/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', ${siteId}]);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();
</script>
<!-- End Matomo Code -->
`;
};

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
