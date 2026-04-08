import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';
import ReCAPTCHA from "react-google-recaptcha";


export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [captcha, setCaptcha]   = useState('');
  const [formError, setFormError] = useState('');
  const { login, loginWithGoogle, error, setError } = useAuth();
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  const googleClientId = (
    import.meta.env.VITE_GOOGLE_CLIENT_ID
    || import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID
    || ''
  ).trim();
  const isGoogleEnabled = Boolean(googleClientId);
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  const navigateByRole = (role) => {
    if (role === 'student') navigate('/student/dashboard');
    if (role === 'instructor') navigate('/instructor/overview');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    if (!captcha) {
      setError('Please complete the CAPTCHA before signing in.');
      return;
    }

    setFormError('');
    setLoading(true);
    try {
      const role = await login(email, password, captcha);
      recaptchaRef.current?.reset();
      setCaptcha('');
      navigateByRole(role);
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
      setError('Please complete the CAPTCHA before using Google sign in.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const role = await loginWithGoogle({ idToken: credentialResponse.credential, mode: 'signin', captchaToken: captcha });
      recaptchaRef.current?.reset();
      setCaptcha('');
      navigateByRole(role);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      {/* Left panel */}
      <div className={styles.left}>
        <div className={styles.logo}>Peer<em>Hub</em></div>

        <div className={styles.hero}>
          <div className={styles.eyebrow}>FSAD-PS26 · Spring 2025</div>
          <h1 className={styles.headline}>
            Learn Better,<br />Together.
          </h1>
          <p className={styles.sub}>
            A collaborative peer review platform helping students grow through meaningful feedback, structured teamwork, and instructor-guided evaluation.
          </p>
        </div>

        <ul className={styles.features}>
          {[
            'Real-time project collaboration',
            'Structured peer evaluation system',
            'Progress tracking & analytics',
            'Role-based dashboards',
          ].map(f => (
            <li key={f} className={styles.feature}>
              <span className={styles.featureDot} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Right panel */}
      <div className={styles.right}>
        <div className={styles.formWrap}>
          <div className={styles.formEye}>Welcome back</div>
          <h2 className={styles.formTitle}>Sign in to<br />your account</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <input
                className={styles.input}
                type="email"
                placeholder="your@university.edu"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); setFormError(''); }}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); setFormError(''); }}
                required
              />
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
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          <div className={styles.divider}><span>or continue with</span></div>

          <div className={styles.socialRow}>
            {isGoogleEnabled ? (
              <GoogleLogin onSuccess={handleGoogle} onError={() => setError('Google sign-in was cancelled or failed.')} />
            ) : (
              <button className={styles.socialBtn} type="button" disabled>
                Google sign-in unavailable (set VITE_GOOGLE_CLIENT_ID)
              </button>
            )}
          </div>

          <p className={styles.footnote}>
            Need an account? <Link className={styles.link} to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
