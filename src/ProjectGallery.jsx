import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from './Navbar';
import Masonry from "react-masonry-css";
import { fetchImagesByTag, getCloudinaryUrl } from './services/cloudinary';

import "./styles/ProjectGallery.css";

const breakpointColumns = {
  default: 3,
  64: 2,
  48: 1,
};

function ProjectPage() {
  const { id } = useParams();
  // Decode the Title from the ID (which is the sanitized filename)
  // Converting Back: "Murder_Mystery" -> "Murder Mystery"
  // Assuming the ID passed is already the public ID part from Projects.jsx
  const projectTitle = id.replace(/_/g, ' ');

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      // Fetch images tagged "project_<ID>"
      const tag = `project_${id}`;
      const remoteImages = await fetchImagesByTag(tag);

      const imageUrls = remoteImages.map(img => getCloudinaryUrl(img.public_id, { width: 1200 }));
      setImages(imageUrls);
      setLoading(false);
    }
    loadGallery();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="project_page">
        <p className="project_title">{projectTitle}</p>

        {loading ? (
          <p style={{ color: "white", textAlign: "center" }}>Loading gallery...</p>
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${projectTitle} ${index + 1}`}
                className="project_image"
              />
            ))}
          </Masonry>
        )}
      </div>
    </>
  );
}

export default ProjectPage;
