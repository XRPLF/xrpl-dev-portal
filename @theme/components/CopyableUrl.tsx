import { useState } from "react"

// Copyable URL component with click-to-copy functionality
export default function CopyableUrl({ url, translate }: { url: string; translate: (text: string) => string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <button
      type="button"
      className={`quick-ref-value-btn ${copied ? "copied" : ""}`}
      onClick={handleCopy}
      title={copied ? translate("Copied!") : translate("Click to copy")}
    >
      <code className="quick-ref-value">{url}</code>
      <span className="copy-icon">{copied ? "✓" : ""}</span>
    </button>
  )
}
