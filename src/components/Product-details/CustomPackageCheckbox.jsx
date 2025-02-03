// components/CustomPackageCheckbox.jsx

import React from 'react'
import { Checkbox } from "@heroui/checkbox"

export default function CustomPackageCheckbox({
  title,
  weight,
  value,
  selectedValue,
  onChange,
}) {
  const isSelected = value === selectedValue

  return (
    <label
      className={`flex items-center  text-sm justify-between mt-2 p-3 border rounded-lg cursor-pointer 
        ${
          isSelected
            ? 'border-white font-medium text-white bg-redBranding'
            : 'border-gray-200 hover:softGreen hover:bg-softRed'
        }`}
      onClick={() => onChange(value)}
    >
      <div className="flex items-center">
        <Checkbox
          value={value}
          checked={isSelected}
          onChange={() => onChange(value)}
          className="hidden"
        />
        <span className="ml-2">{title}</span>
      </div>
      <div>
        <span>{weight}</span>
      </div>
    </label>
  )
}
