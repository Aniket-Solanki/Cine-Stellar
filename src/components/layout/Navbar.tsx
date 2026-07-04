// Premium glassmorphic Floating Navbar with expanding search bar and user profile dropdown.
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, LogOut, Shield, User as UserIcon, List, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthModalStore, useAuthStore } from "@/lib/store";
import Button from "../ui/button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/discover?type=tv", label: "TV Shows" },
  { href: "/discover?type=movie", label: "Movies" },
  { href: "/discover", label: "Discover" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, setUser } = useAuthStore();
  const { openAuthModal } = useAuthModalStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync user status
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (e) {
        console.error("Auth verify failed", e);
      }
    }
    checkAuth();
  }, [setUser]);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-350 ${
        isScrolled ? "glass-navbar py-3 shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Section: Logo & Nav Links */}
        <div className="flex items-center space-x-10">
          <Link href="/" className="text-2xl font-black text-rose-600 tracking-wider text-glow cursor-pointer">
            CINE<span className="text-white">STELLAR</span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold tracking-wide transition-colors hover:text-rose-500 cursor-pointer ${
                    isActive ? "text-rose-500 font-bold" : "text-zinc-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center space-x-5">
          {/* Animated Expanding Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  type="text"
                  placeholder="Titles, people, genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-zinc-900/90 text-white pl-4 pr-10 py-1.5 rounded-full border border-rose-600/30 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 mr-2"
                  autoFocus
                />
              )}
            </AnimatePresence>
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          {/* User Specific Actions */}
          {user ? (
            <>
              {/* Notification Bell */}
              <button className="hidden sm:block p-1.5 text-zinc-400 hover:text-white transition-colors relative cursor-pointer">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
              </button>

              {/* Avatar & Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-1.5 focus:outline-none cursor-pointer"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.avatar || "premium"}`}
                    alt="avatar"
                    className="h-9 w-9 rounded-full border-2 border-rose-600 bg-zinc-900 p-0.5 object-cover"
                  />
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 rounded-xl glass-panel border border-zinc-800 shadow-xl overflow-hidden py-1 text-sm text-zinc-200"
                    >
                      <div className="px-4 py-2.5 border-b border-zinc-850">
                        <p className="font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                      </div>

                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2 hover:bg-rose-600/10 hover:text-rose-500 transition-colors"
                        >
                          <Shield className="h-4.5 w-4.5" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 hover:bg-zinc-800 transition-colors"
                      >
                        <UserIcon className="h-4.5 w-4.5" />
                        <span>Profile Settings</span>
                      </Link>

                      <Link
                        href="/discover"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 hover:bg-zinc-800 transition-colors"
                      >
                        <List className="h-4.5 w-4.5" />
                        <span>Watchlist</span>
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-left hover:bg-red-500/10 text-red-500 transition-colors border-t border-zinc-850 cursor-pointer"
                      >
                        <LogOut className="h-4.5 w-4.5" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Button variant="primary" size="sm" onClick={() => openAuthModal()}>
              Sign In
            </Button>
          )}

          {/* Mobile Hamburger menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1 text-zinc-400 hover:text-white focus:outline-none cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-zinc-950 border-b border-zinc-850 px-4 pt-2 pb-4 space-y-2 flex flex-col"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-2 text-sm font-semibold hover:text-rose-500 ${
                  pathname === link.href ? "text-rose-500" : "text-zinc-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
