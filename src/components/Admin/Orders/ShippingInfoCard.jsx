import React from 'react'
import { RadioGroup, Radio } from "@heroui/radio"

export default function ShippingInfoCard({ user }) {
  return (
    <div className=" border w-96  bg-white shadow-sm rounded-xl mt-10 p-5">
      <h2 className="font-simibold mb-4">Shipping Address</h2>

      <p className=" mt-4">
        <strong>
          {user.name} {user.lastName}
        </strong>
      </p>
      <p className=" font-light">
        {user.number} - {user.street}
      </p>
      <p className=" font-light">
        {user.city}, {user.province}, {user.postalCode},
      </p>
      <p className=" font-light">{user.country}</p>
      <h2 className="mt-4 font-semibold">Tax exemptions</h2>
    </div>
  )
}
