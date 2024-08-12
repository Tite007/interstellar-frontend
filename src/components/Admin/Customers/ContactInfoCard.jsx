import React from 'react'
import { RadioGroup, Radio } from '@nextui-org/radio'

export default function ContactInfoCard({ user }) {
  return (
    <div className=" border  w-full  bg-white shadow-sm rounded-xl mt-10 p-5">
      <h2 className="font-simibold mb-4">Contact information</h2>

      {/* Update this line to include a mailto link */}
      <p className="font-light text-blue-500">
        <a href={`mailto:${user.email}`} className="hover:underline">
          {user.email}
        </a>
      </p>
      <p className=" font-light">Phone: {user.phone}</p>
      <p className="  mt-4"> Defualt Address:</p>
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
      <p className=" font-light ">{user.country}</p>
      <h2 className="font-simibold mt-4">Marketing</h2>
      <RadioGroup
        className="mt-2"
        name="marketing"
        defaultValue={user.emailSubscribed ? 'email' : 'sms'}
      >
        <Radio value="email">Email</Radio>
        <Radio value="sms">SMS</Radio>
      </RadioGroup>
      <h2 className="mt-4 font-semibold">Tax exemptions</h2>
    </div>
  )
}
