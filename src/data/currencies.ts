export interface Currency {
  code: string;
  name: string;
  flag: string;
}

export interface ConversionResult {
  result: number;
  formattedResult: string;
}

const getCurrencyName = (code: string): string => {
  try {
    const currencyNames = new Intl.DisplayNames(["en"], { type: "currency" });
    return currencyNames.of(code) || code;
  } catch {
    return code;
  }
};

const getFlagUrl = (currencyCode: string): string => {
  const exceptions: Record<string, string> = {
    EUR: "eu",
    BTC: "bt",
    ANG: "nl",
    XAF: "cm",
    XOF: "sn",
  };

  const countryCode = exceptions[currencyCode] || currencyCode.slice(0, 2).toLowerCase();
  return `https://flagcdn.com/w40/${countryCode}.png`;
};

export const fetchCurrencies = async (): Promise<Currency[]> => {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!response.ok) throw new Error("Network error");
    const data = await response.json();

    if (data && data.rates) {
      return Object.keys(data.rates).map((code) => ({
        code,
        name: getCurrencyName(code),
        flag: getFlagUrl(code),
      }));
    }
  } catch (error) {
    console.error("Error fetching currency list:", error);
  }

  return [
    { code: "USD", name: "United States Dollar", flag: "https://flagcdn.com/w40/us.png" },
    { code: "BDT", name: "Bangladeshi Taka", flag: "https://flagcdn.com/w40/bd.png" },
    { code: "EUR", name: "Euro", flag: "https://flagcdn.com/w40/eu.png" },
  ];
};

export const fetchConversion = async (
  amount: number,
  from: string,
  to: string
): Promise<ConversionResult | null> => {
  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    if (!response.ok) throw new Error("API Network error");
    const data = await response.json();

    if (data && data.rates && data.rates[to] !== undefined) {
      const rate = data.rates[to];
      const total = amount * rate;
      return {
        result: total,
        formattedResult: total.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        }),
      };
    }
    return { result: 0, formattedResult: "0.00" };
  } catch (error) {
    console.error("Fetch conversion error:", error);
    return { result: 0, formattedResult: "0.00" };
  }
};