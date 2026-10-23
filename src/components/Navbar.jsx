// Render the fixed navigation with a glass backdrop and accessible flip states.
import { useState } from 'react';
import GlassSurface from './GlassSurface';
import './Navbar.css';

// Keep navigation labels and their in-page destinations in one data structure.
const navItems = [
  { title: 'HOME', href: '#home' },
  { title: 'PROJECTS', href: '#projects' },
  { title: 'EDUCATION', href: '#education' },
  { title: 'SKILLS', href: '#skills' },
  { title: 'CONTACT', href: '#contact' }
];

// A single link owns its hover/focus state so pointer and keyboard behavior match.
const FlipItem = ({ title, href }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      className={`nav-flip-item${isHovered ? ' is-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label={title}
    >
      <span className="nav-flip-face nav-flip-face-front">{title}</span>
      <span className="nav-flip-face nav-flip-face-back">{title}</span>
    </a>
  );
};

const Navbar = () => {
  return (
    // GlassSurface provides the visual container while this component owns navigation semantics.
    <nav className="navbar">
      <GlassSurface
        className="nav-pill"
        width={540}
        height={60}
        borderRadius={30}
        distortionScale={-180}
        displace={0.5}
        backgroundOpacity={0.1}
      >
        <div className="nav-items">
          {navItems.map(item => (
            <FlipItem key={item.title} {...item} />
          ))}
        </div>
      </GlassSurface>
    </nav>
  );
};

export default Navbar;