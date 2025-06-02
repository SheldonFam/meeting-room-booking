"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ReactNode } from "react";

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function DropdownItem({
  children,
  onClick,
  className,
}: DropdownItemProps) {
  return (
    <MenuItem>
      <button
        onClick={onClick}
        className={`block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden ${
          className || ""
        }`}
      >
        {children}
      </button>
    </MenuItem>
  );
}

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({
  trigger,
  children,
  align = "right",
  className,
}: DropdownProps) {
  return (
    <Menu
      as="div"
      className={`relative inline-block text-left ${className || ""}`}
    >
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
          {trigger}
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 size-5 text-gray-400"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className={`absolute ${
          align === "right" ? "right-0" : "left-0"
        } z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in`}
      >
        <div className="py-1">{children}</div>
      </MenuItems>
    </Menu>
  );
}
