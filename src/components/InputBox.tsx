
interface InputBoxProps {
  code: string;
  amount: string;
  currencyName?: string;
  flag?: string;
  isBase?: boolean;
  isActive?: boolean;
  onCurrencyClick: () => void;
  onAmountClick: () => void;
}

export default function InputBox({
  code,
  amount,
  currencyName,
  flag,
  isActive = false,
  onCurrencyClick,
  onAmountClick,
}: InputBoxProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid #1a1a1a",
        backgroundColor: isActive ? "#111" : "transparent",
      }}
    >
      {/* Currency Selector */}
      <div
        onClick={onCurrencyClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
        }}
      >
        {flag && (
          <img
            src={flag}
            alt={code}
            style={{
              width: 24,
              height: 16,
              borderRadius: 2,
              objectFit: "cover",
            }}
          />
        )}
        <div>
          <div style={{ fontSize: "18px", fontWeight: "bold", fontStyle: "italic" }}>
            {code} <span style={{ fontSize: "10px", color: "#666" }}>▼</span>
          </div>
          {currencyName && (
            <div style={{ fontSize: "12px", color: "#666" }}>{currencyName}</div>
          )}
        </div>
      </div>

      {/* Amount Display */}
      <div
        onClick={onAmountClick}
        style={{
          fontSize: "28px",
          fontWeight: "500",
          color: isActive ? "#ff9500" : "#fff",
          cursor: "pointer",
        }}
      >
        {amount}
      </div>
    </div>
  );
}