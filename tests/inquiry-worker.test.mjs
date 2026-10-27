import assert from 'node:assert/strict';
import worker from '../public/_worker.js';

const liveUrl = 'https://boostmind-tech.com/api/project-inquiry';
const validPayload = {
  fullName: 'Test Client',
  email: 'client@example.com',
  phone: '+201000000000',
  projectBrief: 'Build a secure workflow platform for our internal operations',
  referenceLink: 'https://example.com/reference',
  botField: '',
  formOpenedAt: Date.now() - 5000,
  sourcePage: 'https://boostmind-tech.com/',
};

function makeRequest(payload = validPayload) {
  return new Request(liveUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://boostmind-tech.com',
    },
    body: JSON.stringify(payload),
  });
}

const originalFetch = globalThis.fetch;
let restUrl;
let restPayload;
globalThis.fetch = async (url, options) => {
  restUrl = String(url);
  restPayload = JSON.parse(options.body);
  return new Response(JSON.stringify({
    success: true,
    errors: [],
    messages: [],
    result: { delivered: ['bishosamuel@gmail.com'], queued: [], permanent_bounces: [] },
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

try {
  const env = {
    CLOUDFLARE_ACCOUNT_ID: 'account-test',
    CLOUDFLARE_EMAIL_API_TOKEN: 'token-test',
  };

  // 1) Pages production path uses Cloudflare Email Service REST API.
  let response = await worker.fetch(makeRequest(), env);
  let body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.emailProvider, 'cloudflare-email-rest');
  assert.match(restUrl, /accounts\/account-test\/email\/sending\/send$/);
  assert.equal(restPayload.to, 'bishosamuel@gmail.com');
  assert.equal(restPayload.from, 'info@boostmind-tech.com');
  assert.equal(restPayload.reply_to, 'client@example.com');
  assert.match(restPayload.subject, /New Boost Mind project inquiry/);
  assert.match(restPayload.html, /Test Client/);
  assert.match(restPayload.text, /Build a secure workflow platform/);

  // 2) Missing REST secrets returns a clear configuration error instead of crashing.
  response = await worker.fetch(makeRequest(), {});
  body = await response.json();
  assert.equal(response.status, 503);
  assert.equal(body.ok, false);
  assert.equal(body.code, 'EMAIL_NOT_CONFIGURED');

  // 3) Validation rejects bad client email before the email provider is called.
  response = await worker.fetch(makeRequest({ ...validPayload, email: 'not-an-email' }), env);
  body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.ok, false);

  // 4) Health endpoint exposes safe configuration state only.
  response = await worker.fetch(new Request('https://boostmind-tech.com/api/health'), env);
  body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.runtime, 'cloudflare-pages-worker');
  assert.equal(body.contactEmail, 'info@boostmind-tech.com');
  assert.equal(body.senderEmail, 'info@boostmind-tech.com');
  assert.equal(body.notificationEmail, 'bishosamuel@gmail.com');
  assert.equal(body.emailProvider, 'cloudflare-email-rest');
  assert.equal(body.emailConfigured, true);
  assert.equal(body.requiredSecrets.CLOUDFLARE_ACCOUNT_ID, true);
  assert.equal(body.requiredSecrets.CLOUDFLARE_EMAIL_API_TOKEN, true);

  console.log('Inquiry Worker tests: PASS');
  console.log('Production provider: Cloudflare Email Service REST API');
  console.log('Notification recipient: bishosamuel@gmail.com');
  console.log('Public/sender email: info@boostmind-tech.com');
  console.log('Reply-To: client submitted email');
} finally {
  globalThis.fetch = originalFetch;
}
