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
              var title = document.getElementById("ch2-dialog-title");
              if (title) {
                title.setAttribute('tabindex', -1);
              }
              var description = document.getElementById("ch2-dialog-description");
              if (description) {
                description.setAttribute('tabindex', -1);
              }
              var dialog = document.getElementsByClassName("ch2-dialog");
              if (dialog && dialog[0]) {
                dialog[0].setAttribute('tabindex', -1);
              }
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
