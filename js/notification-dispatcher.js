/* OBSYRA CAREER PORTAL - AUTOMATED NOTIFICATION DISPATCHER (v5.6.0) */
const NOTIFICATION_DISPATCHER = {
  createWhatsAppLink(phone, messageType, data = {}) {
    const cleanPhone = (phone || '919876543210').replace(/\D/g, '');
    let text = '';

    if (messageType === 'INTERVIEW_INVITE') {
      text = `Hi ${data.candidateName || 'Candidate'}, greetings from Obsyra Pvt Ltd! You have been shortlisted for ${data.jobTitle || 'Role'}. Your ${data.roundName || 'Technical'} Interview is scheduled for ${data.date || 'Soon'} at ${data.time || '10:00 AM'}. Meeting Link: ${data.link || 'https://meet.google.com/xyz'}`;
    } else if (messageType === 'OFFER_LETTER') {
      text = `Congratulations ${data.candidateName || 'Candidate'}! Obsyra Pvt Ltd is pleased to offer you the position of ${data.jobTitle || 'Engineer'}. Please check your email for the official offer document.`;
    } else if (messageType === 'DOC_VERIFICATION') {
      text = `Hi ${data.candidateName || 'Candidate'}, please upload your pending verification documents in your Obsyra Candidate Vault: https://ghodkeswapnil056-prog.github.io/obsyra.co.in/documents.html`;
    } else {
      text = `Hi ${data.candidateName || 'Candidate'}, update regarding your Obsyra application.`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  },

  createEmailLink(email, subject, body) {
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
};
