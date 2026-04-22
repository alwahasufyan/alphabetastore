export const LIBYA_PHONE_PREFIX = "+218";

export const LIBYAN_CITIES = [
  "طرابلس",
  "بنغازي",
  "مصراتة",
  "الزاوية",
  "زليتن",
  "سبها",
  "سرت",
  "البيضاء",
  "أجدابيا",
  "درنة",
  "الخمس",
  "ترهونة",
  "غريان",
  "صبراتة",
  "طبرق",
  "غدامس",
  "يفرن",
  "مرزق",
  "الكفرة",
  "شحات"
];

const LIBYA_PHONE_LOCAL_LENGTH = 9;

function toDigits(value = "") {
  return String(value).replace(/\D/g, "");
}

export function stripLibyaPhonePrefix(value = "") {
  let digits = toDigits(value);

  if (digits.startsWith("218")) {
    digits = digits.slice(3);
  }

  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits.slice(0, LIBYA_PHONE_LOCAL_LENGTH);
}

export function formatLibyaPhone(value = "") {
  const localNumber = stripLibyaPhonePrefix(value);
  return localNumber ? `${LIBYA_PHONE_PREFIX}${localNumber}` : "";
}

export function isValidLibyaPhone(value = "") {
  return stripLibyaPhonePrefix(value).length === LIBYA_PHONE_LOCAL_LENGTH;
}