import React, { useState } from "react";
import type { Currency } from "../data/currencies";

interface CurrencyDropdownProps {
  isOpen: boolean;
  currencies?: Currency[];
  selectedCode: string;
  onSelect: (code: string) => void;
  onClose: () => void;
  excludeCodes?: string[];
}

export default function CurrencyDropdown({
  isOpen,
  currencies = [],
  selectedCode,
  onSelect,
  onClose,
  excludeCodes = [],
}: CurrencyDropdownProps) {
  console.log("API Currencies Data:", currencies);
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filteredCurrencies = currencies.filter((c) => {
    const isExcluded = excludeCodes.includes(c.code);
    const searchTerm = search.toLowerCase().trim();

    const matchesCode = c.code ? c.code.toLowerCase().includes(searchTerm) : false;
    const matchesName = c.name ? c.name.toLowerCase().includes(searchTerm) : false;

    return !isExcluded && (matchesCode || matchesName);
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#000",
        zIndex: 1000,
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
          padding: "16px 20px",
          gap: 16,
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 22,
            cursor: "pointer",
            padding: 4,
          }}
        >
          ←
        </button>
        <span
          style={{
            fontSize: 18,
            fontWeight: 500,
            flex: 1,
            textAlign: "center",
            marginRight: 32,
          }}
        >
          Select Currency
        </span>
      </div>

      {/* Search Input */}
      <div style={{ padding: "0 20px 16px 20px" }}>
        <input
          type="text"
          placeholder="Search currency or country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            backgroundColor: "#111",
            border: "1px solid #333",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "15px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Currency List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {filteredCurrencies.length > 0 ? (
          filteredCurrencies.map((c) => (
            <div
              key={c.code}
              onClick={() => {
                onSelect(c.code);
                onClose();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 0",
                borderBottom: "1px solid #1a1a1a",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {c.flag && (
                  <img
                    src={c.flag}
                    alt={c.code}
                    style={{
                      width: 24,
                      height: 16,
                      borderRadius: 2,
                      objectFit: "cover",
                    }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: "600", fontSize: "16px" }}>
                    {c.code}
                  </div>
                  <div style={{ color: "#666", fontSize: "13px" }}>{c.name}</div>
                </div>
              </div>
              {selectedCode === c.code && (
                <span style={{ color: "orange", fontSize: "18px" }}>✓</span>
              )}
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", color: "#666", marginTop: "40px" }}>
            No currencies found
          </div>
        )}
      </div>
    </div>
  );
}