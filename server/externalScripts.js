export function cookieHubCode (req) {
  if (!req) {
    return '';
  }

  let cookiehubURL;
  // Attempt to parse COOKIEHUB_DOMAINS object
  try {
    if (!process.env.COOKIEHUB_DOMAINS) {
      return '';
    }
    const cookiehubDomainsObject = process.env.COOKIEHUB_DOMAINS.split(';');
    const allowedDomains = cookiehubDomainsObject.map(o => {
      const data = o.split(',');
      return {
        domain: data[0],
        url: data[1],
      }
    });

    const host = req.hostname;
    const fData = allowedDomains.filter(o => host.indexOf(o.domain) > -1);
    const show = !!fData.length;
    if (!show) {
      return '';
    }
    cookiehubURL = allowedDomains[0].url;
  } catch (e) {
    console.error(`Error while parsing COOKIEHUB_DOMAINS variable: ${e.message}`);
    return '';
  }
  
  return `
    <script type="text/javascript">
      document.addEventListener('DOMContentLoaded', function() {
        var cpm = {
          enabled: (location.href.indexOf('/embed/') > -1 ? false : true), // uncomment this line when in production
          onInitialise: function (status) {
            setTimeout(() => {
              document.getElementById("ch2-dialog-title").setAttribute('tabindex', -1);
              document.getElementById("ch2-dialog-description").setAttribute('tabindex', -1);
              document.getElementsByClassName("ch2-dialog")[0].setAttribute('tabindex', -1);
            }, 0)
          }
        };
        (function(h,u,b){
        var d=h.getElementsByTagName("script")[0],e=h.createElement("script");
        e.async=true;e.src='${cookiehubURL}';
        e.onload=function(){u.cookiehub.load(b);}
        d.parentNode.insertBefore(e,d);
        })(document,window,cpm);
      });
    </script>
  `;
};

export function matomoTrackingCode (analyticsUrl, siteId) {
  if (analyticsUrl === undefined || siteId === undefined) {
      return '';
  }
  return `
<!-- Matomo -->
<script type="text/plain" data-consent="analytics">
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
