import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '../context/AuthContext';
import styles from './Signup.module.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [captcha, setCaptcha] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const recaptchaRef = useRef(null);

  const { signup, loginWithGoogle, error, setError } = useAuth();
  const navigate = useNavigate();

  const googleClientId = (
    import.meta.env.VITE_GOOGLE_CLIENT_ID
    || import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID
    || ''
  ).trim();
  const isGoogleEnabled = Boolean(googleClientId);
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  const navigateByRole = (nextRole) => {
    if (nextRole === 'student') navigate('/student/dashboard');
    if (nextRole === 'instructor') navigate('/instructor/overview');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    if (name.trim().length < 2) {
      setFormError('Name must be at least 2 characters.');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setFormError('Enter a valid email address.');
      return;
    }
    if (!strongPassword.test(password)) {
      setFormError('Password must be 8+ chars with uppercase, lowercase, number, and symbol.');
      return;
    }

    if (!captcha) {
      setError('Please complete the CAPTCHA before signing up.');
      return;
    }

    setFormError('');
    setLoading(true);
    try {
      const nextRole = await signup({ name, email, password, role, captchaToken: captcha });
      recaptchaRef.current?.reset();
      setCaptcha('');
      navigateByRole(nextRole);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setError('Google login response was invalid.');
      return;
    }

    if (!captcha) {
      setError('Please complete the CAPTCHA before using Google sign up.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const nextRole = await loginWithGoogle({
        idToken: credentialResponse.credential,
        mode: 'signup',
        role,
        captchaToken: captcha,
      });
      recaptchaRef.current?.reset();
      setCaptcha('');
      navigateByRole(nextRole);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <div className={styles.logo}>Peer<em>Hub</em></div>

        <div className={styles.hero}>
          <div className={styles.eyebrow}>Join the workspace</div>
          <h1 className={styles.headline}>Build, review,<br />and improve.</h1>
          <p className={styles.sub}>
            Create your account to submit projects, review peers, and track progress in one place.
          </p>
        </div>

        <ul className={styles.features}>
          {[
            'Structured peer feedback loops',
            'Instructor-ready progress signals',
            'Simple role-based access',
            'Fast project and review workflows',
          ].map((feature) => (
            <li key={feature} className={styles.feature}>
              <span className={styles.featureDot} />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.right}>
        <div className={styles.formWrap}>
          <div className={styles.formEye}>Get started</div>
          <h2 className={styles.formTitle}>Create your<br />account</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input
                className={styles.input}
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                  setFormError('');
                }}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <input
                className={styles.input}
                type="email"
                placeholder="your@university.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                  setFormError('');
                }}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                  setFormError('');
                }}
                required
                minLength={6}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Role</label>
              <div className={styles.roleRow}>
                <button
                  type="button"
                  className={`${styles.roleBtn} ${role === 'student' ? styles.roleBtnActive : ''}`}
                  onClick={() => setRole('student')}
                >
                  Student
                </button>
                <button
                  type="button"
                  className={`${styles.roleBtn} ${role === 'instructor' ? styles.roleBtnActive : ''}`}
                  onClick={() => setRole('instructor')}
                >
                  Instructor
                </button>
              </div>
            </div>

            <div className={styles.captchaWrap}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={recaptchaSiteKey}
                onChange={(value) => {
                  setCaptcha(value || '');
                  if (value) setError('');
                }}
              />
            </div>

            {formError && <div className={styles.error}>{formError}</div>}
            {error && <div className={styles.error}>{error}</div>}

            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Sign Up'}
            </button>
          </form>

          <div className={styles.divider}><span>or continue with</span></div>

          <div className={styles.socialRow}>
            {isGoogleEnabled ? (
              <GoogleLogin onSuccess={handleGoogle} onError={() => setError('Google sign-up was cancelled or failed.')} />
            ) : (
              <button className={styles.socialBtn} type="button" disabled>
                Google sign-in unavailable (set VITE_GOOGLE_CLIENT_ID)
              </button>
            )}
          </div>

          <p className={styles.footnote}>
            Already have an account? <Link className={styles.link} to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
