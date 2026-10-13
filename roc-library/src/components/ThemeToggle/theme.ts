export const THEME_STORAGE_KEY = 'roc-theme';
export const LIGHT_THEME = 'roc-light';
export const DARK_THEME = 'roc-dark';

/**
 * Runs in <head> before paint so a saved dark Theme mode never flashes white.
 * Light is the default when nothing is saved.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='${DARK_THEME}'||t==='${LIGHT_THEME}'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;
