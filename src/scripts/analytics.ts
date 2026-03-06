import * as Swetrix from 'swetrix';

Swetrix.init(import.meta.env.PUBLIC_SWETRIX_PID, {
  disabled: import.meta.env.DEV,
});
Swetrix.trackViews();
