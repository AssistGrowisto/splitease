import { useState } from 'react';

interface ProductDetailsProps {
  description: string;
  descriptionHtml?: string;
  features?: string[];
}

export function ProductDetails({
  description,
  descriptionHtml,
  features,
}: ProductDetailsProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    description: true,
    features: false,
    care: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="space-y-4 border-t border-ua-grey pt-6">
      {/* Description */}
      <AccordionSection
        title="DESCRIPTION"
        isOpen={expandedSections.description}
        onToggle={() => toggleSection('description')}
      >
        <div className="text-ua-grey text-sm leading-relaxed">
          {descriptionHtml ? (
            <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          ) : (
            <p>{description}</p>
          )}
        </div>
      </AccordionSection>

      {/* Features */}
      {features && features.length > 0 && (
        <AccordionSection
          title="FEATURES"
          isOpen={expandedSections.features}
          onToggle={() => toggleSection('features')}
        >
          <ul className="space-y-2 text-ua-grey text-sm">
            {features.map((feature, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-ua-dark">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </AccordionSection>
      )}

      {/* Care Instructions */}
      <AccordionSection
        title="CARE INSTRUCTIONS"
        isOpen={expandedSections.care}
        onToggle={() => toggleSection('care')}
      >
        <ul className="space-y-2 text-ua-grey text-sm">
          <li>Machine wash with cold water</li>
          <li>Avoid bleach</li>
          <li>Tumble dry on low heat</li>
          <li>Do not iron print or embroidery</li>
        </ul>
      </AccordionSection>
    </div>
  );
}

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionSection({
  title,
  children,
  isOpen,
  onToggle,
}: AccordionSectionProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 font-bold text-uppercase text-sm tracking-widest border-b border-ua-grey hover:text-ua-grey transition-colors"
      >
        {title}
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>
      {isOpen && <div className="py-4">{children}</div>}
    </div>
  );
}
