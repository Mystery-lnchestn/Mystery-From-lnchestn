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

// 加载两张图
const happyImg = new Image();
happyImg.src = 'HAPPY.png';
const angryImg = new Image();
angryImg.src = 'ANGRY.png';

const displayWidth = 100;
const displayHeight = 100;

// 等两张图都加载完
let imagesLoaded = 0;
function checkAllLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 2) {
    gameLoop();
  }
}
happyImg.onload = checkAllLoaded;
angryImg.onload = checkAllLoaded;

// ========== 核心：小球数组 ==========
let balls = [];

// 初始先放一个球在屏幕中心
balls.push({
  x: canvas.width / 2 - displayWidth / 2,
  y: canvas.height / 2 - displayHeight / 2,
  dx: 3,
  dy: 3,
  img: happyImg  // 初始用笑脸
});

// ========== 点屏幕 → 生成新球 ==========
function spawnBall() {
  // 随机选一张图
  const randomImg = Math.random() > 0.5 ? happyImg : angryImg;

  // 随机方向（速度 2~5 之间，方向随机）
  const angle = Math.random() * Math.PI * 2;       // 0~360 度随机角度
  const speed = 2 + Math.random() * 3;              // 速度 2~5
  const dx = Math.cos(angle) * speed;
  const dy = Math.sin(angle) * speed;

  // 随机初始位置（别太靠边，也别和已有球重叠太多）
  const x = Math.random() * (canvas.width - displayWidth);
  const y = Math.random() * (canvas.height - displayHeight);

  balls.push({ x, y, dx, dy, img: randomImg });
}

// 监听点击（电脑 + iPad 通用）
canvas.addEventListener('click', spawnBall);
canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  spawnBall();
});

// ========== 游戏循环 ==========
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 遍历所有小球
  for (let i = 0; i < balls.length; i++) {
    const b = balls[i];

    // 画当前球
    ctx.drawImage(b.img, b.x, b.y, displayWidth, displayHeight);

    // 碰壁检测
    let hitWall = false;
    if (b.x + displayWidth > canvas.width || b.x < 0) {
      b.dx = -b.dx;
      hitWall = true;
    }
    if (b.y + displayHeight > canvas.height || b.y < 0) {
      b.dy = -b.dy;
      hitWall = true;
    }

    // 撞墙换图
    if (hitWall) {
      b.img = (b.img === happyImg) ? angryImg : happyImg;
    }

    // 更新位置
    b.x += b.dx;
    b.y += b.dy;
  }
}

function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}
