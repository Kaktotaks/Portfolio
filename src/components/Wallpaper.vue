<template>
  <!-- Slowly drifting colour fields. Everything glass sits on top of this, so the blur has motion to show. -->
  <div class="wallpaper" aria-hidden="true">
    <span class="blob b1" />
    <span class="blob b2" />
    <span class="blob b3" />
    <span class="blob b4" />
    <span class="grain" />
  </div>
</template>

<style scoped>
.wallpaper {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(160deg, #1b1446 0%, #0d1b3d 55%, #0a2a4a 100%);
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.9;
  will-change: transform;
}

.b1 {
  width: 75%;
  aspect-ratio: 1;
  left: -20%;
  top: -18%;
  background: radial-gradient(circle, #ff8a5c 0%, #ff5c8a 45%, transparent 70%);
  animation: drift1 26s ease-in-out infinite alternate;
}

.b2 {
  width: 70%;
  aspect-ratio: 1;
  right: -25%;
  top: 12%;
  background: radial-gradient(circle, #8b5cf6 0%, #6d28d9 45%, transparent 70%);
  animation: drift2 32s ease-in-out infinite alternate;
}

.b3 {
  width: 85%;
  aspect-ratio: 1;
  left: -10%;
  bottom: -35%;
  background: radial-gradient(circle, #22d3ee 0%, #0ea5e9 40%, transparent 70%);
  animation: drift3 38s ease-in-out infinite alternate;
}

.b4 {
  width: 45%;
  aspect-ratio: 1;
  right: 5%;
  bottom: 18%;
  background: radial-gradient(circle, #f472b6 0%, transparent 70%);
  opacity: 0.55;
  animation: drift2 44s ease-in-out infinite alternate-reverse;
}

/* A touch of grain keeps large gradients from banding */
.grain {
  position: absolute;
  inset: 0;
  opacity: 0.06;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

@keyframes drift1 {
  to {
    transform: translate(18%, 22%) scale(1.15);
  }
}

@keyframes drift2 {
  to {
    transform: translate(-22%, 18%) scale(0.9);
  }
}

@keyframes drift3 {
  to {
    transform: translate(16%, -20%) scale(1.1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .blob {
    animation: none;
  }
}
</style>
