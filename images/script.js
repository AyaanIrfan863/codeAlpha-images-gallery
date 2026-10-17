const photos = [
  { title: "Morning in the mountains", category: "nature", location: "Dolomites, Italy", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85" },
  { title: "Quiet coastal blues", category: "nature", location: "Amalfi Coast", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=85" },
  { title: "Lines of the city", category: "architecture", location: "Modern forms", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=85" },
  { title: "The wild and free", category: "animals", location: "Wildlife", image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1000&q=85" },
  { title: "Golden hour glow", category: "nature", location: "Open landscapes", image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1000&q=85" },
  { title: "A study in symmetry", category: "architecture", location: "Urban details", image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1000&q=85" },
  { title: "Curious little soul", category: "animals", location: "Animal portraits", image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1000&q=85" },
  { title: "Into the forest", category: "nature", location: "Woodland trails", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=85" },
  { title: "Concrete poetry", category: "architecture", location: "City structures", image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1000&q=85" }
];

const gallery = document.getElementById("gallery");
const filters = document.querySelectorAll(".filter");
const note = document.getElementById("gallery-note");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxCount = document.getElementById("lightbox-count");
let activeCategory = "all";
let visiblePhotos = [...photos];
let currentIndex = 0;

function renderGallery() {
  visiblePhotos = activeCategory === "all"
    ? [...photos]
    : photos.filter(photo => photo.category === activeCategory);

  gallery.innerHTML = visiblePhotos.map((photo, index) => `
    <article class="photo-card" tabindex="0" role="button"
      aria-label="Open ${photo.title}" data-index="${index}">
      <img src="${photo.image}" alt="${photo.title}" loading="lazy">
      <div class="photo-caption">
        <div><strong>${photo.title}</strong><small>${photo.location}</small></div>
        <span class="open-icon" aria-hidden="true">↗</span>
      </div>
    </article>
  `).join("");

  note.textContent = `Showing ${visiblePhotos.length} ${activeCategory === "all" ? "photos" : activeCategory + " photos"}`;

  gallery.querySelectorAll(".photo-card").forEach(card => {
    const open = () => openLightbox(Number(card.dataset.index));
    card.addEventListener("click", open);
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
}

filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category;
    renderGallery();
  });
});

function updateLightbox() {
  const photo = visiblePhotos[currentIndex];
  if (!photo) return;
  lightboxImage.src = photo.image;
  lightboxImage.alt = photo.title;
  lightboxTitle.textContent = photo.title;
  lightboxCount.textContent = `${currentIndex + 1} / ${visiblePhotos.length}`;
}

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("close").focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function moveImage(direction) {
  currentIndex = (currentIndex + direction + visiblePhotos.length) % visiblePhotos.length;
  updateLightbox();
}

document.getElementById("close").addEventListener("click", closeLightbox);
document.getElementById("prev").addEventListener("click", () => moveImage(-1));
document.getElementById("next").addEventListener("click", () => moveImage(1));

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveImage(-1);
  if (event.key === "ArrowRight") moveImage(1);
});

renderGallery();
