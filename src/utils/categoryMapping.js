// utils/categoryMapping.js

export const mapCategoryAndSubcategory = (product, categories) => {
  let categoryName = 'default-category'
  let subcategoryName = 'default-subcategory'

  if (product.parentCategory) {
    const category = categories.find(
      (cat) => String(cat._id) === String(product.parentCategory),
    )

    if (category) {
      categoryName = category.name

      if (product.subcategory) {
        const subcategory = categories.find(
          (cat) => String(cat._id) === String(product.subcategory),
        )
        if (subcategory) {
          subcategoryName = subcategory.name
        }
      }
    }
  }

  return { categoryName, subcategoryName }
}
