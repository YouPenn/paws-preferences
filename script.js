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


// 创建猫卡片
function createCatCard() {
  const card = document.createElement("div");
  card.className = "cat-card";

  const img = document.createElement("img");
  img.src = "https://cataas.com/cat?random=" + Math.random();

  card.appendChild(img);
  return card;
}

init();

// 获取最上面那张卡
function getTopCard() {
  return container.lastElementChild;
}

// 处理1
function handleChoice(isLike) {
  if (isDragging) return; //防止拖拽中点按钮
  const card = getTopCard();
  if (!card) return;
  swipeCard(card, isLike);
}


// 处理2
function swipeCard(card, isLike) {
  if (!card) return;

  // 防止重复 swipe
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

//处理3
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
      // 弹回原位
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


// 显示总结
function showSummary() {
  // 隐藏按钮
  document.querySelector(".buttons").style.display = "none";

  // 隐藏卡片容器
  const container = document.querySelector(".card-container");
  container.style.display = "none"; // ⭐ 隐藏原来的卡片位置

  // 显示 summary
  summary.classList.remove("hidden");

  // 更新统计数字
  likeCountEl.textContent = liked;
  dislikeCountEl.textContent = disliked;

  // 显示喜欢的猫咪
  const gallery = document.getElementById("likedGallery");
  gallery.innerHTML = "";
  likedImages.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    gallery.appendChild(img);
  });
}



// 按钮事件
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
  // 重置数据
  liked = 0;
  disliked = 0;
  likedImages = [];

  // 更新数字
  likeCountEl.textContent = "0";
  dislikeCountEl.textContent = "0";

  // 清空容器
  container.innerHTML = "";
  gallery.innerHTML = "";

  // 显示卡片和按钮
  container.style.display = "block";
  document.querySelector(".buttons").style.display = "flex";

  // 隐藏 summary
  summary.classList.add("hidden");

  // 重新生成卡片
  for (let i = 0; i < CARD_COUNT; i++) {
    const card = createCatCard();
    container.appendChild(card);
  }
}

restartBtn.addEventListener("click", () => {
  init();
});
