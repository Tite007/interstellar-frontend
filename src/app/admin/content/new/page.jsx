'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Input, Textarea } from "@heroui/input"
import { Button } from "@heroui/button"
import { Tabs, Tab } from "@heroui/tabs"
import Dropzone from '@/src/components/Admin/Content/Dropzone'
import BreadcrumbsNewContent from '@/src/components/Admin/Content/BreadcrumbsNewContent'
import Image from 'next/image'

const Editor = dynamic(
  () => import('@tinymce/tinymce-react').then((mod) => mod.Editor),
  { ssr: false },
)

export default function NewContentPage() {
  const [headline, setHeadline] = useState('')
  const [images, setImages] = useState([])
  const [datePublished, setDatePublished] = useState(
    new Date().toISOString().slice(0, 10),
  )
  const [authorName, setAuthorName] = useState('')
  const [authorUrl, setAuthorUrl] = useState('')
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [keywords, setKeywords] = useState('')
  const router = useRouter()

  const handleSave = async (status) => {
    try {
      const newImages = images.filter((image) => image.file)
      const formData = new FormData()
      newImages.forEach((image) => {
        formData.append('images', image.file)
      })

      let uploadedImages = []
      if (newImages.length > 0) {
        const uploadRes = await fetch('http://localhost:3001/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) {
          const errorMessage = await uploadRes.text()
          throw new Error(`Failed to upload images: ${errorMessage}`)
        }
        uploadedImages = await uploadRes.json()
        console.log('Uploaded images:', uploadedImages)
      }

      const allImages = [
        ...images.filter((image) => !image.file),
        ...uploadedImages.map((image) => ({ url: image.url })),
      ]

      const imageUrls = allImages.map((image) => image.url)

      const contentData = {
        headline,
        image: imageUrls, // Ensure images are included correctly
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
      }

      console.log(
        'Saving content with data:',
        JSON.stringify(contentData, null, 2),
      )

      const res = await fetch('http://localhost:3001/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      })
      if (!res.ok) {
        const errorMessage = await res.text()
        throw new Error(`Failed to save content: ${errorMessage}`)
      }
      router.push('/admin/content')
    } catch (error) {
      console.error('Error saving content:', error)
    }
  }

  return (
    <div className="xl:container mt-4">
      <BreadcrumbsNewContent />
      <div className="xl:container mt-5 bg-white p-4 rounded-2xl shadow-md w-full">
        <h1 className="text-2xl mt-4 font-semibold text-gray-700 mb-5">
          Create New Content
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
                variant="flat"
                style={{ fontSize: '16px' }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  className="mt-4"
                  radius="md"
                  size="sm"
                  variant="flat"
                  type="date"
                  label="Date Published"
                  value={datePublished}
                  onChange={(e) => setDatePublished(e.target.value)}
                  style={{ fontSize: '16px' }}
                />
                <Input
                  className="mt-4"
                  variant="flat"
                  radius="md"
                  size="sm"
                  label="Author Name"
                  placeholder="Enter author name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  style={{ fontSize: '16px' }}
                />
                <Input
                  variant="flat"
                  label="Author URL"
                  radius="md"
                  size="sm"
                  placeholder="Enter author URL"
                  value={authorUrl}
                  onChange={(e) => setAuthorUrl(e.target.value)}
                  style={{ fontSize: '16px' }}
                />
              </div>
              <Dropzone images={images} setImages={setImages} />
              <div>
                {images.map((image, index) => (
                  <Image
                    key={index}
                    src={image.preview || image.url}
                    alt={`Preview ${index}`}
                    style={{ width: '100px', marginRight: '10px' }}
                    width={100}
                    height={100}
                  />
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
                variant="flat"
              />
              <Textarea
                label="Excerpt"
                radius="md"
                size="sm"
                placeholder="Enter SEO excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                variant="flat"
                className="mt-4"
              />
              <Input
                label="Keywords"
                radius="md"
                size="sm"
                placeholder="Enter SEO keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                variant="flat"
                className="mt-4"
                style={{ fontSize: '16px' }}
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
