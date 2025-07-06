// server/middleware/auth.ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const isProtectionEnabled = config.public.sitePasswordProtect === 'true';

  if (!isProtectionEnabled) {
    return;
  }

  const url = getRequestURL(event);
  if (url.pathname.startsWith('/_nuxt/') || url.pathname.startsWith('/api/')) {
    return;
  }
  
  if (url.pathname === '/login') {
    return;
  }

  const cookie = getCookie(event, 'site_auth');
  
  // THE FIX: Convert the expected password to a string before comparison
  if (cookie !== String(config.sitePassword)) {
    return sendRedirect(event, '/login', 302);
  }
});