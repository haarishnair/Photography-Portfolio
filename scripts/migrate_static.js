import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

// --- Configuration ---
const CLOUD_NAME = 'dip9ilgql';
const UPLOAD_PRESET = 'portfolio';

dotenv.config();

async function uploadToCloudinary(imageUrl, publicId) {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append('file', imageUrl);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('public_id', publicId);
    formData.append('tags', 'static_assets');

    try {
        const response = await fetch(url, { method: 'POST', body: formData });
        const result = await response.json();
        if (result.error) {
            console.error(`❌ Error uploading ${publicId}:`, result.error.message);
            return false;
        }
        console.log(`✅ Uploaded: ${publicId}`);
        return true;
    } catch (error) {
        console.error(`❌ Network Error uploading ${publicId}:`, error);
        return false;
    }
}

async function runStaticMigration() {
    console.log("🚀 Starting Static Asset Migration...");

    const envContent = fs.readFileSync('.env', 'utf-8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) envVars[key.trim()] = val.trim();
    });

    const staticMap = {
        'VITE_PHOTO_1': 'static/profile_pic',
        'VITE_PHOTO_2': 'static/featured_metro',
        'VITE_PHOTO_3': 'static/carousel_1',
        'VITE_PHOTO_4': 'static/carousel_2',
        'VITE_PHOTO_5': 'static/carousel_3'
    };

    for (const [envKey, publicId] of Object.entries(staticMap)) {
        const url = envVars[envKey];
        if (url) {
            await uploadToCloudinary(url, publicId);
        } else {
            console.warn(`⚠️ Key ${envKey} not found in .env`);
        }
    }

    console.log("\n✨ Static Migration Complete!");
}

runStaticMigration().catch(console.error);
