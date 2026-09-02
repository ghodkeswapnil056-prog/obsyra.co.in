-- ====================================================================
-- OBSYRA PVT LTD — RECRUITMENT & SERVICE REQUEST SYSTEM SQL DATABASE SCHEMA
-- Compatible with MySQL, PostgreSQL, SQLite, GCP Cloud SQL & Supabase
-- Database Version: 4.4.0
-- Created: 2026-09-02
-- ====================================================================

-- 1. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. LOCATIONS TABLE (28 STATES, 8 UTS & CITIES)
CREATE TABLE IF NOT EXISTS locations (
    location_id VARCHAR(50) PRIMARY KEY,
    state_ut VARCHAR(100) NOT NULL,
    city_name VARCHAR(100),
    type VARCHAR(50) DEFAULT 'State',
    status VARCHAR(20) DEFAULT 'Active'
);

-- 3. JOBS TABLE (VACANCY MANAGEMENT)
CREATE TABLE IF NOT EXISTS jobs (
    job_id VARCHAR(50) PRIMARY KEY,
    job_title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    client VARCHAR(100) DEFAULT 'Obsyra Pvt Ltd',
    city VARCHAR(100),
    state VARCHAR(100),
    experience VARCHAR(50),
    salary VARCHAR(100),
    employment_type VARCHAR(50) DEFAULT 'Full Time',
    work_mode VARCHAR(50) DEFAULT 'On-Site',
    shift VARCHAR(50) DEFAULT 'Day Shift',
    required_vacancies INT DEFAULT 1,
    applications_count INT DEFAULT 0,
    shortlisted_count INT DEFAULT 0,
    interview_count INT DEFAULT 0,
    selected_count INT DEFAULT 0,
    joined_count INT DEFAULT 0,
    skills TEXT,
    description TEXT,
    responsibilities TEXT,
    requirements TEXT,
    urgent_hiring BOOLEAN DEFAULT FALSE,
    posted_date DATE,
    deadline DATE,
    status VARCHAR(50) DEFAULT 'Open',
    requirement_status VARCHAR(50) DEFAULT 'PARTIALLY FULFILLED',
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. SYSTEM AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS audit_log (
    audit_id VARCHAR(50) PRIMARY KEY,
    admin_id VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(100) NOT NULL,
    record_id VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    ip_reference VARCHAR(50),
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. ADMIN USERS TABLE (ROLE-BASED ACCESS)
CREATE TABLE IF NOT EXISTS admin_users (
    admin_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'HR Recruiter',
    status VARCHAR(20) DEFAULT 'Active',
    created_date DATE
);

-- 6. CANDIDATES MASTER PROFILE TABLE
CREATE TABLE IF NOT EXISTS candidates (
    candidate_id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    alternate_mobile VARCHAR(20),
    whatsapp VARCHAR(20),
    linkedin VARCHAR(255),
    portfolio VARCHAR(255),
    current_address TEXT,
    current_city VARCHAR(100),
    current_state VARCHAR(100),
    pin VARCHAR(20),
    permanent_address TEXT,
    dob DATE,
    gender VARCHAR(20),
    nationality VARCHAR(50) DEFAULT 'Indian',
    current_job_title VARCHAR(150),
    current_company VARCHAR(150),
    total_experience VARCHAR(50),
    relevant_experience VARCHAR(50),
    current_salary VARCHAR(50),
    expected_salary VARCHAR(50),
    employment_status VARCHAR(50),
    notice_period VARCHAR(50),
    willing_to_relocate BOOLEAN DEFAULT TRUE,
    profile_visibility VARCHAR(50) DEFAULT 'Public',
    profile_completion INT DEFAULT 0,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 7. CANDIDATE EDUCATION TABLE
CREATE TABLE IF NOT EXISTS candidate_education (
    education_id VARCHAR(50) PRIMARY KEY,
    candidate_id VARCHAR(50) REFERENCES candidates(candidate_id),
    qualification VARCHAR(100),
    specialization VARCHAR(100),
    institute VARCHAR(255),
    university VARCHAR(255),
    year INT,
    cgpa VARCHAR(20)
);

-- 8. CANDIDATE EXPERIENCE TABLE
CREATE TABLE IF NOT EXISTS candidate_experience (
    experience_id VARCHAR(50) PRIMARY KEY,
    candidate_id VARCHAR(50) REFERENCES candidates(candidate_id),
    company VARCHAR(150),
    designation VARCHAR(150),
    location VARCHAR(100),
    employment_type VARCHAR(50),
    start_date DATE,
    end_date DATE,
    current_job BOOLEAN DEFAULT FALSE,
    responsibilities TEXT,
    achievements TEXT
);

-- 9. CANDIDATE SKILLS TABLE
CREATE TABLE IF NOT EXISTS candidate_skills (
    candidate_id VARCHAR(50) REFERENCES candidates(candidate_id),
    skill_id VARCHAR(50),
    skill_name VARCHAR(100),
    category VARCHAR(100),
    experience VARCHAR(50),
    proficiency VARCHAR(50),
    PRIMARY KEY (candidate_id, skill_name)
);

-- 10. CANDIDATE PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS candidate_preferences (
    candidate_id VARCHAR(50) PRIMARY KEY REFERENCES candidates(candidate_id),
    preferred_role VARCHAR(150),
    preferred_department VARCHAR(100),
    preferred_state VARCHAR(100),
    preferred_city VARCHAR(100),
    preferred_work_mode VARCHAR(50),
    preferred_job_type VARCHAR(50),
    expected_salary VARCHAR(50),
    preferred_shift VARCHAR(50),
    willing_to_relocate BOOLEAN DEFAULT TRUE
);

-- 11. CANDIDATE CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS candidate_certifications (
    certification_id VARCHAR(50) PRIMARY KEY,
    candidate_id VARCHAR(50) REFERENCES candidates(candidate_id),
    certification_name VARCHAR(150),
    organization VARCHAR(150),
    issue_date DATE,
    credential_id VARCHAR(100),
    credential_url VARCHAR(255)
);

-- 12. RESUMES TABLE
CREATE TABLE IF NOT EXISTS resumes (
    resume_id VARCHAR(50) PRIMARY KEY,
    candidate_id VARCHAR(50) REFERENCES candidates(candidate_id),
    resume_name VARCHAR(150),
    template_id VARCHAR(50) DEFAULT 'modern-a4',
    objective TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completion_percentage INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    drive_file_id VARCHAR(100)
);

-- 13. SAVED JOBS TABLE
CREATE TABLE IF NOT EXISTS saved_jobs (
    save_id VARCHAR(50) PRIMARY KEY,
    candidate_id VARCHAR(50) REFERENCES candidates(candidate_id),
    job_id VARCHAR(50) REFERENCES jobs(job_id),
    saved_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. CUSTOMER SERVICE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS service_requests (
    request_id VARCHAR(50) PRIMARY KEY,
    request_date DATE,
    request_time TIME,
    company_name VARCHAR(150) NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL,
    alternate_mobile VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(100),
    project_name VARCHAR(150),
    project_location VARCHAR(100),
    industry VARCHAR(100),
    project_type VARCHAR(100),
    start_date DATE,
    duration VARCHAR(50),
    priority VARCHAR(50) DEFAULT 'Medium',
    primary_service VARCHAR(100),
    additional_services TEXT,
    manpower_required INT DEFAULT 1,
    required_skills TEXT,
    project_description TEXT,
    technical_requirement TEXT,
    contact_preference VARCHAR(50) DEFAULT 'Phone',
    status VARCHAR(50) DEFAULT 'New Requirement',
    assigned_manager VARCHAR(100),
    assigned_team VARCHAR(100),
    quotation_id VARCHAR(50),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. APPLICATIONS TABLE (8-STAGE WORKFLOW)
CREATE TABLE IF NOT EXISTS applications (
    application_id VARCHAR(50) PRIMARY KEY,
    candidate_id VARCHAR(50) REFERENCES candidates(candidate_id),
    job_id VARCHAR(50) REFERENCES jobs(job_id),
    job_title VARCHAR(150),
    department VARCHAR(100),
    location VARCHAR(100),
    application_date DATE,
    application_time TIME,
    resume_id VARCHAR(50),
    resume_version VARCHAR(20),
    application_status VARCHAR(50) DEFAULT 'Applied',
    current_stage VARCHAR(50) DEFAULT 'Under Review',
    recruiter_id VARCHAR(50),
    recruiter_name VARCHAR(100),
    interview_id VARCHAR(50),
    offer_id VARCHAR(50),
    candidate_confirmation VARCHAR(50),
    withdrawal_status VARCHAR(50) DEFAULT 'Active',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 16. APPLICATION DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS application_documents (
    application_document_id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) REFERENCES applications(application_id),
    candidate_id VARCHAR(50) REFERENCES candidates(candidate_id),
    document_id VARCHAR(50),
    document_type VARCHAR(100),
    file_name VARCHAR(255),
    drive_file_id VARCHAR(100),
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Submitted'
);

-- 17. INTERVIEWS TABLE
CREATE TABLE IF NOT EXISTS interviews (
    interview_id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) REFERENCES applications(application_id),
    candidate_id VARCHAR(50) REFERENCES candidates(candidate_id),
    job_id VARCHAR(50) REFERENCES jobs(job_id),
    job_title VARCHAR(150),
    round_number INT DEFAULT 1,
    round_name VARCHAR(100) DEFAULT 'Technical Round',
    interview_type VARCHAR(50) DEFAULT 'Technical',
    interview_mode VARCHAR(50) DEFAULT 'Online Video',
    interview_date DATE,
    start_time TIME,
    end_time TIME,
    duration VARCHAR(50) DEFAULT '45 Mins',
    interviewer VARCHAR(100),
    meeting_platform VARCHAR(50) DEFAULT 'Google Meet',
    meeting_link VARCHAR(255),
    meeting_id VARCHAR(100),
    passcode VARCHAR(50),
    location TEXT,
    instructions TEXT,
    status VARCHAR(50) DEFAULT 'Scheduled',
    candidate_confirmation VARCHAR(50) DEFAULT 'Confirmed',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. INTERVIEW FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS interview_feedback (
    feedback_id VARCHAR(50) PRIMARY KEY,
    interview_id VARCHAR(50) REFERENCES interviews(interview_id),
    candidate_id VARCHAR(50) REFERENCES candidates(candidate_id),
    interviewer VARCHAR(100),
    technical_rating INT DEFAULT 5,
    communication_rating INT DEFAULT 5,
    cultural_fit INT DEFAULT 5,
    comments TEXT,
    decision VARCHAR(50) DEFAULT 'Proceed to Next Round',
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. DOCUMENT VAULT TABLE
CREATE TABLE IF NOT EXISTS documents (
    document_id VARCHAR(50) PRIMARY KEY,
    candidate_id VARCHAR(50) REFERENCES candidates(candidate_id),
    document_category VARCHAR(100) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(150) NOT NULL,
    file_name VARCHAR(255),
    drive_file_id VARCHAR(100),
    drive_url VARCHAR(255),
    file_type VARCHAR(50),
    file_size VARCHAR(50),
    version VARCHAR(20) DEFAULT 'v1.0',
    upload_date DATE,
    expiry_date DATE,
    verification_status VARCHAR(50) DEFAULT 'Pending Verification',
    verified_by VARCHAR(100),
    verified_date DATE,
    rejection_reason TEXT,
    is_current BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'Active'
);

-- 20. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    notification_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_status BOOLEAN DEFAULT FALSE
);

-- ====================================================================
-- INITIAL SEED DATA
-- ====================================================================

-- SEED SYSTEM SETTINGS
INSERT INTO settings (setting_key, value, description) VALUES
('SYSTEM_VERSION', '4.4.0', 'Obsyra Automated Vacancy Workflow Engine'),
('COMPANY_NAME', 'Obsyra Pvt Ltd', 'Corporate Legal Name'),
('REGISTERED_LOCATION', 'Wagholi, Pune, Maharashtra, India', 'Corporate Head Office');

-- SEED ADMIN USERS
INSERT INTO admin_users (admin_id, name, email, password_hash, role, status, created_date) VALUES
('ADMIN-001', 'Surekha Aade', 'surekha@obsyra.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Super Admin', 'Active', '2026-02-16'),
('ADMIN-002', 'Anil Kumar', 'anil.kumar@obsyra.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'HR Manager', 'Active', '2026-02-16');

-- SEED JOBS
INSERT INTO jobs (job_id, job_title, department, category, client, city, state, experience, salary, required_vacancies, selected_count, joined_count, status, requirement_status) VALUES
('OBS-JOB-00125', 'Network Engineer', 'Telecom Services', 'Engineering', 'Obsyra Pvt Ltd', 'Pune', 'Maharashtra', '2-5 Yrs', '₹4.5 - ₹7.5 LPA', 5, 5, 5, 'Closed', 'REQUIREMENT FULFILLED'),
('OBS-JOB-00126', '5G Protocol Testing Engineer', 'Testing Services', 'Testing & QA', 'Obsyra Pvt Ltd', 'Mumbai', 'Maharashtra', '3-6 Yrs', '₹6.0 - ₹10.0 LPA', 5, 4, 3, 'Open', 'PARTIALLY FULFILLED'),
('OBS-JOB-00127', 'Data Center Infrastructure Technician', 'Infrastructure', 'IT & Telecom', 'Obsyra Pvt Ltd', 'Mumbai', 'Maharashtra', '1-4 Yrs', '₹3.5 - ₹5.5 LPA', 3, 2, 1, 'Open', 'PARTIALLY FULFILLED');

-- ====================================================================
-- END OF SCHEMA SCRIPT
-- ====================================================================
