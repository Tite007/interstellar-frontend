// components/CustomPackageCheckbox.jsx

import React from 'react'
import { Checkbox } from '@nextui-org/checkbox'

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
      className={`flex items-center text-sm justify-between mt-2 p-3 border rounded-lg cursor-pointer 
        ${
          isSelected
            ? 'border-blue-500 bg-blue-100'
            : 'border-gray-200 hover:bg-gray-100'
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
