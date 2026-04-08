const table = document.getElementById("bookTable");
const form = document.getElementById("bookForm");
const messageDiv = document.getElementById("message");

let xmlDoc = null;

/* =========================
   LOAD XML USING AJAX GET
========================= */

window.addEventListener("DOMContentLoaded", loadBooks);

function loadBooks() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "books.xml", true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            xmlDoc = xhr.responseXML;

            if (!xmlDoc || xmlDoc.getElementsByTagName("parsererror").length > 0) {
                showMessage("Malformed XML file.", "error");
                return;
            }

            renderTable();
        } else {
            showMessage("Failed to load XML file.", "error");
        }
    };

    xhr.onerror = function () {
        showMessage("Network error.", "error");
    };

    xhr.send();
}

/* =========================
   RENDER TABLE
========================= */

function renderTable() {
    table.innerHTML = "";

    const books = xmlDoc.getElementsByTagName("book");

    if (books.length === 0) {
        table.innerHTML = `<tr><td colspan="5">No Books Available</td></tr>`;
        return;
    }

    for (let i = 0; i < books.length; i++) {

        const id = books[i].getElementsByTagName("id")[0].textContent;
        const title = books[i].getElementsByTagName("title")[0].textContent;
        const author = books[i].getElementsByTagName("author")[0].textContent;
        const status = books[i].getElementsByTagName("availability")[0].textContent;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${id}</td>
            <td>${title}</td>
            <td>${author}</td>
            <td>${status}</td>
            <td>
                <button class="toggle" onclick="toggleStatus('${id}')">Toggle</button>
                <button class="delete" onclick="deleteBook('${id}')">Delete</button>
            </td>
        `;

        table.appendChild(row);
    }
}

/* =========================
   ADD BOOK
========================= */

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = bookId.value.trim();
    const title = bookTitle.value.trim();
    const author = bookAuthor.value.trim();
    const status = bookStatus.value;

    if (!id || !title || !author) {
        showMessage("All fields required.", "error");
        return;
    }

    const books = xmlDoc.getElementsByTagName("book");

    for (let i = 0; i < books.length; i++) {
        if (books[i].getElementsByTagName("id")[0].textContent === id) {
            showMessage("Book ID already exists.", "error");
            return;
        }
    }

    const newBook = xmlDoc.createElement("book");

    newBook.innerHTML = `
        <id>${id}</id>
        <title>${title}</title>
        <author>${author}</author>
        <availability>${status}</availability>
    `;

    xmlDoc.documentElement.appendChild(newBook);

    renderTable();
    form.reset();
    showMessage("Book added successfully.", "success");
});

/* =========================
   UPDATE AVAILABILITY
========================= */

function toggleStatus(id) {
    const books = xmlDoc.getElementsByTagName("book");

    for (let i = 0; i < books.length; i++) {

        const bookIdNode = books[i].getElementsByTagName("id")[0];

        if (bookIdNode.textContent === id) {

            const availabilityNode = books[i].getElementsByTagName("availability")[0];

            availabilityNode.textContent =
                availabilityNode.textContent === "Available" ? "Issued" : "Available";

            renderTable();
            showMessage("Availability updated.", "success");
            return;
        }
    }

    showMessage("Book not found.", "error");
}

/* =========================
   DELETE BOOK
========================= */

function deleteBook(id) {

    const books = xmlDoc.getElementsByTagName("book");

    for (let i = 0; i < books.length; i++) {

        const bookIdNode = books[i].getElementsByTagName("id")[0];

        if (bookIdNode.textContent === id) {
            xmlDoc.documentElement.removeChild(books[i]);
            renderTable();
            showMessage("Book deleted successfully.", "success");
            return;
        }
    }

    showMessage("Book not found.", "error");
}

/* =========================
   MESSAGE
========================= */

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = type;
}
