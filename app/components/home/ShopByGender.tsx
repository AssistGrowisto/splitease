import { Link } from '@remix-run/react';
import { Button } from '../ui/Button';

interface ShopByGenderProps {
  menImage?: string;
  womenImage?: string;
}

export function ShopByGender({
  menImage = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  womenImage = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
}: ShopByGenderProps) {
  return (
    <section className="section-spacing">
      <div className="container-padding">
        <h2 className="text-3xl md:text-4xl font-bold text-ua-dark text-uppercase mb-12">
          SHOP BY GENDER
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Shop Men */}
          <div className="group relative overflow-hidden aspect-video md:aspect-square">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
              style={{
                backgroundImage: `url(${menImage})`,
              }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <h3 className="text-white font-bold text-3xl md:text-4xl text-uppercase">
                SHOP MEN
              </h3>
              <Link to="/collections/mens">
                <Button variant="primary" size="lg">
                  EXPLORE
                </Button>
              </Link>
            </div>
          </div>

          {/* Shop Women */}
          <div className="group relative overflow-hidden aspect-video md:aspect-square">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
              style={{
                backgroundImage: `url(${womenImage})`,
              }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <h3 className="text-white font-bold text-3xl md:text-4xl text-uppercase">
                SHOP WOMEN
              </h3>
              <Link to="/collections/womens">
                <Button variant="primary" size="lg">
                  EXPLORE
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
