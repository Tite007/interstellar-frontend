// src/app/(customer)/categories/[category]/[subcategory]/[productSlug]/page.jsx
import axios from 'axios'
import MainProductDetailsClient from './MainProductDetailsClient'

// Fetch product details
async function fetchProductDetails(productId) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/findProduct/${productId}`,
      { cache: 'no-store' },
    )
    return response.data
  } catch (error) {
    console.error('Error fetching product:', error)
    throw new Error('Failed to fetch product data')
  }
}

// Fetch review details by ID
async function fetchReviewDetails(reviewId) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/getReview/${reviewId}`,
    )
    return response.data
  } catch (error) {
    console.error(`Error fetching review ${reviewId}:`, error)
    return null // Return null if review fetch fails
  }
}

// Map category and subcategory based on product data
function mapCategoryAndSubcategory(product) {
  let categoryName = 'Specialty Coffee'
  let subcategoryName = 'Coffee'

  if (product?.parentCategory) {
    if (product.parentCategory === '670351ab96bf844ee6763504') {
      categoryName = 'Coffee'
    } else if (product.parentCategory === '67035e95407c1bf49bcf272c') {
      categoryName = 'Snacks & Bakery'
    }
  }

  if (product?.subcategory) {
    if (product.subcategory === '67035c09407c1bf49bcf2720') {
      subcategoryName = 'Specialty Coffee'
    } else if (product.subcategory === '67035ea4407c1bf49bcf2731') {
      subcategoryName = 'Snacks'
    } else if (product.subcategory === '670574babca4093879df787a') {
      subcategoryName = 'Bakery'
    }
  }

  return { categoryName, subcategoryName }
}

