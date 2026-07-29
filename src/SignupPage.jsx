import React, { useState } from "react";
import "./SignupPage.css";
import FooterLinks from "./FooterLinks";
// Small rocket mark shown next to the "Streamline" wordmark
import brandIcon from "./streamline-icon.png";

const initialSignupForm = {
  name: "",
  idNumber: "",
  githubUsername: "",
  email: "",
  password: "",
  confirmPassword: "",
};

// Validates a single field, given the full (already-updated) form values
// so cross-field checks like confirmPassword can see the latest password.
function validateField(name, value, currentForm) {
  switch (name) {
    case "name":
      return value.trim() ? "" : "Name is required.";
    case "idNumber":
      return value.trim() ? "" : "ID number is required.";
    case "githubUsername":
      return value.trim() ? "" : "Github username is required.";
    case "email":
      return /^\S+@\S+\.\S+$/.test(value) ? "" : "Enter a valid email.";
    case "password":
      return value.length >= 8
        ? ""
        : "Password must be at least 8 characters.";
    case "confirmPassword":
      return value === currentForm.password
        ? ""
        : "Passwords do not match.";
    default:
      return "";
  }
}

function TermsModal({ onClose, onAccept }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h2>Terms &amp; Conditions</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          <h3>1. Acceptance of Terms</h3>
          <p>
            By creating a Streamline account, powered by Certicode, you agree
            to be bound by these Terms &amp; Conditions and our Privacy
            Policy. If you do not agree, please do not create an account.
          </p>
          <h3>2. Account Responsibilities</h3>
          <p>
            You are responsible for keeping your login credentials
            confidential and for all activity that happens under your
            account. Notify us immediately if you suspect unauthorized use.
          </p>
          <h3>3. Acceptable Use</h3>
          <p>
            You agree not to misuse Streamline's services, attempt to
            disrupt the platform, or use it for any unlawful purpose.
          </p>
          <h3>4. Data &amp; Privacy</h3>
          <p>
            Certicode processes your account data in line with our Privacy
            Policy to secure your workspace, verify your identity, and
            improve the reliability of the service.
          </p>
          <h3>5. Changes to These Terms</h3>
          <p>
            We may update these terms from time to time. Continued use of
            Streamline after changes take effect means you accept the
            revised terms.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn-primary" onClick={onAccept}>
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({ onContinue }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal success-modal">
        <div className="modal-body success-body">
          <i class="fa-regular fa-circle-check success-icon"></i>
          <h2>Signed Up Succesfully!</h2>
          <p>
            Your Streamline account has been created successfully. Click OK
            to log in.
          </p>
        </div>
        <div className="modal-footer success-footer">
          <button className="btn-primary" onClick={onContinue}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage({ onSwitchToLogin }) {
  //  Sign up form state
  const [form, setForm] = useState(initialSignupForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    // Live-validate this field as the user types, so the error clears
    // the moment the value becomes valid instead of waiting for submit.
    setErrors((prev) => {
      const next = { ...prev, [name]: validateField(name, value, updatedForm) };
      // Password and confirmPassword depend on each other, so if password
      // changes and confirmPassword already has a value, re-check it too.
      if (name === "password" && updatedForm.confirmPassword) {
        next.confirmPassword = validateField(
          "confirmPassword",
          updatedForm.confirmPassword,
          updatedForm
        );
      }
      return next;
    });
  };

  const handleAuthorizedChange = (e) => {
    const checked = e.target.checked;
    setAuthorized(checked);
    setErrors((prev) => ({
      ...prev,
      authorized: checked
        ? ""
        : "You must authorize Streamline to access your account.",
    }));
  };

  const handleAgreedChange = (e) => {
    const checked = e.target.checked;
    setAgreed(checked);
    setErrors((prev) => ({
      ...prev,
      agreed: checked ? "" : "You must accept the Terms & Conditions.",
    }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.idNumber.trim()) next.idNumber = "ID number is required.";
    if (!form.githubUsername.trim())
      next.githubUsername = "Github username is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter your  email.";
    if (form.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    if (form.confirmPassword !== form.password)
      next.confirmPassword = "Passwords do not match.";
    if (!authorized)
      next.authorized = "You must authorize Streamline to access your account.";
    if (!agreed) next.agreed = "You must accept the Terms & Conditions.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Sign up form submitted:", form);
      setShowSuccess(true);
    }
  };

  return (
    <div className="page">
      <div className="panel-left">
        <div className="brand">
          <img src={brandIcon} alt="Streamline" className="brand-icon-img" />
          <span className="brand-name">Streamline</span>
        </div>

        <h1 className="headline">Be Productive with Streamline</h1>

        <ul className="feature-list">
          <li>
            <i className="feature-icon fa-solid fa-users" />
            <div>
              <h3>Invite unlimited colleagues</h3>
              <p>
                Share live preview links with developers, QA testers, and managers so everyone can review features instantly from any browser.
              </p>
            </div>
          </li>
          <li>
            <i className="feature-icon fa-solid fa-circle-check" />
            <div>
              <h3>Ensure compliance</h3>
              <p>
                Receive QA and manager feedback in real time, ensuring every feature meets project requirements before deployment.
              </p>
            </div>
          </li>
          <li>
            <i className="feature-icon fa-solid fa-shield-halved" />
            <div>
              <h3>Built-in security</h3>
              <p>
                Deploy every feature in an isolated preview environment, protecting your project while ensuring consistent testing across development and production.
              </p>
            </div>
          </li>
        </ul>

        <FooterLinks />
      </div>

      <div className="panel-right">
        <div className="form-card">
          <div className="brand-powered">
            <img src={brandIcon} alt="Streamline" className="brand-icon-img" />
            <span>
              Streamline{" "}
              <span className="powered">powered by Certicode</span>
            </span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <span className="field-error">
                    <i className="fa-solid fa-circle-exclamation" />{" "}
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="field">
                <label htmlFor="idNumber">ID Number</label>
                <input
                  id="idNumber"
                  name="idNumber"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="ID number"
                  value={form.idNumber}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (
                      !/[0-9]/.test(e.key) &&
                      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.idNumber && (
                  <span className="field-error">
                    <i className="fa-solid fa-circle-exclamation" />{" "}
                    {errors.idNumber}
                  </span>
                )}
              </div>

              <div className="field">
                <label htmlFor="githubUsername">Github Username</label>
                <input
                  id="githubUsername"
                  name="githubUsername"
                  type="text"
                  placeholder="Github username"
                  value={form.githubUsername}
                  onChange={handleChange}
                />
                {errors.githubUsername && (
                  <span className="field-error">
                    <i className="fa-solid fa-circle-exclamation" />{" "}
                    {errors.githubUsername}
                  </span>
                )}
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className="field-error">
                    <i className="fa-solid fa-circle-exclamation" />{" "}
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="password-wrap">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <i
                      className={`fa-solid ${
                        showPassword ? "fa-eye" : "fa-eye-slash"
                      }`}
                    />
                  </button>
                </div>
                <span className="hint">Minimum length is 8 characters</span>
                {errors.password && (
                  <span className="field-error">
                    <i className="fa-solid fa-circle-exclamation" />{" "}
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="field">
                <label htmlFor="confirmPassword">Re-enter Password</label>
                <div className="password-wrap">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    <i
                      className={`fa-solid ${
                        showConfirmPassword ? "fa-eye" : "fa-eye-slash"
                      }`}
                    />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="field-error">
                    <i className="fa-solid fa-circle-exclamation" />{" "}
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="agree-row">
                <input
                  id="authorized"
                  type="checkbox"
                  checked={authorized}
                  onChange={handleAuthorizedChange}
                />
                <label htmlFor="authorized">
                  Authorize Streamline to Access
                </label>
              </div>
              {errors.authorized && (
                <span className="field-error">
                  <i className="fa-solid fa-circle-exclamation" />{" "}
                  {errors.authorized}
                </span>
              )}

              <div className="agree-row">
                <input
                  id="agreed"
                  type="checkbox"
                  checked={agreed}
                  onChange={handleAgreedChange}
                />
                <label htmlFor="agreed">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => setShowTerms(true)}
                  >
                    Terms &amp; Conditions
                  </button>
                </label>
              </div>
              {errors.agreed && (
                <span className="field-error">
                  <i className="fa-solid fa-circle-exclamation" />{" "}
                  {errors.agreed}
                </span>
              )}

              <button type="submit" className="btn-primary btn-full">
                Sign Up
              </button>

              <p className="login-hint">
                Already have an account?{" "}
                <button type="button" onClick={onSwitchToLogin}>
                  Login
                </button>
              </p>
            </form>
        </div>
      </div>

      {showTerms && (
        <TermsModal
          onClose={() => setShowTerms(false)}
          onAccept={() => {
            setAgreed(true);
            setErrors((prev) => ({ ...prev, agreed: "" }));
            setShowTerms(false);
          }}
        />
      )}

      {showSuccess && (
        <SuccessModal
          onContinue={() => {
            setShowSuccess(false);
            setForm(initialSignupForm);
            setAuthorized(false);
            setAgreed(false);
            setErrors({});
            onSwitchToLogin();
          }}
        />
      )}
    </div>
  );
}