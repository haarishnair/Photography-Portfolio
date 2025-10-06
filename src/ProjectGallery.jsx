import { useParams } from "react-router-dom";
import Navbar from './Navbar';
import Masonry from "react-masonry-css";

import "./styles/ProjectGallery.css";

function generateImages(...ranges) {
  const images = [];

  ranges.forEach((range) => {
    if (Array.isArray(range)) {
      // Handle range [start, end]
      const [start, end] = range;
      for (let i = start; i <= end; i++) {
        const key = `VITE_PHOTO_${i}`;
        if (import.meta.env[key]) {
          images.push(import.meta.env[key]);
        }
      }
    } else {
      // Handle single numbers
      const key = `VITE_PHOTO_${range}`;
      if (import.meta.env[key]) {
        images.push(import.meta.env[key]);
      }
    }
  });

  return images;
}

const projectData = {
  1: {
    title: "Murder Mystery Speed Dating Event",
    images: generateImages([6, 32]), 
  },
  2: {
    title: "Bangkok",
    images: generateImages([33, 37]),
  },
  3: {
    title: "Kuala Lumpur",
    images: generateImages(2, [38, 44]), 
  },
  4: {
    title: "TE Appreciation & Networking Event",
    images: generateImages([45, 173]), 
  },

};

const breakpointColumns = {
  default: 3,  
  64: 2,       
  48: 1,    
};

function ProjectPage() {
  const { id } = useParams();
  const project = projectData[id];

  if (!project) {
    return <p style={{ color: "white" }}>Project not found</p>;
  }

  return (
    <>
      <Navbar />
      <div className="project_page">
        <p className="project_title">{project.title}</p>

        <Masonry
          breakpointCols={breakpointColumns}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {project.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${project.title} ${index + 1}`}
              className="project_image"
            />
          ))}
        </Masonry>
      </div>
    </>
  );
}

export default ProjectPage;
