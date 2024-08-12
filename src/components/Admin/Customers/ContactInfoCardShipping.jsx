import React from 'react'

export default function ContactInfoCardShipping({ user, order }) {
  const shippingInfo = order?.shippingInfo || {}

  return (
    <div className=" border w-96  bg-white shadow-sm rounded-xl mt-10 p-5">
      <h2 className="font-simibold mb-4">Contact Information</h2>{' '}
      <p className=" mt-4 text-xl ">
        <strong>
          {user.name} {user.lastName}
        </strong>
      </p>
      <p className="font-light text-blue-500">
        <a href={`mailto:${user.email}`} className="hover:underline">
          {user.email}
        </a>
      </p>
      <p className=" font-light">Phone: {user.phone}</p>
      <h2 className="mb-1 mt-2 text-lg font-medium">Shipping Information</h2>
      {order && order.shippingInfo ? (
        <>
          <p className="mb-1">
            <strong>Carrier:</strong> {shippingInfo.carrierName || 'N/A'}
          </p>
          <p className="mb-1">
            {' '}
            <strong>Shipping Cost:</strong> $
            {shippingInfo.shippingCost || 'N/A'}
          </p>
          <p className="mb-1">
            {' '}
            <strong>Shipping Option:</strong>{' '}
            {shippingInfo.shippingOption || 'N/A'}
          </p>
          <p className="mb-1">
            {' '}
            <strong>Shipping Address:</strong>{' '}
            {shippingInfo.address?.line1 || 'N/A'},{' '}
            {shippingInfo.address?.city || 'N/A'},{' '}
            {shippingInfo.address?.state || 'N/A'},{' '}
            {shippingInfo.address?.postal_code || 'N/A'},{' '}
            {shippingInfo.address?.country || 'N/A'}
          </p>
        </>
      ) : (
        <p>No shipping information available.</p>
      )}
      <h2 className="mt-4 font-semibold">Tax Exemptions</h2>
    </div>
  )
}
