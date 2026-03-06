import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  // const { connected, publicKey } = useWallet();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/explore") {
      return location.pathname === "/" || location.pathname === "/explore";
    }
    return location.pathname === path;
  };

  return (
    <nav className="w-full bg-casino-bg border-b border-casino-border">
      <div className="max-w-19xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Left Section - Logo + Navigation Links */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-white hover:opacity-80 transition-opacity"
              >
                <img
                  src="/atomicnetwork.png"
                  alt="Atomiq Network"
                  className="w-28 object-contain"
                />
              </Link>
            </div>

            {/* Desktop Navigation - Aligned to the left next to logo */}
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-6">
                <Link
                  to="/about"
                  className={`py-1 text-base font-aeonik font-medium transition-colors ${
                    isActive("/about")
                      ? "text-white border-b-2 border-white"
                      : "text-white hover:text-gray-300"
                  }`}
                >
                  About
                </Link>
                <Link
                  to="/"
                  className={`py-1 text-base font-aeonik font-medium transition-colors ${
                    isActive("/explore")
                      ? "text-white border-b-2 border-white"
                      : "text-white hover:text-gray-300"
                  }`}
                >
                  Explore
                </Link>
                <Link
                  to="/faq"
                  className={`py-1 text-base font-aeonik font-medium transition-colors ${
                    isActive("/faq")
                      ? "text-white border-b-2 border-white"
                      : "text-white hover:text-gray-300"
                  }`}
                >
                  FAQ
                </Link>
                <a
                  href="https://casino.atomiq.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1 text-base font-aeonik font-medium text-white hover:text-gray-300 transition-colors"
                >
                  Casino
                </a>
              </div>
            </div>
          </div>

          {/* Desktop Right Section - Social Icons */}
          <div className="hidden md:flex items-center">
            <a
              href="https://x.com/TheAtomiqChain"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-gray-300 inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-casino-bg">
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Menu content */}
          <div className="flex flex-col h-full px-6 py-8">
            {/* Navigation Links */}
            <div className="space-y-8 mb-auto">
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className={`block text-2xl font-aeonik font-medium ${
                  isActive("/about")
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                About
              </Link>
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`block text-2xl font-aeonik font-medium ${
                  isActive("/explore")
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Explore
              </Link>
              <Link
                to="/faq"
                onClick={closeMobileMenu}
                className={`block text-2xl font-aeonik font-medium ${
                  isActive("/faq")
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                FAQ
              </Link>
              <a
                href="https://casino.atomiq.network"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="block text-2xl font-aeonik font-medium text-white/70 hover:text-white"
              >
                Casino
              </a>
            </div>

            {/* Bottom section with social */}
            <div>
              <a
                href="https://x.com/TheAtomiqChain"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
