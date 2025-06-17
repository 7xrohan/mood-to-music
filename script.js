document.getElementById("generate-btn").addEventListener("click", async () => {
  const mood = document.getElementById("mood-input").value;

  const response = await fetch("/api/generate-playlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ mood })
  });

  const data = await response.json();
  displayPlaylists(data.playlists);
});

function displayPlaylists(playlists) {
  const container = document.getElementById("playlist-container");
  container.innerHTML = "";

  playlists.forEach((playlist) => {
    const card = document.createElement("div");
    card.className = "playlist-card";

    const title = document.createElement("h3");
    title.textContent = playlist.title;

    const link = document.createElement("a");
    link.href = playlist.url;
    link.target = "_blank";
    link.textContent = "Listen on Spotify";

    card.appendChild(title);
    card.appendChild(link);
    container.appendChild(card);
  });
}

// Star background
const starCanvas = document.getElementById("stars");
const starCtx = starCanvas.getContext("2d");
let stars = [];

function resizeStarCanvas() {
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeStarCanvas);
resizeStarCanvas();

for (let i = 0; i < 100; i++) {
  stars.push({
    x: Math.random() * starCanvas.width,
    y: Math.random() * starCanvas.height,
    radius: Math.random() * 1.5,
    speed: Math.random() * 0.3 + 0.2
  });
}

function animateStars() {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  stars.forEach((star) => {
    star.y += star.speed;
    if (star.y > starCanvas.height) star.y = 0;

    starCtx.beginPath();
    starCtx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
    starCtx.fillStyle = "#ffffff";
    starCtx.fill();
  });
  requestAnimationFrame(animateStars);
}
animateStars();

// Beatline
const beatCanvas = document.getElementById("beatline");
const beatCtx = beatCanvas.getContext("2d");

function resizeBeatCanvas() {
  beatCanvas.width = window.innerWidth;
  beatCanvas.height = 120;
}
resizeBeatCanvas();
window.addEventListener("resize", resizeBeatCanvas);

let t = 0;

function animateBeatline() {
  beatCtx.clearRect(0, 0, beatCanvas.width, beatCanvas.height);
  beatCtx.beginPath();
  beatCtx.moveTo(0, 60);
  for (let x = 0; x < beatCanvas.width; x++) {
    const y = 60 + Math.sin((x + t) * 0.04) * 20 * Math.abs(Math.sin(t * 0.01));
    beatCtx.lineTo(x, y);
  }
  beatCtx.strokeStyle = "#32cd32";
  beatCtx.lineWidth = 2;
  beatCtx.stroke();
  t += 2;
  requestAnimationFrame(animateBeatline);
}
animateBeatline();
