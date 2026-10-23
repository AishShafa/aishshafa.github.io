import './Experience.css';

const experience = [
  {
    period: 'Mar 2026 – Present',
    title: 'Software Engineer',
    company: 'Isle Web · Freelance',
    details: [
      'Designed, built, and deployed Isle Web’s company website (isleweb.com), a responsive single-page site.',
      'Currently working on projects as they come in from clients, including building a static site for a local business using Astro 5, Vite, and Tailwind CSS 4.'
    ]
  },
  {
    period: 'Jan 2026 – Mar 2026',
    title: 'Web Developer',
    company: 'Zoom Travels',
    details: [
      'Built zoomtravels.net, a responsive single-page static site with Astro 5, Vite, and Tailwind CSS 4 using reusable Astro components.',
      'Implemented GSAP ScrollTrigger animations, a sticky video hero, scroll-aware navigation, active section tracking, expandable FAQs, and contact links.'
    ]
  },
  {
    period: 'Jun 2025 - Jul 2025',
    title: 'Internship',
    company: 'Ministry of Health',
    details: [
      'Developed a platform eact Native, Node.js/Express, and PostgreSQL.',
      'Designed the PostgreSQL schema, tested APIs with Postman, and documented the architecture and source code for the internal team.'
    ]
  }
];

const Experience = () => (
  <section id="experience" className="container section-spacing">
    <h2 className="section-title">WORK<br /><span className="outline-text">EXPERIENCE</span></h2>
    <div className="experience-list">
      {experience.map(item => (
        <article key={`${item.company}-${item.period}`} className="experience-item">
          <div className="exp-header">
            <h3>{item.title}</h3>
            {item.period && <span className="exp-date">{item.period}</span>}
          </div>
          <p className="exp-role">{item.company}</p>
          <ul className="exp-details">
            {item.details.map(detail => <li key={detail}>{detail}</li>)}
          </ul>
        </article>
      ))}
    </div>
  </section>
);

export default Experience;
