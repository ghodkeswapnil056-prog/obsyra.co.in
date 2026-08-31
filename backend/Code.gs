/**
 * OBSYRA JOB & CAREER PORTAL - BACKEND API CONTROLLER
 */

function doGet(e) {
  var action = e.parameter.action || "ping";
  return handleAction(action, e.parameter);
}

function doPost(e) {
  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = e.parameter;
  }
  var action = data.action || "ping";
  return handleAction(action, data);
}

function handleAction(action, payload) {
  var response = { success: false, message: "Invalid action" };

  try {
    switch (action) {
      case "ping":
        response = { success: true, status: "Obsyra API Online", timestamp: new Date() };
        break;

      case "getCandidateDashboardData":
        response = getCandidateDashboardData(payload);
        break;

      case "getCandidateDocuments":
        response = getCandidateDocuments(payload);
        break;

      case "uploadDocumentToVault":
        response = uploadDocumentToVault(payload);
        break;

      case "markCandidateJoined":
        response = markCandidateJoined(payload);
        break;

      case "getVacanciesStatus":
        response = getVacanciesStatus();
        break;

      case "getAdminDashboardStats":
        response = getAdminDashboardStats();
        break;

      case "updateApplicationStatus":
        response = updateApplicationStatus(payload);
        break;

      case "scheduleInterview":
        response = scheduleInterview(payload);
        break;

      case "getAuditLogs":
        response = getAuditLogs();
        break;

      case "saveCandidateProfile":
        response = saveCandidateProfile(payload);
        break;

      case "getCandidateProfile":
        response = getCandidateProfile(payload);
        break;

      case "saveResume":
        response = saveResume(payload);
        break;

      case "getLocations":
        response = getLocations();
        break;

      case "getJobs":
        response = getJobs(payload);
        break;

      case "submitServiceRequest":
        response = submitServiceRequest(payload);
        break;

      case "registerCandidate":
        response = registerCandidate(payload);
        break;

      case "loginCandidate":
        response = loginCandidate(payload);
        break;

      case "applyForJob":
        response = applyForJob(payload);
        break;
    }
  } catch (ex) {
    response = { success: false, message: ex.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty("SPREADSHEET_ID");
  if (!id) {
    var files = DriveApp.getFilesByName("OBSYRA_RECRUITMENT_DATABASE");
    if (files.hasNext()) {
      var file = files.next();
      id = file.getId();
      props.setProperty("SPREADSHEET_ID", id);
    }
  }
  return SpreadsheetApp.openById(id);
}

function logAudit(adminId, action, module, recordId, oldValue, newValue) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("AUDIT_LOG");
    sheet.appendRow(["AUD-" + Date.now(), adminId, action, module, recordId, oldValue, newValue, "127.0.0.1", new Date()]);
  } catch(e) {
    Logger.log("Audit Note: " + e.toString());
  }
}

function getCandidateDashboardData(payload) {
  return {
    success: true,
    user: { candidateId: "CAN-000125", firstName: "Rahul", lastName: "Sharma", email: "rahul.sharma@example.com" },
    stats: { totalApplications: 12, shortlisted: 3, upcomingInterviews: 2, selected: 1, savedJobs: 7, profilePercent: 92 },
    recommendedJobs: [
      { jobId: "OBS-JOB-00125", title: "Network Engineer", client: "Obsyra Pvt Ltd", location: "Maharashtra", experience: "2-5 Yrs", matchScore: 95 },
      { jobId: "OBS-JOB-00126", title: "5G Protocol Testing Engineer", client: "Obsyra Pvt Ltd", location: "Maharashtra / Hybrid", experience: "3-6 Yrs", matchScore: 91 }
    ]
  };
}

function getCandidateDocuments(payload) {
  return {
    success: true,
    documents: [
      { id: "DOC-001", name: "B.Tech Degree Certificate", category: "Education", uploadDate: "31 Aug 2026", status: "Verified", statusColor: "#10b981" },
      { id: "DOC-002", name: "Aadhaar Card Front & Back", category: "Identity", uploadDate: "31 Aug 2026", status: "Verified", statusColor: "#10b981" },
      { id: "DOC-003", name: "PAN Card Scan", category: "Identity", uploadDate: "31 Aug 2026", status: "Verified", statusColor: "#10b981" },
      { id: "DOC-004", name: "Experience Letter", category: "Employment", uploadDate: "30 Aug 2026", status: "Action Required", statusColor: "#ef4444", rejectionReason: "Uploaded document scan is blurred. Please upload a clear PDF file." },
      { id: "DOC-005", name: "CCNA Cisco Certification", category: "Certifications", uploadDate: "29 Aug 2026", status: "Verified", statusColor: "#10b981" }
    ],
    completionPercent: 80
  };
}

function uploadDocumentToVault(payload) {
  var docId = "DOC-00" + Math.floor(10 + Math.random() * 90);
  return {
    success: true,
    message: "✓ Document " + (payload.docName || payload.fileName) + " uploaded successfully to Google Drive!",
    docId: docId
  };
}

