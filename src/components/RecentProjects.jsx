// Present current and future portfolio projects through the animated BounceCards UI.
import { useState } from 'react';
import BounceCards from './BounceCards';
import './RecentProjects.css';

// Project metadata drives card images, hover labels, previews, and click destinations.
const projects = [
  {
    title: 'Zoom Travels',
    image: 'https://images.unsplash.com/photo-1724152312974-d4d48b8b36fd?w=480&h=480&fit=crop',
    url: 'https://zoomtravels.net',
    preview: 'https://zoomtravels.net'
  },
  { title: 'ShowRecs', 
    image: 'https://images.unsplash.com/photo-1762846818262-33c197852fa8?w=480&h=480&fit=crop', 
    url: 'https://showrecs.vercel.app',
    preview: 'https://showrecs.vercel.app'
  },
  { title: 'More projects coming soon', image: 'https://images.unsplash.com/photo-1721407964262-f9864b562453?w=480&h=480&fit=crop' },
  { title: 'More projects coming soon', image: 'https://images.unsplash.com/photo-1776394254711-4a0d7345269a?w=480&h=480&fit=crop' },
  { title: 'More projects coming soon', image: 'https://images.unsplash.com/photo-1763440519433-5467759054fc?w=480&h=480&fit=crop' }
];

const RecentProjects = () => {
  // Track the active card so its title can be shown below the card stack.
  const [hoveredProject, setHoveredProject] = useState(-1);

  // Open only projects that provide a real URL; placeholders remain non-navigable.
  const handleProjectClick = index => {
    const project = projects[index];
    if (project?.url) window.open(project.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="projects" className="container section-spacing">
      <h2 className="section-title">PREVIOUS<br /><span className="outline-text">PROJECTS</span></h2>

      {/* BounceCards handles the animated stack while this wrapper owns section alignment. */}
      <div className="project-bounce">
        <BounceCards
          images={projects.map(project => ({
            src: project.image,
            alt: project.title,
            preview: project.preview
          }))}
          containerWidth="100%"
          containerHeight={250}
          cardWidth={360}
          cardHeight={203}
          spread={30}
          rotation={6}
          arc={0}
          pushDistance={70}
          hoverScale={1.06}
          bounciness={0.6}
          animationDelay={0.5}
          animationStagger={0.06}
          borderWidth={0}
          borderColor="#ffffff"
          radius={25}
          shadow
          enableHover
          onCardHover={setHoveredProject}
          onCardClick={handleProjectClick}
          style={{ width: '100%', margin: '0 auto' }}
        />
        <div className="project-hover-title" aria-live="polite">
          {hoveredProject >= 0 ? projects[hoveredProject].title : ''}
        </div>
      </div>
    </section>
  );
};
export default RecentProjects;
