import { Link } from '@remix-run/react';
import clsx from 'clsx';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="py-4">
      <ol className="flex items-center gap-2 text-sm text-ua-grey">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.href ? (
              <>
                <Link
                  to={item.href}
                  className="text-ua-grey hover:text-ua-dark transition-colors"
                >
                  {item.label}
                </Link>
                {index < items.length - 1 && (
                  <span className="text-ua-grey">/</span>
                )}
              </>
            ) : (
              <>
                <span className="text-ua-dark font-medium">{item.label}</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
