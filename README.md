# WorkforceHub
AI-Powered Talent &amp; Workforce Hub (College project SEM 5,6)

My college team members:
DIVYA DEVENBHAI SHAH, VIVEK MAHESHKUMAR WADHWANI

Front-end Technology: React.js with Tailwind CSS (Frontend)

Back-end Technology: Python (Flask or Django) REST APIs with MySQL (Database), integrated with the OpenAI API for AI-driven features

Project Description :

The AI-Powered Talent & Workforce Hub is a full-stack web application that digitizes and intelligently automates core Human Resource operations while embedding advanced artificial intelligence through the OpenAI API. The platform centralizes employee management—covering attendance, leave requests, payroll, training, and performance tracking—while introducing a next-generation AI-driven recruitment pipeline.
Using OpenAI’s language models in combination with custom Natural Language Processing (NLP) workflows, the system automatically parses, analyzes, and ranks candidate resumes according to job requirements and skill sets. Shortlisted applicants receive a secure, proctored mock test that includes both aptitude and coding assessments. The testing environment enforces strict integrity with a configurable exam time limit, live webcam monitoring, screen recording, and browser-lock features. High-scoring candidates are automatically scheduled for a one-to-one interview, and successful interviewees are seamlessly added to the employee database.
The application is developed with React.js and Tailwind CSS for the responsive front end, and a Python back end (Flask/Django) with MySQL for robust data management and AI model integration. The OpenAI API powers resume understanding, automated question generation for the mock test, and intelligent evaluation of candidate responses.
By combining automation, real-time analytics, and the capabilities of the OpenAI API, the AI-Powered Talent & Workforce Hub reduces manual HR effort, accelerates hiring, and delivers a scalable, future-ready solution for enterprise workforce management.

Technology Stack:
    Front-end: React.js with Tailwind CSS for a responsive, modern UI.
    Back-end: Python (Flask or Django) REST APIs with MySQL as the database.
    AI/ML: Python libraries (scikit-learn, spaCy, TensorFlow/PyTorch) 
    integrated with the OpenAI API for advanced language understanding, question generation, and candidate evaluation
    Proctoring & Browser Lock: WebRTC for camera streaming, custom JavaScript hooks for tab-switch detection, and Python services for screen recording storage.

Modules:
1. AI-Powered Recruitment Module
Introduction The Recruitment Module streamlines the hiring pipeline—from resume screening to final onboarding—using artificial intelligence and the OpenAI API. It automatically analyzes resumes, conducts online assessments, schedules interviews, and updates the employee database once a candidate is hired.

Objectives
    Reduce manual effort in shortlisting candidates.
    Ensure unbiased, data-driven hiring decisions.
    Provide secure, monitored mock tests with proctoring features.
    Seamlessly transition successful candidates into the Employee database.
    
Core Features
1. AI Resume Sorting
- Natural Language Processing (NLP) models combined with the OpenAI API parse and rank resumes based on job requirements, skills, and experience.
- Generates a shortlist for HR review.

2. AI-Conducted Mock Test
- Exam Time Limit – Configurable duration for each section.
- Webcam & Screen Proctoring – Real-time camera access plus continuous screen recording.
- Browser Lockdown – Restricts new tabs and blocks Chrome navigation.
- Sections
    Aptitude Test: Logical reasoning and quantitative ability.
    Coding Test: Algorithmic or language-specific coding challenges.
- The OpenAI API assists in generating dynamic aptitude and coding questions, evaluating free-text answers, and providing intelligent feedback.
  
3. Automated Interview Scheduling
- Candidates with good scores get invited to a live video interview.
- Integrated calendar for selecting available time slots.
- OpenAI-powered chat/assistant can suggest suitable time slots based on participant availability.
  
4. Final Onboarding
- Successful candidates’ profiles are automatically pushed into the Employee Module database with their resumes and test/interview records.

Workflow

-Candidate uploads resume → AI (with OpenAI API) shortlists → Secure test link sent → AI proctor monitors aptitude & coding tests and evaluates answers → High scorers receive automated 1:1 interview invitations → Upon HR approval, candidate data flows into the Employee Module.

Benefits
- Faster, bias-free candidate selection powered by OpenAI’s advanced language models.
- End-to-end digital hiring pipeline with automated question generation and answer evaluation.
- Enhanced security and compliance through proctored testing.
- Seamless integration with existing employee records.

