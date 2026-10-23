// Compose the portfolio shell from reusable visual and content sections.
import Navbar from './components/Navbar';
import SpotlightCard from './components/Spotlight.jsx';
import Grainient from './components/Grainient.jsx';
import githubIcon from './assets/github.svg';
import linkedinIcon from './assets/linkedin.svg';
import profilePhoto from './assets/photo.jpg';
import RecentProjects from './components/RecentProjects';
import PremiumTools from './components/PremiumTools';
import Education from './components/Education';
import Contact from './components/Contact';

function App() {
  return (
    // Isolate the app stacking context so the animated background stays behind content.
    <div className="app-wrapper">
      {/* The Grainient canvas supplies the full-page animated visual background. */}
      <Grainient
        className="site-background"
        colors={['#120f17', '#2a0f0a', '#9a3412', '#f97316', '#fed7aa']}
        angle={55}
        flow={0.8}
        silk={0.35}
        grainAmount={0.09}
        type="radial"
        bands={1}
        softness={1}
        scale={1}
        speed={1}
        grainSize={1.2}
        grainAnimated
        contrast={1}
        saturation={1}
        variation={0}
        interactive
        stir={1}
        clickSwirl
        intro
        lightMode={false}
      />
      {/* The fixed glass navigation provides anchor links to each section. */}
      <Navbar />
      
      {/* The desktop layout keeps the profile card beside the scrolling content. */}
      <div className="main-layout container">
        <div className="left-column">
          {/* SpotlightCard supplies the interactive lighting effect for the profile panel. */}
          <SpotlightCard
            className="profile-card"
            style={{
              '--spotlight-card-surface': '#111111',
              '--spotlight-card-border': 'rgba(255, 255, 255, 0.08)',
              '--spotlight-card-shadow': '0 24px 48px -24px rgba(0, 0, 0, 0.6)'
            }}
            theme="dark"
            spotlightColor="#ffffff"
            intensity={0.15}
            spotlightSize={240}
            softness={0.7}
            shape="circle"
            borderGlow={0.6}
            proximity={80}
            smoothing={0.3}
            grain={0}
            ambient={false}
            flare={false}
          >
            {/* Decorative arc intentionally sits above the profile image. */}
            <div className="card-arc card-arc-top" aria-hidden="true" />
            <div className="avatar-container">
              <img src={profilePhoto} alt="Aishath Shafa" className="avatar" />
            </div>
            <h3 className="profile-name">Aishath Shafa</h3>
            <p className="profile-bio">
              Software engineer who develops, tests and implements systems, websites and databases, from database design
and backend through to the frontend and cloud deployment. Experienced in database design, API and
automated testing, preparing data for reporting, and writing clear technical documentation.
            </p>
            <div className="social-links">
              <a href="https://github.com/aishshafa" target="_blank" rel="noreferrer" aria-label="GitHub">
                <img src={githubIcon} alt="" />
              </a>
              <a href="https://linkedin.com/in/aishathshafa" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <img src={linkedinIcon} alt="" />
              </a>
            </div>
          </SpotlightCard>
        </div>

        <div className="right-column">
          {/* Introductory content establishes the portfolio's primary identity. */}
          <div className="hero-top-content">
            <h1 className="hero-title">
              SOFTWARE<br />
              <span className="outline-text">ENGINEER</span>
            </h1>
            <p className="hero-desc">
              Hi, I’m Shafa, a software engineer who is passionate about building thoughtful, user-focused software experiences. From interactive web platforms to custom applications, I enjoy blending design, logic, and creativity to bring ideas to life.
            </p>

          </div>
          {/* Portfolio work, education, skills, and contact remain independently reusable. */}
          <RecentProjects />
          <Education />
          <PremiumTools />
          <Contact />
        </div>
      </div>
      {/* Keep the email centered across the full page rather than the right column. */}
      <a className="site-email" href="mailto:aishathshafaofficial@gmail.com">
        aishathshafaofficial@gmail.com
      </a>
    </div>
  );
}

export default App;