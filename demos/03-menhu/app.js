/**
 * ==========================================================================
 * ARTISAN CODE 2026 - CORE INTERACTION SYSTEM
 * 核心动效：数字纸张褶皱形变 + 全屏物理冲击波 + 印刷底版网格扭曲
 * ==========================================================================
 */

// 1. 全局状态存储
const state = {
  mouseX: 0,
  mouseY: 0,
  targetMouseX: 0,
  targetMouseY: 0,
  scrollSpeed: 0,
  lastScrollY: window.scrollY,
  clickPulse: 0, // 鼠标点击波纹脉冲强度
  clickX: 0,
  clickY: 0,
};

// 获取DOM节点
const displacementMap = document.getElementById("displacement-map");
const canvas = document.getElementById("canvas-canvas");
const ctx = canvas.getContext("2d");

// 2. 初始化画布尺寸
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// 3. 事件流捕获监控
window.addEventListener("mousemove", (e) => {
  state.targetMouseX = e.clientX;
  state.targetMouseY = e.clientY;
});

window.addEventListener("click", (e) => {
  state.clickPulse = 60; // 激发高强度波纹
  state.clickX = e.clientX;
  state.clickY = e.clientY;
});

// 4. 核心物理渲染与扭曲驱动循环
function update() {
  // 鼠标平滑缓动追随 (Lerp)
  state.mouseX += (state.targetMouseX - state.mouseX) * 0.1;
  state.mouseY += (state.targetMouseY - state.mouseY) * 0.1;

  // 计算当前页面的滚动速度
  const currentScrollY = window.scrollY;
  state.scrollSpeed = currentScrollY - state.lastScrollY;
  state.lastScrollY = currentScrollY;

  // 点击冲击波波纹随时间衰减
  if (state.clickPulse > 0) {
    state.clickPulse *= 0.94;
    if (state.clickPulse < 0.1) state.clickPulse = 0;
  }

  // ==========================================
  // 算法 A: 驱动全局 SVG 滤镜扭曲 HTML 文本结构
  // ==========================================
  // 基础扭曲度由滚动速度绝对值决定，并叠加鼠标点击冲击波
  const targetScale = Math.min(
    Math.abs(state.scrollSpeed) * 0.6 + state.clickPulse * 1.5,
    80,
  );
  // 平滑同步渲染给 SVG 位移贴图
  let currentScale = parseFloat(displacementMap.getAttribute("scale")) || 0;
  currentScale += (targetScale - currentScale) * 0.2;
  displacementMap.setAttribute("scale", currentScale);

  // ==========================================
  // 算法 B: 绘制底层可交互的“丝网印刷线条画布”
  // ==========================================
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1.5;

  const lineGap = 60; // 垂向线条的间距
  const totalLines = Math.ceil(canvas.width / lineGap) + 1;

  for (let i = 0; i < totalLines; i++) {
    let originX = i * lineGap;

    ctx.beginPath();
    // 逐像素/步长向下绘制单条正弦扭曲波纹线
    for (let y = 0; y <= canvas.height; y += 15) {
      let currentX = originX;

      // 1. 鼠标悬停的局部油墨排斥避让计算
      const dx = currentX - state.mouseX;
      const dy = y - state.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        const force = (180 - dist) / 180;
        // 沿着鼠标移入方向产生推开位移
        currentX += (dx / dist) * force * 35;
      }

      // 2. 页面滚动带来的整体横向水波纹流动形变
      if (Math.abs(state.scrollSpeed) > 0.5) {
        currentX +=
          Math.sin(y * 0.01 + currentScrollY * 0.05) *
          (state.scrollSpeed * 0.3);
      }

      // 3. 鼠标点击产生的全屏圆环冲击波形变
      if (state.clickPulse > 0) {
        const cDx = currentX - state.clickX;
        const cDy = y - state.clickY;
        const cDist = Math.sqrt(cDx * cDx + cDy * cDy);

        // 冲击波震荡核心半径跟随时间扩散
        const waveRadius = (60 - state.clickPulse) * 15;
        const waveWidth = 100;

        if (cDist > waveRadius - waveWidth && cDist < waveRadius + waveWidth) {
          const waveForce =
            (1 - Math.abs(cDist - waveRadius) / waveWidth) * state.clickPulse;
          currentX += (cDx / cDist) * waveForce * 2;
        }
      }

      if (y === 0) {
        ctx.moveTo(currentX, y);
      } else {
        ctx.lineTo(currentX, y);
      }
    }
    ctx.stroke();
  }

  // 维持无尽循环
  requestAnimationFrame(update);
}

// 启动引擎
requestAnimationFrame(update);

// 5. 额外彩蛋：作品库底层超大文本视差倾斜效果
window.addEventListener("scroll", () => {
  const hugeText = document.querySelector(".bg-huge-text");
  if (hugeText) {
    const scrolled = window.scrollY;
    // 随滚动横向拉伸平移，打破固有矩形视觉
    hugeText.style.transform = `translateX(${scrolled * -0.2}px) skewX(${Math.min(window.scrollY * 0.02, 15)}deg)`;
  }
});
