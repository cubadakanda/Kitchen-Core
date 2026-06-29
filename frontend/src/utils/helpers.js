export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/default-recipe.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:3001${imagePath}`;
};
