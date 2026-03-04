import { useState } from 'react';
import clsx from 'clsx';

interface GalleryImage {
  url: string;
  altText?: string;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const selectedImage = images[selectedImageIndex] || { url: '', altText: title };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:w-24">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={clsx(
              'flex-shrink-0 w-20 h-20 md:w-24 md:h-24 border-2 transition-colors',
              selectedImageIndex === index
                ? 'border-ua-dark'
                : 'border-transparent hover:border-ua-grey',
            )}
          >
            <img
              src={image.url}
              alt={image.altText || `${title} view ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 bg-gray-100 aspect-square overflow-hidden">
        <img
          src={selectedImage.url}
          alt={selectedImage.altText || title}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
