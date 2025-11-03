import React, { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Bookmark,
  Home,
  BookOpen,
  User2,
  Settings,
  PlusCircle,
  Trophy,
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  { link: "/", linkIcon: Home, label: "Home" },
  { link: "/add-repo-post", linkIcon: PlusCircle, label: "Create" },
  { link: "/archive", linkIcon: Bookmark, label: "Archive" },
  { link: "/challenges", linkIcon: Trophy, label: "Challenges" }
];

function NavBar({ isLoggedIn }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const rightLinks = [
    { link: "/playlists", linkIcon: BookOpen, label: "Playlists" },
    { link: "/settings", linkIcon: Settings, label: "Settings" },
    {
      link: isLoggedIn ? "/profile" : "/auth/login",
      linkIcon: User2,
      label: isLoggedIn ? "Profile" : "Sign In"
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="w-full fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* LOGO */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <h3 className="text-lg font-semibold hidden sm:block">
                  <span className="text-zinc-400 group-hover:text-blue-400 transition-colors">Byte</span>
                  <span className="text-white group-hover:text-purple-400 transition-colors">List</span>
                </h3>
              </a>
            </div>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link, index) => {
                const Icon = link.linkIcon;
                return (
                  <a
                    key={index}
                    href={link.link}
                    className="group relative px-4 py-2 rounded-lg text-zinc-400 hover:text-white transition-all duration-300 hover:bg-zinc-800/50"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                      <span className="text-sm font-medium hidden lg:block">{link.label}</span>
                    </div>
                    {/* Underline effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </a>
                );
              })}
            </div>

            {/* RIGHT SECTION - DESKTOP */}
            <div className="hidden md:flex items-center space-x-1">
              {rightLinks.map((link, index) => {
                const Icon = link.linkIcon;
                const isAuthLink = link.label === "Sign In" || link.label === "Profile";
                
                return (
                  <a
                    key={index}
                    href={link.link}
                    className={`group relative px-4 py-2 rounded-lg transition-all duration-300 ${
                      isAuthLink 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                      <span className="text-sm font-medium hidden lg:block">{link.label}</span>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-1 bg-zinc-900/50 backdrop-blur-lg border-t border-zinc-800/50">
            {/* Mobile Nav Links */}
            {navLinks.map((link, index) => {
              const Icon = link.linkIcon;
              return (
                <a
                  key={index}
                  href={link.link}
                  className="group flex items-center space-x-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="text-sm font-medium">{link.label}</span>
                </a>
              );
            })}

            {/* Divider */}
            <div className="h-px bg-zinc-800/50 my-2" />

            {/* Mobile Right Links */}
            {rightLinks.map((link, index) => {
              const Icon = link.linkIcon;
              const isAuthLink = link.label === "Sign In" || link.label === "Profile";
              
              return (
                <a
                  key={index}
                  href={link.link}
                  className={`group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isAuthLink 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="text-sm font-medium">{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16" />
    </>
  );
}

export default NavBar;