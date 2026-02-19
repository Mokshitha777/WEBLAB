const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const loader = document.getElementById("loader");

let debounceTimer;

// Load featured products on page load
window.addEventListener("DOMContentLoaded", () => {
    fetchProducts("");
});

searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.trim().toLowerCase();

    loader.classList.remove("hidden");

    debounceTimer = setTimeout(() => {
        fetchProducts(query);
    }, 500);
});

function fetchProducts(query) {
    fetch("products.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network error");
            }
            return response.json();
        })
        .then(data => {
            const filtered = data.products.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            );

            displayResults(filtered, query);
            loader.classList.add("hidden");
        })
        .catch(error => {
            loader.classList.add("hidden");
            resultsDiv.innerHTML =
                `<div class="message">⚠ Unable to load products</div>`;
        });
}

function displayResults(products, query) {
    resultsDiv.innerHTML = "";

    if (products.length === 0) {
        resultsDiv.innerHTML =
            `<div class="message">No results found for "${query}"</div>`;
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h3>${product.name}</h3>
            <div class="price">₹${product.price}</div>
            <div class="category">${product.category}</div>
        `;

        resultsDiv.appendChild(card);
    });
}
