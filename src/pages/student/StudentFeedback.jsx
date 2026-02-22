import { useState } from 'react';
import { PENDING_REVIEWS } from '../../data/mockData';
import { Card, CardHeader, StarRating } from '../../components/UI';
import styles from './StudentFeedback.module.css';

const CRITERIA = ['Code Quality', 'Documentation', 'Teamwork', 'Innovation'];

export default function StudentFeedback() {
  const [ratings, setRatings]   = useState(Object.fromEntries(CRITERIA.map(c => [c, 0])));
  const [comment, setComment]   = useState('');
  const [score, setScore]       = useState('');
  const [project, setProject]   = useState(PENDING_REVIEWS[0].title);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = comment.trim() && score && Object.values(ratings).every(v => v > 0);

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  const reset = () => {
    setSubmitted(false);
    setComment('');
    setScore('');
    setRatings(Object.fromEntries(CRITERIA.map(c => [c, 0])));
  };

  if (submitted) {
    return (
      <div className="page-enter">
        <div className={styles.successWrap}>
          <div className={styles.successIcon}>✦</div>
          <div className={styles.successTitle}>Review Submitted!</div>
          <p className={styles.successSub}>
            Your feedback has been recorded and shared anonymously with the team.
          </p>
          <button className={styles.resetBtn} onClick={reset}>
            Write Another Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className={styles.grid}>
        {/* Form */}
        <Card>
          <CardHeader title="Write Your Review" />
          <div className={styles.body}>
            <div className={styles.field}>
              <label className={styles.label}>Project</label>
              <select className={styles.ctrl} value={project} onChange={e => setProject(e.target.value)}>
                {PENDING_REVIEWS.map(p => <option key={p.id}>{p.title}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Overall Score (0–100)</label>
              <input
                className={styles.ctrl}
                type="number" min="0" max="100"
                placeholder="e.g. 85"
                value={score}
                onChange={e => setScore(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Feedback</label>
              <textarea
                className={`${styles.ctrl} ${styles.textarea}`}
                placeholder="Share specific strengths, areas for improvement, and actionable suggestions..."
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>

            <button
              className={`${styles.submitBtn} ${!canSubmit ? styles.submitDisabled : ''}`}
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              Submit Review →
            </button>
            {!canSubmit && <p className={styles.hint}>Fill in all fields and rate all criteria to submit.</p>}
          </div>
        </Card>

        {/* Criteria */}
        <div className={styles.col}>
          <Card>
            <CardHeader title="Criteria Ratings" />
            <div className={styles.body}>
              {CRITERIA.map(c => (
                <div key={c} className={styles.critRow}>
                  <div className={styles.critName}>{c}</div>
                  <StarRating
                    value={ratings[c]}
                    onChange={v => setRatings(prev => ({ ...prev, [c]: v }))}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Pending Assignments" />
            <div className={styles.body}>
              {PENDING_REVIEWS.map(p => (
                <div key={p.id} className={styles.assignRow}>
                  <div className={styles.assignIcon}>📋</div>
                  <div>
                    <div className={styles.assignTitle}>{p.title}</div>
                    <div className={styles.assignDue}>{p.due}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
