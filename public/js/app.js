import { API_BASE } from "./config.js";
/*this fron */
let products = [];
const productsContainer = document.getElementById("products");
const statusText = document.getElementById("productsStatus");

function setStatus(message) {
  if (statusText) {
    statusText.textContent = message;
  }
}

async function testApiConnection() {
  try {
    await fetch(`${API_BASE}/health`);
  } catch (error) {
    setStatus("Server unavailable");
  }
}

function render(list) {
  if (!productsContainer) {
    return;
  }

  productsContainer.innerHTML = "";

  if (!Array.isArray(list) || list.length === 0) {
    setStatus("No products available");
    return;
  }

  setStatus("");

  list.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.addEventListener("click", () => openProduct(product.id));

    const mainImage = Array.isArray(product.images) && product.images.length
      ? product.images[0]
      : "https://via.placeholder.com/300";

    const shortDescription = product.description && product.description.length > 60
      ? `${product.description.substring(0, 60)}...`
      : (product.description || "");

    card.innerHTML = `
      <img src="${mainImage}" alt="${product.name}">
      <div class="product-info">
        <h4>${product.name}</h4>
        <p class="price">${product.price}</p>
        <p>${shortDescription}</p>
        <p>Owner: ${product.owner}</p>
      </div>
    `;

    productsContainer.appendChild(card);
  });
}

async function loadProducts() {
  setStatus("Loading...");

  try {
    const response = await fetch(`${API_BASE}/api/products`);

    if (!response.ok) {
      throw new Error("Unable to load products.");
    }

    products = await response.json();
    render(products);
  } catch (error) {
    products = [];
    render(products);
    setStatus("Server unavailable");
  }
}

function openProduct(id) {
  window.location.href = `product.html?id=${encodeURIComponent(id)}`;
}

async function addProduct() {
  const formData = new FormData();
  const nameInput = document.getElementById("pname");
  const priceInput = document.getElementById("pprice");
  const categoryInput = document.getElementById("pcategory");
  const descInput = document.getElementById("pdesc");
  const imageInput = document.getElementById("pimages");

  formData.append("name", nameInput?.value || "");
  formData.append("price", priceInput?.value || "");
  formData.append("category", categoryInput?.value || "");
  formData.append("owner", "You");
  formData.append("description", descInput?.value || "");

  const files = imageInput?.files || [];
  for (let i = 0; i < files.length; i += 1) {
    formData.append("images", files[i]);
  }

  setStatus("Loading...");

  try {
    const response = await fetch(`${API_BASE}/api/products`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message || "Image/category verification failed.");
    }

    closeSell();
    await loadProducts();
  } catch (error) {
    setStatus(error.message || "Server unavailable");
  }
}

function filterProducts(category) {
  if (category === "all") {
    render(products);
    return;
  }

  render(products.filter((product) => product.category === category));
}

function openSell() {
  const modal = document.getElementById("sellModal");
  if (modal) {
    modal.style.display = "flex";
  }
}

function closeSell() {
  const modal = document.getElementById("sellModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function logout() {
  window.location.href = "index.html";
}

document.querySelector(".search")?.addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase();

  const filtered = products.filter((product) =>
    String(product.name || "").toLowerCase().includes(query)
      || String(product.category || "").toLowerCase().includes(query)
  );

  render(filtered);
});

const imageInput = document.getElementById("pimages");
const preview = document.getElementById("preview");

if (imageInput && preview) {
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) {
      preview.style.display = "none";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });
}

window.openSell = openSell;
window.closeSell = closeSell;
window.addProduct = addProduct;
window.filterProducts = filterProducts;
window.openProduct = openProduct;
window.logout = logout;

testApiConnection();
loadProducts();