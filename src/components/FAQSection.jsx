import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQSection = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqData = [
    {
      question: "How does the AI decision maker tool work?",
      answer:
        "Choose-Wise uses advanced artificial intelligence to analyze your options based on decision science frameworks. Our AI considers your personal context, weighs pros and cons, and provides personalized recommendations using proven decision-making methodologies from behavioral psychology and strategic planning.",
    },
    {
      question: "Is my personal information safe and private?",
      answer:
        "Absolutely. We prioritize your privacy with enterprise-grade security. Your decisions are processed securely and never stored permanently. We use end-to-end encryption and don't share your personal information with third parties. Each analysis session is completely confidential.",
    },
    {
      question: "What types of decisions can Choose-Wise help with?",
      answer:
        "Our AI advisor excels at career decisions (job offers, career changes), relationship choices, business decisions, educational paths, financial planning, living arrangements, health choices, and major life transitions. Any decision with multiple options can benefit from our analysis.",
    },
    {
      question: "How accurate are the AI recommendations?",
      answer:
        "Our AI provides highly insightful analysis based on proven decision-making frameworks and your specific context. While we can't predict the future, our recommendations help you think through decisions systematically, consider factors you might miss, and make more informed choices with greater confidence.",
    },
    {
      question: "Is Choose-Wise free to use?",
      answer:
        "Yes! Choose-Wise is completely free. We believe everyone deserves access to quality decision-making support. Our mission is to help people make better choices, and we're committed to keeping our core service accessible to all.",
    },
    {
      question: "Can I use Choose-Wise for business decisions?",
      answer:
        "Definitely! Many professionals use Choose-Wise for strategic business decisions, hiring choices, investment options, market entry decisions, and operational planning. Our AI provides objective analysis that's valuable for both personal and professional decision-making.",
    },
    {
      question: "How is this better than making pros/cons lists?",
      answer:
        "While pros/cons lists are useful, Choose-Wise goes deeper by analyzing psychological factors, considering your values and priorities, identifying blind spots, weighing options systematically, and providing actionable next steps. Our AI combines multiple decision-making frameworks for more comprehensive analysis.",
    },
    {
      question: "What if I don't agree with the AI recommendation?",
      answer:
        "That's perfectly fine! Choose-Wise is designed to help you think through decisions, not make them for you. If you disagree with our recommendation, that reaction itself is valuable data about your preferences. Use our analysis as one input among many in your decision-making process.",
    },
  ];

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <p className="faq-subtitle">
          Everything you need to know about using Choose-Wise for better
          decision making
        </p>

        <div className="faq-list">
          {faqData.map((item, index) => (
            <div key={index} className="faq-item">
              <button
                className={`faq-question ${openItems[index] ? "open" : ""}`}
                onClick={() => toggleItem(index)}
                aria-expanded={openItems[index]}
              >
                <span>{item.question}</span>
                {openItems[index] ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {openItems[index] && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faq-cta">
          <h3>Still have questions?</h3>
          <p>
            Try Choose-Wise with your actual decision to see how our AI can help
            you choose wisely.
          </p>
        </div>
      </div>

      {/* Structured data for FAQ rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
};

export default FAQSection;
