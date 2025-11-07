'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Product Information',
    question: 'What is jaggery and how is it different from sugar?',
    answer: 'Jaggery is an unrefined natural sweetener made from sugarcane juice or palm sap. Unlike refined white sugar, jaggery retains essential minerals like iron, magnesium, and potassium. It has a rich, caramel-like flavor and is considered healthier as it undergoes minimal processing.'
  },
  {
    category: 'Product Information',
    question: 'Is your jaggery organic and chemical-free?',
    answer: 'Yes! All our jaggery products are 100% organic and chemical-free. We source directly from certified organic farms that use traditional methods without any synthetic pesticides or chemicals.'
  },
  {
    category: 'Product Information',
    question: 'How should I store jaggery?',
    answer: 'Store jaggery in an airtight container in a cool, dry place away from direct sunlight. Properly stored jaggery can last for 6-12 months. If it becomes hard, you can grate it or warm it slightly to soften.'
  },
  {
    category: 'Orders & Shipping',
    question: 'Do you offer free shipping?',
    answer: 'Yes! We offer free shipping on all orders across India. Your order will be carefully packaged and delivered to your doorstep within 3-5 business days.'
  },
  {
    category: 'Orders & Shipping',
    question: 'How can I track my order?',
    answer: 'Once your order is shipped, you will receive a tracking number via email and SMS. You can use this number to track your order status. You can also check your order status in the "My Orders" section of your account.'
  },
  {
    category: 'Orders & Shipping',
    question: 'Can I modify or cancel my order?',
    answer: 'You can cancel your order within 24 hours of placement if it hasn\'t been shipped yet. Please contact our customer support immediately. Once shipped, orders cannot be cancelled, but you can initiate a return after delivery.'
  },
  {
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major payment methods including Credit/Debit Cards, UPI, Net Banking, and Digital Wallets. All transactions are secured with industry-standard encryption.'
  },
  {
    category: 'Payment',
    question: 'Do you offer Cash on Delivery (COD)?',
    answer: 'Currently, we only accept online payments for faster order processing. However, we ensure 100% secure transactions through trusted payment gateways.'
  },
  {
    category: 'Returns & Refunds',
    question: 'What is your return policy?',
    answer: 'We offer a 7-day return policy from the date of delivery. Products must be unused and in their original packaging. Contact our support team to initiate a return. Refunds will be processed within 5-7 business days after we receive the returned product.'
  },
  {
    category: 'Returns & Refunds',
    question: 'What if I receive a damaged product?',
    answer: 'We take great care in packaging, but if you receive a damaged product, please contact us immediately with photos. We will arrange for a replacement or full refund at no additional cost to you.'
  },
  {
    category: 'Usage & Health',
    question: 'Can diabetic patients consume jaggery?',
    answer: 'While jaggery has a lower glycemic index than white sugar, it still contains sugars and can affect blood glucose levels. Diabetic patients should consult their doctor before consuming jaggery and use it in moderation if approved.'
  },
  {
    category: 'Usage & Health',
    question: 'How much jaggery should I consume daily?',
    answer: 'We recommend consuming 10-15 grams of jaggery per day as part of a balanced diet. Excessive consumption may lead to weight gain due to its calorie content.'
  },
  {
    category: 'Usage & Health',
    question: 'Can pregnant women consume jaggery?',
    answer: 'Yes, jaggery is generally safe for pregnant women in moderate amounts. It can help prevent anemia due to its iron content. However, we always recommend consulting with your healthcare provider regarding dietary choices during pregnancy.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  
  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg body-text max-w-2xl mx-auto">
            Find answers to common questions about our premium organic jaggery products, 
            orders, shipping, and more.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-amber-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <div className="flex-1 pr-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full mb-2">
                    {faq.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                {openIndex === index ? (
                  <ChevronUpIcon className="h-6 w-6 text-amber-600 flex-shrink-0" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 body-text">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-amber-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-lg body-text mb-6">
            Our customer support team is here to help you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="mailto:support@dfoods.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-amber-600 text-base font-medium rounded-md text-amber-600 bg-white hover:bg-amber-50 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

