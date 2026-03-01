
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
 * @param {Object} options Options like { width: 800 }
 * @returns {string} Fully qualified URL
 */
export function getCloudinaryUrl(publicId, options = {}) {
    // Basic URL construction
    const transformations = ['f_auto', 'q_auto'];

    if (options.width) {
        transformations.push(`w_${options.width}`, 'c_limit');
    }

    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations.join(',')}/${publicId}`;
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
