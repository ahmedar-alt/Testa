import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.VITE_MIXPANEL_TOKEN;

export const initAnalytics = () => {
  if (MIXPANEL_TOKEN) {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: false,
      track_pageview: true,
      persistence: 'localStorage',
      ignore_dnt: true
    });
  } else {
    console.warn("Mixpanel Token non trouvé. Le tracking est désactivé.");
  }
};

export const trackEvent = (eventName: string, properties?: any) => {
  if (MIXPANEL_TOKEN) {
    try {
      mixpanel.track(eventName, properties);
    } catch (e) {
      console.error("Erreur tracking:", e);
    }
  } else {
    console.log(`[Dev Analytics] ${eventName}`, properties);
  }
};