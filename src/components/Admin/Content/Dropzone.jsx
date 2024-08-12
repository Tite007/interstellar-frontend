import React from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@nextui-org/button'
import Image from 'next/image'

function Dropzone({ images, setImages }) {
  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      setImages((prevImages) => [
        ...prevImages,
        ...acceptedFiles.map((file) => ({
          file,
          url: URL.createObjectURL(file),
        })),
      ])
    },
    accept: 'image/*',
  })

  const handleRemove = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  return (
    <div className="">
      <div
        {...getRootProps({
          className:
            'dropzone w-1/2 my-4 p-4 border-2 border-dashed rounded-md',
        })}
      >
        <input {...getInputProps()} />
        {images.length === 0 && (
          <>
            <p>Drag & Drop your files here</p>
            <Button
              className="mt-3"
              size="sm"
              color="primary"
              type="button"
              onClick={open}
            >
              Browse File
            </Button>
          </>
        )}

        {images.length > 0 && (
          <div>
            <h4>Files</h4>
            <ul>
              {images.map((image, index) => (
                <li key={index} className="flex items-center">
                  <Image
                    src={image.file ? image.url : image}
                    alt={`Preview ${index}`}
                    style={{ width: '100px', marginRight: '10px' }}
                    width={100}
                    height={100}
                  />
                  <Button
                    auto
                    color="danger"
                    onClick={() => handleRemove(index)}
                    style={{ marginLeft: '10px' }}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dropzone
