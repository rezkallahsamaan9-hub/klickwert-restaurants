document.addEventListener('DOMContentLoaded', () => {
  // Skip if already decided
  const consent = localStorage.getItem('cookie-consent');
  if (consent === 'accepted') {
    loadGA();
    return;
  }
  if (consent === 'rejected') return;

  // Build banner
  const banner = document.createElement('div');
  banner.className = 'cookie-banner active';
  banner.innerHTML = `
    <div class="cookie-inner">
      <p class="cookie-text">
        Wir verwenden Cookies und Google Analytics, um unsere Website zu verbessern.
        Mehr dazu in unserer <a href="datenschutz.html">Datenschutzerkl&auml;rung</a>.
      </p>
      <div class="cookie-buttons">
        <button class="cookie-btn cookie-btn-reject" id="cookieReject">Nur notwendige</button>
        <button class="cookie-btn cookie-btn-accept" id="cookieAccept">Alle akzeptieren</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('cookieAccept').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    banner.classList.remove('active');
    setTimeout(() => banner.remove(), 400);
    loadGA();
  });

  document.getElementById('cookieReject').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'rejected');
    banner.classList.remove('active');
    setTimeout(() => banner.remove(), 400);
  });
});

function loadGA() {
  // Replace G-XXXXXXXXXX with your actual GA4 Measurement ID
  const GA_ID = 'G-XXXXXXXXXX';
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(script);
  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  };
}
