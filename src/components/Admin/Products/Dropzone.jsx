import React from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@nextui-org/button'
import Image from 'next/image'

//work with the add variants images - good one
function Dropzone({ images = [], setImages, onImagesChange = () => {} }) {
  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }))
      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)
      onImagesChange(updatedImages)
    },
    accept: 'image/*',
  })

  const handleRemove = (index) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  return (
    <div className="dropzone-container">
      <div
        {...getRootProps({
          className:
            'dropzone w-full my-4 p-4 border-2 border-dashed rounded-md flex flex-col items-center justify-center',
        })}
      >
        <input {...getInputProps()} />
        {images.length === 0 && (
          <>
            <p>No images found. Drag & Drop your files here</p>
            <Button
              className="mt-3"
              size="sm"
              color="primary"
              type="button"
              onClick={open}
            >
              Browse Files
            </Button>
          </>
        )}
        {Array.isArray(images) && images.length > 0 && (
          <div className="files-preview">
            <h4>Files</h4>
            <ul>
              {images.map((image, index) => (
                <li key={index} className="flex items-center mb-2">
                  <Image
                    src={typeof image === 'string' ? image : image.url}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover mr-2"
                    width={96}
                    height={96}
                  />
                  <Button
                    auto
                    color="danger"
                    size="sm"
                    onClick={() => handleRemove(index)}
                    className="ml-2"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {images.length > 0 && (
        <Button
          className="mt-3"
          size="sm"
          color="primary"
          type="button"
          onClick={open}
        >
          Add More Images
        </Button>
      )}
    </div>
  )
}

export default Dropzone
