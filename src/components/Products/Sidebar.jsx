// src/components/Products/Sidebar.jsx
import React from 'react'
import { Checkbox } from '@nextui-org/checkbox'

const Sidebar = ({
  categories,
  roastLevels,
  countries,
  onSelectCategory,
  onClearFilter,
  selectedCategory, // New prop for selected category
  selectedRoastLevel, // New prop for selected roast level
  selectedCountry, // New prop for selected country
}) => {
  const handleCheckboxChange = (type, value) => {
    if (type === 'category' && selectedCategory === value) {
      onClearFilter('category')
    } else if (type === 'roastLevel' && selectedRoastLevel === value) {
      onClearFilter('roastLevel')
    } else if (type === 'country' && selectedCountry === value) {
      onClearFilter('country')
    } else {
      onSelectCategory(type, value)
    }
  }

  return (
    <div className=" w-72 p-6 items-center justify-center border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Filters</h3>

      <div className="mb-4 border p-4 rounded-lg">
        <h4 className="text-lg font-semibold mb-2">Categories</h4>
        <button
          onClick={() => onClearFilter('category')}
          className="text-blue-500 mb-2"
        >
          Clear
        </button>
        <ul>
          {categories.map((category) => (
            <li key={category} className="mb-2">
              <Checkbox
                isSelected={selectedCategory === category}
                onChange={() => handleCheckboxChange('category', category)}
              >
                {category}
              </Checkbox>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4 border p-4 rounded-lg ">
        <h4 className="text-lg font-semibold mb-2">Roast Levels</h4>
        <button
          onClick={() => onClearFilter('roastLevel')}
          className="text-blue-500 mb-2"
        >
          Clear
        </button>
        <ul>
          {roastLevels.map((level) => (
            <li key={level} className="mb-2">
              <Checkbox
                isSelected={selectedRoastLevel === level}
                onChange={() => handleCheckboxChange('roastLevel', level)}
              >
                {level}
              </Checkbox>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4 border p-4 rounded-lg">
        <h4 className="text-lg font-semibold mb-2">Countries</h4>
        <button
          onClick={() => onClearFilter('country')}
          className="text-blue-500 mb-2"
        >
          Clear
        </button>
        <ul>
          {countries.map((country) => (
            <li key={country} className="mb-2">
              <Checkbox
                isSelected={selectedCountry === country}
                onChange={() => handleCheckboxChange('country', country)}
              >
                {country}
              </Checkbox>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
