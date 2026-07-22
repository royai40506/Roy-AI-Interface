import { useState } from "react";
import { useAppContext } from "@/context/AppContext";

export default function MarketPage() {
  const { marketData } = useAppContext();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Market Data</h1>

      <p>Total Records : {marketData.length}</p>

<button
  style={{
    padding: "10px 20px",
    marginTop: "20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  Upload Screenshot
</button>

<button
  style={{
    padding: "10px 20px",
    marginTop: "10px",
    marginLeft: "10px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  Manual Entry
</button>
    </div>
  );
}
