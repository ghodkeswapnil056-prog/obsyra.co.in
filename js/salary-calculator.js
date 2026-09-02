/* OBSYRA CAREER PORTAL - CTC & TAKE-HOME SALARY CALCULATOR (v5.6.0) */
const SALARY_CALCULATOR = {
  calculateBreakdown(annualCTC) {
    const ctc = parseFloat(annualCTC) || 600000; // Default 6 LPA
    const monthlyGross = ctc / 12;

    const basicMonthly = Math.round(monthlyGross * 0.50); // 50% Basic
    const hraMonthly = Math.round(basicMonthly * 0.40); // 40% HRA
    const pfMonthly = 1800; // Standard PF
    const ptMonthly = 200; // Standard Professional Tax (MH)
    const specialAllowance = Math.max(0, Math.round(monthlyGross - (basicMonthly + hraMonthly + pfMonthly)));
    const netTakeHome = Math.round(monthlyGross - (pfMonthly + ptMonthly));

    return {
      annualCTC: ctc,
      monthlyGross: Math.round(monthlyGross),
      basicMonthly: basicMonthly,
      hraMonthly: hraMonthly,
      specialAllowance: specialAllowance,
      pfMonthly: pfMonthly,
      ptMonthly: ptMonthly,
      netTakeHomeMonthly: netTakeHome
    };
  }
};
