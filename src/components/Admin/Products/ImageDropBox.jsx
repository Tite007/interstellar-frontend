import React, { useState } from 'react'

const ImageDropBox = () => {
  const [files, setFiles] = useState([])

  const handleFiles = (e) => {
    setFiles([...e.target.files])
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white">
        <svg
          className="w-8 h-8"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="M16.7,5.3l-1.9-2c-0.2-0.2-0.5-0.3-0.8-0.3H5.5C4.7,3,4,3.7,4,4.5v11c0,0.8,0.7,1.5,1.5,1.5h9c0.8,0,1.5-0.7,1.5-1.5V6.1
            C16,5.8,16.9,5.5,16.7,5.3z M14.5,6c0.8,0,1.5-0.7,1.5-1.5S15.3,3,14.5,3H12v3H14.5z M5,15l3-3h4l3,3H5z"
          />
        </svg>
        <span className="mt-2 text-base leading-normal">Select a file</span>
        <input
          type="file"
          className="hidden"
          multiple
          onChange={handleFiles}
          accept="image/*"
        />
      </label>
      <div className="mt-4">
        {files.length > 0 && (
          <ul>
            {files.map((file, index) => (
              <li key={index} className="text-sm text-gray-600">
                {file.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ImageDropBox
