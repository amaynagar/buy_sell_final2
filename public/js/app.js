/* ===============================
   GLOBAL VARIABLES
================================ */
let products = [];

/* ===============================
   LOAD PRODUCTS FROM BACKEND
================================ */
async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    products = await res.json();
    render(products);
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

/* ===============================
   RENDER PRODUCTS
================================ */
function render(list) {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = "";

  list.forEach(p => {
    container.innerHTML += `
      <div class="product-card" onclick="openProduct('${p.id}')">
       <img src="${p.images ? p.images[0] : 'https://via.placeholder.com/300'}">
        <div class="product-info">
          <h4>${p.name}</h4>
          <p class="price">${p.price}</p>
      <p>
  ${p.description && p.description.length > 60
    ? p.description.substring(0, 60) + "..."
    : p.description}
</p>
          <p>👤 ${p.owner}</p>
        </div>
      </div>
    `;
  });
}

/* ===============================
   OPEN PRODUCT DETAIL PAGE
================================ */
function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

/* ===============================
   ADD PRODUCT (SELL)
================================ */
async function addProduct() {
  const formData = new FormData();

  formData.append("name", pname.value);
  formData.append("price", pprice.value);
  formData.append("category", pcategory.value);
  formData.append("owner", "You");
  formData.append("description", pdesc.value);

  const files = document.getElementById("pimages").files;

  for (let i = 0; i < files.length; i++) {
    formData.append("images", files[i]); // multiple images
  }

  const res = await fetch("/api/products", {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    alert(err.message || "Image/category verification failed.");
    return;
  }

  loadProducts();
  closeSell();
}
/* ===============================
   SEARCH FUNCTION
================================ */
document.querySelector(".search")?.addEventListener("input", e => {
  const q = e.target.value.toLowerCase();

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );

  render(filtered);
});

/* ===============================
   CATEGORY FILTER
================================ */
function filterProducts(cat) {
  if (cat === "all") render(products);
  else render(products.filter(p => p.category === cat));
}

/* ===============================
   MODAL CONTROL
================================ */
function openSell() {
  document.getElementById("sellModal").style.display = "flex";
}

function closeSell() {
  document.getElementById("sellModal").style.display = "none";
}

/* ===============================
   IMAGE PREVIEW
================================ */
const pimage = document.getElementById("pimages");
const preview = document.getElementById("preview");

if (pimage) {
  pimage.onchange = () => {
    const file = pimage.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      preview.src = reader.result;
      preview.style.display = "block";
    };

    if (file) reader.readAsDataURL(file);
  };
}

/* ===============================
   SLIDER LOGIC
================================ */
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function showSlide(index) {
  slides.forEach(s => s.classList.remove("active"));
  if (slides[index]) slides[index].classList.add("active");
}

if (slides.length > 0) {
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 3000);
}

/* ===============================
   INITIAL LOAD
================================ */
loadProducts();