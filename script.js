// Application State
let state = {
    complaints: [],
    complaintCounter: 1000,
    currentAssignmentIndex: null,
    currentCompletionIndex: null,
    selectedCompletionImage: null,
    isAdminLoggedIn: false
};

// Admin credentials (in production, this should be server-side)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadComplaintsFromStorage();
    setupEventListeners();

    // Check if admin is logged in
    const adminLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (adminLoggedIn === 'true') {
        state.isAdminLoggedIn = true;
        showAdminDashboard();
    }
});

// ============ DATA PERSISTENCE ============

function saveComplaintsToStorage() {
    localStorage.setItem('complaints', JSON.stringify(state.complaints));
    localStorage.setItem('complaintCounter', state.complaintCounter.toString());
}

function loadComplaintsFromStorage() {
    const savedComplaints = localStorage.getItem('complaints');
    const savedCounter = localStorage.getItem('complaintCounter');

    if (savedComplaints) {
        state.complaints = JSON.parse(savedComplaints);
    }

    if (savedCounter) {
        state.complaintCounter = parseInt(savedCounter);
    }
}

// ============ VIEW NAVIGATION ============

function showPublicView() {
    document.getElementById('public-view').style.display = 'block';
    document.getElementById('admin-login-view').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'none';
}

function showAdminLogin() {
    document.getElementById('public-view').style.display = 'none';
    document.getElementById('admin-login-view').style.display = 'block';
    document.getElementById('admin-dashboard-view').style.display = 'none';
}

function showAdminDashboard() {
    document.getElementById('public-view').style.display = 'none';
    document.getElementById('admin-login-view').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'block';

    updateAdminStats();
    renderComplaintsTable();
}

function logout() {
    state.isAdminLoggedIn = false;
    sessionStorage.removeItem('adminLoggedIn');
    showPublicView();

    // Clear login form
    document.getElementById('admin-login-form').reset();
}

// ============ EVENT LISTENERS ============

function setupEventListeners() {
    // Public complaint form
    const complaintForm = document.getElementById('complaint-form');
    complaintForm.addEventListener('submit', handleComplaintSubmit);

    // Public image upload
    const publicUploadBox = document.getElementById('public-upload-box');
    const publicImageUpload = document.getElementById('public-image-upload');

    publicUploadBox.addEventListener('click', () => {
        publicImageUpload.click();
    });

    publicImageUpload.addEventListener('change', (e) => {
        handlePublicImageUpload(e);
    });

    // Drag and drop for public upload
    publicUploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        publicUploadBox.classList.add('dragover');
    });

    publicUploadBox.addEventListener('dragleave', () => {
        publicUploadBox.classList.remove('dragover');
    });

    publicUploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        publicUploadBox.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageFile(file, 'public');
        }
    });

    // Admin login form
    const adminLoginForm = document.getElementById('admin-login-form');
    adminLoginForm.addEventListener('submit', handleAdminLogin);

    // Completion image upload
    const uploadArea = document.getElementById('upload-area');
    const completionImageUpload = document.getElementById('completion-image-upload');

    uploadArea.addEventListener('click', () => {
        completionImageUpload.click();
    });

    completionImageUpload.addEventListener('change', (e) => {
        handleCompletionImageUpload(e);
    });

    // Drag and drop for completion upload
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageFile(file, 'completion');
        }
    });
}

// ============ PUBLIC COMPLAINT SUBMISSION ============

function handlePublicImageUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageFile(file, 'public');
    }
}

function handleImageFile(file, type) {
    const reader = new FileReader();
    reader.onload = (event) => {
        if (type === 'public') {
            showPublicImagePreview(event.target.result);
        } else if (type === 'completion') {
            showCompletionImagePreview(event.target.result);
        }
    };
    reader.readAsDataURL(file);
}

function showPublicImagePreview(imageSrc) {
    document.getElementById('public-upload-box').style.display = 'none';
    document.getElementById('public-image-preview').style.display = 'block';
    document.getElementById('public-preview-img').src = imageSrc;
}

function changePublicImage() {
    document.getElementById('public-image-upload').click();
}

