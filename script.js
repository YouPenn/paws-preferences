const container = document.querySelector(".card-container");
const likeBtn = document.getElementById("like");
const dislikeBtn = document.getElementById("dislike");
const summary = document.getElementById("summary");

const likeCountEl = document.getElementById("likeCount");
const dislikeCountEl = document.getElementById("dislikeCount");

const restartBtn = document.getElementById("restart");
const gallery = document.querySelector(".gallery");

const CARD_COUNT = 15;

let liked = 0;
let disliked = 0;
let likedImages = [];


// Create Cat Card
function createCatCard() {
  const card = document.createElement("div");
  card.className = "cat-card";

  const img = document.createElement("img");
  img.src = "https://cataas.com/cat?random=" + Math.random();

  card.appendChild(img);
  return card;
}

init();

// Get the top card
function getTopCard() {
  return container.lastElementChild;
}

// handleChoice
function handleChoice(isLike) {
  if (isDragging) return; //Prevent dragging the midpoint button
  const card = getTopCard();
  if (!card) return;
  swipeCard(card, isLike);
}


// swipeCard
function swipeCard(card, isLike) {
  if (!card) return;

  // Preventing repetition swipe
  if (card.classList.contains("like") || card.classList.contains("dislike")) {
    return;
  }

if (isLike) {
  liked++;
  const imgSrc = card.querySelector("img").src;
  likedImages.push(imgSrc);
  card.classList.add("like");
} else {
  disliked++;
  card.classList.add("dislike");
}

  setTimeout(() => {
    card.remove();
    if (!getTopCard()) showSummary();
  }, 400);
}

//
let startX = 0;
let currentX = 0;
let isDragging = false;

container.addEventListener("mousedown", (e) => {
  const card = getTopCard();
  if (!card) return;

  isDragging = true;
  startX = e.clientX;
  card.classList.add("dragging");

  function onMouseMove(e) {
    if (!isDragging) return;

    currentX = e.clientX - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX * 0.05}deg)`;
  }

  function onMouseUp() {
    isDragging = false;
    card.classList.remove("dragging");

    const threshold = 120;

    if (currentX > threshold) {
      swipeCard(card, true);   // Like
    } else if (currentX < -threshold) {
      swipeCard(card, false);  // Dislike
    } else {
      // bounce back to its original position
      card.style.transition = "transform 0.3s ease";
      card.style.transform = "translateX(0) rotate(0deg)";
      setTimeout(() => {
        card.style.transition = "";
      }, 300);
    }

    currentX = 0;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
});


// Summary
function showSummary() {
  // Hide button
  document.querySelector(".buttons").style.display = "none";

  // Hidden Card Container
  const container = document.querySelector(".card-container");
  container.style.display = "none"; //Hide the original card position

  // Display summary
  summary.classList.remove("hidden");

  // Update statistics
  likeCountEl.textContent = liked;
  dislikeCountEl.textContent = disliked;

  // Show your liked cat
  const gallery = document.getElementById("likedGallery");
  gallery.innerHTML = "";
  likedImages.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    gallery.appendChild(img);
  });
}



// button
likeBtn.addEventListener("click", () => handleChoice(true));
dislikeBtn.addEventListener("click", () => handleChoice(false));

container.addEventListener("touchstart", (e) => {
  const card = getTopCard();
  if (!card) return;

  startX = e.touches[0].clientX;
  card.classList.add("dragging");

  function onTouchMove(e) {
    currentX = e.touches[0].clientX - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX * 0.05}deg)`;
  }

  function onTouchEnd() {
    card.classList.remove("dragging");

    const threshold = 100;

    if (currentX > threshold) {
      swipeCard(card, true);
    } else if (currentX < -threshold) {
      swipeCard(card, false);
    } else {
      card.style.transition = "transform 0.3s ease";
      card.style.transform = "translateX(0) rotate(0deg)";
      setTimeout(() => {
        card.style.transition = "";
      }, 300);
    }

    currentX = 0;
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
  }

  document.addEventListener("touchmove", onTouchMove);
  document.addEventListener("touchend", onTouchEnd);
});

function init() {
  // Reset data
  liked = 0;
  disliked = 0;
  likedImages = [];

  // Update numbers
  likeCountEl.textContent = "0";
  dislikeCountEl.textContent = "0";

  // Empty container
  container.innerHTML = "";
  gallery.innerHTML = "";

  // Show cards and buttons
  container.style.display = "block";
  document.querySelector(".buttons").style.display = "flex";

  // hide summary
  summary.classList.add("hidden");

  // Regenerate cards
  for (let i = 0; i < CARD_COUNT; i++) {
    const card = createCatCard();
    container.appendChild(card);
  }
}

restartBtn.addEventListener("click", () => {
  init();
});
