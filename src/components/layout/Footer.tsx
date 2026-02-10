'use client';

import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    platform: [
      { label: t('footer.browseSchools'), href: '/schools' },
      { label: t('footer.aboutUs'), href: '/about' },
      { label: t('footer.faq'), href: '/faq' },
      { label: t('footer.contact'), href: '/contact' },
    ],
    legal: [
      { label: t('footer.privacy'), href: '/privacy' },
      { label: t('footer.terms'), href: '/terms' },
    ],
    account: [
      { label: t('footer.signIn'), href: '/login' },
      { label: t('footer.createAccount'), href: '/register' },
    ],
  };

  return (
    <footer className="bg-[var(--md-surface-variant)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--md-primary)] rounded-[var(--md-radius-md)] flex items-center justify-center">
                <span className="text-[var(--md-on-primary)] font-medium text-base">IB</span>
              </div>
              <span className="md-title-large text-[var(--md-on-surface)]">InBeam Test</span>
            </Link>
            <p className="text-[var(--md-on-surface-variant)] md-body-medium leading-relaxed mb-4">
              {t('footer.description')}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[var(--md-on-surface-variant)]">
                <Mail className="w-5 h-5" />
                <a href="mailto:support@inbeamtest.com" className="md-body-medium hover:text-[var(--md-primary)] transition-colors">
                  support@inbeamtest.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-[var(--md-on-surface-variant)]">
                <MapPin className="w-5 h-5" />
                <span className="md-body-medium">Seoul, South Korea</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="md-title-medium text-[var(--md-on-surface)] mb-4">{t('footer.platform')}</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--md-on-surface-variant)] hover:text-[var(--md-primary)] transition-colors md-body-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="md-title-medium text-[var(--md-on-surface)] mb-4">{t('footer.account')}</h3>
            <ul className="space-y-3">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--md-on-surface-variant)] hover:text-[var(--md-primary)] transition-colors md-body-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="md-title-medium text-[var(--md-on-surface)] mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--md-on-surface-variant)] hover:text-[var(--md-primary)] transition-colors md-body-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--md-outline-variant)] mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--md-on-surface-variant)] md-body-small">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[var(--md-on-surface-variant)] hover:text-[var(--md-primary)] md-label-large transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-[var(--md-on-surface-variant)] hover:text-[var(--md-primary)] md-label-large transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
