/* OBSYRA CAREER PORTAL - AI MATCH & CANDIDATE SCORING ENGINE (v5.0.0) */
const AI_ENGINE = {
  weights: {
    skills: 0.40,
    experience: 0.25,
    location: 0.15,
    noticePeriod: 0.10,
    salaryExpectation: 0.10
  },

  evaluateJobMatch(candidate, job) {
    if (!candidate || !job) return { score: 75, label: 'Good Match', breakdown: {} };

    // 1. Skill Match Score (40%)
    let skillScore = 0;
    const candSkills = (candidate.skills || []).map(s => (s.skill_name || s).toLowerCase());
    const jobSkills = (job.skills || '').toLowerCase().split(',').map(s => s.trim());

    if (jobSkills.length > 0) {
      let matchedCount = 0;
      jobSkills.forEach(js => {
        if (candSkills.some(cs => cs.includes(js) || js.includes(cs))) matchedCount++;
      });
      skillScore = Math.min(100, Math.round((matchedCount / jobSkills.length) * 100));
    } else {
      skillScore = 85;
    }

    // 2. Experience Match Score (25%)
    let expScore = 80;
    const candExp = parseFloat(candidate.total_experience || candidate.expYears || '3');
    if (candExp >= 3) expScore = 95;
    else if (candExp >= 1) expScore = 85;

    // 3. Location Match Score (15%)
    let locScore = 70;
    const candState = (candidate.current_state || '').toLowerCase();
    const jobState = (job.location || job.state || '').toLowerCase();
    if (jobState.includes('pan india') || jobState.includes(candState)) locScore = 100;
    else locScore = 80;

    // 4. Notice Period Score (10%)
    let noticeScore = candidate.notice_period === 'Immediate' ? 100 : 85;

    // 5. Overall Weighted Calculation
    const overallScore = Math.round(
      (skillScore * this.weights.skills) +
      (expScore * this.weights.experience) +
      (locScore * this.weights.location) +
      (noticeScore * this.weights.noticePeriod) +
      (85 * this.weights.salaryExpectation)
    );

    let label = 'Good Match';
    if (overallScore >= 90) label = '🔥 Ideal Candidate Match';
    else if (overallScore >= 80) label = '🎯 High Potential Match';
    else if (overallScore >= 70) label = '👍 Recommended Candidate';

    return {
      score: overallScore,
      label: label,
      breakdown: {
        skills: skillScore,
        experience: expScore,
        location: locScore,
        noticePeriod: noticeScore
      }
    };
  }
};
