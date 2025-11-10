# EPIC-001: Core Complaint Management System (v1.0)

*   **Status:** Completed
*   **Description:** This Epic covers the implementation of the foundational, end-to-end system that allows citizens to submit complaints and administrators to log in, view, and manage them. This corresponds to the product state required for the "Internal Pilot" and "MVP Private Beta" phases.

---

## User Stories

### 1. Public Complaint Submission
*   **Story:** As a **Citizen**, I want to submit a complaint with my location, a description, and a photo, **so that** the municipality is clearly and accurately informed of the issue.
*   **Story Points:** 8
*   **Status:** Completed
*   **Tasks:**
    *   [x] Design public submission form UI (`index.html`).
    *   [x] Style the form for desktop and mobile (`styles.css`).
    *   [x] Implement frontend logic for image selection and preview (`script.js`).
    *   [x] Implement frontend logic to show a success modal with a Complaint ID after submission (`script.js`).
    *   [x] Create backend endpoint to receive complaint data (`POST /api/complaints`).
    *   [x] Implement backend logic to store complaint text data in the D1 database.
    *   [x] Implement backend logic to upload and store the complaint image in the R2 bucket.

### 2. Admin Authentication
*   **Story:** As an **Admin**, I want to log in to the system through a secure portal, **so that** only authorized personnel can view and manage sensitive complaint data.
*   **Story Points:** 3
*   **Status:** Completed
*   **Tasks:**
    *   [x] Design the admin login form UI (`index.html`).
    *   [x] Implement frontend logic for showing/hiding the login view (`script.js`).
    *   [x] Create a backend endpoint for authentication (`POST /api/login`).
    *   [x] Implement backend logic to securely validate credentials against secrets managed in Cloudflare.
    *   [x] Implement frontend logic to store a session token and redirect to the dashboard on successful login.

### 3. Admin Complaint Dashboard
*   **Story:** As an **Admin**, I want to see a dashboard with a list of all complaints and their key details (ID, location, status), **so that** I can get a quick overview of the current workload.
*   **Story Points:** 5
*   **Status:** Completed
*   **Tasks:**
    *   [x] Design the admin dashboard UI, including statistics cards and the main complaints table (`index.html`).
    *   [x] Style the dashboard for desktop and mobile, ensuring the table is readable (`styles.css`).
    *   [x] Create a secure backend endpoint to fetch all complaints from the database (`GET /api/complaints`).
    *   [x] Implement frontend logic to call the API and dynamically render the fetched complaints in the table.
    *   [x] Implement frontend logic to update the statistics cards based on the fetched data.

### 4. Admin Complaint Management
*   **Story:** As an **Admin**, I want to be able to assign a complaint to a specific officer and later mark it as complete with photo evidence, **so that** I can manage the entire complaint resolution lifecycle.
*   **Story Points:** 8
*   **Status:** Completed
*   **Tasks:**
    *   [x] Design modals for "Assign Officer" and "Mark as Completed" (`index.html`).
    *   [x] Create a secure backend endpoint to update a complaint's status, assignee, and completion details (`PUT /api/complaints/:id`).
    *   [x] Implement frontend logic to open the modals and pass the correct Complaint ID.
    *   [x] Implement the frontend flow for assigning an officer and updating the UI.
    *   [x] Implement the frontend flow for the completion process, including uploading the "after" photo.
    *   [x] Implement backend logic to handle the "after" photo upload to R2 and update the complaint record in D1.
