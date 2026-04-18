#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function printUsage() {
  console.log(`
Usage:
  node scripts/generate-apple-secret.js \\
    --team-id=YOUR_TEAM_ID \\
    --key-id=YOUR_KEY_ID \\
    --service-id=YOUR_SERVICE_ID \\
    --private-key=/absolute/path/to/AuthKey_XXXXXXXXXX.p8

Optional:
  --expires-in-days=180

Example:
  node scripts/generate-apple-secret.js \\
    --team-id=ABCDE12345 \\
    --key-id=XYZ987LMNO \\
    --service-id=au.com.ptescore.web \\
    --private-key="/Users/florah/Downloads/AuthKey_XYZ987LMNO.p8"
`);
}

function parseArgs(argv) {
  const parsed = {};
  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
      continue;
    }
    if (!arg.startsWith('--')) continue;
    const eqIndex = arg.indexOf('=');
    if (eqIndex === -1) {
      parsed[arg.slice(2)] = true;
      continue;
    }
    const key = arg.slice(2, eqIndex);
    const value = arg.slice(eqIndex + 1);
    parsed[key] = value;
  }
  return parsed;
}

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function derToJose(signature) {
  let offset = 0;
  if (signature[offset++] !== 0x30) {
    throw new Error('Invalid DER signature format.');
  }

  let seqLength = signature[offset++];
  if (seqLength & 0x80) {
    const bytesToRead = seqLength & 0x7f;
    seqLength = 0;
    for (let i = 0; i < bytesToRead; i += 1) {
      seqLength = (seqLength << 8) | signature[offset++];
    }
  }

  if (signature[offset++] !== 0x02) {
    throw new Error('Invalid DER signature: missing R integer.');
  }
  let rLength = signature[offset++];
  let r = signature.slice(offset, offset + rLength);
  offset += rLength;

  if (signature[offset++] !== 0x02) {
    throw new Error('Invalid DER signature: missing S integer.');
  }
  let sLength = signature[offset++];
  let s = signature.slice(offset, offset + sLength);

  while (r.length > 32 && r[0] === 0x00) r = r.slice(1);
  while (s.length > 32 && s[0] === 0x00) s = s.slice(1);

  if (r.length > 32 || s.length > 32) {
    throw new Error('Invalid DER signature length for ES256.');
  }

  const rPadded = Buffer.concat([Buffer.alloc(32 - r.length, 0), r]);
  const sPadded = Buffer.concat([Buffer.alloc(32 - s.length, 0), s]);
  return Buffer.concat([rPadded, sPadded]);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printUsage();
    process.exit(0);
  }

  const teamId = String(args['team-id'] || '').trim();
  const keyId = String(args['key-id'] || '').trim();
  const serviceId = String(args['service-id'] || '').trim();
  const privateKeyPath = String(args['private-key'] || '').trim();
  const expiresInDays = Number(args['expires-in-days'] || 180);

  if (!teamId || !keyId || !serviceId || !privateKeyPath) {
    printUsage();
    throw new Error('Missing required arguments.');
  }

  if (!Number.isFinite(expiresInDays) || expiresInDays <= 0) {
    throw new Error('expires-in-days must be a positive number.');
  }

  const resolvedKeyPath = path.resolve(privateKeyPath);
  const privateKey = fs.readFileSync(resolvedKeyPath, 'utf8');
  const now = Math.floor(Date.now() / 1000);
  const exp = now + Math.floor(expiresInDays * 24 * 60 * 60);

  const header = {
    alg: 'ES256',
    kid: keyId,
    typ: 'JWT',
  };

  const payload = {
    iss: teamId,
    iat: now,
    exp,
    aud: 'https://appleid.apple.com',
    sub: serviceId,
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const derSignature = crypto.sign('sha256', Buffer.from(signingInput), {
    key: privateKey,
    dsaEncoding: 'der',
  });

  const joseSignature = derToJose(derSignature);
  const token = `${signingInput}.${base64url(joseSignature)}`;

  console.log('\nApple client secret generated successfully.\n');
  console.log(token);
  console.log('\nCopy the token above into Supabase -> Apple -> Secret Key (for OAuth).\n');
  console.log(`Expires at (UTC): ${new Date(exp * 1000).toISOString()}`);
}

try {
  main();
} catch (error) {
  console.error(`\nError: ${error.message}\n`);
  process.exit(1);
}