2. Employee Module
Introduction:
The Employee Module serves as the backbone of the Smart Workforce Hub, as it holds and organizes all employee-related data in one place. It goes beyond storing basic details by capturing employment history, job roles, assigned responsibilities, and career progress. This structured digital profile enables HR teams to track employee growth, allocate resources effectively, and ensure fair practices across departments. By centralizing the information, the module eliminates redundancy, reduces paperwork, and strengthens communication between employees and decision-makers.
Objectives:
The main objective of this module is to maintain a structured digital database of all employees that minimizes manual errors and paperwork. It ensures that employee records are kept updated and accessible for HR, managers, and authorized staff. Another goal is to provide clarity in role assignments and reporting structures, making it easier for organizations to monitor workforce distribution and plan for promotions or transfers.
Core Features:
1. Employee Database – Stores personal and professional details
2. Role Assignment – Assigns roles and departments
3. Document Repository – Stores resumes and contracts
4. Performance Tracking – Records evaluations and KPIs
5. Reporting Hierarchy – Defines team structures
Workflows:
When a new employee joins, HR creates their profile, uploads documents, and assigns roles. Any changes such as promotions, transfers, or performance updates are added continuously, giving managers access to updated data.
Benefits:
Centralized workforce records, Reduced errors and paperwork, Increased transparency, Faster role assignment, Data-driven decision-making.
3. Leave Module Introduction:
The Leave Module digitizes and streamlines the entire leave process, making it easier for both employees and managers to handle requests without relying on paperwork. Employees can apply for leave through an online system that is accessible anytime, while managers can immediately view these requests, check departmental schedules, and respond quickly. This reduces delays, prevents communication gaps, and ensures that work continuity is maintained even when multiple employees take leave. By integrating with company policies and official holiday calendars, the module ensures fairness, compliance, and effective planning for both short-term and long-term staffing needs.
Objectives:
The primary objective is to create a transparent, fair, and efficient leave process that minimizes confusion and errors. Employees gain real-time visibility into their available leave balances, while managers can make informed decisions based on staffing requirements. Another key goal is to provide HR with reliable data to analyze leave trends, monitor absenteeism, and ensure adherence to organizational and labor policies.
Overall, the objective is to build trust and accountability by making leave tracking structured and accessible.
Core Features:
1. Leave Application – Employees request casual, medical, or earned leave
2. Approval Workflow – Managers approve or reject requests
3. Leave Balance Tracking – Updates automatically
4. Holiday Calendar Integration
5. Leave Reporting
Workflows:
An employee submits a leave request through the system, selecting the type and dates. The request is routed to the reporting manager, who reviews team availability and approves or rejects. Once approved, the system updates leave balances automatically and records the transaction for HR tracking.
Benefits:
Easy leave tracking, Conflict-free approvals, Real-time balance visibility, Compliance with leave policies, Improved transparency, Reliable records for HR analysis
4. Payroll Module Introduction:
The Payroll Module is one of the most essential components of the Smart Workforce Hub because it directly impacts employee satisfaction and organizational credibility. It automates the complete salary cycle by integrating attendance, overtime, and leave data, ensuring that every employee is compensated accurately according to their work. The system manages gross and net pay calculations, applies deductions for taxes, insurance, or provident funds, and adds allowances where applicable. Payslips are generated instantly and can be accessed online, reducing paperwork and delays. By removing manual intervention, the module not only saves HR time but also minimizes payroll errors, builds employee trust, and ensures financial compliance.
Objectives:
The main objective is to provide a fast, accurate, and fully automated payroll process that reduces human error and saves valuable time for HR teams. It ensures timely salary disbursement by linking with attendance and leave modules, preventing calculation mismatches. Another important goal is to give employees transparency in how their salaries are structured, including deductions and benefits, so they can access payslips easily and resolve doubts without lengthy inquiries. This promotes fairness, accountability, and confidence in the system.
Core Features:
1. Salary Calculation
2. Tax and Deductions
3. Payslip Generation
4. Bank Integration
5. Payroll Reports
Workflows:
The payroll system pulls data from attendance and leave modules, calculates salaries, applies necessary deductions, and generates payslips for each employee. Once verified, it processes salary transfers automatically through linked bank accounts.
Benefits:
Accurate salary processing, Compliance with tax rules, Reduced HR workload, Transparent deductions, Timely payments, Greater employee satisfaction.
5. Training and Development Module Introduction:
The Training and Development Module focuses on empowering employees through structured learning and continuous skill enhancement. It provides HR teams with the tools to organize training programs, assign online learning materials, and monitor participation and certifications in a single system. By offering a combination of classroom sessions, e-learning, and feedback-driven courses, the module ensures that employees are not only prepared for their current roles but also for future responsibilities. This contributes directly to organizational growth, as a skilled workforce can adapt to changes faster and deliver better results. Additionally, it creates a culture of learning that motivates employees, improves retention, and demonstrates the company’s commitment to their career development.
Objectives:
The primary objective is to create a structured and transparent learning environment that aligns employee development with organizational needs. It ensures employees complete essential compliance training while also gaining access to career-focused programs that enhance their professional growth. Another objective is to capture training feedback, evaluate effectiveness, and use progress reports to improve future programs, making training more measurable and impactful.
Core Features:
1. Training Programs
2. E-learning Access
3. Certification Tracking
4. Feedback Collection
5. Progress Reports
Workflows:
HR schedules training programs, assigns eligible employees, and notifies them through the system. Employees complete sessions or online courses, provide feedback, and records are updated to reflect their progress and certifications.
Benefits:
Skill improvement, Career growth support, Higher employee retention, Workforce readiness, better compliance monitoring.
6. Attendance Module
Introduction:
The Attendance Module automates the daily tracking of employee presence, replacing outdated manual registers. It records working hours, clock-in/clock-out times, and overtime with the help of biometric systems or digital portals. This ensures not only accuracy but also fairness in attendance monitoring. By feeding data directly into payroll and performance tracking, the module ensures that employee contributions are properly recognized and compensated.
Objectives:
The key objective is to maintain accurate attendance data that supports payroll processing and workforce analysis. It also aims to reduce disputes about working hours, increase accountability, and give managers better insight into absenteeism trends. Furthermore, it helps organizations plan shifts and schedules more effectively.
    Core Features:
1. Clock-in/Clock-out Logging
2. Biometric or ID Integration
3. Shift Scheduling
4. Overtime Recording
5. Absence Reports
    Workflows:
Employees mark attendance through biometric devices or an online portal. The system records daily hours and overtime, generating attendance reports for HR.
    Benefits:
Accurate payroll inputs, Reduced attendance disputes, Transparent tracking, Shift planning support, better productivity monitoring.
