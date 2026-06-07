<script setup lang="ts">import { ref, onMounted, onUnmounted } from 'vue';
import { useDivinationStore } from '@/stores/divination';
const store = useDivinationStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationId: number | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let frameCount = 0;
const numbers = ref<{
 x: number;
 y: number;
 value: string;
 speed: number;
 opacity: number;
}[]>([]);
const initNumbers = () => {
 numbers.value = [];
 for (let i = 0; i < 50; i++) {
 numbers.value.push({
 x: Math.random() * 400,
 y: Math.random() * 400 - 400,
 value: String(Math.floor(Math.random() * 10)),
 speed: 1 + Math.random() * 2,
 opacity: 0.3 + Math.random() * 0.7
 });
 }
};
const animate = () => {
 if (!ctx || !canvasRef.value)
 return;
 const canvasCtx = ctx;
 const { width, height } = canvasRef.value;
 ctx.fillStyle = 'rgba(5, 5, 16, 0.1)';
 ctx.fillRect(0, 0, width, height);
 const progress = store.calculationProgress / 100;
 const centerX = width / 2;
 const centerY = height / 2;
 const matrixSize = 60;
 const matrixStartX = centerX - matrixSize * 1.5;
 const matrixStartY = centerY - matrixSize * 1.5 - 50;
 if (progress > 0.1) {
 ctx.font = '14px JetBrains Mono, monospace';
 ctx.textAlign = 'center';
 for (let i = 0; i < 3; i++) {
 for (let j = 0; j < 3; j++) {
 const x = matrixStartX + j * matrixSize;
 const y = matrixStartY + i * matrixSize;
 const cellProgress = Math.max(0, Math.min(1, (progress - 0.1) * 1.5 - (i + j) * 0.1));
 if (cellProgress > 0) {
 ctx.strokeStyle = `rgba(212, 175, 55, ${cellProgress * 0.5})`;
 ctx.lineWidth = 1;
 ctx.strokeRect(x - 25, y - 15, 50, 30);
 if (cellProgress > 0.3) {
 const value = Math.floor(Math.sin(frameCount * 0.1 + i * 3 + j) * 4.5 + 4.5);
 ctx.fillStyle = `rgba(212, 175, 55, ${(cellProgress - 0.3) * 1.4})`;
 ctx.fillText(String(value), x, y + 5);
 }
 }
 }
 }
 }
 if (progress > 0.4) {
 const formulaProgress = Math.min(1, (progress - 0.4) * 2);
 ctx.font = '12px JetBrains Mono, monospace';
 ctx.fillStyle = `rgba(147, 112, 219, ${formulaProgress})`;
 ctx.textAlign = 'center';
 const formulas = [
 'det(M - λI) = 0',
 'λ₁, λ₂, λ₃ = eig(M)',
 'v = f(λ, t, runes)'
 ];
 formulas.forEach((formula, idx) => {
 const y = centerY + 80 + idx * 30;
 const alpha = Math.max(0, Math.min(1, formulaProgress - idx * 0.15));
 canvasCtx.fillStyle = `rgba(147, 112, 219, ${alpha})`;
 canvasCtx.fillText(formula, centerX, y);
 });
 }
 if (progress > 0.7) {
 const geomProgress = Math.min(1, (progress - 0.7) * 3.3);
 const sides = 5 + Math.floor(Math.sin(frameCount * 0.02) * 2);
 ctx.strokeStyle = `rgba(212, 175, 55, ${geomProgress})`;
 ctx.lineWidth = 2;
 ctx.beginPath();
 for (let i = 0; i < sides; i++) {
 const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
 const radius = 80 * geomProgress;
 const x = centerX + 200 + Math.cos(angle) * radius;
 const y = centerY - 50 + Math.sin(angle) * radius;
 if (i === 0)
 ctx.moveTo(x, y);
 else
 ctx.lineTo(x, y);
 }
 ctx.closePath();
 ctx.stroke();
 }
 numbers.value.forEach((num, idx) => {
 num.y += num.speed;
 if (num.y > height + 20) {
 num.y = -20;
 num.x = Math.random() * width;
 num.value = String(Math.floor(Math.random() * 10));
 }
 canvasCtx.font = '14px JetBrains Mono, monospace';
 canvasCtx.fillStyle = `rgba(192, 192, 192, ${num.opacity * progress})`;
 canvasCtx.textAlign = 'left';
 canvasCtx.fillText(num.value, num.x, num.y);
 });
 const ringRadius = 150 + Math.sin(frameCount * 0.05) * 10;
 ctx.strokeStyle = `rgba(212, 175, 55, ${0.3 * progress})`;
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2 * progress);
 ctx.stroke();
 if (progress > 0) {
 ctx.font = 'bold 24px Cinzel, serif';
 ctx.fillStyle = '#d4af37';
 ctx.textAlign = 'center';
 ctx.fillText(`${Math.floor(store.calculationProgress)}%`, centerX, centerY + 8);
 }
 frameCount++;
 animationId = requestAnimationFrame(animate);
};
onMounted(() => {
 if (canvasRef.value) {
 ctx = canvasRef.value.getContext('2d');
 initNumbers();
 animate();
 }
});
onUnmounted(() => {
 if (animationId) {
 cancelAnimationFrame(animationId);
 }
});
</script>

<template>
  <div class="w-full max-w-3xl mx-auto text-center">
    <div class="mb-8">
      <h3 class="font-display text-3xl text-gold mb-4 tracking-wider animate-pulse-slow">
        算法演算中
      </h3>
      <p class="font-body text-silver/70 text-lg">
        矩阵正在解析你的能量场...
      </p>
    </div>
    
    <div class="relative flex justify-center">
      <canvas
        ref="canvasRef"
        width="800"
        height="600"
        class="max-w-full rounded-2xl"
        style="background: linear-gradient(135deg, rgba(10, 10, 26, 0.9), rgba(26, 10, 46, 0.9))"
      />
      
      <div
        class="absolute inset-0 rounded-2xl pointer-events-none"
        style="box-shadow: inset 0 0 100px rgba(212, 175, 55, 0.1)"
      />
    </div>
    
    <div class="mt-8 space-y-2">
      <div
        v-for="i in 3"
        :key="i"
        class="flex items-center justify-center gap-4 text-sm font-mono"
        :class="{
          'text-gold': store.calculationStepIndex > i * 5,
          'text-silver/50': store.calculationStepIndex <= i * 5
        }"
      >
        <span class="w-24 text-right">
          {{ ['生命路径', '命运矩阵', '星象映射'][i - 1] }}
        </span>
        <span class="text-silver/50">→</span>
        <span class="w-24 text-left">
          {{ store.calculationStepIndex > i * 5 ? '✓ 完成' : '计算中...' }}
        </span>
      </div>
    </div>
  </div>
</template>
