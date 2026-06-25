document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.getElementById("gridContainer");

  // 1. 动态生成 Demo 卡片
  function renderCards() {
    gridContainer.innerHTML = DEMO_DATA.map(
      (demo) => `
      <div class="card" data-path="${demo.path}" data-title="${demo.title}">
        <div>
          <h3>${demo.title}</h3>
          <p>${demo.description}</p>
        </div>
        <div class="tags">
          ${demo.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </div>
    `,
    ).join("");
  }

  // 别忘了调用渲染函数
  renderCards();

  // 2. 绑定卡片点击事件（在新窗口打开）
  gridContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;

    // 获取当前卡片的 demo 路径
    const path = card.dataset.path;

    // ★ 核心改动：_blank 表示在全新的标签页/窗口中打开该路径
    window.open(path, "_blank");
  });
});
