// Debug logger for production issues
export const debugLog = {
  init: () => {
    console.log('[Debug Logger Initialized]', {
      env: import.meta.env.MODE,
      baseURL: import.meta.env.BASE_URL,
      isDev: import.meta.env.DEV,
      isProd: import.meta.env.PROD,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      currentURL: window.location.href,
      documentBase: document.baseURI
    });

    // Log all image load failures
    window.addEventListener('error', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        console.error('[Global Image Error]', {
          src: img.src,
          alt: img.alt,
          currentSrc: img.currentSrc,
          naturalWidth: img.naturalWidth,
          timestamp: new Date().toISOString()
        });
      }
    }, true);
  }
};