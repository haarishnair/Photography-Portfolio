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
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    async function loadGallery() {
      // Fetch images tagged "project_<ID>"
      const tag = `project_${id}`;
      const remoteImages = await fetchImagesByTag(tag);

      const fetchedImages = remoteImages.map(img => ({
        thumbnail: getCloudinaryUrl(img.public_id, { width: 800 }),
        full: getCloudinaryUrl(img.public_id, { width: 1920 })
      }));
      setImages(fetchedImages);
      setLoading(false);
    }
    loadGallery();
  }, [id]);

  const goPrev = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

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
            {images.map((imgObj, index) => (
              <img
                key={index}
                src={imgObj.thumbnail}
                alt={`${projectTitle} ${index + 1}`}
                className="project_image clickable"
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </Masonry>
        )}

        {selectedImageIndex !== null && (
          <div className="lightbox" onClick={() => setSelectedImageIndex(null)}>
            <span className="lightbox-close" onClick={() => setSelectedImageIndex(null)}>&times;</span>

            <div className="lightbox-nav-left" onClick={goPrev}>
              &#10094;
            </div>

            <img
              src={images[selectedImageIndex].full}
              alt={`${projectTitle} fullscreen`}
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="lightbox-nav-right" onClick={goNext}>
              &#10095;
            </div>

            <div className="lightbox-counter">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProjectPage;
