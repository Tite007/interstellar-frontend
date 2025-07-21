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
    throw new Error('Failed to fetch product data')
  }
}

// Fetch all reviews for a product
async function fetchProductReviews(productId) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/getByProduct/${productId}`,
    )
    return response.data
  } catch (error) {
    return []
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
    .replace(/'/g, '`')
    .replace(/\s+/g, ' ')
    .trim()
}

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
  const { category, subcategory, productSlug } = await params
  const productId = (await searchParams).productId

  const productData = await fetchProductDetails(productId)
  const reviews = await fetchProductReviews(productId)
  const { categoryName, subcategoryName } =
    mapCategoryAndSubcategory(productData)

  const variantSnippet =
    productData.variants?.length > 0
      ? ` Available in ${productData.size}, ${productData.variants.map((v) => v.optionValues.map((ov) => ov.value).join(', ')).join(', ')}.`
      : ` Available in ${productData.size}.`
  const reviewSnippet =
    reviews.length > 0
      ? ` Rated ${(
          reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          reviews.length
        ).toFixed(
          1,
        )}/5 based on ${reviews.length} review${reviews.length > 1 ? 's' : ''}.`
      : ''
  const title = `${productData.name || 'Product'} | ${categoryName} | ${subcategoryName} | Muchio Shop`
  const description = `${productData.seoDescription || productData.description || 'No description available.'}${variantSnippet}${reviewSnippet}`

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
  const { category, subcategory, productSlug } = await params
  const productId = (await searchParams).productId

  const productData = await fetchProductDetails(productId)
  const reviews = await fetchProductReviews(productId)
  const { categoryName, subcategoryName } =
    mapCategoryAndSubcategory(productData)

  // JSON-LD structured data with ProductGroup and variants
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    name: productData.name || 'Unnamed Product',
    description: prepareDescription(productData.description),
    sku: productData.sku || 'N/A',
    brand: {
      '@type': 'Brand',
      name: productData.brand || 'Muchio Shop',
    },
    productGroupID: productData.sku || 'N/A',
    variesBy: ['https://schema.org/size'],
    hasVariant: [
      {
        '@type': 'Product',
        name: `${productData.name || 'Unnamed Product'} - ${productData.size || 'N/A'}`,
        image:
          productData.images?.length > 0
            ? productData.images
            : ['/default-og-image.jpg'],
        description: prepareDescription(productData.description),
        sku: productData.sku || 'N/A',
        size: productData.size || 'N/A',
        offers: {
          '@type': 'Offer',
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${category}/${subcategory}/${productSlug}?productId=${productId}`,
          priceCurrency: 'USD',
          price: productData.price ? productData.price.toFixed(2) : '0.00',
          availability:
            productData.currentStock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          priceValidUntil: new Date(
            productData.expirationDate || Date.now() + 30 * 24 * 60 * 60 * 1000,
          )
            .toISOString()
            .split('T')[0],
        },
      },
      ...(productData.variants?.map((variant) => ({
        '@type': 'Product',
        name: `${productData.name || 'Unnamed Product'} - ${variant.optionValues[0].value}`,
        image:
          variant.images?.length > 0
            ? variant.images
            : productData.images?.length > 0
              ? productData.images
              : ['/default-og-image.jpg'],
        description: prepareDescription(productData.description),
        sku: `${productData.sku || 'N/A'}-${variant.optionValues[0].value}`,
        size: variant.optionValues[0].value,
        offers: {
          '@type': 'Offer',
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${category}/${subcategory}/${productSlug}?productId=${productId}&variant=${variant.optionValues[0].value}`,
          priceCurrency: 'USD',
          price: variant.optionValues[0].price
            ? variant.optionValues[0].price.toFixed(2)
            : '0.00',
          availability:
            variant.optionValues[0].quantity > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          priceValidUntil: new Date(
            productData.expirationDate || Date.now() + 30 * 24 * 60 * 60 * 1000,
          )
            .toISOString()
            .split('T')[0],
        },
      })) || []),
    ],
    ...(reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (
          reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          reviews.length
        ).toFixed(1),
        reviewCount: reviews.length,
      },
      review: reviews.map((review) => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating || '4',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: review.user.name || 'Unknown Reviewer',
        },
        reviewBody: review.comment || '',
        datePublished: new Date(review.time).toISOString().split('T')[0],
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
      <div itemScope itemType="https://schema.org/ProductGroup">
        <meta itemProp="name" content={productData.name || 'Unnamed Product'} />
        <meta
          itemProp="description"
          content={prepareDescription(productData.description)}
        />
        <meta itemProp="productGroupID" content={productData.sku || 'N/A'} />
        <div itemProp="brand" itemScope itemType="https://schema.org/Brand">
          <meta itemProp="name" content={productData.brand || 'Muchio Shop'} />
        </div>
        {/* Base Product */}
        <div
          itemProp="hasVariant"
          itemScope
          itemType="https://schema.org/Product"
        >
          <meta
            itemProp="name"
            content={`${productData.name || 'Unnamed Product'} - ${productData.size || 'N/A'}`}
          />
          <meta
            itemProp="image"
            content={productData.images?.[0] || '/default-og-image.jpg'}
          />
          <meta itemProp="sku" content={productData.sku || 'N/A'} />
          <meta itemProp="size" content={productData.size || 'N/A'} />
          <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <meta
              itemProp="url"
              content={`${process.env.NEXT_PUBLIC_BASE_URL}/categories/${category}/${subcategory}/${productSlug}?productId=${productId}`}
            />
            <meta itemProp="priceCurrency" content="USD" />
            <meta
              itemProp="price"
              content={
                productData.price ? productData.price.toFixed(2) : '0.00'
              }
            />
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
        </div>
        {/* Variants */}
        {productData.variants?.map((variant) => (
          <div
            key={variant._id}
            itemProp="hasVariant"
            itemScope
            itemType="https://schema.org/Product"
          >
            <meta
              itemProp="name"
              content={`${productData.name || 'Unnamed Product'} - ${variant.optionValues[0].value}`}
            />
            <meta
              itemProp="image"
              content={
                variant.images?.[0] ||
                productData.images?.[0] ||
                '/default-og-image.jpg'
              }
            />
            <meta
              itemProp="sku"
              content={`${productData.sku || 'N/A'}-${variant.optionValues[0].value}`}
            />
            <meta itemProp="size" content={variant.optionValues[0].value} />
            <div
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <meta
                itemProp="url"
                content={`${process.env.NEXT_PUBLIC_BASE_URL}/categories/${category}/${subcategory}/${productSlug}?productId=${productId}&variant=${variant.optionValues[0].value}`}
              />
              <meta itemProp="priceCurrency" content="USD" />
              <meta
                itemProp="price"
                content={
                  variant.optionValues[0].price
                    ? variant.optionValues[0].price.toFixed(2)
                    : '0.00'
                }
              />
              <meta
                itemProp="availability"
                content={
                  variant.optionValues[0].quantity > 0
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
          </div>
        ))}
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
