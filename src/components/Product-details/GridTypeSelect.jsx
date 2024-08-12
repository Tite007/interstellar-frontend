// src/components/Product-details/ProductSelect.jsx
import React from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { grindOptions } from "./data";

const GrindTypeSelect = ({ selectedGrind, onGrindChange }) => {
  return (
    <Select
      color="primary"
      size="md"
      placeholder="Select grind type"
      selectedKeys={selectedGrind ? new Set([selectedGrind]) : undefined}
      onSelectionChange={onGrindChange}
      className="max-w-xs mt-2"
    >
      {grindOptions.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
};

export default GrindTypeSelect;
