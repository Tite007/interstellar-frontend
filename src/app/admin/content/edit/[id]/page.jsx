'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter, useParams } from 'next/navigation'
import { Input, Textarea } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { Tabs, Tab } from '@nextui-org/tabs'
import Dropzone from '@/src/components/Admin/Content/Dropzone'
import BreadcrumbsContent from '@/src/components/Admin/Content/BreadcrumbsContent'
import { toast } from 'sonner'
import Image from 'next/image'

// Dynamically import the Editor component with no SSR
const Editor = dynamic(
  () => import('@tinymce/tinymce-react').then((mod) => mod.Editor),
  { ssr: false },
)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function EditContentPage() {
  const [headline, setHeadline] = useState('')
  const [images, setImages] = useState([])
  const [datePublished, setDatePublished] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [authorUrl, setAuthorUrl] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('')
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [keywords, setKeywords] = useState('')
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      const fetchContent = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/content/${id}`)
          if (!res.ok) throw new Error('Failed to fetch content')
          const data = await res.json()

          setHeadline(data.headline)
          setImages(data.image || [])
          setDatePublished(
            new Date(data.datePublished).toISOString().slice(0, 10),
          )
          setAuthorName(data.author[0]?.name || '')
          setAuthorUrl(data.author[0]?.url || '')
          setContent(data.content)
          setStatus(data.status)
          setTitle(data.seo?.title || '')
          setExcerpt(data.seo?.excerpt || '')
          setKeywords(data.seo?.keywords || '')
        } catch (error) {
          console.error('Error fetching content:', error)
        }
      }

      fetchContent()
    }
  }, [id])

  const handleSave = async (status) => {
    try {
      const newImages = images.filter((image) => image.file)
      const formData = new FormData()
      newImages.forEach((image) => {
        formData.append('images', image.file)
      })

      let uploadedImages = []
      if (newImages.length > 0) {
        const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) throw new Error('Failed to upload images')
        uploadedImages = await uploadRes.json()
      }

      const allImages = [
        ...images.filter((image) => !image.file),
        ...uploadedImages.map((image) => image.url),
      ]

      const existingContentRes = await fetch(`${API_BASE_URL}/content/${id}`)
      if (!existingContentRes.ok)
        throw new Error('Failed to fetch existing content')
      const existingContent = await existingContentRes.json()

      const existingImages = existingContent.image || []

      const imagesToDelete = existingImages.filter(
        (existingImage) =>
          !allImages.some((newImage) => newImage === existingImage),
      )

      if (imagesToDelete.length > 0) {
        await fetch(`${API_BASE_URL}/delete-images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ images: imagesToDelete }),
        })
      }

      const res = await fetch(`${API_BASE_URL}/content/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          headline,
          image: allImages,
          datePublished,
          dateModified: new Date(),
          author: [{ name: authorName, url: authorUrl, type: 'Person' }],
          content,
          status,
          seo: {
            title,
            excerpt,
            keywords,
          },
        }),
      })
      if (!res.ok) throw new Error('Failed to save content')
      router.push('/content')
    } catch (error) {
      console.error('Error saving content:', error)
    }
  }

  const handleDeleteImage = async (image) => {
    const imageUrl = typeof image === 'string' ? image : image.url
    if (!imageUrl) {
      console.error('Invalid image:', image)
      return
    }

    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await fetch(`${API_BASE_URL}/delete-images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ images: [imageUrl] }),
        })

        const updatedImages = images.filter((img) => img !== imageUrl)
        setImages(updatedImages)
        toast('Image deleted successfully!', {})
      } catch (error) {
        console.error('Error deleting image:', error)
        toast('Error deleting image', { type: 'error' })
      }
    }
  }

  return (
    <div className="xl:container mt-4">
      <BreadcrumbsContent />
      <div className="xl:container mt-5 bg-white p-4 rounded-lg w-full">
        <h1 className="text-2xl mt-2 font-semibold text-gray-700 mb-5">
          Edit Content
        </h1>
        <Tabs aria-label="Options">
          <Tab key="content" title="Content">
            <div>
              <Input
                label="Headline"
                radius="md"
                size="sm"
                placeholder="Enter headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                variant="faded"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  className="mt-4"
                  radius="md"
                  size="sm"
                  variant="faded"
                  type="date"
                  label="Date Published"
                  value={datePublished}
                  onChange={(e) => setDatePublished(e.target.value)}
                />
                <Input
                  className="mt-4"
                  variant="faded"
                  radius="md"
                  size="sm"
                  label="Author Name"
                  placeholder="Enter author name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
                <Input
                  variant="faded"
                  label="Author URL"
                  radius="md"
                  size="sm"
                  placeholder="Enter author URL"
                  value={authorUrl}
                  onChange={(e) => setAuthorUrl(e.target.value)}
                />
              </div>
              <Dropzone images={images} setImages={setImages} />

              <div>
                {images.map((image, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <Image
                      src={typeof image === 'string' ? image : image.url}
                      alt={`Preview ${index}`}
                      className="w-24 h-24 object-cover mr-2 mb-4"
                      width={96}
                      height={96}
                    />
                    <Button
                      auto
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteImage(image)}
                      className="ml-2"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
              <Editor
                apiKey="bt4hfpy9rn587suxgn8e2kyvfetkop2lw712usvwzj7rnrq5"
                value={content}
                init={{
                  plugins: 'link image code',
                  toolbar:
                    'undo redo | bold italic | alignleft aligncenter alignright | code',
                }}
                onEditorChange={(newContent) => setContent(newContent)}
              />
            </div>
          </Tab>
          <Tab key="seo" title="SEO">
            <div>
              <Input
                label="Title"
                radius="md"
                size="sm"
                placeholder="Enter SEO title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="faded"
              />
              <Textarea
                label="Excerpt"
                radius="md"
                size="sm"
                placeholder="Enter SEO excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                variant="faded"
                className="mt-4"
              />
              <Input
                label="Keywords"
                radius="md"
                size="sm"
                placeholder="Enter SEO keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                variant="faded"
                className="mt-4"
              />
            </div>
          </Tab>
        </Tabs>
        <div className="flex justify-end gap-4 mt-4">
          <Button onClick={() => handleSave('draft')}>Save as Draft</Button>
          <Button color="success" onClick={() => handleSave('published')}>
            Publish
          </Button>
        </div>
      </div>
    </div>
  )
}
