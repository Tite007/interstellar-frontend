// src/app/(customer)/categories/[category]/[subcategory]/[productSlug]/layout.js

// Dynamic metadata with OG image and custom product properties
export async function generateMetadata({ params }) {
  const { category, subcategory, productSlug } = params
  const product = await fetchProductDetails(productSlug)

  // Fallback product data based on your structure
  const fallbackProduct = {
    name: 'Product',
    description: 'Explore our premium products.',
    images: ['/default-og-image.jpg'],
    sku: 'DEFAULT-SKU',
    price: 0.0,
    currentStock: 0,
    reviews: [],
    brand: 'Muchio Shop',
    category: 'Specialty Coffee',
    technicalData: { country: 'N/A', region: 'N/A', tasteNotes: 'N/A' },
    parentCategory: null,
    subcategory: null,
    size: 'N/A',
    compareAtPrice: null,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: 'Coffee, Specialty Coffee, El Salvador, Medium Roast',
    expirationDate: new Date().toISOString(),
  }

  const productData = product || fallbackProduct

  // Calculate aggregate rating if reviews exist
  let aggregateRating = undefined
  if (productData.reviews && productData.reviews.length > 0) {
    const ratingValue =
      productData.reviews.reduce((sum, review) => sum + review.rating || 0, 0) /
      productData.reviews.length
    aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: ratingValue.toFixed(1),
      reviewCount: productData.reviews.length,
    }
  }

  const { categoryName, subcategoryName } =
    mapCategoryAndSubcategory(productData)

  return {
    title: `${productData.name} - Muchio Shop`,
    description:
      productData.seoDescription ||
      productData.description ||
      'Explore our premium products.',
    keywords:
      productData.seoKeywords ||
      'Coffee, Specialty Coffee, El Salvador, Medium Roast',
    openGraph: {
      title: `${productData.name} - Muchio Shop`,
      description:
        productData.seoDescription ||
        productData.description ||
        'Explore our premium products.',
      images: [
        {
          url: productData.images?.[0] || '/default-og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${productData.name} - Muchio Shop`,
        },
      ],
      url: `https://www.interstellar-inc.com/categories/${category}/${subcategory}/${productSlug}?productId=${productSlug}`,
      type: 'website', // Using 'website' to avoid Next.js validation errors
      locale: 'en_US',
      siteName: 'Muchio Shop',
      'product:plural_title': `${productData.name}s` || 'Products', // Custom product property
    },
    twitter: {
      title: `${productData.name} - Muchio Shop`,
      description:
        productData.seoDescription ||
        productData.description ||
        'Explore our premium products.',
      images: [productData.images?.[0] || '/default-og-image.jpg'],
    },
    other: {
      robots:
        'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1', // Google-supported robots meta tag
    },
  }
}

