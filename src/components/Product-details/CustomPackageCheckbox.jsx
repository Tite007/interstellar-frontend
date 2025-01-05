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
      className={`flex items-center  text-sm justify-between mt-2 p-3 border rounded-lg cursor-pointer 
        ${
          isSelected
            ? 'border-tealGreen font-medium text-white bg-tealGreen'
            : 'border-gray-200 hover:softGreen hover:bg-softGreen'
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
