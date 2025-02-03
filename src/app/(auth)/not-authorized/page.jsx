// pages/unauthorized.js

import Link from 'next/link'
import { Button } from "@heroui/button"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-4">Unauthorized Access</h1>
        <p className="mb-8">You are not authorized to view this page.</p>
        <Link href="/" passHref>
          <Button
            color="primary"
            className="text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
