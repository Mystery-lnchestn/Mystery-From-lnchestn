const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// 全屏适配
function resizeCanvas() {
  canvas.width = window.visualViewport?.width || window.innerWidth;
  canvas.height = window.visualViewport?.height || window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.visualViewport?.addEventListener('resize', resizeCanvas);

// 加载图片
const happyImg = new Image();
happyImg.src = 'HAPPY.png';
const angryImg = new Image();
angryImg.src = 'ANGRY.png';

const displayWidth = 100;
const displayHeight = 100;
const radius = displayWidth / 2; // 球的半径（用于碰撞检测）

// 等图片加载完
let imagesLoaded = 0;
function checkAllLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 2) gameLoop();
}
happyImg.onload = checkAllLoaded;
angryImg.onload = checkAllLoaded;

// 小球数组
let balls = [];

// 初始一个球
balls.push({
  x: canvas.width / 2,
  y: canvas.height / 2,
  dx: 3,
  dy: 3,
  img: happyImg
});

// ===== 核心：手指位置生成新球 =====
function spawnBallAt(x, y) {
  // 限制数量，iPad 性能保护
  if (balls.length >= 25) return;

  const randomImg = Math.random() > 0.5 ? happyImg : angryImg;
  const angle = Math.random() * Math.PI * 2;
  const speed = 2 + Math.random() * 3;
  const dx = Math.cos(angle) * speed;
  const dy = Math.sin(angle) * speed;

  balls.push({
    x: x - displayWidth / 2,  // 让球心对准手指
    y: y - displayHeight / 2,
    dx,
    dy,
    img: randomImg
  });
}

// 触摸事件（修正坐标偏移）
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect(); // 获取 canvas 偏移
  for (let touch of e.changedTouches) {
    spawnBallAt(
      touch.clientX - rect.left,
      touch.clientY - rect.top
    );
  }
});

// 鼠标点击（调试用）
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  spawnBallAt(e.clientX - rect.left, e.clientY - rect.top);
});

// ===== 核心：球与球碰撞检测 =====
function handleBallCollision(b1, b2) {
  const dx = b2.x - b1.x;
  const dy = b2.y - b1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // 如果撞上了
  if (distance < radius * 2) {
    // 1. 交换速度（简易弹性碰撞）
    [b1.dx, b2.dx] = [b2.dx, b1.dx];
    [b1.dy, b2.dy] = [b2.dy, b1.dy];

    // 2. 稍微推开一点，防止粘连
    const overlap = radius * 2 - distance;
    const separation = overlap / 2;
    const sepX = (dx / distance) * separation;
    const sepY = (dy / distance) * separation;
    b1.x -= sepX;
    b1.y -= sepY;
    b2.x += sepX;
    b2.y += sepY;

    // 3. 撞完换脸（可选，很魔性）
    [b1.img, b2.img] = [b2.img, b1.img];
  }
}

// ===== 游戏循环 =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 更新位置 + 碰壁
  for (let b of balls) {
    b.x += b.dx;
    b.y += b.dy;

    // 碰壁反弹
    if (b.x < 0 || b.x + displayWidth > canvas.width) {
      b.dx = -b.dx;
      b.img = (b.img === happyImg) ? angryImg : happyImg;
    }
    if (b.y < 0 || b.y + displayHeight > canvas.height) {
      b.dy = -b.dy;
      b.img = (b.img === happyImg) ? angryImg : happyImg;
    }
  }

  // 球与球碰撞（双重循环）
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      handleBallCollision(balls[i], balls[j]);
    }
  }

  // 绘制所有球
  for (let b of balls) {
    ctx.drawImage(b.img, b.x, b.y, displayWidth, displayHeight);
  }
}

function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}
