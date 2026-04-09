import { API_BASE } from "./config.js";

const statusText = document.getElementById("productStatus");
const mainImg = document.getElementById("mainImg");
const thumbs = document.getElementById("thumbs");

function setStatus(message) {
  if (statusText) {
    statusText.textContent = message;
  }
}

function renderDetails(product) {
  const images = Array.isArray(product.images) && product.images.length
    ? product.images
    : ["https://via.placeholder.com/800x600?text=No+Image"];

  if (mainImg) {
    mainImg.src = images[0];
  }

  if (thumbs) {
    thumbs.innerHTML = "";
    images.forEach((imageSrc) => {
      const thumb = document.createElement("img");
      thumb.src = imageSrc;
      thumb.alt = "Thumbnail";
      thumb.addEventListener("click", () => {
        if (mainImg) {
          mainImg.src = imageSrc;
        }
      });
      thumbs.appendChild(thumb);
    });
  }

  const nameElement = document.getElementById("pName");
  const priceElement = document.getElementById("pPrice");
  const ownerElement = document.getElementById("pOwner");
  const contactElement = document.getElementById("pContact");
  const descElement = document.getElementById("pFullDesc");

  if (nameElement) nameElement.textContent = product.name || "Unnamed product";
  if (priceElement) priceElement.textContent = product.price || "";
  if (ownerElement) ownerElement.textContent = `Seller: ${product.owner || "Unknown"}`;
  if (contactElement) contactElement.textContent = product.owner || "Unknown";
  if (descElement) descElement.textContent = product.description || "No description provided.";
}

async function loadProduct() {
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    setStatus("Missing product id.");
    return;
  }

  setStatus("Loading...");

  try {
    await fetch(`${API_BASE}/health`);
  } catch (error) {
    setStatus("Server unavailable");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/products/${encodeURIComponent(id)}`);

    if (!response.ok) {
      throw new Error("Unable to load product details.");
    }

    const product = await response.json();
    renderDetails(product);
    setStatus("");
  } catch (error) {
    setStatus("Server unavailable");
  }
}

loadProduct();
