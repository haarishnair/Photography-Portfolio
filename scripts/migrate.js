import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
// Hardcoded based on user input, normally in .env
const CLOUD_NAME = 'dip9ilgql';
const UPLOAD_PRESET = 'portfolio'; // Assuming unsigned upload is allowed

// Map your .env ImageKit URLs here by reading the .env file manually or using dotenv
dotenv.config();

// Initialize Cloudinary (Unsigned doesn't need API Key/Secret for upload, BUT
// for scripting bulk migrations it is HIGHLY recommended to use signed uploads if possible.
// Use unsigned for now as per constraints.
// WAIT: The user did NOT give me API Key/Secret. 
// I must use Unsigned Upload.
// Unsigned upload: `cloudinary.uploader.unsigned_upload`
// BUT: The Node.js SDK `cloudinary.v2` usually expects API Key/Secret for `uploader.upload`.
// Unsigned upload is usually client-side.
// LET'S TRY: standard upload with no auth? No, that won't work server-side.
// I will fetch the images and print instructions if I fail.
// ACTUALLY: The user created the cloud, they can get the API Key/Secret.
// I'll try to use the `fetch` API directly for unsigned upload if the SDK fails.

// Re-reading user prompt: "I want to migrate... You have the URLs".
// "Cloud name: dip9ilgql", "Upload preset name: portfolio".
// NO API KEY/SECRET PROVIDED.
// I MUST USE UNSIGNED UPLOAD via raw HTTP fetch.

const projectData = [
  { 
    id: 1, 
    title: "Murder Mystery Speed Dating Event",
    cover: "VITE_PHOTO_6",
    range: [[6, 32]] // VITE_PHOTO_6 to 32
  },
  { 
    id: 2, 
    title: "Bangkok",
    cover: "VITE_PHOTO_33", // inferred
    range: [[33, 37]]
  },
  { 
    id: 3, 
    title: "Kuala Lumpur",
    cover: "VITE_PHOTO_2",
    range: ["VITE_PHOTO_2", [38, 44]] // VITE_PHOTO_2, then 38-44
  },
  { 
    id: 4, 
    title: "TE Appreciation & Networking Event",
    cover: "VITE_PHOTO_49",
    range: [[45, 173]]
  },
  { 
    id: 5, 
    title: "Around the World Event",
    cover: "VITE_PHOTO_174",
    range: [[174, 204]]
  },
];

async function uploadToCloudinary(imageUrl, publicId, tags) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', imageUrl);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('public_id', publicId);
  // Flatten tags array to comma-separated string if needed, or append multiple times
  // Cloudinary API takes comma separated string
  formData.append('tags', tags.join(','));
  
  // Naming: public_id will be explicit
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    if (result.error) {
      console.error(`❌ Error uploading ${publicId}:`, result.error.message);
      return false;
    }
    console.log(`✅ Uploaded: ${publicId} (Tags: ${tags.join(', ')})`);
    return true;
  } catch (error) {
    console.error(`❌ Network Error uploading ${publicId}:`, error);
    return false;
  }
}

async function runMigration() {
  console.log("🚀 Starting Migration...");
  
  // 1. Resolve all ENV variables to actual URLs
  const envContent = fs.readFileSync('.env', 'utf-8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const [key, val] = line.split('=');
    if (key && val) envVars[key.trim()] = val.trim();
  });

  for (const project of projectData) {
    console.log(`\n📂 Processing: ${project.title}`);
    const safeTitle = project.title.replace(/[^a-zA-Z0-9]/g, '_'); // simple sanitize
    
    // 1. Upload Cover
    const coverKey = project.cover;
    const coverUrl = envVars[coverKey];
    if (coverUrl) {
        // Tag 'portfolio_cover' means "Use this for the main list"
        // Also tag 'project_PROJECTID' so it appears in the gallery too? 
        // Usually cover is IN the gallery.
        // Public ID: project_covers/Title
        await uploadToCloudinary(coverUrl, `project_covers/${safeTitle}`, ['portfolio_cover', `project_${safeTitle}`]);
    }

    // 2. Upload Gallery Images
    const imagesToUpload = [];
    
    project.range.forEach(rangeItem => {
      if (Array.isArray(rangeItem)) {
         for (let i = rangeItem[0]; i <= rangeItem[1]; i++) {
             imagesToUpload.push(`VITE_PHOTO_${i}`);
         }
      } else {
         // Single ID like "VITE_PHOTO_2"
         // or logic: if it's a number treat as ID, string treat as key
         if (typeof rangeItem === 'string' && rangeItem.startsWith('VITE')) {
            imagesToUpload.push(rangeItem);
         } else {
             // It's a number
             imagesToUpload.push(`VITE_PHOTO_${rangeItem}`); // Assuming logic from ProjectGallery
         }
      }
    });

    for (let i = 0; i < imagesToUpload.length; i++) {
        const key = imagesToUpload[i];
        const url = envVars[key];
        if (!url) {
            console.warn(`⚠️ Warning: ${key} not found in .env`);
            continue;
        }
        
        // Naming: projects/Title/image_1, image_2...
        // Tag: project_Title
        const fileName = `image_${i + 1}`;
        await uploadToCloudinary(url, `projects/${safeTitle}/${fileName}`, [`project_${safeTitle}`]);
    }
  }
  
  console.log("\n✨ Migration Complete!");
}

runMigration().catch(console.error);
