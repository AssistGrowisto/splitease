import { Link } from '@remix-run/react';
import { Button } from '../ui/Button';

interface HeroBannerProps {
  image: string;
  heading: string;
  subheading?: string;
  ctaText: string;
  ctaUrl: string;
  alignment?: 'center' | 'left' | 'right';
}

export function HeroBanner({
  image,
  heading,
  subheading,
  ctaText,
  ctaUrl,
  alignment = 'center',
}: HeroBannerProps) {
  const alignmentClasses = {
    center: 'items-center justify-center text-center',
    left: 'items-start justify-start text-left',
    right: 'items-end justify-end text-right',
  };

  return (
    <section className="relative w-full h-screen min-h-96 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div
        className={`relative h-full flex flex-col gap-6 container-padding ${alignmentClasses[alignment]}`}
      >
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-ua-light text-uppercase leading-tight mb-4">
            {heading}
          </h1>
          {subheading && (
            <p className="text-lg md:text-xl text-ua-light mb-8">{subheading}</p>
          )}
          <Link to={ctaUrl}>
            <Button variant="primary" size="lg">
              {ctaText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
