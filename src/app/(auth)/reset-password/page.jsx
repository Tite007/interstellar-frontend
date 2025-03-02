// src/app/(auth)/reset-password/page.jsx
import React from 'react'
import { Suspense } from 'react'
import ResetPasswordClient from './ResetPasswordClient' // New client component

// Server-side page component
export default function ResetPasswordPage() {
  const backgroundStyle = {
    backgroundImage: `url('/LoginBackground.jpg')`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh',
  }

  return (
    <div
      style={backgroundStyle}
      className="min-h-screen flex items-center justify-center"
    >
      {/* Wrap client-side logic in Suspense */}
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordClient />
      </Suspense>
    </div>
  )
}
