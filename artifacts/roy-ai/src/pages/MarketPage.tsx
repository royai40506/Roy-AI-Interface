import { useState } from "react";
import { useAppContext } from "@/context/AppContext";

export default function MarketPage() {
  const { marketData } = useAppContext();

  return (
  <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
    <h1>Market Data</h1>

    <p>
      <strong>Total Records:</strong> {marketData.length}
    </p>

    <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <button
        style={{
          padding: "10px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        📷 Upload Screenshot
      </button>

      <button
        style={{
          padding: "10px 20px",
          background: "#16a34a",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        📝 Manual Entry
      </button>
    </div>

    <div
      style={{
        marginTop: "30px",
        padding: "16px",
        border: "1px solid #444",
        borderRadius: "10px",
      }}
    >
      <h3>No market data yet.</h3>
      <p>Add your first record using Screenshot Upload or Manual Entry.</p>
    </div>
  </div>
);
}
