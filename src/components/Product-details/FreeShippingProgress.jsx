// src/components/FreeShippingProgress.jsx

import React from 'react'
import { Progress } from '@nextui-org/progress'

const FREE_SHIPPING_THRESHOLD = 75

const FreeShippingProgress = ({ cartTotal }) => {
  // Calculate the percentage progress towards the free shipping threshold
  const shippingProgress = Math.min(
    (cartTotal / FREE_SHIPPING_THRESHOLD) * 100,
    100,
  )

  return (
    <div className="mt-4">
      <p className="text-sm mb-2">
        {shippingProgress === 100
          ? 'Congratulations! You qualify for free shipping.'
          : `Spend $${(FREE_SHIPPING_THRESHOLD - cartTotal).toFixed(
              2,
            )} more to qualify for free shipping.`}
      </p>
      <Progress
        aria-label="Free shipping progress"
        size="md"
        value={shippingProgress}
        color={shippingProgress === 100 ? 'success' : 'primary'}
        showValueLabel={true}
        className="max-w-md"
      />
    </div>
  )
}

export default FreeShippingProgress
