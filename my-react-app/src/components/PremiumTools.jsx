// Display the CV's technical and professional skills as a responsive bento grid.
import './PremiumTools.css';

// Store skill labels and details as data so the grid remains easy to extend.
const tools = [
  { name: 'Databases', type: 'PostgreSQL, MySQL, SQL, DBeaver, pgAdmin' },
  { name: 'Web & Systems', type: 'React, React Native, Node.js, Express.js, HTML, CSS, Bootstrap, API testing' },
  { name: 'Languages', type: 'Python, JavaScript, Java, C#, C++, Kotlin, Dart, R' },
  { name: 'Cloud & Tools', type: 'AWS, Git, Visual Studio, Eclipse, NetBeans, Android Studio, RStudio' },
  { name: 'Practices', type: 'SDLC, Requirements Engineering, Software Architecture, Design Patterns, OOP, UI/UX and HCI' },
  { name: 'Professional Skills', type: 'Communication, documentation, problem solving, collaboration' },
];

const PremiumTools = () => {
  return (
    // The section id is used by the SKILLS navigation link.
    <section id="skills" className="container section-spacing">
      <h2 className="section-title">PROFESSIONAL<br /><span className="outline-text">SKILLS</span></h2>
      <div className="tools-grid">
        {tools.map((tool) => (
          <div key={tool.name} className="tool-card">
            <div className="tool-text">
              <h4>{tool.name}</h4>
              <p>{tool.type}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default PremiumTools;