const userForm = document.getElementById('userForm');
const userList = document.getElementById('userList');
const userCountLabel = document.getElementById('userCount');

// Load data on start
document.addEventListener('DOMContentLoaded', displayUsers);

userForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect values
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const mobile = document.getElementById('userMobile').value;
    const password = document.getElementById('userPass').value;

    // --- Validations ---
    if (mobile.length !== 10) {
        alert("Mobile number must be exactly 10 digits.");
        return;
    }
    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    let users = JSON.parse(localStorage.getItem('core_users')) || [];

    // --- Duplicate Email Check ---
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert("Error: This email is already registered.");
        return;
    }

    // --- Store as Object ---
    users.push({ name, email, mobile, password });
    localStorage.setItem('core_users', JSON.stringify(users));

    userForm.reset();
    displayUsers();
});

function displayUsers() {
    const users = JSON.parse(localStorage.getItem('core_users')) || [];
    userList.innerHTML = '';
    userCountLabel.innerText = `${users.length} Users`;

    if (users.length === 0) {
        userList.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px;">No registered users found.</td></tr>`;
        return;
    }

    // --- Render Table Rows ---
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${user.name}</strong></td>
            <td>${user.email}</td>
            <td>${user.mobile}</td>
            <td><span style="font-family: monospace;">******</span></td>
            <td>
                <button class="btn-delete-small" onclick="deleteUser(${index})">Delete</button>
            </td>
        `;
        userList.appendChild(row);
    });
}

function deleteUser(index) {
    let users = JSON.parse(localStorage.getItem('core_users')) || [];
    users.splice(index, 1);
    localStorage.setItem('core_users', JSON.stringify(users));
    displayUsers();
}

function clearAll() {
    if (confirm("Are you sure you want to erase ALL users from LocalStorage?")) {
        localStorage.removeItem('core_users');
        displayUsers();
    }
}