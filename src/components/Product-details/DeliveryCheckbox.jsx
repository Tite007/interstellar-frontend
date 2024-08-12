"use client";
import React, { useEffect } from "react";
import { Checkbox } from "@nextui-org/checkbox";
import { Truck } from "lucide-react";
import classNames from "classnames";

const DeliveryCheckbox = ({ options, selectedOption, onChange }) => {
  useEffect(() => {
    if (!selectedOption && options.length > 0) {
      onChange(options[0].value); // Set the first option as default if none is selected
    }
  }, [selectedOption, options, onChange]);

  return (
    <div className="flex flex-col gap-4">
      {options.map((option) => (
        <label
          key={option.value}
          className={classNames(
            "inline-flex w-full max-w-md bg-content1 p-2 border-2 rounded-lg cursor-pointer",
            selectedOption === option.value
              ? "border-primary bg-blue-100"
              : "border-transparent hover:bg-content2"
          )}
          onClick={() => {
            if (selectedOption === option.value) {
              onChange(""); // Deselect the option if it's already selected
            } else {
              onChange(option.value); // Select the option
            }
          }}
        >
          <div className="flex items-center gap-4 w-full">
            <Truck size={32} strokeWidth={1.5} absoluteStrokeWidth />
            <div className="flex flex-col">
              <span className="font-bold">{option.label}</span>
              <span className="text-sm text-gray-500">{option.subtitle}</span>
              <span className="text-sm text-gray-500">
                {option.description}
              </span>
            </div>
          </div>
          <Checkbox
            value={option.value}
            checked={selectedOption === option.value}
            className="hidden"
            onChange={() => {}}
          />
        </label>
      ))}
    </div>
  );
};

export default DeliveryCheckbox;