// Prepare description for structured data
function prepareDescription(description) {
  if (!description) return 'No description available.'
  return description
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Generate dynamic metadata with Google best practices
export async function generateMetadata({ params, searchParams }) {
  const { category, subcategory, productSlug } = params
  const productId = searchParams.productId

  const productData = await fetchProductDetails(productId)
  const { categoryName, subcategoryName } =
    mapCategoryAndSubcategory(productData)

  // Fetch reviews if they exist
  let reviews = []
  if (productData.reviews && productData.reviews.length > 0) {
    reviews = await Promise.all(
      productData.reviews.map(
        async (reviewId) => await fetchReviewDetails(reviewId),
      ),
    )
    reviews = reviews.filter((review) => review !== null)
  }

  const title = `${productData.name || 'Product'} | ${category} - ${subcategory} | Muchio Shop`
  const reviewSnippet =
    reviews.length > 0
      ? ` Rated ${reviews[0].rating || 'N/A'}/5 by ${reviews[0].user.name || 'a customer'}.`
      : ''
  const description = `${productData.seoDescription || productData.description || 'No description available.'}${reviewSnippet}`

  return {
    title,
    description,
    keywords:
      productData.seoKeywords ||
      'Coffee, Specialty Coffee, El Salvador, Medium Roast',
    openGraph: {
      title,
      description,
      images: [
        {
          url: productData.images?.[0] || '/default-og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${productData.name} - Muchio Shop`,
        },
      ],
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${category}/${subcategory}/${productSlug}?productId=${productId}`,
      type: 'website',
      locale: 'en_US',
      siteName: 'Muchio Shop',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [productData.images?.[0] || '/default-og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  }
}

// Server Component with JSON-LD and Microdata
export default async function Page({ params, searchParams }) {
  const { category, subcategory, productSlug } = params
  const productId = searchParams.productId

  const productData = await fetchProductDetails(productId)
  const { categoryName, subcategoryName } =
    mapCategoryAndSubcategory(productData)

  // Fetch reviews if they exist
  let reviews = []
  if (productData.reviews && productData.reviews.length > 0) {
    reviews = await Promise.all(
      productData.reviews.map(
        async (reviewId) => await fetchReviewDetails(reviewId),
      ),
    )
    reviews = reviews.filter((review) => review !== null)
  }

  // JSON-LD structured data conforming to Google's Product snippet requirements
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productData.name, // Required: Product name
    image: productData.images || ['/default-og-image.jpg'], // Recommended: Product image(s)
    description: prepareDescription(productData.description), // Recommended: Product description
    sku: productData.sku, // Recommended: Stock Keeping Unit
    brand: {
      '@type': 'Brand',
      name: productData.brand || 'Muchio Shop', // Recommended: Brand name
    },
    offers: {
      '@type': 'Offer',
      price: productData.price?.toFixed(2), // Required: Offer price
      priceCurrency: 'USD', // Recommended (required for merchant listings): Currency in ISO 4217 format
      availability:
        productData.currentStock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock', // Recommended: Availability status
      itemCondition: 'https://schema.org/NewCondition', // Recommended: Condition of the item
      priceValidUntil: new Date(
        productData.expirationDate || Date.now() + 30 * 24 * 60 * 60 * 1000,
      ) // Recommended: Price validity (default to 30 days if not specified)
        .toISOString()
        .split('T')[0],
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${category}/${subcategory}/${productSlug}?productId=${productId}`, // Recommended: URL of the offer
    },
    ...(reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (
          reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          reviews.length
        ).toFixed(1), // Recommended: Average rating
        reviewCount: reviews.length, // Recommended: Number of reviews
      },
      review: reviews.map((review) => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating || '4', // Required: Rating value
          bestRating: '5', // Recommended: Best possible rating
        },
        author: {
          '@type': 'Person',
          name: review.user.name || 'Unknown Reviewer', // Required: Author name
        },
        reviewBody: review.comment || '', // Recommended: Review text
        datePublished: new Date(review.time).toISOString().split('T')[0], // Recommended: Publication date
      })),
    }),
  }

  return (
    <section>
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
      />

      {/* Microdata */}
      <div itemScope itemType="https://schema.org/Product">
        <meta itemProp="name" content={productData.name} />
        <meta
          itemProp="description"
          content={prepareDescription(productData.description)}
        />
        <meta itemProp="sku" content={productData.sku} />
        <meta
          itemProp="image"
          content={productData.images?.[0] || '/default-og-image.jpg'}
        />
        <div itemProp="brand" itemScope itemType="https://schema.org/Brand">
          <meta itemProp="name" content={productData.brand || 'Muchio Shop'} />
        </div>
        <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <meta
            itemProp="url"
            content={`${process.env.NEXT_PUBLIC_BASE_URL}/categories/${category}/${subcategory}/${productSlug}?productId=${productId}`}
          />
          <meta itemProp="priceCurrency" content="USD" />
          <meta itemProp="price" content={productData.price?.toFixed(2)} />
          <meta
            itemProp="availability"
            content={
              productData.currentStock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock'
            }
          />
          <meta
            itemProp="itemCondition"
            content="https://schema.org/NewCondition"
          />
          <meta
            itemProp="priceValidUntil"
            content={
              new Date(
                productData.expirationDate ||
                  Date.now() + 30 * 24 * 60 * 60 * 1000,
              )
                .toISOString()
                .split('T')[0]
            }
          />
        </div>
        {reviews.length > 0 && (
          <>
            <div
              itemProp="aggregateRating"
              itemScope
              itemType="https://schema.org/AggregateRating"
            >
              <meta
                itemProp="ratingValue"
                content={(
                  reviews.reduce(
                    (sum, review) => sum + (review.rating || 0),
                    0,
                  ) / reviews.length
                ).toFixed(1)}
              />
              <meta itemProp="reviewCount" content={reviews.length} />
            </div>
            {reviews.map((review) => (
              <div
                key={review._id}
                itemProp="review"
                itemScope
                itemType="https://schema.org/Review"
              >
                <div
                  itemProp="author"
                  itemScope
                  itemType="https://schema.org/Person"
                >
                  <meta
                    itemProp="name"
                    content={review.user.name || 'Unknown Reviewer'}
                  />
                </div>
                <div
                  itemProp="reviewRating"
                  itemScope
                  itemType="https://schema.org/Rating"
                >
                  <meta itemProp="ratingValue" content={review.rating || '4'} />
                  <meta itemProp="bestRating" content="5" />
                </div>
                <meta itemProp="reviewBody" content={review.comment || ''} />
                <meta
                  itemProp="datePublished"
                  content={new Date(review.time).toISOString().split('T')[0]}
                />
              </div>
            ))}
          </>
        )}

        {/* Render the client component */}
        <MainProductDetailsClient initialProduct={productData} />
      </div>
    </section>
  )
}
