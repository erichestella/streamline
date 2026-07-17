import React, { useState } from 'react';
import './FooterLinks.css';

const modalDetails = {
  Terms: {
    title: 'Terms of Service',
    content: (
      <div className="modal-scroll-content">
        <p>Welcome to <strong>Streamline</strong>. By using our automated deployment platform, you agree to the following terms:</p>
        <ul>
          <li><strong>Intended Use:</strong> This platform is designed specifically for small, bootstrapped IT startups, student ventures, and lean teams to eliminate deployment bottlenecks.</li>
          <li><strong>Licensing & Costs:</strong> Our system targets a cost of ₱0 in additional licensing by leveraging existing free-tier cloud resources (such as Vercel or Netlify).</li>
          <li><strong>Limitations of Liability:</strong> This initial iteration is built strictly to optimize developer-to-manager feedback loops. It does not provide enterprise-scale server automation, automated load testing, or custom domain mapping.</li>
          <li><strong>Prohibited Use:</strong> Users must not exploit the free-tier infrastructure or deploy malicious scripts in preview environments.</li>
        </ul>
      </div>
    ),
  },
  Privacy: {
    title: 'Privacy Policy',
    content: (
      <div className="modal-scroll-content">
        <p>Your privacy and intellectual property are our priorities. Here is how we handle your data:</p>
        <ul>
          <li><strong>Code Security:</strong> Streamline connects directly to your cloud-managed GitHub repositories. We do not store your proprietary code on our own servers.</li>
          <li><strong>Ephemeral Environments:</strong> Every branch build runs in an isolated, ephemeral instance. Once a preview is closed or a branch is merged, the associated sandbox instance is dismantled, preventing data leakage.</li>
          <li><strong>Third-Party Integrations:</strong> Deployment builds are processed securely using your chosen cloud provider's API (Vercel/Netlify), ensuring your access tokens remain encrypted and safe.</li>
        </ul>
      </div>
    ),
  },
  Docs: {
    title: 'Documentation',
    content: (
      <div className="modal-scroll-content">
        <p>Streamline converts static code repositories into active, shareable preview links automatically.</p>
        
        <h3>🚀 How It Works</h3>
        <ol>
          <li><strong>Push Your Code:</strong> Push your latest changes to a new GitHub branch.</li>
          <li><strong>Automated Build:</strong> Streamline triggers an automatic build using your integrated cloud deployment tool.</li>
          <li><strong>Get Your Link:</strong> In under 5 minutes, your team receives a unique, live preview URL for that specific feature branch.</li>
        </ol>

        <h3>💡 Core Features</h3>
        <ul>
          <li><strong>Zero Context Switching:</strong> No more waiting in queue for shared staging environments.</li>
          <li><strong>Real-Time QA:</strong> Managers and non-technical stakeholders can review live features directly in a web browser with zero software installation.</li>
          <li><strong>Consistent Builds:</strong> Eliminates "it works on my laptop" bugs by matching your preview environments perfectly with production configurations.</li>
        </ul>
      </div>
    ),
  },
  Help: {
    title: 'Help & Support',
    content: (
      <div className="modal-scroll-content">
        <p>Streamline is optimized for developer speed without the overhead of a dedicated DevOps department.</p>
        
        <h3>❓ Frequently Asked Questions</h3>
        <p><strong>Q: Why is my preview link build failing?</strong><br />
        Make sure your root directory contains a valid configuration file and that your repository is correctly linked to your cloud provider (Vercel or Netlify).</p>

        <p><strong>Q: Can I add a custom domain?</strong><br />
        Custom domain mapping is scheduled for later iterations. Currently, every preview is hosted on a unique, auto-generated, isolated URL.</p>

        <p><strong>Q: How do I report a system bug?</strong><br />
        Please reach out to your team's project lead or submit an issue directly on our developer portal.</p>
      </div>
    ),
  },
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
              {item}
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