const usernameInput = document.getElementById("username");
const feedback = document.getElementById("feedback");
const form = document.getElementById("registerForm");
const submitBtn = document.getElementById("submitBtn");

let isAvailable = false;
let debounceTimer;

// Debounce function to prevent too many requests
usernameInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);

    const username = usernameInput.value.trim();

    if (username.length < 3) {
        feedback.textContent = "Username must be at least 3 characters";
        feedback.className = "taken";
        submitBtn.disabled = true;
        return;
    }

    feedback.textContent = "Checking availability...";
    feedback.className = "loading";
    submitBtn.disabled = true;

    debounceTimer = setTimeout(() => {
        checkUsername(username);
    }, 500);
});

function checkUsername(username) {
    fetch("users.json")
        .then(response => response.json())
        .then(data => {
            const exists = data.usernames.includes(username.toLowerCase());

            if (exists) {
                feedback.textContent = "❌ Username already taken";
                feedback.className = "taken";
                isAvailable = false;
                submitBtn.disabled = true;
            } else {
                feedback.textContent = "✅ Username available";
                feedback.className = "available";
                isAvailable = true;
                submitBtn.disabled = false;
            }
        })
        .catch(error => {
            feedback.textContent = "Error checking username";
            feedback.className = "taken";
            submitBtn.disabled = true;
        });
}

// Prevent submission if username not available
form.addEventListener("submit", function(e) {
    if (!isAvailable) {
        e.preventDefault();
        alert("Please choose an available username.");
    } else {
        alert("Registration successful!");
    }
});
