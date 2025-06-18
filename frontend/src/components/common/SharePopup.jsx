import React from 'react';
import { shareRecipe, copyRecipeLink, shareToSocialMedia } from '../../services/shareService';

const SharePopup = ({ recipe, isOpen, onClose, onShareComplete }) => {
  if (!isOpen || !recipe) return null;

  const handleShareAction = async (action, platform = null) => {
    let result;
    try {
      switch (action) {
        case 'copy':
          result = await copyRecipeLink(recipe.id);
          break;
        case 'social':
          result = shareToSocialMedia(recipe.id, platform, recipe.title);
          break;
        default:
          result = await shareRecipe(recipe.id);
      }
      
      onShareComplete(result.message);
      onClose();
    } catch (error) {
      onShareComplete('Failed to share recipe. Please try again.');
      onClose();
    }
  };

  return (
    <div className="share-popup-overlay" onClick={onClose}>
      <div className="share-popup" onClick={(e) => e.stopPropagation()}>
        <div className="share-popup-header">
          <h3><i className="fas fa-share-alt mr-2"></i>Share Recipe</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="share-popup-content">
          <h4>{recipe.title}</h4>
          <p className="recipe-share-description">
            {recipe.description ? recipe.description.substring(0, 100) + '...' : 'Share this amazing recipe with your friends and family!'}
          </p>
          <div className="share-options">
            <button 
              className="share-option copy-link"
              onClick={() => handleShareAction('copy')}
              title="Copy link to clipboard"
            >
              <i className="fas fa-link"></i>
              Copy Link
            </button>
            <button 
              className="share-option whatsapp"
              onClick={() => handleShareAction('social', 'whatsapp')}
              title="Share on WhatsApp"
            >
              <i className="fab fa-whatsapp"></i>
              WhatsApp
            </button>
            <button 
              className="share-option facebook"
              onClick={() => handleShareAction('social', 'facebook')}
              title="Share on Facebook"
            >
              <i className="fab fa-facebook"></i>
              Facebook
            </button>
            <button 
              className="share-option twitter"
              onClick={() => handleShareAction('social', 'twitter')}
              title="Share on Twitter"
            >
              <i className="fab fa-twitter"></i>
              Twitter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;
