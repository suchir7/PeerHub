import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconGraduationCap, IconUserCheck } from '../components/Icons';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const role = await login(email, password);
    setLoading(false);
    if (role === 'student')    navigate('/student/dashboard');
    if (role === 'instructor') navigate('/instructor/overview');
  };

  const fillDemo = (type) => {
    setError('');
    if (type === 'student') {
      setEmail('alex@university.edu');
      setPassword('student123');
    } else {
      setEmail('prof.rivera@university.edu');
      setPassword('teach123');
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

          {/* Demo quick-fill */}
          <div className={styles.demoRow}>
            <span className={styles.demoLabel}>Quick demo:</span>
            <button className={styles.demoBtn} type="button" onClick={() => fillDemo('student')}>
              <IconGraduationCap size={14} /> Student
            </button>
            <button className={styles.demoBtn} type="button" onClick={() => fillDemo('instructor')}>
              <IconUserCheck size={14} /> Instructor
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <input
                className={styles.input}
                type="email"
                placeholder="your@university.edu"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
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
                onChange={e => { setPassword(e.target.value); setError(''); }}
                required
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          <p className={styles.footnote}>
            You'll be redirected automatically based on your role.
          </p>
        </div>
      </div>
    </div>
  );
}
