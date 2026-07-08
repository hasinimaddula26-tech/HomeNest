import React from 'react';

interface Testimonial {
  stars: number;
  quote: string;
  author: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    stars: 5,
    quote: "Finally my family's documents, expenses, and reminders are in one place. No more searching through dozens of WhatsApp groups.",
    author: "Priya Sharma",
    role: "Mother of three & Homemaker",
  },
  {
    stars: 5,
    quote: "Managing utility bills and grocery tracking has never been this simple. I love that everyone can check off items on the shopping list in real-time.",
    author: "Arjun Verma",
    role: "Software Engineer",
  },
  {
    stars: 5,
    quote: "Our emergency contacts and insurance papers are securely vault-stored. It gives us peace of mind knowing they are always accessible.",
    author: "Meera Nair",
    role: "Retired Professor",
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-slate-50 border-t border-slate-200/50">
      <div className="w-full max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-secondary mb-4">
            Loved by modern families
          </h2>
          <p className="text-slate-600 text-base md:text-lg">
            See how HomeNest is helping households coordinate their daily chores and files.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex gap-1 text-amber-400 mb-6">
                  {Array.from({ length: test.stars }).map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
                {/* Quote */}
                <p className="text-slate-600 text-sm italic leading-relaxed mb-6">
                  "{test.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="border-t border-slate-100 pt-4 mt-2">
                <p className="text-sm font-bold text-secondary">{test.author}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{test.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
