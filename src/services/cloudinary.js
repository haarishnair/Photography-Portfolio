
const CLOUD_NAME = 'dip9ilgql';

/**
 * Fetch list of resources with a specific tag (JSON list)
 * @param {string} tag 
 * @returns {Promise<Array>} List of resources
 */
export async function fetchImagesByTag(tag) {
    try {
        const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch tag: ${tag}`);
        const data = await response.json();
        return data.resources; // Array of { public_id, version, format, width, height, ... }
    } catch (error) {
        console.error("Cloudinary Fetch Error:", error);
        return [];
    }
}

/**
 * Construct a Cloudinary URL from public_id
 * @param {string} publicId 
 * @returns {string} Fully qualified URL
 */
export function getCloudinaryUrl(publicId, options = {}) {
    // Basic URL construction
    // Could add transformations here if needed (e.g. f_auto, q_auto)
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${publicId}`;
}

/**
 * Extract Project Title from Public ID (Convention: folder/Title_With_Underscores)
 * @param {string} publicId 
 */
export function getTitleFromPublicId(publicId) {
    const parts = publicId.split('/');
    const filename = parts[parts.length - 1]; // "Title_With_Underscores" or "image_1"
    // If it's a cover image, the filename IS the title
    return filename.replace(/_/g, ' ');
}
