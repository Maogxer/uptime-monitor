// server/api/logout.post.ts
export default defineEventHandler((event) => {
  // Delete the authentication cookie
  deleteCookie(event, 'site_auth');
  
  // Redirect the user to the login page
  return sendRedirect(event, '/login', 302);
});