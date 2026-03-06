import * as Swetrix from 'swetrix';
import { DEV, PUBLIC_SWETRIX_PID } from 'astro:env/client';

Swetrix.init(PUBLIC_SWETRIX_PID, {
  apiURL: 'https://analytics.jswebforge.de/api/log',
  disabled: DEV,
});
Swetrix.trackViews();
