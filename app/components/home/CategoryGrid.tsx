import { Link } from '@remix-run/react';

interface Category {
  name: string;
  image: string;
  url: string;
}

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="section-spacing bg-ua-light">
      <div className="container-padding">
        <h2 className="text-3xl md:text-4xl font-bold text-ua-dark text-uppercase mb-12">
          SHOP BY SPORT
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, idx) => (
            <Link
              key={idx}
              to={category.url}
              className="group relative overflow-hidden aspect-square"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-end p-4">
                <h3 className="text-white font-bold text-uppercase text-sm md:text-base">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
