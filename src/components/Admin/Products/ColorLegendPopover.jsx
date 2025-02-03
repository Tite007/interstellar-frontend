'use client'
// components/ColorLegendPopover.jsx
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover"
import { Button } from "@heroui/button"
import React from 'react'

export default function ColorLegendPopover() {
  return (
    <Popover placement="right">
      <PopoverTrigger>
        <Button auto color="primary" size="sm">
          Color Legend
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-4 py-2">
          <div className="text-small font-bold mb-2">Expiration Status</div>

          {/* Green color description */}
          <div className="flex items-center mb-2">
            <span
              style={{
                display: 'inline-block',
                width: '15px',
                height: '15px',
                backgroundColor: '#4CAF50',
                borderRadius: '50%',
                marginRight: '10px',
              }}
            ></span>
            <div>Green: More than 60 days to expiration</div>
          </div>

          {/* Yellow color description */}
          <div className="flex items-center mb-2">
            <span
              style={{
                display: 'inline-block',
                width: '15px',
                height: '15px',
                backgroundColor: '#FFC107',
                borderRadius: '50%',
                marginRight: '10px',
              }}
            ></span>
            <div>Yellow: Between 30 and 60 days to expiration</div>
          </div>

          {/* Red color description */}
          <div className="flex items-center">
            <span
              style={{
                display: 'inline-block',
                width: '15px',
                height: '15px',
                backgroundColor: '#F44336',
                borderRadius: '50%',
                marginRight: '10px',
              }}
            ></span>
            <div>Red: Less than 30 days to expiration</div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
