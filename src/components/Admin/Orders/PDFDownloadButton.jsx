'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@heroui/button'

// Error Boundary Component for PDF
class PDFErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('PDF Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Button size="sm" className="mt-7 w-52" isDisabled>
          PDF Unavailable
        </Button>
      )
    }

    return this.props.children
  }
}

export default function PDFDownloadButton({ order, userDetails }) {
  const [PDFDownloadLink, setPDFDownloadLink] = useState(null)
  const [MyDocument, setMyDocument] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Only load PDF components on client side
    if (typeof window !== 'undefined') {
      Promise.all([
        import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
        import('@/src/components/Admin/Orders/PDFPackingSlip').then(
          (mod) => mod.default,
        ),
      ])
        .then(([PDFDownloadLinkComponent, DocumentComponent]) => {
          setPDFDownloadLink(() => PDFDownloadLinkComponent)
          setMyDocument(() => DocumentComponent)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error('Failed to load PDF components:', err)
          setError(err)
          setIsLoading(false)
        })
    }
  }, [])

  if (isLoading) {
    return (
      <Button size="sm" className="mt-7 w-52" isDisabled>
        Loading PDF...
      </Button>
    )
  }

  if (error || !PDFDownloadLink || !MyDocument) {
    return (
      <Button size="sm" className="mt-7 w-52" isDisabled>
        PDF Unavailable
      </Button>
    )
  }

  if (!order?.orderNumber || !userDetails) {
    return (
      <Button size="sm" className="mt-7 w-52" isDisabled>
        Loading...
      </Button>
    )
  }

  return (
    <PDFErrorBoundary>
      <PDFDownloadLink
        document={React.createElement(MyDocument, { order, userDetails })}
        fileName={`packing-slip-${order.orderNumber}.pdf`}
      >
        {({ blob, url, loading, error: pdfError }) => {
          if (pdfError) {
            console.error('PDF generation error:', pdfError)
            return (
              <Button size="sm" className="mt-7 w-52" isDisabled>
                PDF Error
              </Button>
            )
          }
          return (
            <Button size="sm" className="mt-7 w-52" isLoading={loading}>
              {loading ? 'Preparing...' : 'Print Packing Slip'}
            </Button>
          )
        }}
      </PDFDownloadLink>
    </PDFErrorBoundary>
  )
}
