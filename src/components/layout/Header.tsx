'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Browse Schools', href: '/schools' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'de', label: 'Deutsch' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--deep-navy)] h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[var(--leica-orange)] flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-white font-semibold text-lg hidden sm:block">
              Gateway to Korea
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/90 hover:text-white text-sm font-medium transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-[var(--leica-gold)] hover:after:w-full after:transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Language + Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium"
              >
                <Globe className="w-4 h-4" />
                <span>{languages.find(l => l.code === currentLanguage)?.label}</span>
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLanguage(lang.code);
                        setIsLanguageOpen(false);
                      }}
                      className={cn(
                        'w-full text-left px-4 py-2 text-sm hover:bg-[var(--light-cream)]',
                        currentLanguage === lang.code
                          ? 'text-[var(--leica-orange)] font-medium bg-[#FFE082]'
                          : 'text-[var(--deep-navy)]'
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Links */}
            <Link
              href="/login"
              className="text-white/90 hover:text-white text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-[var(--leica-orange)] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#E67E00] transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--deep-navy)] border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-white/90 hover:text-white text-base font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <hr className="border-white/10" />
            <div className="flex items-center gap-4 py-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setCurrentLanguage(lang.code)}
                  className={cn(
                    'text-sm',
                    currentLanguage === lang.code
                      ? 'text-[var(--leica-orange)] font-medium'
                      : 'text-white/70'
                  )}
                >
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>
            <hr className="border-white/10" />
            <div className="flex gap-4 py-2">
              <Link
                href="/login"
                className="text-white/90 hover:text-white text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-[var(--leica-orange)] text-white px-4 py-2 rounded text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
