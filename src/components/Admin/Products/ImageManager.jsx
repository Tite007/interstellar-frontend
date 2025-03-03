// src/components/Admin/Products/ImageManager.jsx
import { Button } from '@heroui/button'
import Image from 'next/image'
import Dropzone from './Dropzone'
import { useProduct } from '@/src/context/ProductContext'
import { toast } from 'sonner'

const ImageManager = () => {
  const { images, updateImages, product } = useProduct()

  const handleDeleteImage = async (image) => {
    const imageUrl = typeof image === 'string' ? image : image.url
    if (window.confirm('Are you sure you want to delete this image?')) {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/delete-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: [imageUrl], productId: product._id }),
      })
      const updatedImages = images.filter((img) => img.url !== imageUrl)
      updateImages(updatedImages)
      toast('Image deleted successfully!')
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-6 bg-white pr-4 pl-4 border shadow-md rounded-2xl pt-5 pb-10">
      <div>
        <label>Upload new product images</label>
        <Dropzone images={images} setImages={updateImages} />
      </div>
      <div>
        <h4>Uploaded Images</h4>
        <ul>
          {images.map((image, index) => (
            <li key={index} className="flex items-center mb-2">
              <Image
                src={image.url}
                alt={`Preview ${index}`}
                width={96}
                height={96}
              />
              <Button
                color="danger"
                size="sm"
                onClick={() => handleDeleteImage(image)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ImageManager
