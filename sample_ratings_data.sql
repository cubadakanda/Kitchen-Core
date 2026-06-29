-- Insert sample data for testing rating functionality
-- Pastikan users dan recipes sudah ada di database

-- Sample ratings data
INSERT INTO recipe_ratings (user_id, recipe_id, rating, review_text, created_at) VALUES
(1, 1, 5, 'Resep nasi goreng yang luar biasa! Sangat mudah diikuti dan hasilnya sempurna.', '2024-01-15 10:30:00'),
(2, 1, 4, 'Enak banget! Cuma kurang sedikit garam menurut saya.', '2024-01-16 14:20:00'),
(3, 1, 5, 'Recipe terbaik yang pernah saya coba. Keluarga semua suka!', '2024-01-17 19:45:00'),
(1, 2, 4, 'Spaghetti carbonara yang creamy dan lezat.', '2024-01-18 12:15:00'),
(2, 2, 5, 'Perfect! Persis seperti di restoran Italia.', '2024-01-19 20:30:00'),
(4, 2, 3, 'Lumayan enak, tapi agak terlalu creamy untuk selera saya.', '2024-01-20 13:10:00'),
(1, 3, 5, 'Rendang terenak yang pernah saya buat sendiri!', '2024-01-21 16:45:00'),
(3, 3, 5, 'Bumbu-bumbunya pas semua. Daging empuk banget.', '2024-01-22 11:20:00'),
(4, 3, 4, 'Sangat autentik rasanya. Recommended!', '2024-01-23 15:35:00'),
(2, 3, 5, 'Resep warisan nenek yang terjaga keasliannya.', '2024-01-24 18:00:00');

-- Check if data inserted correctly
SELECT 
    rr.id,
    rr.rating,
    rr.review_text,
    rr.created_at,
    u.name as user_name,
    r.title as recipe_title
FROM recipe_ratings rr
LEFT JOIN users u ON rr.user_id = u.id
LEFT JOIN recipes r ON rr.recipe_id = r.id
ORDER BY rr.created_at DESC;

-- Check rating statistics
SELECT 
    COUNT(*) as total_ratings,
    AVG(rating) as average_rating,
    rating,
    COUNT(*) as count_per_rating
FROM recipe_ratings 
GROUP BY rating 
ORDER BY rating;

-- Check recipes with their ratings
SELECT 
    r.id,
    r.title,
    COUNT(rr.id) as rating_count,
    AVG(rr.rating) as avg_rating
FROM recipes r
LEFT JOIN recipe_ratings rr ON r.id = rr.recipe_id
GROUP BY r.id, r.title
ORDER BY avg_rating DESC, rating_count DESC;
