import React from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { MoreVertical } from 'lucide-react';

const ActionDropdown = () => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button auto flat icon={<MoreVertical size="20" />} />
      </DropdownTrigger>
      <DropdownMenu aria-label="Actions">
        <DropdownItem key="view">View</DropdownItem>
        <DropdownItem key="edit">Edit</DropdownItem>
        <DropdownItem key="delete">Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
