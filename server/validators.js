const dns = require("dns").promises;

const MESSAGE_MAX = 2000;
const NAME_MAX = 60;
const MAX_YEARS = 5;

function isValidEmailSyntax(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

async function hasMx(email) {
  const domain = email.split("@")[1];
  if (!domain) return false;
  try {
    const records = await dns.resolveMx(domain);
    return Array.isArray(records) && records.length > 0;
  } catch {
    return false;
  }
}

function maxFutureDate() {
  return new Date(Date.now() + MAX_YEARS * 365 * 86400000);
}

function validateFutureDate(value) {
  const d = new Date(value);
  const now = new Date();
  return !Number.isNaN(d.getTime()) && d > now && d <= maxFutureDate() ? d : null;
}

module.exports = {
  MESSAGE_MAX,
  NAME_MAX,
  MAX_YEARS,
  isValidEmailSyntax,
  hasMx,
  maxFutureDate,
  validateFutureDate,
};
