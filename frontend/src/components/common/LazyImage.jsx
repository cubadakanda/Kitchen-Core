import React, { useState, useEffect } from 'react';

const LazyImage = ({ src, alt, className, style, fallbackSrc, onError, ...props }) => {
  const [imageSrc, setImageSrc] = useState(fallbackSrc || '');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const defaultFallback = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

  useEffect(() => {
    if (!src) {
      setImageSrc(fallbackSrc || defaultFallback);
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setImageSrc(fallbackSrc || defaultFallback);
      setIsLoading(false);
      setHasError(true);
      if (onError) onError();
    };
    img.src = src;
  }, [src, fallbackSrc, onError]);

  const handleImageError = () => {
    if (!hasError) {
      setImageSrc(fallbackSrc || defaultFallback);
      setHasError(true);
      if (onError) onError();
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoading ? 'loading' : 'loaded'}`}
      style={{
        ...style,
        opacity: isLoading ? 0.5 : 1,
        transition: 'opacity 0.3s ease',
      }}
      onError={handleImageError}
      {...props}
    />
  );
};

export default LazyImage;
