/**
 * Canvas 树枝随机生长动效
 * 注释使用中文描述关键逻辑
 */

const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");

// 存储所有正在生长的树枝节点任务
let branchTasks = [];

// 初始化画布大小
function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  startTreeGrowth();
}

/**
 * 启动一棵新树的生长
 */
function startTreeGrowth() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  branchTasks = [];

  // 初始树干参数
  const startX = canvas.width / 2;
  const startY = canvas.height;
  const initialLength = Math.min(canvas.height * 0.2, 130); // 初始主干长度
  const initialWidth = 14; // 主干粗细
  const angle = -Math.PI / 2; // 垂直向上 (-90度)

  // 将主干推入生长任务队列
  createBranch(startX, startY, angle, initialLength, initialWidth, 0);

  // 启动动画循环（如果还没启动的话）
  if (branchTasks.length > 0) {
    requestAnimationFrame(animate);
  }
}

/**
 * 创建一个树枝任务对象
 * @param {number} x 起点X
 * @param {number} y 起点Y
 * @param {number} angle 生长角度（弧度）
 * @param {number} length 总长度
 * @param {number} width 树枝宽度
 * @param {number} generation 当前代数（级数）
 */
function createBranch(x, y, angle, length, width, generation) {
  branchTasks.push({
    startX: x,
    startY: y,
    currentX: x,
    currentY: y,
    angle: angle,
    totalLength: length,
    currentLength: 0,
    width: width,
    generation: generation,
    // 计算终点，方便计算角度微调
    endX: x + Math.cos(angle) * length,
    endY: y + Math.sin(angle) * length,
    speed: 2 + Math.random() * 2, // 生长速度：每帧延长的像素
  });
}

/**
 * 绘制花朵/桃花效果
 */
function drawFlower(x, y) {
  const petals = 5;
  const radius = 3 + Math.random() * 4;

  ctx.save();
  ctx.fillStyle = `rgba(255, 182, 193, ${0.6 + Math.random() * 0.4})`; // 樱花粉色

  // 绘制5片花瓣
  for (let i = 0; i < petals; i++) {
    ctx.beginPath();
    const angle = (i * 2 * Math.PI) / petals;
    const petalX = x + Math.cos(angle) * radius;
    const petalY = y + Math.sin(angle) * radius;
    ctx.arc(petalX, petalY, radius * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 花芯
  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * 核心动画循环
 */
function animate() {
  if (branchTasks.length === 0) return;

  // 下一帧需要保留的任务
  const nextTasks = [];

  for (let task of branchTasks) {
    // 1. 每一帧计算当前增长的步长
    const remaining = task.totalLength - task.currentLength;
    const step = Math.min(task.speed, remaining);

    if (step <= 0) {
      // 当前树枝已经生长完毕，触发分叉判定
      handleBranchSplit(task, nextTasks);
      continue;
    }

    // 2. 计算这步延长的目标坐标（加入微小的随机曲折感）
    const nextX = task.currentX + Math.cos(task.angle) * step;
    const nextY = task.currentY + Math.sin(task.angle) * step;

    // 3. 绘制这一小段树枝
    ctx.beginPath();
    ctx.strokeStyle = `hsl(30, 40%, ${15 + task.generation * 4}%)`; // 越到末梢颜色越浅
    ctx.lineWidth = Math.max(
      0.5,
      task.width * (1 - task.currentLength / task.totalLength),
    ); // 渐变变细
    ctx.lineCap = "round";
    ctx.moveTo(task.currentX, task.currentY);
    ctx.lineTo(nextX, nextY);
    ctx.stroke();

    // 4. 更新当前任务的坐标状态
    task.currentX = nextX;
    task.currentY = nextY;
    task.currentLength += step;

    // 保留未成长完的任务
    nextTasks.push(task);
  }

  branchTasks = nextTasks;
  requestAnimationFrame(animate);
}

/**
 * 当树枝生长结束后，判定是否分叉或开花
 */
function handleBranchSplit(task, nextTasks) {
  const maxGenerations = 8; // 最大分叉代数

  if (task.generation >= maxGenerations) {
    // 最后一代末梢有概率开花
    if (Math.random() > 0.3) {
      drawFlower(task.currentX, task.currentY);
    }
    return;
  }

  // 概率开花（中途的枝干也可能开少许花）
  if (task.generation > 4 && Math.random() > 0.88) {
    drawFlower(task.currentX, task.currentY);
  }

  // 决定分叉的数量（1到3个）
  let branchesCount = 2;
  if (task.generation === 0) branchesCount = 3; // 主干多开几个分叉
  if (Math.random() > 0.8) branchesCount = 1; // 概率不分叉只延续

  for (let i = 0; i < branchesCount; i++) {
    // 角度偏移：每一代都有不同的偏转范围
    const maxSpread = task.generation === 0 ? 0.4 : 0.6; // 弧度
    let angleChange = (Math.random() - 0.5) * maxSpread;

    // 如果分叉多个，强行撑开角度避免重合
    if (branchesCount > 1) {
      angleChange =
        (i / (branchesCount - 1) - 0.5) * maxSpread +
        (Math.random() - 0.5) * 0.2;
    }

    const nextAngle = task.angle + angleChange;
    // 越到高代数，长度和粗细呈指数衰减
    const nextLength = task.totalLength * (0.65 + Math.random() * 0.2);
    const nextWidth = task.width * 0.7;

    if (nextWidth > 0.5 && nextLength > 5) {
      createBranch(
        task.currentX,
        task.currentY,
        nextAngle,
        nextLength,
        nextWidth,
        task.generation + 1,
      );
    }
  }
}

// 事件监听
window.addEventListener("resize", initCanvas);
window.addEventListener("click", startTreeGrowth);

// 初始化运行
initCanvas();
