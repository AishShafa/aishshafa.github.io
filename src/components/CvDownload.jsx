import cvPdf from '../assets/CV.pdf';
import GlassSurface from './GlassSurface';
import './OrbButton.css';

const CvDownload = () => (
  <div className="button-stack cv-download">
    <GlassSurface
      className="cv-orb-surface"
      width={60}
      height={60}
      borderRadius={30}
      distortionScale={-180}
      displace={0.5}
      backgroundOpacity={0.1}
    >
      <div className="btn-wrapper">
        <a
          className="orb-btn btn-orange"
          href={cvPdf}
          download="Aishath-Shafa-CV.pdf"
          aria-label="Download my CV"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4v11 M8 11l4 4 4-4 M5 19h14"></path>
          </svg>
        </a>
        <span className="btn-label">Download my CV</span>
      </div>
    </GlassSurface>
  </div>
);

export default CvDownload;
