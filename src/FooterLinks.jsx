import React, { useState } from 'react';
import './FooterLinks.css';

const ModalFeatureItem = ({ icon, title, children }) => (
  <div className="modal-feature-item">
    <i className={`modal-feature-icon fa-solid ${icon}`} aria-hidden="true" />
    <div>
      <h4>{title}</h4>
      <p>{children}</p>
    </div>
  </div>
);

const modalDetails = {
  Terms: {
    title: 'Terms of Service',
    content: (
      <div className="modal-scroll-content">
        <p>Welcome to <strong>Streamline</strong>. By using our automated deployment platform, you agree to the following terms:</p>
        <div className="modal-feature-list">
          <ModalFeatureItem icon="fa-bullseye" title="Intended Use">
            This platform is designed specifically for small, bootstrapped IT startups, student ventures, and lean teams to eliminate deployment bottlenecks.
          </ModalFeatureItem>
          <ModalFeatureItem icon="fa-peso-sign" title="Licensing & Costs">
            Our system targets a cost of ₱0 in additional licensing by leveraging existing free-tier cloud resources (such as Vercel or Netlify).
          </ModalFeatureItem>
          <ModalFeatureItem icon="fa-triangle-exclamation" title="Limitations of Liability">
            This initial iteration is built strictly to optimize developer-to-manager feedback loops. It does not provide enterprise-scale server automation, automated load testing, or custom domain mapping.
          </ModalFeatureItem>
          <ModalFeatureItem icon="fa-ban" title="Prohibited Use">
            Users must not exploit the free-tier infrastructure or deploy malicious scripts in preview environments.
          </ModalFeatureItem>
        </div>
      </div>
    ),
  },
  Privacy: {
    title: 'Privacy Policy',
    content: (
      <div className="modal-scroll-content">
        <p>Your privacy and intellectual property are our priorities. Here is how we handle your data:</p>
        <div className="modal-feature-list">
          <ModalFeatureItem icon="fa-lock" title="Code Security">
            Streamline connects directly to your cloud-managed GitHub repositories. We do not store your proprietary code on our own servers.
          </ModalFeatureItem>
          <ModalFeatureItem icon="fa-clock-rotate-left" title="Ephemeral Environments">
            Every branch build runs in an isolated, ephemeral instance. Once a preview is closed or a branch is merged, the associated sandbox instance is dismantled, preventing data leakage.
          </ModalFeatureItem>
          <ModalFeatureItem icon="fa-plug" title="Third-Party Integrations">
            Deployment builds are processed securely using your chosen cloud provider's API (Vercel/Netlify), ensuring your access tokens remain encrypted and safe.
          </ModalFeatureItem>
        </div>
      </div>
    ),
  },
  Docs: {
    title: 'Documentation',
    content: (
      <div className="modal-scroll-content">
        <p>Streamline converts static code repositories into active, shareable preview links automatically.</p>
        
        <h3>How It Works</h3>
        <div className="modal-feature-list">
          <ModalFeatureItem icon="fa-code-branch" title="Push Your Code">
            Push your latest changes to a new GitHub branch.
          </ModalFeatureItem>
          <ModalFeatureItem icon="fa-gears" title="Automated Build">
            Streamline triggers an automatic build using your integrated cloud deployment tool.
          </ModalFeatureItem>
          <ModalFeatureItem icon="fa-link" title="Get Your Link">
            In under 5 minutes, your team receives a unique, live preview URL for that specific feature branch.
          </ModalFeatureItem>
        </div>

        <h3>Core Features</h3>
        <div className="modal-feature-list">
          <ModalFeatureItem icon="fa-bolt" title="Zero Context Switching">
            No more waiting in queue for shared staging environments.
          </ModalFeatureItem>
          <ModalFeatureItem icon="fa-eye" title="Real-Time QA">
            Managers and non-technical stakeholders can review live features directly in a web browser with zero software installation.
          </ModalFeatureItem>
          <ModalFeatureItem icon="fa-check-double" title="Consistent Builds">
            Eliminates "it works on my laptop" bugs by matching your preview environments perfectly with production configurations.
          </ModalFeatureItem>
        </div>
      </div>
    ),
  },
  Help: {
    title: 'Help & Support',
    content: (
      <div className="modal-scroll-content">
        <p>Streamline is optimized for developer speed without the overhead of a dedicated DevOps department.</p>
        
        <h3>Frequently Asked Questions</h3>
        <div className="modal-feature-list">
          <ModalFeatureItem icon="fa-circle-question" title="Why is my preview link build failing?">
            Make sure your root directory contains a valid configuration file and that your repository is correctly linked to your cloud provider (Vercel or Netlify).
          </ModalFeatureItem>
          <ModalFeatureItem icon="fa-circle-question" title="Can I add a custom domain?">
            Custom domain mapping is scheduled for later iterations. Currently, every preview is hosted on a unique, auto-generated, isolated URL.
          </ModalFeatureItem>
          <ModalFeatureItem icon="fa-circle-question" title="How do I report a system bug?">
            Please reach out to your team's project lead or submit an issue directly on our developer portal.
          </ModalFeatureItem>
        </div>
      </div>
    ),
  },
};

const linkIcons = {
  Terms: 'fa-file-contract',
  Privacy: 'fa-shield-halved',
  Docs: 'fa-book',
  Help: 'fa-circle-question',
};

const FooterLinks = () => {
  const [activeModal, setActiveModal] = useState(null);

  const links = ['Terms', 'Privacy', 'Docs', 'Help'];

  return (
    <>
      <footer className="streamline-footer">
        <nav className="footer-nav">
          {links.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveModal(item)}
              className="footer-link-btn"
            >
              <i className={`fa-solid ${linkIcons[item]} footer-link-icon`} aria-hidden="true" />
              <span>{item}</span>
            </button>
          ))}
        </nav>
      </footer>

      {/* Modal Dialog & Overlay */}
      {activeModal && (
        <div className="footer-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="footer-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="footer-modal-title">{modalDetails[activeModal].title}</h3>
            <div className="footer-modal-body">
              {modalDetails[activeModal].content}
            </div>
            <button
              type="button"
              className="footer-modal-close-btn"
              onClick={() => setActiveModal(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FooterLinks;