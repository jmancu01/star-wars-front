"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface Route {
  name: string;
  path: string;
  icon?: string;
}

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const routes: Route[] = [
    { name: "Home", path: "/", icon: "☄️" },
    { name: "Characters", path: "/characters", icon: "👥" },
    { name: "Movies", path: "/movies", icon: "🎬" },
    { name: "Starships", path: "/starships", icon: "🚀" },
    { name: "Planets", path: "/planets", icon: "🌍" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string): boolean => pathname === path;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/90 backdrop-blur-sm" : "bg-black/70"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors duration-300 flex items-center gap-2"
            >
              ⚡ Star Wars Hub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 group ${
                  isActive(route.path)
                    ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                    : "text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-400"
                }`}
              >
                <span className="transform group-hover:scale-110 transition-transform duration-200">
                  {route.icon}
                </span>
                <span className="relative">
                  {route.name}
                  {isActive(route.path) && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-400 rounded-full"></span>
                  )}
                </span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/20 focus:outline-none transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ${
          isOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-black/95 backdrop-blur-sm">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                isActive(route.path)
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-400"
              } flex items-center gap-2`}
              onClick={() => setIsOpen(false)}
            >
              <span>{route.icon}</span>
              {route.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
