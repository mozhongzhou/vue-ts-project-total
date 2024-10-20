<template>
  <div class="clock">
    <!-- 画布，用于绘制时钟 -->
    <canvas ref="canvas" width="400" height="400"></canvas>
    <!-- 显示北京时间 -->
    <p>北京时间: {{ time }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// 定义响应式变量来存储时间和画布引用
const time = ref('');
const canvas = ref<HTMLCanvasElement | null>(null);

// 绘制时钟的函数
const drawClock = (ctx: CanvasRenderingContext2D, x0: number, y0: number) => {
  // 绘制表盘的时针刻度
  const drawHoursScale = (ctx: CanvasRenderingContext2D, x0: number, y0: number, scaleNum: number, scaleW: number, maxL: number, minL: number) => {
    for (let i = 0; i < scaleNum; i++) {
      let angle = -90 + i * (360 / scaleNum); // 角度
      let [x1, y1] = [x0 + Math.cos(angle * Math.PI / 180) * maxL, y0 + Math.sin(angle * Math.PI / 180) * maxL];
      let [x2, y2] = [x0 + Math.cos(angle * Math.PI / 180) * minL, y0 + Math.sin(angle * Math.PI / 180) * minL];
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = scaleW;
      ctx.lineCap = "round";
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }
  };

  // 绘制表盘的分针刻度
  const drawMinutesScale = (ctx: CanvasRenderingContext2D, x0: number, y0: number, scaleNum: number, scaleW: number, maxL: number, minL: number) => {
    for (let i = 0; i < scaleNum; i++) {
      let angle = -90 + i * (360 / scaleNum); // 角度
      let [x1, y1] = [x0 + Math.cos(angle * Math.PI / 180) * maxL, y0 + Math.sin(angle * Math.PI / 180) * maxL];
      let [x2, y2] = [x0 + Math.cos(angle * Math.PI / 180) * minL, y0 + Math.sin(angle * Math.PI / 180) * minL];
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = scaleW;
      ctx.lineCap = "round";
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }
  };

  // 绘制表盘数字刻度
  const drawNumbers = (ctx: CanvasRenderingContext2D, x0: number, y0: number, radius: number) => {
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 1; i <= 12; i++) {
      let angle = -90 + i * (360 / 12); // 角度
      let x = x0 + Math.cos(angle * Math.PI / 180) * (radius - 30);
      let y = y0 + Math.sin(angle * Math.PI / 180) * (radius - 30);
      ctx.fillText(i.toString(), x, y);
    }
  };

  // 绘制时针、分针、秒针
  const drawTimeNeedle = (ctx: CanvasRenderingContext2D, x0: number, y0: number, lineW: number, L: number, angle: number, color: string = '#000') => {
    // 计算指针终点坐标
    let [x, y] = [x0 + Math.cos(angle * Math.PI / 180) * L, y0 + Math.sin(angle * Math.PI / 180) * L];
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineW;
    ctx.lineCap = "round";
    ctx.moveTo(x0, y0); // 指针起点
    ctx.lineTo(x, y); // 指针终点
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  // 绘制中心点
  const drawCenter = (ctx: CanvasRenderingContext2D, x0: number, y0: number) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x0, y0, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  };

  // 绘制秒针的尾部
  const drawSecondTail = (ctx: CanvasRenderingContext2D, x0: number, y0: number, L: number, angle: number) => {
    // 计算秒针尾部终点坐标
    let [x, y] = [x0 + Math.cos(angle * Math.PI / 180) * L, y0 + Math.sin(angle * Math.PI / 180) * L];
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.moveTo(x0, y0); // 秒针尾部起点
    ctx.lineTo(x, y); // 秒针尾部终点
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  // 获取当前时间并绘制指针
  const drawTime = (ctx: CanvasRenderingContext2D, x0: number, y0: number) => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    // 计算时针、分针、秒针的角度
    const hourAngle = -90 + (hours % 12) * 30 + minutes / 2;
    const minuteAngle = -90 + minutes * 6;
    const secondAngle = -90 + seconds * 6 + milliseconds * 0.006;

    // 绘制时针
    drawTimeNeedle(ctx, x0, y0, 8, 80, hourAngle, '#000');
    // 绘制分针
    drawTimeNeedle(ctx, x0, y0, 6, 120, minuteAngle, '#000');
    // 绘制秒针
    drawTimeNeedle(ctx, x0, y0, 4, 140, secondAngle, 'red');

    // 绘制秒针的尾部
    drawSecondTail(ctx, x0, y0, -20, secondAngle + 180);
  };

  // 清除画布
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // 绘制表盘
  drawHoursScale(ctx, x0, y0, 12, 4, 150, 130);
  drawMinutesScale(ctx, x0, y0, 60, 2, 150, 140);
  drawNumbers(ctx, x0, y0, 150);
  drawCenter(ctx, x0, y0);
  drawTime(ctx, x0, y0);
};

// 更新时间的函数
const updateTime = () => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Shanghai',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  time.value = new Intl.DateTimeFormat('zh-CN', options).format(now);
};

// 组件挂载时的生命周期钩子
onMounted(() => {
  const ctx = canvas.value?.getContext('2d');
  if (ctx) {
    const x0 = ctx.canvas.width / 2;
    const y0 = ctx.canvas.height / 2;

    const render = () => {
      drawClock(ctx, x0, y0);
      updateTime();
      requestAnimationFrame(render);
    };

    render();

    onUnmounted(() => {
      cancelAnimationFrame(render);
    });
  }
});
</script>

<style scoped>
.clock {
  font-size: 2em;
  color: #2c3e50;
  text-align: center;
}

canvas {
  display: block;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}
</style>