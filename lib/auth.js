'use strict';

const {
  randomBytes,
  scryptSync,
  timingSafeEqual,
} = require('node:crypto');

const SESSION_COOKIE = 'ripple_session';
const SESSION_DAYS = 30;

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (typeof stored !== 'string' || !stored.includes(':')) return false;

  const [salt, expectedHex] = stored.split(':');
  if (!salt || !expectedHex) return false;

  try {
    const expected = Buffer.from(expectedHex, 'hex');
    const actual = scryptSync(password, salt, expected.length);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

function createToken() {
  return randomBytes(32).toString('hex');
}

function parseCookies(header = '') {
  return header.split(';').reduce((cookies, part) => {
    const index = part.indexOf('=');
    if (index < 0) return cookies;

    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();

    if (!key) return cookies;
    try {
      cookies[key] = decodeURIComponent(value);
    } catch {
      cookies[key] = value;
    }
    return cookies;
  }, {});
}

function normalizeUsername(value) {
  return String(value || '').trim().toLowerCase();
}

function isUsername(value) {
  return /^[a-z0-9_]{3,20}$/.test(value);
}

function normalizeWebsite(value) {
  const website = String(value || '').trim();
  if (!website) return '';

  const withProtocol = /^https?:\/\//i.test(website)
    ? website
    : `https://${website}`;

  try {
    const url = new URL(withProtocol);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    if (!url.hostname.includes('.')) return null;
    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

module.exports = {
  SESSION_COOKIE,
  SESSION_DAYS,
  hashPassword,
  verifyPassword,
  createToken,
  parseCookies,
  normalizeUsername,
  isUsername,
  normalizeWebsite,
};
