const form = document.getElementById("productForm");
const table = document.getElementById("inventoryTable");
const messageDiv = document.getElementById("message");
const totalValueDiv = document.getElementById("totalValue");
const searchInput = document.getElementById("searchCategory");

let products = [];
let editMode = false;
let editId = null;

/* ======================
   LOAD JSON
====================== */

window.addEventListener("DOMContentLoaded", loadInventory);

function loadInventory() {
    fetch("inventory.json")
        .then(response => response.json())
        .then(data => {
            if (!data.products) throw new Error("Invalid JSON format");
            products = data.products;
            renderTable(products);
        })
        .catch(() => {
            showMessage("Error loading JSON file.", "error");
        });
}

/* ======================
   RENDER TABLE
====================== */

function renderTable(data) {
    table.innerHTML = "";
    let totalInventoryValue = 0;

    data.forEach(product => {

        const row = document.createElement("tr");

        if (product.stock <= 3) {
            row.classList.add("low-stock");
        }

        const total = product.price * product.stock;
        totalInventoryValue += total;

        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price}</td>
            <td>${product.stock}</td>
            <td>₹${total}</td>
            <td>
                <button class="edit" onclick="editProduct('${product.id}')">Edit</button>
                <button class="delete" onclick="deleteProduct('${product.id}')">Delete</button>
            </td>
        `;

        table.appendChild(row);
    });

    totalValueDiv.textContent = "Total Inventory Value: ₹" + totalInventoryValue;
}

/* ======================
   ADD / UPDATE
====================== */

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = productId.value.trim();
    const name = productName.value.trim();
    const category = productCategory.value.trim();
    const price = parseFloat(productPrice.value);
    const stock = parseInt(productStock.value);

    if (!id || !name || !category || isNaN(price) || isNaN(stock)) {
        showMessage("Invalid input data.", "error");
        return;
    }

    if (editMode) {
        const index = products.findIndex(p => p.id === editId);
        products[index].price = price;
        products[index].stock = stock;
        editMode = false;
        showMessage("Product updated.", "success");
    } else {
        if (products.find(p => p.id === id)) {
            showMessage("Product ID exists.", "error");
            return;
        }
        products.push({ id, name, category, price, stock });
        showMessage("Product added.", "success");
    }

    renderTable(products);
    form.reset();
});

/* ======================
   DELETE
====================== */

function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    renderTable(products);
    showMessage("Product deleted.", "success");
}

/* ======================
   EDIT
====================== */

function editProduct(id) {
    const product = products.find(p => p.id === id);

    productId.value = product.id;
    productName.value = product.name;
    productCategory.value = product.category;
    productPrice.value = product.price;
    productStock.value = product.stock;

    editMode = true;
    editId = id;
}

/* ======================
   SEARCH BY CATEGORY
====================== */

searchInput.addEventListener("input", function () {
    const category = this.value.toLowerCase();
    const filtered = products.filter(p =>
        p.category.toLowerCase().includes(category)
    );
    renderTable(filtered);
});

/* ======================
   MESSAGE
====================== */

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = type;
}