function handleComplaintSubmit(e) {
    e.preventDefault();

    const location = document.getElementById('complaint-location').value;
    const description = document.getElementById('complaint-description').value;
    const contact = document.getElementById('complaint-contact').value;
    const image = document.getElementById('public-preview-img').src;

    if (!image) {
        alert('Please upload a photo of the issue');
        return;
    }

    // Create complaint
    const complaint = {
        id: state.complaintCounter++,
        location: location,
        description: description,
        contact: contact,
        status: 'pending',
        assignedTo: null,
        beforeImage: image,
        afterImage: null,
        submittedAt: new Date().toISOString(),
        completedAt: null
    };

    state.complaints.push(complaint);
    saveComplaintsToStorage();

    // Show success modal
    document.getElementById('complaint-id-display').textContent = '#' + complaint.id;
    document.getElementById('success-modal').classList.add('active');

    // Reset form
    document.getElementById('complaint-form').reset();
    document.getElementById('public-upload-box').style.display = 'block';
    document.getElementById('public-image-preview').style.display = 'none';
    document.getElementById('public-preview-img').src = '';
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.remove('active');
}

// ============ ADMIN AUTHENTICATION ============

function handleAdminLogin(e) {
    e.preventDefault();

    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        state.isAdminLoggedIn = true;
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminDashboard();
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

// ============ ADMIN DASHBOARD ============

function updateAdminStats() {
    const total = state.complaints.length;
    const pending = state.complaints.filter(c => c.status === 'pending').length;
    const processing = state.complaints.filter(c => c.status === 'processing').length;
    const completed = state.complaints.filter(c => c.status === 'completed').length;

    document.getElementById('total-complaints').textContent = total;
    document.getElementById('pending-complaints').textContent = pending;
    document.getElementById('processing-complaints').textContent = processing;
    document.getElementById('completed-complaints').textContent = completed;
}

function renderComplaintsTable() {
    const tableBody = document.getElementById('complaints-list');

    if (state.complaints.length === 0) {
        tableBody.innerHTML = '<div class="no-complaints">No complaints registered yet</div>';
        return;
    }

    tableBody.innerHTML = '';

    // Sort complaints by ID (newest first)
    const sortedComplaints = [...state.complaints].sort((a, b) => b.id - a.id);

    sortedComplaints.forEach((complaint, index) => {
        const actualIndex = state.complaints.findIndex(c => c.id === complaint.id);
        const row = document.createElement('div');
        row.className = 'complaint-row';

        let statusClass = 'status-pending';
        let statusText = 'Pending';
        if (complaint.status === 'processing') {
            statusClass = 'status-processing';
            statusText = 'In Process';
        } else if (complaint.status === 'completed') {
            statusClass = 'status-completed';
            statusText = 'Completed';
        }

        let actionButton = '';
        if (complaint.status === 'pending') {
            actionButton = `<button class="btn-assign" onclick="openAssignModal(${actualIndex})">Assign</button>`;
        } else if (complaint.status === 'processing') {
            actionButton = `<button class="btn-complete" onclick="openCompletionModal(${actualIndex})">Mark Complete</button>`;
        } else {
            actionButton = `<span class="completed-icon">✓</span>`;
        }

        const shortDescription = complaint.description.length > 50
            ? complaint.description.substring(0, 50) + '...'
            : complaint.description;

        row.innerHTML = `
            <div class="complaint-id" data-label="ID:">#${complaint.id}</div>
            <div class="complaint-location" data-label="Location:">${complaint.location}</div>
            <div class="complaint-description" data-label="Description:" title="${complaint.description}">${shortDescription}</div>
            <div class="complaint-contact" data-label="Contact:">${complaint.contact}</div>
            <div data-label="Status:"><span class="status-badge ${statusClass}">${statusText}</span></div>
            <div class="assigned-officer" data-label="Assigned To:">${complaint.assignedTo || '-'}</div>
            <div class="complaint-actions" data-label="Action:">
                <button class="btn-view" onclick="viewComplaint(${actualIndex})" title="View Details">👁️</button>
                ${actionButton}
            </div>
        `;

        tableBody.appendChild(row);
    });
}

// ============ OFFICER ASSIGNMENT ============

function openAssignModal(index) {
    state.currentAssignmentIndex = index;
    document.getElementById('officer-select').value = '';
    document.getElementById('assign-modal').classList.add('active');
}

function closeAssignModal() {
    document.getElementById('assign-modal').classList.remove('active');
    state.currentAssignmentIndex = null;
}

function confirmAssignment() {
    const officer = document.getElementById('officer-select').value;

    if (!officer) {
        alert('Please select an officer');
        return;
    }

    if (state.currentAssignmentIndex === null) return;

    const complaint = state.complaints[state.currentAssignmentIndex];
    complaint.status = 'processing';
    complaint.assignedTo = officer;

    saveComplaintsToStorage();
    updateAdminStats();
    renderComplaintsTable();
    closeAssignModal();

    showNotification('Complaint #' + complaint.id + ' assigned to ' + officer);
}

// ============ COMPLAINT COMPLETION ============

function openCompletionModal(index) {
    state.currentCompletionIndex = index;
    state.selectedCompletionImage = null;

    // Reset modal state
    document.getElementById('upload-area').style.display = 'block';
    document.getElementById('completion-image-preview').style.display = 'none';
    document.getElementById('completion-preview-img').src = '';
    document.getElementById('btn-submit-completion').disabled = true;

    // Show modal
    document.getElementById('completion-modal').classList.add('active');
}

function closeCompletionModal() {
    document.getElementById('completion-modal').classList.remove('active');
    state.currentCompletionIndex = null;
    state.selectedCompletionImage = null;
}

function handleCompletionImageUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            showCompletionImagePreview(event.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function showCompletionImagePreview(imageSrc) {
    state.selectedCompletionImage = imageSrc;
    document.getElementById('upload-area').style.display = 'none';
    document.getElementById('completion-image-preview').style.display = 'block';
    document.getElementById('completion-preview-img').src = imageSrc;
    document.getElementById('btn-submit-completion').disabled = false;
}

function changeCompletionImage() {
    document.getElementById('completion-image-upload').click();
}

function submitCompletion() {
    if (state.currentCompletionIndex === null || !state.selectedCompletionImage) {
        return;
    }

    const complaint = state.complaints[state.currentCompletionIndex];
    complaint.status = 'completed';
    complaint.afterImage = state.selectedCompletionImage;
    complaint.completedAt = new Date().toISOString();

    saveComplaintsToStorage();
    updateAdminStats();
    renderComplaintsTable();
    closeCompletionModal();

    showNotification('Complaint #' + complaint.id + ' marked as completed');
}

// ============ VIEW COMPLAINT DETAILS ============

function viewComplaint(index) {
    const complaint = state.complaints[index];

    const submittedDate = new Date(complaint.submittedAt).toLocaleString();
    const completedDate = complaint.completedAt ? new Date(complaint.completedAt).toLocaleString() : 'Not completed';

    let statusClass = 'status-pending';
    let statusText = 'Pending';
    if (complaint.status === 'processing') {
        statusClass = 'status-processing';
        statusText = 'In Process';
    } else if (complaint.status === 'completed') {
        statusClass = 'status-completed';
        statusText = 'Completed';
    }

    let afterImageHTML = '';
    if (complaint.afterImage) {
        afterImageHTML = `
            <div class="detail-section">
                <h4>After Photo (Resolved)</h4>
                <img src="${complaint.afterImage}" alt="After Photo" class="detail-image">
            </div>
        `;
    }

    const detailsHTML = `
        <div class="complaint-details">
            <div class="detail-row">
                <div class="detail-label">Complaint ID:</div>
                <div class="detail-value complaint-id-value">#${complaint.id}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Status:</div>
                <div class="detail-value"><span class="status-badge ${statusClass}">${statusText}</span></div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Location:</div>
                <div class="detail-value">${complaint.location}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Contact:</div>
                <div class="detail-value">${complaint.contact}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Assigned To:</div>
                <div class="detail-value">${complaint.assignedTo || 'Not assigned'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Submitted:</div>
                <div class="detail-value">${submittedDate}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Completed:</div>
                <div class="detail-value">${completedDate}</div>
            </div>
            <div class="detail-section">
                <h4>Description</h4>
                <p class="detail-description">${complaint.description}</p>
            </div>
            <div class="detail-section">
                <h4>Before Photo (Issue Reported)</h4>
                <img src="${complaint.beforeImage}" alt="Before Photo" class="detail-image">
            </div>
            ${afterImageHTML}
        </div>
    `;

    document.getElementById('complaint-details-content').innerHTML = detailsHTML;
    document.getElementById('view-complaint-modal').classList.add('active');
}

function closeViewModal() {
    document.getElementById('view-complaint-modal').classList.remove('active');
}

// ============ UTILITY FUNCTIONS ============

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
