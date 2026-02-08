'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp, Search, Mail } from 'lucide-react';
import { Input } from '@/components/ui/Input';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What is Gateway to Korea?',
        a: 'Gateway to Korea is a platform that connects international students with educational and career opportunities in South Korea. We provide verified information about Korean universities, help with applications, and offer multilingual support.',
      },
      {
        q: 'Is Gateway to Korea free to use?',
        a: 'Yes! Browsing schools, reading reviews, and accessing basic information is completely free. We may offer premium services in the future for additional support.',
      },
      {
        q: 'Which countries do you support?',
        a: 'We primarily serve students from Europe (including Germany, France, Italy, Spain), Russia, and Central Asia (Kazakhstan, Uzbekistan). Our platform is available in English, Russian, and German.',
      },
    ],
  },
  {
    category: 'Applications',
    questions: [
      {
        q: 'How do I apply to a school through Gateway to Korea?',
        a: 'Each school page has an "Apply Now" button. Some schools allow direct application through our platform, while others will redirect you to their official website. We provide step-by-step guidance throughout the process.',
      },
      {
        q: 'What documents do I need for my application?',
        a: 'Typically, you\'ll need: academic transcripts, language proficiency certificates (TOPIK, IELTS, or TOEFL), recommendation letters, personal statement, and a valid passport. Specific requirements vary by school.',
      },
      {
        q: 'Can I apply to multiple schools at once?',
        a: 'Yes, you can apply to as many schools as you like. We recommend applying to 3-5 schools to maximize your chances of acceptance.',
      },
    ],
  },
  {
    category: 'Studying in Korea',
    questions: [
      {
        q: 'Do I need to speak Korean to study in Korea?',
        a: 'Not necessarily. Many programs, especially at the graduate level, are offered in English. However, learning Korean will significantly enhance your experience and career prospects in Korea.',
      },
      {
        q: 'What is the cost of living in Korea for students?',
        a: 'On average, international students spend $800-1,200 per month including accommodation, food, and transportation. Costs vary by city, with Seoul being the most expensive.',
      },
      {
        q: 'Are there scholarships available for international students?',
        a: 'Yes! Many Korean universities offer scholarships for international students. The Korean Government Scholarship Program (KGSP) is particularly popular. Check individual school pages for specific scholarship information.',
      },
    ],
  },
  {
    category: 'Career & Jobs',
    questions: [
      {
        q: 'Can I work while studying in Korea?',
        a: 'Yes, international students can work part-time (up to 20 hours/week during semesters) after completing 6 months of study. Full-time work is allowed during vacations.',
      },
      {
        q: 'What are the job prospects after graduation?',
        a: 'Korea offers excellent job opportunities, especially in tech, engineering, and business. The D-10 visa allows graduates to stay for up to 2 years to seek employment.',
      },
    ],
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q =>
        q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.a.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-[var(--warm-gray)]">
            Find answers to common questions about studying in Korea
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <Input
            icon="search"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xl mx-auto"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-8">
          {filteredFaqs.map((category, catIndex) => (
            <div key={catIndex}>
              <h2 className="text-xl font-bold text-[var(--leica-orange)] mb-4">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((faq, faqIndex) => {
                  const itemId = `${catIndex}-${faqIndex}`;
                  const isOpen = openItems.includes(itemId);

                  return (
                    <div key={faqIndex} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-[var(--deep-navy)] pr-4">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-[var(--leica-orange)] flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[var(--warm-gray)] flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 text-[var(--warm-gray)] leading-relaxed border-t border-gray-100 pt-4">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-[var(--warm-gray)]">No questions found matching "{searchTerm}"</p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 bg-white rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-[var(--deep-navy)] mb-2">Still have questions?</h2>
          <p className="text-[var(--warm-gray)] mb-6">Our team is here to help you</p>
          <Link href="/contact">
            <Button variant="primary">
              <Mail className="w-4 h-4 mr-2" />
              Contact Us
            </Button>
          </Link>
        </div>
      </main>

      <footer className="bg-[var(--deep-navy)] text-white/60 text-center py-6 mt-16">
        <p>© 2026 Gateway to Korea. All rights reserved.</p>
      </footer>
    </div>
  );
}
