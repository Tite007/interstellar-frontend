// CustomCheckbox.jsx

import React from "react";
import { Checkbox, Text, } from "@heroui/checkbox";
import { Card } from "@heroui/card";

export const CustomCheckbox = ({ title, weight, price, value }) => {
    return (
      <div className="p-4 border rounded-lg flex justify-between items-center w-full">
        <Checkbox value={value} className="flex-1">
          <span className="font-bold">{title}</span>
        </Checkbox>
        <div className="flex flex-col items-end">
          <span>{weight}</span>
          <span className="font-bold">${price}</span>
        </div>
      </div>
    );
  };