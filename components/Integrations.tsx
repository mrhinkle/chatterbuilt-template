import Script from "next/script";
import { integrations } from "@/lib/integrations";

/**
 * Third-party tags from content/integrations.json (build-time).
 * Empty IDs render nothing — free tier friendly, no dead scripts.
 */

export function GoogleTagManager() {
  const id = integrations.gtmContainerId;
  if (!id) return null;
  return (
    <Script id="gtm" strategy="afterInteractive">{`
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${id}');
    `}</Script>
  );
}

export function GoogleTagManagerNoscript() {
  const id = integrations.gtmContainerId;
  if (!id) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}

export function GoogleAnalytics() {
  const id = integrations.ga4MeasurementId;
  if (!id) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${id}');
      `}</Script>
    </>
  );
}

export function MetaPixel() {
  const id = integrations.metaPixelId;
  if (!id) return null;
  return (
    <Script id="meta-pixel" strategy="afterInteractive">{`
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${id}');
      fbq('track', 'PageView');
    `}</Script>
  );
}

export function UmamiAnalytics() {
  const websiteId = integrations.umamiWebsiteId;
  const src = integrations.umamiScriptUrl;
  if (!websiteId || !src) return null;
  return (
    <Script
      async
      defer
      src={src}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}

/** Mount all configured integration scripts. */
export function Integrations() {
  return (
    <>
      <GoogleTagManager />
      <GoogleAnalytics />
      <MetaPixel />
      <UmamiAnalytics />
    </>
  );
}
