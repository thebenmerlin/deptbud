"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg"
              style={{ backgroundColor: "#821910" }}
            ></div>
            <span className="font-bold text-lg hidden sm:inline">
              Budget Portal
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {session?.user && (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {session.user.name}
                </span>
                <button
                  onClick={() =>
                    setTheme(theme === "dark" ? "light" : "dark")
                  }
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-slate-700">
            <div className="flex flex-col gap-2 mt-4">
              {session?.user && (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                    {session.user.name}
                  </div>
                  <button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-left w-full"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="w-4 h-4" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4" />
                        Dark Mode
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
