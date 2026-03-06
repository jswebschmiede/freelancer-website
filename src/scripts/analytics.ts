import * as Swetrix from 'swetrix';

Swetrix.init(import.meta.env.PUBLIC_SWETRIX_PID, {
  apiURL: 'https://analytics.jswebforge.de/api/log',
  disabled: import.meta.env.DEV,
});
Swetrix.trackViews();
