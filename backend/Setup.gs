/**
 * OBSYRA JOB & CAREER PORTAL - ONE-CLICK SETUP SCRIPT
 * Run function setupDatabaseAndDrive() once in Google Apps Script editor.
 */

function setupDatabaseAndDrive() {
  Logger.log("Starting Obsyra System Auto-Provisioning...");

  var ss = SpreadsheetApp.create("OBSYRA_RECRUITMENT_DATABASE");
  var ssId = ss.getId();
  Logger.log("Created Master Database Spreadsheet ID: " + ssId);

  var sheetsConfig = {
    "SETTINGS": ["Setting_Key", "Value", "Description", "Last_Updated"],
    "LOCATIONS": ["Location_ID", "State_UT", "Type", "Status"],
    "JOBS": ["Job_ID", "Job_Title", "Department", "Category", "Client", "City", "State", "Experience", "Salary", "Employment_Type", "Work_Mode", "Shift", "Required_Vacancies", "Applications_Count", "Shortlisted_Count", "Interview_Count", "Selected_Count", "Joined_Count", "Skills", "Description", "Responsibilities", "Requirements", "Urgent_Hiring", "Posted_Date", "Deadline", "Status", "Requirement_Status", "Views"],
    "AUDIT_LOG": ["Audit_ID", "Admin_ID", "Action", "Module", "Record_ID", "Old_Value", "New_Value", "IP_Reference", "Date_Time"],
    "ADMIN_USERS": ["Admin_ID", "Name", "Email", "Password_Hash", "Role", "Status", "Created_Date"],
    "CANDIDATES": ["Candidate_ID", "First_Name", "Middle_Name", "Last_Name", "Email", "Mobile", "Alternate_Mobile", "WhatsApp", "LinkedIn", "Portfolio", "Current_Address", "Current_City", "Current_State", "PIN", "Permanent_Address", "DOB", "Gender", "Nationality", "Current_Job_Title", "Current_Company", "Total_Experience", "Relevant_Experience", "Current_Salary", "Expected_Salary", "Employment_Status", "Notice_Period", "Willing_To_Relocate", "Profile_Visibility", "Profile_Completion", "Created_Date", "Updated_Date"],
    "CANDIDATE_EDUCATION": ["Education_ID", "Candidate_ID", "Qualification", "Specialization", "Institute", "University", "Year", "CGPA"],
    "CANDIDATE_EXPERIENCE": ["Experience_ID", "Candidate_ID", "Company", "Designation", "Location", "Employment_Type", "Start_Date", "End_Date", "Current_Job", "Responsibilities", "Achievements"],
    "CANDIDATE_SKILLS": ["Candidate_ID", "Skill_ID", "Skill_Name", "Category", "Experience", "Proficiency"],
    "CANDIDATE_PREFERENCES": ["Candidate_ID", "Preferred_Role", "Preferred_Department", "Preferred_State", "Preferred_City", "Preferred_Work_Mode", "Preferred_Job_Type", "Expected_Salary", "Preferred_Shift", "Willing_To_Relocate"],
    "CANDIDATE_CERTIFICATIONS": ["Certification_ID", "Candidate_ID", "Certification_Name", "Organization", "Issue_Date", "Credential_ID", "Credential_URL"],
    "RESUMES": ["Resume_ID", "Candidate_ID", "Resume_Name", "Template_ID", "Objective", "Created_Date", "Updated_Date", "Completion_Percentage", "Status", "Drive_File_ID"],
    "SAVED_JOBS": ["Save_ID", "Candidate_ID", "Job_ID", "Saved_Date"],
    "SERVICE_REQUESTS": ["Request_ID", "Request_Date", "Request_Time", "Company_Name", "Contact_Name", "Designation", "Mobile", "Email", "Alternate_Mobile", "City", "State", "Project_Name", "Project_Location", "Industry", "Project_Type", "Start_Date", "Duration", "Priority", "Primary_Service", "Additional_Services", "Manpower_Required", "Required_Skills", "Project_Description", "Technical_Requirement", "Contact_Preference", "Status", "Assigned_Manager", "Assigned_Team", "Quotation_ID", "Created_By", "Created_Date", "Updated_Date"],
    "APPLICATIONS": ["Application_ID", "Candidate_ID", "Job_ID", "Job_Title", "Department", "Location", "Application_Date", "Application_Time", "Resume_ID", "Resume_Version", "Application_Status", "Current_Stage", "Recruiter_ID", "Recruiter_Name", "Interview_ID", "Offer_ID", "Candidate_Confirmation", "Withdrawal_Status", "Created_Date", "Updated_Date"],
    "APPLICATION_DOCUMENTS": ["Application_Document_ID", "Application_ID", "Candidate_ID", "Document_ID", "Document_Version", "Document_Type", "File_Name", "Drive_File_ID", "Submitted_Date", "Status"],
    "INTERVIEWS": ["Interview_ID", "Application_ID", "Candidate_ID", "Job_ID", "Job_Title", "Round_Number", "Round_Name", "Interview_Type", "Interview_Mode", "Interview_Date", "Start_Time", "End_Time", "Duration", "Interviewer", "Meeting_Platform", "Meeting_Link", "Meeting_ID", "Passcode", "Location", "Instructions", "Status", "Candidate_Confirmation", "Created_Date", "Updated_Date"],
    "INTERVIEW_FEEDBACK": ["Feedback_ID", "Interview_ID", "Candidate_ID", "Interviewer", "Technical_Rating", "Communication_Rating", "Cultural_Fit", "Comments", "Decision", "Date_Time"],
    "DOCUMENTS": ["Document_ID", "Candidate_ID", "Document_Category", "Document_Type", "Document_Name", "File_Name", "Drive_File_ID", "Drive_URL", "File_Type", "File_Size", "Version", "Upload_Date", "Expiry_Date", "Verification_Status", "Verified_By", "Verified_Date", "Rejection_Reason", "Is_Current", "Status"],
    "NOTIFICATIONS": ["Notification_ID", "User_ID", "Title", "Message", "Created_Date", "Read_Status"]
  };

  var defaultSheet = ss.getActiveSheet();
  var sheetNames = Object.keys(sheetsConfig);

  sheetNames.forEach(function(name, idx) {
    var sheet = (idx === 0) ? defaultSheet : ss.insertSheet(name);
    if (idx === 0) sheet.setName(name);

    var headers = sheetsConfig[name];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#0284c7").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  });

  var settingsSheet = ss.getSheetByName("SETTINGS");
  settingsSheet.appendRow(["SYSTEM_VERSION", "4.1.0", "Obsyra Automated Vacancy Workflow Engine", new Date()]);

  Logger.log("SUCCESS! Database & Automated Vacancy tables provisioned. Spreadsheet ID: " + ssId);
}
