// server/api/login.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const submittedPassword = body.password;

  // THE FIX: Convert the expected password to a string before comparison
  const isMatch = submittedPassword === String(config.sitePassword);

  if (isMatch) {
    setCookie(event, 'site_auth', submittedPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    return sendRedirect(event, '/', 302);
  } else {
    return sendRedirect(event, '/login?error=1', 302);
  }
});