async function fetchProductDetails(productId) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/findProduct/${productId}`,
      { cache: 'no-store' }, // Ensure fresh data
    )
    return await response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

function mapCategoryAndSubcategory(product) {
  let categoryName = 'Specialty Coffee' // Default
  let subcategoryName = 'Coffee' // Default

  if (product?.parentCategory) {
    if (product.parentCategory === '670351ab96bf844ee6763504') {
      categoryName = 'Coffee'
    } else if (product.parentCategory === '67035e95407c1bf49bcf272c') {
      // Based on your data for snacks/bakery
      categoryName = 'Snacks & Bakery'
    }
  }

  if (product?.subcategory) {
    if (product.subcategory === '67035c09407c1bf49bcf2720') {
      subcategoryName = 'Specialty Coffee'
    } else if (product.subcategory === '67035ea4407c1bf49bcf2731') {
      // Snacks
      subcategoryName = 'Snacks'
    } else if (product.subcategory === '670574babca4093879df787a') {
      // Bakery
      subcategoryName = 'Bakery'
    }
  }

  return { categoryName, subcategoryName }
}

// Function to prepare content for JSON-LD and microdata (simplified for products)
function prepareDescription(description) {
  if (!description) return 'No description available.'
  return description
    .replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, "'") // Correctly escaped single quote
    .replace(/ /g, ' ') // Decode non-breaking spaces
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim()
}

export default async function ProductLayout({ children, params }) {
  const { productSlug } = params
  const product = await fetchProductDetails(productSlug)

  // Fallback product data based on your structure
  const fallbackProduct = {
    name: 'Product',
    description: 'Explore our premium products.',
    images: ['/default-og-image.jpg'],
    sku: 'DEFAULT-SKU',
    price: 0.0,
    currentStock: 0,
    reviews: [],
    brand: 'Muchio Shop',
    category: 'Specialty Coffee',
    technicalData: { country: 'N/A', region: 'N/A', tasteNotes: 'N/A' },
    parentCategory: null,
    subcategory: null,
    size: 'N/A',
    compareAtPrice: null,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: 'Coffee, Specialty Coffee, El Salvador, Medium Roast',
    expirationDate: new Date().toISOString(),
  }

  const productData = product || fallbackProduct

  const { categoryName, subcategoryName } =
    mapCategoryAndSubcategory(productData)

  // JSON-LD for structured data - SEO Google Best Practices
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productData.name,
    image: productData.images || [
      productData.images?.[0] || '/default-og-image.jpg',
    ],
    description: prepareDescription(productData.description),
    sku: productData.sku,
    brand: {
      '@type': 'Brand',
      name: productData.brand || 'Muchio Shop',
    },
    category: productData.category || subcategoryName, // Use subcategoryName as fallback for category
    offers: {
      '@type': 'Offer',
      url: `https://www.interstellar-inc.com/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}/${subcategoryName.toLowerCase().replace(/\s+/g, '-')}/${productSlug}?productId=${productSlug}`,
      priceCurrency: 'USD',
      price: productData.price?.toFixed(2) || '0.00',
      availability:
        productData.currentStock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      priceValidUntil: new Date(productData.expirationDate || Date.now())
        .toISOString()
        .split('T')[0], // Use expirationDate if available
    },
    ...(productData.reviews &&
      productData.reviews.length > 0 && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: (
            productData.reviews.reduce(
              (sum, review) => sum + (review.rating || 0),
              0,
            ) / productData.reviews.length
          ).toFixed(1),
          reviewCount: productData.reviews.length,
        },
        review: {
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: productData.reviews[0]?.rating || '4', // Use first review or default
            bestRating: '5',
          },
          author: {
            '@type': 'Person',
            name: productData.reviews[0]?.author || 'Unknown Reviewer', // Adjust based on your reviews structure
          },
        },
      }),
    keywords:
      productData.seoKeywords ||
      'Coffee, Specialty Coffee, El Salvador, Medium Roast, Snacks, Bakery',
    countryOfOrigin: productData.technicalData?.country || 'N/A',
    locationCreated: productData.technicalData?.region || 'N/A',
    publisher: {
      '@type': 'Organization',
      name: 'Muchio Shop',
    },
    copyrightHolder: 'Muchio Shop',
    inLanguage: 'English',
    creativeWorkStatus: 'Published',
    audience: 'Coffee Enthusiasts, Snack Lovers',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.interstellar-inc.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Categories',
          item: 'https://www.interstellar-inc.com/categories',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: categoryName,
          item: `https://www.interstellar-inc.com/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: subcategoryName,
          item: `https://www.interstellar-inc.com/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}/${subcategoryName.toLowerCase().replace(/\s+/g, '-')}`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: productData.name,
          item: `https://www.interstellar-inc.com/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}/${subcategoryName.toLowerCase().replace(/\s+/g, '-')}/${productSlug}`,
        },
      ],
    },
  }

  return (
    <section>
      <div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
        />
      </div>
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
            content={`https://www.interstellar-inc.com/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}/${subcategoryName.toLowerCase().replace(/\s+/g, '-')}/${productSlug}?productId=${productSlug}`}
          />
          <meta itemProp="priceCurrency" content="USD" />
          <meta
            itemProp="price"
            content={productData.price?.toFixed(2) || '0.00'}
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
              new Date(productData.expirationDate || Date.now())
                .toISOString()
                .split('T')[0]
            }
          />
        </div>
        <meta
          itemProp="category"
          content={productData.category || subcategoryName}
        />
        {productData.reviews && productData.reviews.length > 0 && (
          <>
            <div
              itemProp="aggregateRating"
              itemScope
              itemType="https://schema.org/AggregateRating"
            >
              <meta
                itemProp="ratingValue"
                content={(
                  productData.reviews.reduce(
                    (sum, review) => sum + (review.rating || 0),
                    0,
                  ) / productData.reviews.length
                ).toFixed(1)}
              />
              <meta
                itemProp="reviewCount"
                content={productData.reviews.length}
              />
            </div>
            <div
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
                  content={productData.reviews[0]?.author || 'Unknown Reviewer'}
                />
              </div>
              <div
                itemProp="reviewRating"
                itemScope
                itemType="https://schema.org/Rating"
              >
                <meta
                  itemProp="ratingValue"
                  content={productData.reviews[0]?.rating || '4'}
                />
                <meta itemProp="bestRating" content="5" />
              </div>
            </div>
          </>
        )}
        {children}
      </div>
    </section>
  )
}
