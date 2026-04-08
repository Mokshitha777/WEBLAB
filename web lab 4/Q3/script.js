const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");
const messageDiv = document.getElementById("message");

let students = [];
let editMode = false;
let editId = null;

// READ
window.addEventListener("DOMContentLoaded", fetchStudents);

function fetchStudents() {
    fetch("students.json")
        .then(response => {
            if (response.status === 200) return response.json();
            if (response.status === 404) throw new Error("Data not found (404)");
            throw new Error("Server error (500)");
        })
        .then(data => {
            students = data.students;
            renderTable();
            showMessage("Students loaded successfully (200)", "success");
        })
        .catch(error => {
            showMessage(error.message, "error");
        });
}

// CREATE & UPDATE
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const newStudent = {
        id: studentId.value,
        name: studentName.value,
        department: studentDept.value,
        marks: parseInt(studentMarks.value)
    };

    if (editMode) {
        const index = students.findIndex(s => s.id === editId);
        students[index] = newStudent;
        editMode = false;
        showMessage("Student updated successfully (200)", "success");
    } else {
        const exists = students.find(s => s.id === newStudent.id);
        if (exists) {
            showMessage("Student ID already exists (500)", "error");
            return;
        }
        students.push(newStudent);
        showMessage("Student added successfully (200)", "success");
    }

    renderTable();
    form.reset();
});

// DELETE
function deleteStudent(id) {
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        showMessage("Student not found (404)", "error");
        return;
    }

    students.splice(index, 1);
    renderTable();
    showMessage("Student deleted successfully (200)", "success");
}

// EDIT
function editStudent(id) {
    const student = students.find(s => s.id === id);

    if (!student) {
        showMessage("Student not found (404)", "error");
        return;
    }

    studentId.value = student.id;
    studentName.value = student.name;
    studentDept.value = student.department;
    studentMarks.value = student.marks;

    editMode = true;
    editId = id;
}

// Render table dynamically
function renderTable() {
    table.innerHTML = "";

    students.forEach(student => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.department}</td>
            <td>${student.marks}</td>
            <td>
                <button class="edit" onclick="editStudent('${student.id}')">Edit</button>
                <button class="delete" onclick="deleteStudent('${student.id}')">Delete</button>
            </td>
        `;

        table.appendChild(row);
    });
}

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = type;
}
