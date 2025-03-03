class Sakura {
  constructor() {
    this.container = document.body;
    this.init();
  }

  init() {
    this.createInterval();
  }

  createInterval() {
    // 减少间隔时间，增加樱花数量
    setInterval(() => this.createPetal(), 200);
  }

  createPetal() {
    const petal = document.createElement("div");
    petal.className = "sakura";

    // 随机起始位置（在屏幕顶部和两侧）
    const startX = Math.random() * (window.innerWidth + 200) - 100;

    // 更自然的结束位置计算
    const windForce = Math.random() * 2 - 1; // 随机风力，-1到1
    const endX = startX + (Math.random() * 300 - 150) + windForce * 200;
    const endY = window.innerHeight + 100;

    // 生成中间点，使路径更自然
    const quarterX =
      startX + (endX - startX) * 0.25 + (Math.random() * 100 - 50);
    const quarterY = endY * 0.25;
    const halfX = startX + (endX - startX) * 0.5 + (Math.random() * 100 - 50);
    const halfY = endY * 0.5;
    const threeQuarterX =
      startX + (endX - startX) * 0.75 + (Math.random() * 100 - 50);
    const threeQuarterY = endY * 0.75;

    // 随机旋转角度
    const baseRotate = Math.random() * 360;
    const quarterRotate = baseRotate + Math.random() * 180 - 90;
    const halfRotate = quarterRotate + Math.random() * 180 - 90;
    const threeQuarterRotate = halfRotate + Math.random() * 180 - 90;
    const finalRotate = threeQuarterRotate + Math.random() * 360 - 180;

    // 随机动画持续时间
    const duration = 5000 + Math.random() * 5000;

    // 设置样式
    petal.style.left = `${startX}px`;
    petal.style.top = "-20px";

    // 设置动画路径点
    petal.style.setProperty("--quarter-x", `${quarterX - startX}px`);
    petal.style.setProperty("--quarter-y", `${quarterY}px`);
    petal.style.setProperty("--half-x", `${halfX - startX}px`);
    petal.style.setProperty("--half-y", `${halfY}px`);
    petal.style.setProperty("--three-quarter-x", `${threeQuarterX - startX}px`);
    petal.style.setProperty("--three-quarter-y", `${threeQuarterY}px`);
    petal.style.setProperty("--final-x", `${endX - startX}px`);
    petal.style.setProperty("--final-y", `${endY}px`);

    // 设置旋转角度
    petal.style.setProperty("--quarter-rotate", `${quarterRotate}deg`);
    petal.style.setProperty("--half-rotate", `${halfRotate}deg`);
    petal.style.setProperty(
      "--three-quarter-rotate",
      `${threeQuarterRotate}deg`
    );
    petal.style.setProperty("--rotate-deg", `${finalRotate}deg`);

    petal.style.animationDuration = `${duration}ms`;

    // 添加到页面
    this.container.appendChild(petal);

    // 动画结束后移除
    setTimeout(() => {
      petal.remove();
    }, duration);
  }
}

// 当页面加载完成后启动樱花动画
document.addEventListener("DOMContentLoaded", () => {
  new Sakura();
});
