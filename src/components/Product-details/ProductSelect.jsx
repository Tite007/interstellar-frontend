// components/CustomSelect.jsx
import React from "react";
import { Select, SelectItem } from "@heroui/select";

const ProductSelect = ({ label, placeholder, options, onChange, selected }) => {
  return (
    <Select
      label={label}
      placeholder={placeholder}
      selectedKeys={selected}
      onSelectionChange={onChange}
      className="max-w-xs">
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {`${option.title} - $${option.price}`}
        </SelectItem>
      ))}
    </Select>
  );
};

export default ProductSelect;
