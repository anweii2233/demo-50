function updateClock() {
  const hourHand = document.getElementById("hourHand");
  const minHand = document.getElementById("minHand");
  const secHand = document.getElementById("secHand");

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // 1. 计算秒针角度：一圈 360 度共 60 秒，每秒 6 度
  const secDegrees = seconds * 6;

  // 2. 计算分针角度：每分钟 6 度 + 秒针带来的微调 (seconds / 60 * 6)
  const minDegrees = minutes * 6 + seconds * 0.1;

  // 3. 计算时针角度：12小时一圈，每小时 30 度 + 分针带来的微调 (minutes / 60 * 30)
  // hours % 12 将 24小时制转换为 12小时制
  const hourDegrees = (hours % 12) * 30 + minutes * 0.5;

  // 4. 应用 CSS 属性变换
  // 因为 CSS 里设置了 transform: translateX(-50%)，这里别忘了带上
  secHand.style.transform = `translateX(-50%) rotate(${secDegrees}deg)`;
  minHand.style.transform = `translateX(-50%) rotate(${minDegrees}deg)`;
  hourHand.style.transform = `translateX(-50%) rotate(${hourDegrees}deg)`;
}

// 初始化先执行一次，避免首屏闪烁/延迟
updateClock();

// 每秒刷新一次
setInterval(updateClock, 1000);
