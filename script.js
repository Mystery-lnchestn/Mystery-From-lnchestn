const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// 【关键】让画布严格铺满整个iPad屏幕
function resizeCanvas() {
  // iPad Safari专属：用视觉视口尺寸，避免刘海/工具栏干扰
  canvas.width = window.visualViewport?.width || window.innerWidth;
  canvas.height = window.visualViewport?.height || window.innerHeight;
}
resizeCanvas();
// 转屏/缩放时自动重新铺满
window.addEventListener('resize', resizeCanvas);
window.visualViewport?.addEventListener('resize', resizeCanvas);

// 加载你的滑稽图
const img = new Image();
img.src = 'HAPPY.png';

// 速度（iPad上3-4刚好，不会太快晃眼）
let dx = 3;
let dy = 3;
// 表情显示大小（你之前设的100，刚好）
const displayWidth = 100;
const displayHeight = 100;

// 【关键】等图片加载完、画布也铺满后，再把表情放在屏幕正中心
img.onload = function () {
  // 初始位置=屏幕中心，不会偏到左上角
  x = canvas.width / 2 - displayWidth / 2;
  y = canvas.height / 2 - displayHeight / 2;
  gameLoop();
};

function draw() {
  // 清屏（黑背景）
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 画表情包
  ctx.drawImage(img, x, y, displayWidth, displayHeight);

  // 【核心修复】用「当前全屏画布的尺寸」判断碰壁，不是固定值！
  if (x + displayWidth > canvas.width || x < 0) dx = -dx;
  if (y + displayHeight > canvas.height || y < 0) dy = -dy;

  // 更新位置
  x += dx;
  y += dy;
}

function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}
