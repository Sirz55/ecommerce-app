import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  onUpload?: (file: File) => void;
}

export function ProductGallery({ images, onUpload }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Main Image */}
      <div className="relative w-full md:w-3/4 aspect-square">
        <Image
          src={images[activeImage]}
          alt="Product main image"
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Thumbnail Images */}
      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative w-20 h-20 cursor-pointer rounded-lg border transition-all ${
              activeImage === index ? "border-primary" : "border-gray-200"
            }`}
            onClick={() => setActiveImage(index)}
          >
            <Image
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
