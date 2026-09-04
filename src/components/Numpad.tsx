interface NumpadProps {
  onPress: (key: string) => void;
}

export default function Numpad({ onPress }: NumpadProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "repeat(4, 64px)",
        gap: 10,
        padding: "16px 20px 32px",
        background: "#000",
      }}
    >
      {/* Row 1 */}
      <NumButton label="7" onPress={() => onPress("7")} />
      <NumButton label="8" onPress={() => onPress("8")} />
      <NumButton label="9" onPress={() => onPress("9")} />
      <NumButton
        label="AC"
        onPress={() => onPress("AC")}
        style={{ gridRow: "span 2", color: "#d97706" }}
      />

      {/* Row 2 */}
      <NumButton label="4" onPress={() => onPress("4")} />
      <NumButton label="5" onPress={() => onPress("5")} />
      <NumButton label="6" onPress={() => onPress("6")} />

      {/* Row 3 */}
      <NumButton label="1" onPress={() => onPress("1")} />
      <NumButton label="2" onPress={() => onPress("2")} />
      <NumButton label="3" onPress={() => onPress("3")} />
      <NumButton
        label="⌫"
        onPress={() => onPress("BS")}
        style={{ gridRow: "span 2", color: "#d97706" }}
      />

      {/* Row 4 */}
      <NumButton
        label="0"
        onPress={() => onPress("0")}
        style={{ gridColumn: "span 2" }}
      />
      <NumButton label="." onPress={() => onPress(".")} />
    </div>
  );
}

function NumButton({
  label,
  onPress,
  style = {},
}: {
  label: string;
  onPress: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onPress}
      style={{
        background: "#1a1a1a",
        border: "none",
        borderRadius: 16,
        color: "#fff",
        fontSize: 24,
        fontWeight: 400,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        transition: "background 0.1s",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!style?.background) e.currentTarget.style.background = "#2a2a2a";
      }}
      onMouseLeave={(e) => {
        if (!style?.background) e.currentTarget.style.background = "#1a1a1a";
      }}
    >
      {label}
    </button>
  );
}