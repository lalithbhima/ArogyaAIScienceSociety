import React from 'react';
import { Quote } from 'lucide-react';

/**
 * Horizontally scrolling testimonial cards — continuous left-to-right loop.
 */
const InfiniteTestimonialGallery = ({ title, subtitle, testimonials }) => {
  const loopItems = [...testimonials, ...testimonials];

  return (
    <div className="w-full">
      <div className="text-center mb-8 px-4">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{title}</h3>
        {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-gray-50 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-gray-50 to-transparent z-10" />

        <div className="testimonial-marquee-viewport">
          <div className="testimonial-marquee-track">
            {loopItems.map((item, index) => (
              <figure
                key={`${item.id}-${index}`}
                className="testimonial-marquee-card"
              >
                <Quote className="h-8 w-8 text-[#23c07e] mb-3 shrink-0 opacity-80" aria-hidden="true" />
                <blockquote className="text-gray-700 text-sm leading-relaxed flex-grow">
                  &ldquo;{item.text}&rdquo;
                </blockquote>
                <figcaption className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium">
                  Summer Program Student
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfiniteTestimonialGallery;
