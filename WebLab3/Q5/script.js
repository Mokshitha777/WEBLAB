// 1. Temporary Data Storage
let formData = {
    fullname: "",
    email: "",
    password: "",
    terms: false
};

let currentStage = 1;
const totalStages = 4;

// DOM Elements
const stages = document.querySelectorAll('.form-stage');
const dots = document.querySelectorAll('.step-dot');
const progressBar = document.getElementById('progressBar');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const submitBtn = document.getElementById('submitBtn');

// 2. Navigation Control
nextBtn.addEventListener('click', () => {
    if (validateStage(currentStage)) {
        saveData(currentStage);
        if (currentStage < totalStages) {
            currentStage++;
            updateUI();
        }
    }
});

prevBtn.addEventListener('click', () => {
    if (currentStage > 1) {
        currentStage--;
        updateUI();
    }
});

// 3. Validation Rules Engine
function validateStage(stage) {
    let isValid = true;
    hideAllErrors();

    if (stage === 1) {
        const name = document.getElementById('fullname').value;
        if (name.length < 3) {
            showError('fullname');
            isValid = false;
        }
    } else if (stage === 2) {
        const email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('email');
            isValid = false;
        }
    } else if (stage === 3) {
        const pass = document.getElementById('password').value;
        if (pass.length < 8) {
            showError('password');
            isValid = false;
        }
    } else if (stage === 4) {
        const terms = document.getElementById('terms').checked;
        if (!terms) {
            showError('terms');
            isValid = false;
        }
    }
    return isValid;
}

// 4. Temporary Storage Logic
function saveData(stage) {
    if (stage === 1) formData.fullname = document.getElementById('fullname').value;
    if (stage === 2) formData.email = document.getElementById('email').value;
    if (stage === 3) formData.password = document.getElementById('password').value;
    if (stage === 4) formData.terms = document.getElementById('terms').checked;
    
    if (stage === 3) renderSummary(); // Prepare summary for the final stage
}

// 5. DOM Manipulation for UI Updates
function updateUI() {
    // Show/Hide stages
    stages.forEach(s => s.classList.remove('active'));
    document.querySelector(`[data-stage="${currentStage}"]`).classList.add('active');

    // Update Progress Bar
    const progressPercent = ((currentStage - 1) / (totalStages - 1)) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Update Dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index < currentStage);
    });

    // Button Toggles
    prevBtn.disabled = currentStage === 1;
    if (currentStage === totalStages) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

function renderSummary() {
    document.getElementById('summary').innerHTML = `
        <p><strong>Name:</strong> ${formData.fullname}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
    `;
}

function showError(id) {
    document.getElementById(`err-${id}`).style.display = 'block';
}

function hideAllErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
}

// Final Submission
document.getElementById('workflowForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateStage(4)) {
        alert("Form Submitted Successfully!\nData: " + JSON.stringify(formData));
        console.log("Final Data Object:", formData);
    }
});