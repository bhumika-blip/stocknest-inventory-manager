
interface InventoryProduct {
    id: number;
    name: string;
    price: number;
    quantity: number;
    category: string;
}

const productList = document.getElementById("product-list") as HTMLDivElement;
const productCount = document.getElementById("product-count") as HTMLElement;
const inventoryValue = document.getElementById("inventory-value") as HTMLElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const productForm = document.getElementById("product-form") as HTMLFormElement;
const emptyMessage = document.getElementById("empty-message") as HTMLParagraphElement;
const formMessage = document.getElementById("form-message") as HTMLParagraphElement;

let nextId = 5;

let products: InventoryProduct[] = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 2499,
        quantity: 12,
        category: "Electronics"
    },
    {
        id: 2,
        name: "Canvas Tote Bag",
        price: 599,
        quantity: 3,
        category: "Accessories"
    },
    {
        id: 3,
        name: "Daily Planner",
        price: 349,
        quantity: 20,
        category: "Stationery"
    },
    {
        id: 4,
        name: "Ceramic Coffee Mug",
        price: 449,
        quantity: 0,
        category: "Home & Living"
    }
];

function getStockStatus(quantity: number): string {
    if (quantity === 0) {
        return "Out of stock";
    }

    if (quantity <= 5) {
        return "Low stock";
    }

    return "In stock";
}

function getStockClass(quantity: number): string {
    if (quantity === 0) {
        return "out";
    }

    if (quantity <= 5) {
        return "low";
    }

    return "";
}

function getCategoryIcon(category: string): string {
    switch (category) {
        case "Electronics":
            return "🎧";
        case "Accessories":
            return "👜";
        case "Stationery":
            return "📒";
        case "Home & Living":
            return "☕";
        default:
            return "📦";
    }
}

function updateSummary(): void {
    productCount.textContent = String(products.length);

    const totalValue = products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
    );

    inventoryValue.textContent = totalValue.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2
    });
}

function createProductRow(product: InventoryProduct): HTMLDivElement {
    const row = document.createElement("div");
    row.className = "product-row";

    const info = document.createElement("div");
    info.className = "product-info";

    const icon = document.createElement("div");
    icon.className = "product-icon";
    icon.textContent = getCategoryIcon(product.category);
    icon.setAttribute("aria-hidden", "true");

    const details = document.createElement("div");

    const name = document.createElement("p");
    name.className = "product-name";
    name.textContent = product.name;

    const meta = document.createElement("p");
    meta.className = "product-meta";
    meta.textContent = `${product.category} · Qty: ${product.quantity}`;

    details.append(name, meta);
    info.append(icon, details);

    const right = document.createElement("div");
    right.className = "product-right";

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = product.price.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR"
    });

    const status = document.createElement("span");
    status.className = `stock-status ${getStockClass(product.quantity)}`;
    status.textContent = getStockStatus(product.quantity);

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${product.name}`);

    removeButton.addEventListener("click", () => {
        products = products.filter(item => item.id !== product.id);
        renderProducts();
        formMessage.textContent = `${product.name} removed from inventory.`;
    });

    right.append(price, status, removeButton);
    row.append(info, right);

    return row;
}

function renderProducts(): void {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    productList.replaceChildren();

    filteredProducts.forEach(product => {
        productList.appendChild(createProductRow(product));
    });

    emptyMessage.hidden = filteredProducts.length > 0;
    updateSummary();
}

productForm.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();

    const nameInput = document.getElementById("product-name") as HTMLInputElement;
    const priceInput = document.getElementById("product-price") as HTMLInputElement;
    const quantityInput = document.getElementById("product-quantity") as HTMLInputElement;
    const categoryInput = document.getElementById("product-category") as HTMLSelectElement;

    const name = nameInput.value.trim();
    const price = Number(priceInput.value);
    const quantity = Number(quantityInput.value);
    const category = categoryInput.value;

    if (
        name.length === 0 ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isInteger(quantity) ||
        quantity < 0 ||
        category === ""
    ) {
        formMessage.textContent = "Please enter valid product details.";
        return;
    }

    const newProduct: InventoryProduct = {
        id: nextId,
        name,
        price,
        quantity,
        category
    };

    nextId++;
    products.push(newProduct);

    productForm.reset();
    searchInput.value = "";
    formMessage.textContent = `${name} added successfully!`;

    renderProducts();
});

searchInput.addEventListener("input", renderProducts);

renderProducts();
