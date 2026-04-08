const table = document.getElementById("employeeTable");
const form = document.getElementById("employeeForm");
const messageDiv = document.getElementById("message");

let xmlDoc = null;
let editMode = false;
let editId = null;

/* =========================
   READ (Fetch XML)
========================= */

window.addEventListener("DOMContentLoaded", loadEmployees);

function loadEmployees() {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "employees.xml", true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            xmlDoc = xhr.responseXML;

            if (!xmlDoc || xmlDoc.getElementsByTagName("parsererror").length > 0) {
                showMessage("Malformed XML file.", "error");
                return;
            }

            renderTable();
            showMessage("Employees loaded successfully.", "success");
        } else {
            showMessage("Failed to load XML file.", "error");
        }
    };

    xhr.onerror = function () {
        showMessage("Network error while loading XML.", "error");
    };

    xhr.send();
}

/* =========================
   RENDER TABLE
========================= */

function renderTable() {
    table.innerHTML = "";

    const employees = xmlDoc.getElementsByTagName("employee");

    if (employees.length === 0) {
        table.innerHTML = `<tr><td colspan="5">No Employees Found</td></tr>`;
        return;
    }

    for (let i = 0; i < employees.length; i++) {

        const id = employees[i].getElementsByTagName("id")[0].textContent;
        const name = employees[i].getElementsByTagName("name")[0].textContent;
        const dept = employees[i].getElementsByTagName("department")[0].textContent;
        const salary = employees[i].getElementsByTagName("salary")[0].textContent;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${id}</td>
            <td>${name}</td>
            <td>${dept}</td>
            <td>${salary}</td>
            <td>
                <button class="edit" onclick="editEmployee('${id}')">Edit</button>
                <button class="delete" onclick="deleteEmployee('${id}')">Delete</button>
            </td>
        `;

        table.appendChild(row);
    }
}

/* =========================
   CREATE / UPDATE
========================= */

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = empId.value.trim();
    const name = empName.value.trim();
    const dept = empDept.value.trim();
    const salary = empSalary.value.trim();

    if (!id || !name || !dept || !salary) {
        showMessage("All fields are required.", "error");
        return;
    }

    if (editMode) {
        updateEmployee(id, dept, salary);
    } else {
        createEmployee(id, name, dept, salary);
    }

    renderTable();
    form.reset();
});

/* CREATE */

function createEmployee(id, name, dept, salary) {

    const employees = xmlDoc.getElementsByTagName("employee");

    for (let i = 0; i < employees.length; i++) {
        const existingId = employees[i].getElementsByTagName("id")[0].textContent;
        if (existingId === id) {
            showMessage("Employee ID already exists.", "error");
            return;
        }
    }

    const newEmployee = xmlDoc.createElement("employee");

    newEmployee.innerHTML = `
        <id>${id}</id>
        <name>${name}</name>
        <department>${dept}</department>
        <salary>${salary}</salary>
    `;

    xmlDoc.documentElement.appendChild(newEmployee);
    showMessage("Employee added successfully.", "success");
}

/* UPDATE */

function updateEmployee(id, dept, salary) {

    const employees = xmlDoc.getElementsByTagName("employee");

    for (let i = 0; i < employees.length; i++) {

        const empIdNode = employees[i].getElementsByTagName("id")[0];

        if (empIdNode.textContent === id) {
            employees[i].getElementsByTagName("department")[0].textContent = dept;
            employees[i].getElementsByTagName("salary")[0].textContent = salary;

            editMode = false;
            showMessage("Employee updated successfully.", "success");
            return;
        }
    }

    showMessage("Employee not found.", "error");
}

/* DELETE */

function deleteEmployee(id) {

    const employees = xmlDoc.getElementsByTagName("employee");

    for (let i = 0; i < employees.length; i++) {

        const empIdNode = employees[i].getElementsByTagName("id")[0];

        if (empIdNode.textContent === id) {
            xmlDoc.documentElement.removeChild(employees[i]);
            renderTable();
            showMessage("Employee deleted successfully.", "success");
            return;
        }
    }

    showMessage("Employee not found.", "error");
}

/* EDIT */

function editEmployee(id) {

    const employees = xmlDoc.getElementsByTagName("employee");

    for (let i = 0; i < employees.length; i++) {

        const empIdNode = employees[i].getElementsByTagName("id")[0];

        if (empIdNode.textContent === id) {

            empId.value = id;
            empName.value = employees[i].getElementsByTagName("name")[0].textContent;
            empDept.value = employees[i].getElementsByTagName("department")[0].textContent;
            empSalary.value = employees[i].getElementsByTagName("salary")[0].textContent;

            editMode = true;
            editId = id;
            return;
        }
    }
}

/* MESSAGE */

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = type;
}
