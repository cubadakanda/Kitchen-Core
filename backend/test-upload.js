// Test script untuk verifikasi upload gambar
// Jalankan dengan: node test-upload.js

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const testImageUpload = async () => {
    try {
        // Buat base64 test image (1x1 pixel red PNG)
        const testBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGAHH8AAA==';
        
        const testData = {
            title: 'Test Recipe with Image',
            description: 'Testing image upload functionality',
            category_id: 1,
            user_id: 1,
            ingredients: 'Test ingredients',
            instructions: 'Test instructions',
            cook_time: 30,
            prep_time: 15,
            servings: 4,
            status: 'published',
            image_data: testBase64,
            image_filename: 'test-image.png',
            image_type: 'image/png'
        };

        console.log('Sending test data to backend...');
        console.log('Base64 length:', testBase64.length);
        
        const response = await fetch('http://localhost:5000/api/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', result);

        if (response.ok) {
            console.log('✅ Test BERHASIL! Gambar berhasil diupload.');
        } else {
            console.log('❌ Test GAGAL!');
        }

    } catch (error) {
        console.error('Error during test:', error);
    }
};

testImageUpload();
