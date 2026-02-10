'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage, languages } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  const currentLang = languages.find(l => l.code === language);

  const navItems = [
    { label: t('nav.schools'), href: '/schools' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.faq'), href: '/faq' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--md-surface)] h-16 md-elevation-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo + Language Selector */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[var(--md-radius-md)] bg-[var(--md-primary)] flex items-center justify-center">
                <span className="text-[var(--md-on-primary)] font-medium text-base">IB</span>
              </div>
              <span className="text-[var(--md-on-surface)] font-medium md-title-large hidden sm:block">
                InBeam Test
              </span>
            </Link>

            {/* Language Flags - Desktop */}
            <div className="hidden md:flex items-center gap-1 ml-4 pl-4 border-l border-[var(--md-outline-variant)]">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    'w-9 h-9 rounded-[var(--md-radius-full)] flex items-center justify-center text-xl transition-all',
                    language === lang.code
                      ? 'bg-[var(--md-primary-container)] ring-2 ring-[var(--md-primary)] scale-110'
                      : 'hover:bg-[var(--md-surface-variant)] opacity-70 hover:opacity-100'
                  )}
                  title={lang.label}
                >
                  {lang.flag}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)] md-label-large transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-[var(--md-primary)] hover:after:w-full after:transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pl-3 pr-2 rounded-[var(--md-radius-full)] hover:bg-[var(--md-surface-variant)] transition-colors border border-[var(--md-outline-variant)]"
                >
                  <span className="text-sm font-medium text-[var(--md-on-surface)]">
                    {user.firstName || user.email?.split('@')[0]}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[var(--md-primary-container)] flex items-center justify-center text-[var(--md-on-primary-container)]">
                    <User className="w-4 h-4" />
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[var(--md-outline-variant)] py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 border-b border-[var(--md-outline-variant)]">
                        <p className="text-sm font-medium text-[var(--md-on-surface)] truncate">
                          {user.email}
                        </p>
                        <p className="text-xs text-[var(--md-on-surface-variant)] capitalize mt-0.5">
                          {user.role} Account
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--md-on-surface)] hover:bg-[var(--md-surface-variant)]"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        {isAdmin() && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--md-on-surface)] hover:bg-[var(--md-surface-variant)]"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-[var(--md-outline-variant)] py-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="md-btn-text"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/register"
                  className="md-btn-filled"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[var(--md-on-surface)] p-2 rounded-[var(--md-radius-full)] hover:bg-[var(--md-surface-variant)] transition-colors"
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
        <div className="md:hidden bg-[var(--md-surface)] border-t border-[var(--md-outline-variant)] md-elevation-1">
          <div className="px-4 py-4 space-y-2">
            {/* User Info Mobile */}
            {user && (
              <div className="mb-4 pb-4 border-b border-[var(--md-outline-variant)]">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-[var(--md-primary-container)] flex items-center justify-center text-[var(--md-on-primary-container)]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--md-on-surface)]">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-[var(--md-on-surface-variant)]">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Language Selector */}
            <div className="flex items-center justify-center gap-2 py-3 border-b border-[var(--md-outline-variant)] mb-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    'w-10 h-10 rounded-[var(--md-radius-full)] flex items-center justify-center text-xl transition-all',
                    language === lang.code
                      ? 'bg-[var(--md-primary-container)] ring-2 ring-[var(--md-primary)] scale-110'
                      : 'hover:bg-[var(--md-surface-variant)] opacity-60'
                  )}
                  title={lang.label}
                >
                  {lang.flag}
                </button>
              ))}
            </div>

            {/* Current Language Display */}
            <div className="text-center mb-2">
              <span className="md-body-small text-[var(--md-on-surface-variant)]">
                {t('nav.currentLanguage')}: {currentLang?.flag} {currentLang?.label}
              </span>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-[var(--md-on-surface)] md-body-large py-3 px-4 rounded-[var(--md-radius-sm)] hover:bg-[var(--md-surface-variant)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {user && (
              <Link
                key="/profile"
                href="/profile"
                className="block text-[var(--md-on-surface)] md-body-large py-3 px-4 rounded-[var(--md-radius-sm)] hover:bg-[var(--md-surface-variant)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            )}

            <hr className="border-[var(--md-outline-variant)] my-2" />

            <div className="flex gap-3 px-4 py-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="md-btn-outlined w-full text-center text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  Sign out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="md-btn-outlined flex-1 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    href="/register"
                    className="md-btn-filled flex-1 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
