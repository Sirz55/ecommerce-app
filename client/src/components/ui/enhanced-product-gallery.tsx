import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Zoom } from "react-zoom-pan-pinch";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  onUpload?: (file: File) => void;
  onImageChange?: (index: number) => void;
  className?: string;
  ariaLabel?: string;
}

export function EnhancedProductGallery({ 
  images, 
  onUpload, 
  onImageChange,
  className = '',
  ariaLabel = 'Product gallery'
}: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setUploadError(null);

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      setIsUploading(false);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file');
      setIsUploading(false);
      return;
    }

    if (onUpload) {
      try {
        await onUpload(file);
        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
        });
      } catch (error) {
        setUploadError('Failed to upload image');
        toast({
          title: 'Error',
          description: 'Failed to upload image',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  useEffect(() => {
    if (onImageChange) {
      onImageChange(activeImage);
    }
  }, [activeImage, onImageChange]);

  return (
    <div 
      className={cn(
        'relative',
        className
      )}
      ref={containerRef}
      aria-label={ariaLabel}
    >
      {/* Main Image */}
      <div 
        className="relative w-full aspect-square mb-4"
        aria-label="Main product image"
        role="img"
        aria-describedby="image-description"
      >
        <Image
          src={images[activeImage]}
          alt="Product main image"
          fill
          className="object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => setShowZoom(true)}
          priority
        />
        <p id="image-description" className="sr-only">
          {images[activeImage]}
        </p>
        
        {/* Image Comparison */}
        {showComparison && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="relative w-full aspect-square">
              <div className="absolute inset-0 bg-white bg-opacity-50" />
              <div className="absolute inset-0 flex">
                <div className="w-1/2 relative">
                  <Image
                    src={images[activeImage]}
                    alt="Product main image"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-1/2 relative">
                  <Image
                    src={images[(activeImage + 1) % images.length]}
                    alt="Product comparison image"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowComparison(false)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {showZoom && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden">
            <Zoom>
              <div className="relative w-full h-full">
                <Image
                  src={images[activeImage]}
                  alt="Product main image"
                  fill
                  className="object-contain"
                />
              </div>
            </Zoom>
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100"
            >
              ×
            </button>
          </div>
        </div>

        {/* Upload Button */}
        {onUpload && (
          <div className="mt-4">
            <label
              htmlFor="image-upload"
              className="flex items-center justify-center w-full h-12 px-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary"
            >
              <div className="text-center">
                <svg
                  className="mx-auto h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mt-1 text-sm text-gray-600">
                  {isUploading ? (
                    <span className="inline-flex items-center">
                      Uploading...
                      <svg
                        className="ml-2 w-4 h-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </span>
                  ) : uploadError ? (
                    <span className="text-red-500">{uploadError}</span>
                  ) : (
                    <span>
                      Click to upload
                      <span className="text-primary">&nbsp;or drag and drop</span>
                    </span>
                  )}
                </p>
              </div>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </div>
        )}
      )}

      {/* Thumbnail Images */}
      <div 
        className="flex gap-2 overflow-x-auto pb-2"
        aria-label="Image thumbnails"
        role="list"
      >
        {images.map((image, index) => (
          <motion.div
            key={index}
            className={`relative w-20 h-20 cursor-pointer rounded-lg border transition-all ${
              activeImage === index ? "border-primary" : "border-gray-200"
            }`}
            onClick={() => setActiveImage(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            role="listitem"
            aria-selected={activeImage === index}
            aria-label={`Thumbnail ${index + 1}`}
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

      {/* Image Upload */}
      {onUpload && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
          />
        </div>
      )}

      {/* Comparison Button */}
      <button
        onClick={() => setShowComparison(true)}
        className="mt-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
      >
        Compare with Next Image
      </button>
    </div>
  );
}
