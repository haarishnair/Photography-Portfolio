import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Navbar from './Navbar';
import './styles/Projects.css';
import { fetchImagesByTag, getCloudinaryUrl, getTitleFromPublicId } from './services/cloudinary';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const covers = await fetchImagesByTag('portfolio_cover');
      // Transform Cloudinary resources into Project objects
      const projectList = covers.map(cover => {
        const title = getTitleFromPublicId(cover.public_id);
        // Use the sanitized title (filename) as the ID for routing
        // e.g. "Murder_Mystery" -> /project/Murder_Mystery
        const id = cover.public_id.split('/').pop();
        return {
          id: id,
          title: title,
          thumbnail: getCloudinaryUrl(cover.public_id)
        };
      });
      setProjects(projectList);
      setLoading(false);
    }
    loadProjects();
  }, []);

  return (
    <>
      <Navbar />
      <section className="portfolio">
        <div className="portfolio_text_container">
          <p className='portfolio_title'>My Projects</p>
          <p className='portfolio_text'>
            Welcome to my portfolio. Here you’ll find a selection of my work.
            Explore my projects to learn more about what I do. Feel free to hover on each image to see the project name.
          </p>
        </div>

        <div className="portfolio_gallery">
          {loading ? (
            <p style={{ color: 'white', textAlign: 'center' }}>Loading projects...</p>
          ) : (
            projects.map((project) => (
              <div className="portfolio_gallery_cover" key={project.id}>
                <Link to={`/project/${project.id}`}>
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="portfolio_gallery_cover_image"
                  />
                  <div className="overlay">
                    <p className="overlay-text">{project.title}</p>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}

export default Projects;
