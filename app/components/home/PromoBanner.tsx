import { Link } from '@remix-run/react';
import { Button } from '../ui/Button';

interface PromoBannerProps {
  image: string;
  title: string;
  description?: string;
  ctaText: string;
  ctaUrl: string;
  backgroundColor?: string;
}

export function PromoBanner({
  image,
  title,
  description,
  ctaText,
  ctaUrl,
  backgroundColor = 'bg-ua-dark',
}: PromoBannerProps) {
  return (
    <section className={`section-spacing ${backgroundColor}`}>
      <div className="container-padding">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="text-ua-light">
            <h2 className="text-4xl md:text-5xl font-bold text-uppercase mb-4 leading-tight">
              {title}
            </h2>
            {description && (
              <p className="text-lg text-ua-grey mb-8">{description}</p>
            )}
            <Link to={ctaUrl}>
              <Button variant="primary" size="lg">
                {ctaText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
