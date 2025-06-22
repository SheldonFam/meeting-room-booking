"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  LogOut,
  User,
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  DoorOpen,
  Shield,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface HeaderProps {
  userRole?: "admin" | "user";
  userName?: string;
}

export function Header({ userRole = "user", userName = "Guest" }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();

  const navigationItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "user"],
    },
    {
      href: "/rooms",
      label: "Rooms",
      icon: DoorOpen,
      roles: ["admin", "user"],
    },
    {
      href: "/calendar",
      label: "Calendar",
      icon: CalendarDays,
      roles: ["admin", "user"],
    },
    {
      href: "/admin",
      label: "Admin Panel",
      icon: Shield,
      roles: ["admin"],
    },
    {
      href: "/my-bookings",
      label: "Bookings",
      icon: BookOpen,
      roles: ["admin", "user"],
    },
  ];

  const filteredNavItems = navigationItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm dark:border-gray-800 dark:bg-gray-900/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-xl font-bold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">MB</span>
          </div>
          <span>MyBooking</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:text-blue-600 hover:bg-blue-50 rounded-lg dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800",
                pathname === item.href &&
                  "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-gray-800"
              )}
            >
              <item.icon className="mr-2 h-4 w-4 inline-block align-middle" />
              <span className="align-middle">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button> */}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-2 py-1"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-gray-900 dark:text-gray-100">
                    {userName}
                  </span>
                  <span className="hidden md:inline text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {userRole}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="end">
                <div className="flex flex-col items-start space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {userName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {userRole}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-2">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 hover:bg-blue-50 rounded-lg dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800",
                    pathname === item.href &&
                      "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-gray-800"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="mr-2 h-4 w-4 inline-block align-middle" />
                  <span className="align-middle">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
