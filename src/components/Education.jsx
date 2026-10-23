// Education content is kept separate so CV updates do not affect layout code.
import './RecentProjects.css';

// The portfolio currently presents the single requested higher-education qualification.
const education = [{
  period: '2022–2025',
  title: (
    <>
      BSc (Hons) Software Engineering, (Dual
      <br />
      Award)
    </>
  ),
  institution: 'De Montfort University (UK), Asia Pacific University (Malaysia)'
}];

const Education = () => (
  // Reuse the project-list layout because both sections share the same content geometry.
  <section id="education" className="container section-spacing">
    <h2 className="section-title">HIGHER<br /><span className="outline-text">EDUCATION</span></h2>
    <div className="experience-list">
      {education.map(item => (
        <div key={item.period} className="experience-item">
          <div className="exp-header">
            <h3>{item.title}</h3>
            <span className="exp-date">{item.period}</span>
          </div>
          <p className="exp-role">{item.institution}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Education;
