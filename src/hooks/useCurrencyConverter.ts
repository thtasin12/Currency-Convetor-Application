import { useState, useCallback, useEffect } from "react";
import { fetchCurrencies, fetchConversion, type Currency } from "../data/currencies";

export interface TargetCurrency {
  code: string;
  id: string;
}

export function useCurrencyConverter() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [baseAmount, setBaseAmount] = useState("1");
  const [activeCurrency, setActiveCurrency] = useState<string>("USD");
  const [targets, setTargets] = useState<TargetCurrency[]>([
    { code: "TZS", id: "target-1" },
    { code: "BDT", id: "target-2" },
  ]);

  const [convertedAmounts, setConvertedAmounts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadCurrencies() {
      const list = await fetchCurrencies();
      setCurrencies(list);
    }
    loadCurrencies();
  }, []);

  useEffect(() => {
    async function updateConversions() {
      const numericAmount = parseFloat(baseAmount) || 0;
      if (numericAmount <= 0) {
        setConvertedAmounts({});
        return;
      }

      setLoading(true);
      const newConversions: Record<string, string> = {};

      await Promise.all(
        targets.map(async (target) => {
          const res = await fetchConversion(numericAmount, baseCurrency, target.code);
          if (res) {
            newConversions[target.code] = res.formattedResult;
          }
        })
      );

      setConvertedAmounts(newConversions);
      setLoading(false);
    }

    updateConversions();
  }, [baseAmount, baseCurrency, targets]);

  const handleNumpad = useCallback(
    (key: string) => {
      if (activeCurrency !== baseCurrency) {
        setActiveCurrency(baseCurrency);
      }

      if (key === "AC") {
        setBaseAmount("0");
        return;
      }

      if (key === "BS") {
        setBaseAmount((prev) => {
          if (prev.length <= 1) return "0";
          return prev.slice(0, -1);
        });
        return;
      }

      if (key === "=") {
        return;
      }

      setBaseAmount((prev) => {
        if (prev === "0" && key !== ".") {
          return key;
        }
        if (key === "." && prev.includes(".")) {
          return prev;
        }
        if (prev.replace(".", "").length >= 9) {
          return prev;
        }
        return prev + key;
      });
    },
    [activeCurrency, baseCurrency]
  );

  const addTarget = useCallback(() => {
    setTargets((prev) => {
      if (prev.length >= 5) return prev;
      const usedCodes = new Set([baseCurrency, ...prev.map((t) => t.code)]);
      const available = currencies.find((c) => !usedCodes.has(c.code));
      if (!available) return prev;
      return [...prev, { code: available.code, id: `target-${Date.now()}` }];
    });
  }, [baseCurrency, currencies]);

  const removeTarget = useCallback((id: string) => {
    setTargets((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTargetCode = useCallback((id: string, newCode: string) => {
    setTargets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, code: newCode } : t))
    );
  }, []);

  const getConvertedAmount = useCallback(
    (code: string) => {
      return convertedAmounts[code] || "0";
    },
    [convertedAmounts]
  );

  return {
    currencies,
    baseCurrency,
    setBaseCurrency,
    baseAmount,
    setBaseAmount,
    activeCurrency,
    setActiveCurrency,
    targets,
    addTarget,
    removeTarget,
    updateTargetCode,
    handleNumpad,
    getConvertedAmount,
    loading,
  };
}