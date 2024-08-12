// src/utils/imageUtils.js

export const uploadImages = async (images) => {
  const newImages = images.filter((image) => image.file)
  const formData = new FormData()
  newImages.forEach((image) => {
    formData.append('images', image.file)
  })

  if (newImages.length > 0) {
    const uploadRes = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    })

    if (!uploadRes.ok) throw new Error('Failed to upload images')
    return await uploadRes.json()
  }

  return []
}

export const deleteImages = async (images, productId) => {
  if (images.length > 0) {
    await fetch('http://localhost:3001/delete-images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images: images.map((image) => image.url),
        productId,
      }),
    })
  }
}
