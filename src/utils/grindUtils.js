// src/utils/grindUtils.js
import { grindOptions } from '@/src/components/Product-details/data'

export const getGrindLabel = (value) => {
  const option = grindOptions.find((option) => option.value === value)
  return option ? option.label : value // Return the label if found, otherwise return the original value
}
