export async function GET() {
  return new Response(JSON.stringify({
    SITE_KEY: import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY,
    SECRET: import.meta.env.RECAPTCHA_SECRET
  }), { status: 200 });
}
