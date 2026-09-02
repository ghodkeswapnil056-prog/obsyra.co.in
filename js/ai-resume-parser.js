/* OBSYRA CAREER PORTAL - AI AUTOMATED RESUME PARSER ENGINE (v5.6.0) */
const AI_RESUME_PARSER = {
  skillsKeywords: ['Telecom', '5G', '4G', 'LTE', 'Java', 'Python', 'JavaScript', 'HTML', 'CSS', 'SQL', 'Linux', 'AWS', 'Docker', 'Testing', 'QA', 'Networking', 'React', 'Node.js'],

  parseResumeText(text) {
    if (!text) return null;

    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
    const expMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?experience/i);

    const extractedSkills = [];
    this.skillsKeywords.forEach(skill => {
      if (new RegExp('\\b' + skill + '\\b', 'i').test(text)) {
        extractedSkills.push(skill);
      }
    });

    return {
      email: emailMatch ? emailMatch[0] : '',
      mobile: phoneMatch ? phoneMatch[0] : '',
      experienceYears: expMatch ? expMatch[1] : '3',
      extractedSkills: extractedSkills,
      parsedScore: Math.min(100, 50 + (extractedSkills.length * 10))
    };
  }
};
