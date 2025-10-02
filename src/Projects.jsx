import { Link } from "react-router-dom";
import Navbar from './Navbar';
import './styles/Projects.css';

function Projects() {
  const projects = [
    { 
      id: 1, 
      title: "Murder Mystery Speed Dating Event", 
      thumbnail: import.meta.env.VITE_PHOTO_6 
    },
    { 
      id: 2, 
      title: "Bangkok", 
      thumbnail: import.meta.env.VITE_PHOTO_33 
    },
    { 
      id: 3, 
      title: "Kuala Lumpur", 
      thumbnail: import.meta.env.VITE_PHOTO_2 
    },
  ];

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
          {projects.map((project) => (
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
          ))}
        </div>
      </section>
    </>
  );
}

export default Projects;
