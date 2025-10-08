import type { RawRow } from "../types";

interface DebugPreviewProps {
  firstPreview: RawRow | null;
  csvKeys: string[];
  jsonKeys: string[];
}

export default function DebugPreview({ firstPreview, csvKeys, jsonKeys }: DebugPreviewProps) {
  if (!firstPreview) return null;

  return (
    <details style={{ marginBottom: 12 }}>
      <summary style={{ cursor: "pointer" }}>Debug: first row & keys</summary>
      <div style={{ fontSize: 12 }}>
        <div>CSV keys: {csvKeys.join(", ") || "—"}</div>
        <div>JSON keys: {jsonKeys.join(", ") || "—"}</div>
        <pre>{JSON.stringify(firstPreview, null, 2)}</pre>
      </div>
    </details>
  );
}
