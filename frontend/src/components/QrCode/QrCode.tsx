import "./QrCode.css"
import { useRef, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { FaDownload } from "react-icons/fa"

type QrCodeProps = {
  url: string
  size: number
}

function QrCode({ url, size }: QrCodeProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [error, setError] = useState<string>()

  function handleDownload() {
    const node = svgRef.current
    if (node == null) {
      return
    }
    // SVG, get markup and turn into XML, XMLSerializer ensure markup contains xmlns
    // Encode DOCTYPE and xmlns into URI for download as <a> href
    try {
      const serializer = new XMLSerializer()
      const uri =
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(
          "<?xml version='1.0' standalone='no'?>" +
            serializer.serializeToString(node)
        )
      downloadFile(uri, "qrcode.svg")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error.message)
      setError(error.message)
    }
  }

  function downloadFile(dataUri: string, filename: string) {
    const a = document.createElement("a")
    a.download = filename
    a.href = dataUri
    a.click()
    a.remove()
  }

  return (
    <div className="qr-code-container" data-testid="qr-code-container">
      <QRCodeSVG
        ref={svgRef}
        value={url}
        level="M"
        size={size}
        bgColor="#FFFFFF"
      />
      <button onClick={handleDownload} data-testid="download-qr-code">
        <FaDownload />
        Download
      </button>
      {error && (
        <p role="alert" className="error-text">
          {error}
        </p>
      )}
    </div>
  )
}

export default QrCode
