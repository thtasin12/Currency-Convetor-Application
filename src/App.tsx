import { useState } from "react";
import InputBox from "./components/InputBox";
import CurrencyDropdown from "./components/CurrencyDropdown";
import Numpad from "./components/Numpad";
import { useCurrencyConverter } from "./hooks/useCurrencyConverter";

function App() {
  const {
    currencies,
    baseCurrency,
    setBaseCurrency,
    baseAmount,
    activeCurrency,
    setActiveCurrency,
    targets,
    updateTargetCode,
    handleNumpad,
    getConvertedAmount,
    loading,
  } = useCurrencyConverter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownFor, setDropdownFor] = useState<{
    type: "base" | "target";
    id?: string;
  } | null>(null);

  const openDropdown = (type: "base" | "target", id?: string) => {
    setDropdownFor({ type, id });
    setDropdownOpen(true);
  };

  const handleSelect = (code: string) => {
    if (!dropdownFor) return;
    if (dropdownFor.type === "base") {
      setBaseCurrency(code);
    } else if (dropdownFor.id) {
      updateTargetCode(dropdownFor.id, code);
    }
  };

  const excludeCodes = [
    ...(dropdownFor?.type !== "base" ? [baseCurrency] : []),
    ...targets
      .filter((t) => t.id !== dropdownFor?.id)
      .map((t) => t.code),
  ];

  const getCurrencyDetails = (code: string) =>
    currencies.find((c) => c.code === code);

  const baseDetails = getCurrencyDetails(baseCurrency);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {/* Header */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px 20px",
  }}
>
  <span
    style={{
      fontSize: 20,
      fontWeight: 500,
      fontStyle: "italic",
      textAlign: "center",
    }}
  >
    Currency converter
  </span>
</div>

      {/* Base Currency */}
      <InputBox
        code={baseCurrency}
        amount={baseAmount}
        currencyName={baseDetails?.name}
        flag={baseDetails?.flag}
        isBase
        isActive={activeCurrency === baseCurrency}
        onCurrencyClick={() => openDropdown("base")}
        onAmountClick={() => setActiveCurrency(baseCurrency)}
      />

      {/* Target Currencies */}
      {targets.map((target) => {
        const targetDetails = getCurrencyDetails(target.code);
        return (
          <InputBox
            key={target.id}
            code={target.code}
            currencyName={targetDetails?.name}
            flag={targetDetails?.flag}
            amount={loading ? "..." : getConvertedAmount(target.code)}
            isActive={activeCurrency === target.code}
            onCurrencyClick={() => openDropdown("target", target.id)}
            onAmountClick={() => setActiveCurrency(target.code)}
          />
        );
      })}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Numpad */}
      <Numpad onPress={handleNumpad} />

      {/* Dropdown */}
      <CurrencyDropdown
        isOpen={dropdownOpen}
        currencies={currencies}
        selectedCode={
          dropdownFor?.type === "base"
            ? baseCurrency
            : dropdownFor?.id
            ? targets.find((t) => t.id === dropdownFor.id)?.code || "USD"
            : "USD"
        }
        onSelect={handleSelect}
        onClose={() => setDropdownOpen(false)}
        excludeCodes={excludeCodes}
      />
    </div>
  );
}

export default App;