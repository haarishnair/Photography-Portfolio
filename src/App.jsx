import { useState } from 'react';
import { Link } from "react-router-dom";
import './styles/App.css'

import Navbar from './Navbar';
import Contact from './Contact';

function App() {
  const photo1 = import.meta.env.VITE_PHOTO_1;
  const photo2 = import.meta.env.VITE_PHOTO_2;
  const photo3 = import.meta.env.VITE_PHOTO_3;
  const photo4 = import.meta.env.VITE_PHOTO_4;
  const photo5 = import.meta.env.VITE_PHOTO_5;

  const images = [photo3, photo4, photo5];
  const [index, setIndex] = useState(0);

  const prevImage = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <Navbar />
      <section className='top' id='home'>
        <div className='top_left'>
          <div className='top_left_word1'>
            <p className='hello'>Hello;</p>
          </div>
          <div className='top_left_word2'>
            <p className='hello2'>I'M HAARISH NAIR</p>
          </div>
          <div className='top_left_word3'>
            <p className='hello3'>AND I'M A PHOTOGRAPHER</p>
          </div>
        </div>
        <div className='top_right'>
          <img className='top_right_img' src={photo1} alt='Haarish Photo' />
        </div>
      </section>
      <section className='about' id='about'>
        <p className='about_title'>About Me</p>
        <p className='about_text'>
          Welcome, I’m Haarish Nair, a passionate photographer with a love for storytelling through the lens.
        </p>
        <p className='about_text2'>
          Each photograph I capture is a journey to discover meaning in the moments and places I explore. My work reflects a constant evolution, and I invite you to enjoy this visual journey as I continue to grow and refine my craft.
        </p>
      </section>
      <section className='featured' id='featured'>
        <p className='featured_title'>Featured</p>
        <div className='featured_image1'>
          <img src={photo2} alt="Sample" className='bukitBintang'/>
          <div className='featured_text_container'>
            <p className='featured_text_title'>
              "Metropolitan Rhythm"
            </p>
            <p className='featured_text'>
              In this photograph, my goal was to capture the heartbeat of a vibrant city—a place where life flows through the streets in a harmonious yet unpredictable dance. The urban landscape, framed by towering buildings and busy intersections, represents more than just structures; it mirrors the energy and spirit of the people who inhabit it. The bustling cars, pedestrians crossing paths, and the interplay of light and shadow are all part of a larger narrative of movement and connection. I edited this photo to highlight the subtle ray of sunlight that cuts through the urban sprawl. The sunlight softens the harsh lines of the cityscape, infusing warmth and vitality into the scene, and revealing the depth and humanity within the seemingly cold, structured environment. Through this image, I wanted to showcase not just the physical aspects of a city, but its essence—the invisible rhythm that pulses through its streets, the stories it holds, and the fleeting moments of tranquillity that give life to the urban environment. 
            </p>
          </div>
        </div>
        <hr className='line'></hr>
        <p className='featured_text_title2'>
          "Through the Shadows: A Glimpse of Malaysia's Skyscrapers"
        </p>
        <section className='gallery'>
          <div className='gallery_left' onClick={prevImage}>
            <img
              src={images[(index - 1 + images.length) % images.length]}
              alt="Previous"
              className='gallery_img_small'
            />
          </div>
          <div className='gallery_center'>
            <img
              src={images[index]}
              alt="Current"
              className='gallery_img_large'
            />
          </div>
          <div className='gallery_right' onClick={nextImage}>
            <img
              src={images[(index + 1) % images.length]}
              alt="Next"
              className='gallery_img_small'
            />
          </div>
        </section>
        <p className='featured_text2'>
          This photograph captures more than just a striking view of a towering skyscraper; it represents a moment of introspection on the balance between nature and urbanization. Framed deliberately through the shadows of the leaves, the image is a visual metaphor for how modern progress can sometimes feel distant yet inescapably intertwined with the natural world. The decision to obscure the building partially behind the leaves invites the viewer to reflect on how easily the grandeur of human achievement can be hidden or overshadowed by the simplicity and beauty of nature.
        </p>
        <hr className='line'></hr>
      </section>
      <section className='projects'>
        <p className='projects_title'>My Projects</p>
        <Link to="/projects">
          <button className='projects_button'>View My Portfolio</button>
        </Link>
      </section>
      <Contact />
    </>
  )
}

export default App
