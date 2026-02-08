'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@gatewaytokorea.com',
      link: 'mailto:support@gatewaytokorea.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+82 2-1234-5678',
      link: 'tel:+8221234567',
    },
    {
      icon: MapPin,
      title: 'Office',
      value: 'Seoul, South Korea',
      link: null,
    },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--off-white)]">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm">
            <div className="w-20 h-20 bg-[var(--success)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="w-10 h-10 text-[var(--success)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--deep-navy)] mb-4">Message Sent!</h1>
            <p className="text-[var(--warm-gray)] mb-8">
              Thank you for reaching out. We'll get back to you within 24-48 hours.
            </p>
            <Link href="/">
              <Button variant="primary">Back to Home</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-[var(--warm-gray)] hover:text-[var(--leica-orange)] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--deep-navy)] mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-[var(--warm-gray)] max-w-2xl mx-auto">
            Have questions about studying in Korea? We're here to help you every step of the way.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--leica-orange)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-[var(--leica-orange)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--deep-navy)] mb-1">{info.title}</h3>
                    {info.link ? (
                      <a href={info.link} className="text-[var(--warm-gray)] hover:text-[var(--leica-orange)] transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-[var(--warm-gray)]">{info.value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Office Hours */}
            <div className="bg-gradient-to-br from-[var(--leica-orange)]/10 to-[var(--leica-gold)]/10 rounded-xl p-6">
              <h3 className="font-semibold text-[var(--deep-navy)] mb-3">Office Hours</h3>
              <div className="space-y-2 text-[var(--warm-gray)]">
                <p>Monday - Friday: 9:00 AM - 6:00 PM (KST)</p>
                <p>Saturday: 10:00 AM - 2:00 PM (KST)</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-[var(--leica-orange)]" />
                <h2 className="text-2xl font-bold text-[var(--deep-navy)]">Send us a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="John Doe"
                      className="w-full h-11 px-4 bg-[var(--off-white)] border border-[var(--leica-gold)] rounded text-[var(--deep-navy)] placeholder:text-[var(--warm-gray)]/60 focus:outline-none focus:border-2 focus:border-[var(--leica-orange)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-11 px-4 bg-[var(--off-white)] border border-[var(--leica-gold)] rounded text-[var(--deep-navy)] placeholder:text-[var(--warm-gray)]/60 focus:outline-none focus:border-2 focus:border-[var(--leica-orange)]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => updateField('subject', e.target.value)}
                    placeholder="How can we help you?"
                    className="w-full h-11 px-4 bg-[var(--off-white)] border border-[var(--leica-gold)] rounded text-[var(--deep-navy)] placeholder:text-[var(--warm-gray)]/60 focus:outline-none focus:border-2 focus:border-[var(--leica-orange)]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    className="w-full px-4 py-3 bg-[var(--off-white)] border border-[var(--leica-gold)] rounded text-[var(--deep-navy)] placeholder:text-[var(--warm-gray)]/60 focus:outline-none focus:border-2 focus:border-[var(--leica-orange)] resize-none"
                    required
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[var(--deep-navy)] text-white/60 text-center py-6 mt-16">
        <p>© 2026 Gateway to Korea. All rights reserved.</p>
      </footer>
    </div>
  );
}
