const SUPPORTED_CURRENCIES = new Set(["LYD", "USD"]);

const state = {
  defaultCurrency: "LYD",
  exchangeRateUsdToLyd: 5.2,
  locale: "ar-LY"
};

function toFiniteNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeCurrency(value) {
  const normalized = String(value || "").trim().toUpperCase();
  return SUPPORTED_CURRENCIES.has(normalized) ? normalized : "LYD";
}

export function configureCurrency(options = {}) {
  const nextCurrency = normalizeCurrency(options.default_currency || options.defaultCurrency || state.defaultCurrency);
  const nextRate = toFiniteNumber(options.exchange_rate_usd_to_lyd || options.exchangeRateUsdToLyd, state.exchangeRateUsdToLyd);
  const nextLanguage = String(options.default_language || options.defaultLanguage || "ar").trim().toLowerCase();

  state.defaultCurrency = nextCurrency;
  state.exchangeRateUsdToLyd = nextRate > 0 ? nextRate : state.exchangeRateUsdToLyd;
  state.locale = nextLanguage.startsWith("ar") ? "ar-LY" : "en-US";
}

export function getCurrencyConfig() {
  return {
    defaultCurrency: state.defaultCurrency,
    exchangeRateUsdToLyd: state.exchangeRateUsdToLyd,
    locale: state.locale
  };
}

export function convertUsdToCurrency(amount, currencyCode = state.defaultCurrency) {
  const currency = normalizeCurrency(currencyCode);
  const usdAmount = toFiniteNumber(amount, 0);

  if (currency === "LYD") {
    return usdAmount * state.exchangeRateUsdToLyd;
  }

  return usdAmount;
}

export function getCurrencySymbol(currencyCode = state.defaultCurrency) {
  const currency = normalizeCurrency(currencyCode);
  return currency === "LYD" ? "د.ل" : "$";
}

export function formatStoreCurrency(amount, fraction = 2, currencyCode = state.defaultCurrency) {
  const currency = normalizeCurrency(currencyCode);
  const convertedAmount = convertUsdToCurrency(amount, currency);
  const formatter = new Intl.NumberFormat(state.locale, {
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction
  });

  const formattedNumber = formatter.format(convertedAmount);

  if (currency === "LYD") {
    return `${formattedNumber} ${getCurrencySymbol(currency)}`;
  }

  return `${getCurrencySymbol(currency)}${formattedNumber}`;
}
