// Share Service untuk menghandle sharing recipes
const API_BASE_URL = 'http://localhost:5000';

export const shareRecipe = async (recipeId, shareType = 'link') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recipes/${recipeId}`);
    const recipe = await response.json();
    
    if (shareType === 'link') {
      const shareUrl = `${window.location.origin}/recipe/${recipeId}`;
      
      if (navigator.share) {
        // Use Web Share API if available
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: shareUrl,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        return { success: true, message: 'Link copied to clipboard!' };
      }
    }
    
    return { success: true, message: 'Recipe shared successfully!' };
  } catch (error) {
    console.error('Error sharing recipe:', error);
    return { success: false, message: 'Failed to share recipe' };
  }
};

export const copyRecipeLink = async (recipeId) => {
  try {
    const shareUrl = `${window.location.origin}/recipe/${recipeId}`;
    await navigator.clipboard.writeText(shareUrl);
    return { success: true, message: 'Link copied to clipboard!' };
  } catch (error) {
    console.error('Error copying link:', error);
    return { success: false, message: 'Failed to copy link' };
  }
};

export const shareToSocialMedia = (recipeId, platform, recipeTitle) => {
  const shareUrl = `${window.location.origin}/recipe/${recipeId}`;
  const text = encodeURIComponent(`Check out this amazing recipe: ${recipeTitle}`);
  const url = encodeURIComponent(shareUrl);
  
  let shareLink = '';
  
  switch (platform) {
    case 'facebook':
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case 'twitter':
      shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
      break;
    case 'whatsapp':
      shareLink = `https://wa.me/?text=${text}%20${url}`;
      break;
    case 'telegram':
      shareLink = `https://t.me/share/url?url=${url}&text=${text}`;
      break;
    default:
      return { success: false, message: 'Platform not supported' };
  }
  
  window.open(shareLink, '_blank', 'noopener,noreferrer');
  return { success: true, message: 'Shared successfully!' };
};