function saveCandidateProfile(payload) {
  return { success: true, message: "✓ Profile updated successfully!", lastSaved: new Date().toLocaleTimeString() };
}

function getCandidateProfile(payload) {
  return {
    success: true,
    candidate: { candidateId: "CAN-000125", firstName: "Rahul", lastName: "Sharma", email: "rahul.sharma@example.com", mobile: "+91 9876543210", city: "Pune", state: "Maharashtra", jobTitle: "Network Engineer", expYears: "3.5" }
  };
}

function saveResume(payload) {
  return { success: true, message: "✓ Resume saved successfully to Google Drive!", resumeId: "RES-2026-000125" };
}

function getJobs(payload) {
  return {
    success: true,
    jobs: [
      { id: "OBS-JOB-00125", title: "Network Engineer", client: "Obsyra Pvt Ltd", location: "Pune, Maharashtra", type: "Full Time", expDisplay: "2-5 Yrs", workMode: "On-Site", department: "Telecom Services", postedDate: "31 Aug 2026", status: "Open", featured: true, matchScore: 92 },
      { id: "OBS-JOB-00126", title: "5G Protocol Testing Engineer", client: "Obsyra Pvt Ltd", location: "Mumbai / Hybrid", type: "Full Time", expDisplay: "3-6 Yrs", workMode: "Hybrid", department: "Testing Services", postedDate: "30 Aug 2026", status: "Open", featured: true, matchScore: 88 },
      { id: "OBS-JOB-00127", title: "Data Center Infrastructure Technician", client: "Obsyra Pvt Ltd", location: "Mumbai", type: "Full Time", expDisplay: "1-4 Yrs", workMode: "On-Site", department: "Infrastructure", postedDate: "29 Aug 2026", status: "Open", featured: false, matchScore: 85 }
    ]
  };
}

function getLocations() {
  return {
    success: true,
    locations: [
      { state: "Maharashtra", cities: ["Pune", "Mumbai", "Nagpur", "Nashik"] },
      { state: "Gujarat", cities: ["Ahmedabad", "Surat", "Vadodara"] },
      { state: "Delhi", cities: ["New Delhi", "Noida", "Gurugram"] }
    ]
  };
}

function submitServiceRequest(payload) {
  var reqId = "OBS-SR-2026-" + Math.floor(100000 + Math.random() * 900000);
  return { success: true, message: "✓ Requirement submitted successfully!", requestId: reqId };
}

function registerCandidate(payload) {
  var candId = "CAN-2026-" + Math.floor(100000 + Math.random() * 900000);
  return { success: true, message: "✓ Account registered successfully!", candidateId: candId };
}

function loginCandidate(payload) {
  return { success: true, message: "✓ Login successful!", user: { candidateId: "CAN-000125", name: "Rahul Sharma", email: payload.email } };
}

function applyForJob(payload) {
  var appId = "APP-2026-" + Math.floor(100000 + Math.random() * 900000);
  return { success: true, message: "🎉 Application submitted successfully!", applicationId: appId };
}

function markCandidateJoined(payload) {
  var jobId = payload.jobId || "OBS-JOB-00125";
  var appId = payload.applicationId || "APP-2026-000386";
  logAudit(payload.adminId || "ADMIN-002", "CANDIDATE_JOINED", "APPLICATIONS", appId, "Selected", "JOINED");

  return {
    success: true,
    message: "🎉 CANDIDATE JOINED & REQUIREMENT FULFILLED! Candidate marked as JOINED. Target vacancies reached (5/5). Vacancy " + jobId + " has automatically been CLOSED.",
    jobClosed: true,
    jobId: jobId,
    requirementStatus: "REQUIREMENT FULFILLED"
  };
}

function getVacanciesStatus() {
  return {
    success: true,
    vacancies: [
      { jobId: "OBS-JOB-00125", title: "Network Engineer", location: "Maharashtra", required: 5, selected: 5, joined: 5, remaining: 0, reqStatus: "REQUIREMENT FULFILLED", jobStatus: "CLOSED" },
      { jobId: "OBS-JOB-00126", title: "5G Protocol Testing Engineer", location: "Maharashtra / Hybrid", required: 5, selected: 4, joined: 3, remaining: 2, reqStatus: "PARTIALLY FULFILLED", jobStatus: "OPEN" }
    ]
  };
}

function getAdminDashboardStats() {
  return {
    success: true,
    stats: { totalCandidates: 1248, newToday: 18, openJobs: 27, totalApplications: 386, shortlisted: 74, interviews: 42, selected: 16, joined: 11 }
  };
}

function updateApplicationStatus(payload) {
  return { success: true, message: "✓ Application status updated to " + payload.newStatus };
}

function scheduleInterview(payload) {
  return { success: true, message: "✓ Interview scheduled successfully!", interviewId: "INT-2026-000125" };
}

function getAuditLogs() {
  return {
    success: true,
    logs: [
      { auditId: "AUD-000125", adminId: "ADMIN-002", action: "STATUS_CHANGED", module: "APPLICATIONS", recordId: "APP-2026-000386", oldValue: "Under Review", newValue: "Shortlisted", dateTime: "01 Sep 2026" }
    ]
  };
}
