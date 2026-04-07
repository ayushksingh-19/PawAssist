const otpSessions = new Map();

const OTP_LENGTH = 4;
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_POOL = ["1024", "2048", "2580", "3141", "4096", "4321", "5678", "6789", "8080", "9090"];
let otpPoolIndex = 0;

function normalizePhone(phone) {
  return String(phone || "").trim();
}

function generateOtp() {
  const code = OTP_POOL[otpPoolIndex % OTP_POOL.length];
  otpPoolIndex += 1;
  return code;
}

function createOtpSession(phone) {
  const normalizedPhone = normalizePhone(phone);
  const code = generateOtp();
  const expiresAt = Date.now() + OTP_TTL_MS;

  otpSessions.set(normalizedPhone, {
    code,
    expiresAt,
  });

  return {
    phone: normalizedPhone,
    code,
    expiresAt,
  };
}

function verifyOtpSession(phone, otp) {
  const normalizedPhone = normalizePhone(phone);
  const normalizedOtp = String(otp || "").trim();
  const session = otpSessions.get(normalizedPhone);

  if (!session) {
    return { ok: false, reason: "missing" };
  }

  if (Date.now() > session.expiresAt) {
    otpSessions.delete(normalizedPhone);
    return { ok: false, reason: "expired" };
  }

  if (normalizedOtp.length !== OTP_LENGTH || session.code !== normalizedOtp) {
    return { ok: false, reason: "invalid" };
  }

  otpSessions.delete(normalizedPhone);
  return { ok: true };
}

module.exports = {
  OTP_LENGTH,
  OTP_TTL_MS,
  createOtpSession,
  verifyOtpSession,
};
