// src/components/FAQSection.js
import React, { useState } from 'react';
import './FAQSection.css';

const faqs = [
  {
    question: "What is Krutsha?",
    answer: "Krutsha is an AI-powered study partner that helps students learn better, 24/7.",
  },
  {
    question: "Is Krutsha free?",
    answer: "Yes, Krutsha offers a free version with core features accessible to all students.",
  },
  {
    question: "What subjects does Krutsha support?",
    answer: "Krutsha supports a wide range of subjects including Math, Science, and more.",
  },
  {
  question: "How is Krutsha different from other learning apps?",
  answer: "Unlike others, Krutsha uses personalized AI to adapt to each student's needs, offering 24x7 support tailored for them."
}
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (<div class="page-wrapper">
    <section id ="faq" className="faq-section">
      <div className="faq-container">
        {/* Left Image */}
        <div className="faq-image">
          <img src="/assets/faq.png" alt="FAQ Visual" />
        </div>

        {/* Right Text */}
        <div className="faq-content">
          <h2 className="faq-heading">FAQ</h2>
          {faqs.map((item, index) => (
            <div
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
              key={index}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <span className="faq-number">{index + 1}.</span> {item.question}
              </div>
              {openIndex === index && (
                <div className="faq-answer">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
    </div>
  );
}

export default FAQSection;
