const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");
const messageDiv = document.getElementById("message");

const studentIdInput = document.getElementById("studentId");
const studentNameInput = document.getElementById("studentName");
const studentCourseInput = document.getElementById("studentCourse");
const studentMarksInput = document.getElementById("studentMarks");

let students = [];
let editMode = false;
let editId = null;

/* =========================
   READ - Fetch JSON
========================= */

window.addEventListener("DOMContentLoaded", loadStudents);

function loadStudents() {
    fetch("students.json")
        .then(response => response.json())
        .then(data => {
            if (!data.students) throw new Error("Invalid JSON structure");

            students = data.students;
            renderTable();
            showMessage("Students loaded successfully.", "success");
        })
        .catch(error => {
            showMessage("JSON Parsing Error or File Error.", "error");
        });
}

/* =========================
   CREATE & UPDATE
========================= */

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = studentIdInput.value.trim();
    const name = studentNameInput.value.trim();
    const course = studentCourseInput.value.trim();
    const marks = parseInt(studentMarksInput.value);

    if (!id || !name || !course || isNaN(marks)) {
        showMessage("All fields are required and marks must be valid.", "error");
        return;
    }

    if (editMode) {
        const index = students.findIndex(s => s.id === editId);
        students[index].course = course;
        students[index].marks = marks;

        editMode = false;
        editId = null;

        showMessage("Student updated successfully.", "success");

    } else {
        if (students.find(s => s.id === id)) {
            showMessage("Student ID already exists.", "error");
            return;
        }

        students.push({ id, name, course, marks });
        showMessage("Student added successfully.", "success");
    }

    renderTable();
    form.reset();
});

/* =========================
   DELETE
========================= */

function deleteStudent(id) {
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        showMessage("Student not found.", "error");
        return;
    }

    students.splice(index, 1);
    renderTable();
    showMessage("Student deleted successfully.", "success");
}

/* =========================
   EDIT
========================= */

function editStudent(id) {
    const student = students.find(s => s.id === id);

    if (!student) {
        showMessage("Student not found.", "error");
        return;
    }

    studentIdInput.value = student.id;
    studentNameInput.value = student.name;
    studentCourseInput.value = student.course;
    studentMarksInput.value = student.marks;

    editMode = true;
    editId = id;
}

/* =========================
   RENDER TABLE
========================= */

function renderTable() {
    table.innerHTML = "";

    if (students.length === 0) {
        table.innerHTML = `<tr><td colspan="5">No Students Found</td></tr>`;
        return;
    }

    students.forEach(student => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.marks}</td>
            <td>
                <button class="edit" onclick="editStudent('${student.id}')">Edit</button>
                <button class="delete" onclick="deleteStudent('${student.id}')">Delete</button>
            </td>
        `;

        table.appendChild(row);
    });
}

/* =========================
   MESSAGE
========================= */

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = type;
}
