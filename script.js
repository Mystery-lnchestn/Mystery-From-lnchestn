const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// 1. 创建图片对象
const img = new Image();
img.src = 'HAPPY.png'; // 你的文件名是 HAPPY.png，这里必须一模一样（大小写敏感）

// 2. 初始位置和速度
let x = 50;
let y = 50;
let dx = 2;
let dy = 2;

// 3. 关键：设置显示尺寸（原图太大了，我们要缩小）
// 你可以随意调整这两个数字，比如 80, 80 或者 120, 120
const displayWidth = 100;
const displayHeight = 100;

// 4. 等图片加载完毕再开始游戏（非常重要！）
img.onload = function () {
  console.log('图片加载成功！开始弹跳～');
  gameLoop();
};

// 如果图片加载失败，报错提示（方便排查问题）
img.onerror = function () {
  console.error('图片加载失败！检查文件名是否是 HAPPY.png');
};

function draw() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 5. 画图片（使用缩小后的尺寸）
  ctx.drawImage(img, x, y, displayWidth, displayHeight);

  // 6. 碰壁反弹逻辑（要用显示尺寸来判断边缘）
  if (x + displayWidth > canvas.width || x < 0) {
    dx = -dx;
  }
  if (y + displayHeight > canvas.height || y < 0) {
    dy = -dy;
  }

  // 7. 更新位置
  x += dx;
  y += dy;
}

function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}
