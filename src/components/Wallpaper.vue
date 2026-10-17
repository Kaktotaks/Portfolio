<template>
  <!--
    Original wallpaper in the spirit of iOS's flowing-ribbon wallpapers (not Apple artwork).
    Drawn on a square canvas and cropped with "slice", so it works on the portrait phone
    and the landscape iPad alike. Each ribbon = soft shadow + gradient body + fold shading + lit edge.
  -->
  <div class="wallpaper" aria-hidden="true">
    <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wp-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1a1150" />
          <stop offset="0.55" stop-color="#2a0f55" />
          <stop offset="1" stop-color="#071a45" />
        </linearGradient>

        <linearGradient id="wp-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#3b1d8f" />
          <stop offset="1" stop-color="#7a2fb8" />
        </linearGradient>
        <linearGradient id="wp-warm" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="#ff5f8f" />
          <stop offset="0.5" stop-color="#ff8a6a" />
          <stop offset="1" stop-color="#ffc27a" />
        </linearGradient>
        <linearGradient id="wp-violet" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="#5b3cf0" />
          <stop offset="0.55" stop-color="#a24cf2" />
          <stop offset="1" stop-color="#e46ad6" />
        </linearGradient>
        <linearGradient id="wp-blue" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="#0a3a9e" />
          <stop offset="0.5" stop-color="#2f6bff" />
          <stop offset="1" stop-color="#3fc8ff" />
        </linearGradient>

        <!-- Fold shading: light at the top edge, darker toward the underside -->
        <linearGradient id="wp-fold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity="0.22" />
          <stop offset="0.45" stop-color="#fff" stop-opacity="0" />
          <stop offset="1" stop-color="#000" stop-opacity="0.38" />
        </linearGradient>

        <filter id="wp-shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id="wp-soft" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>

      <rect width="1000" height="1000" fill="url(#wp-bg)" />

      <!-- Top fold -->
      <g class="ribbon r0">
        <path d="M-120 -120H1120V140C930 90 780 300 560 310S130 210 -120 330Z" fill="url(#wp-top)" />
        <path d="M-120 -120H1120V140C930 90 780 300 560 310S130 210 -120 330Z" fill="url(#wp-fold)" />
      </g>

      <!-- Warm ribbon -->
      <g class="ribbon r1">
        <path class="shadow" d="M-120 400C130 270 350 490 600 350S950 170 1120 240V420C900 350 760 540 560 580S120 490 -120 620Z" filter="url(#wp-shadow)" />
        <path d="M-120 400C130 270 350 490 600 350S950 170 1120 240V420C900 350 760 540 560 580S120 490 -120 620Z" fill="url(#wp-warm)" />
        <path d="M-120 400C130 270 350 490 600 350S950 170 1120 240V420C900 350 760 540 560 580S120 490 -120 620Z" fill="url(#wp-fold)" />
        <path class="edge" d="M-120 400C130 270 350 490 600 350S950 170 1120 240" filter="url(#wp-soft)" />
      </g>

      <!-- Violet ribbon -->
      <g class="ribbon r2">
        <path class="shadow" d="M-120 590C150 490 380 700 620 580S950 400 1120 470V660C920 600 760 780 560 800S140 700 -120 820Z" filter="url(#wp-shadow)" />
        <path d="M-120 590C150 490 380 700 620 580S950 400 1120 470V660C920 600 760 780 560 800S140 700 -120 820Z" fill="url(#wp-violet)" />
        <path d="M-120 590C150 490 380 700 620 580S950 400 1120 470V660C920 600 760 780 560 800S140 700 -120 820Z" fill="url(#wp-fold)" />
        <path class="edge" d="M-120 590C150 490 380 700 620 580S950 400 1120 470" filter="url(#wp-soft)" />
      </g>

      <!-- Blue base -->
      <g class="ribbon r3">
        <path class="shadow" d="M-120 790C160 700 400 900 640 800S960 640 1120 710V1120H-120Z" filter="url(#wp-shadow)" />
        <path d="M-120 790C160 700 400 900 640 800S960 640 1120 710V1120H-120Z" fill="url(#wp-blue)" />
        <path d="M-120 790C160 700 400 900 640 800S960 640 1120 710V1120H-120Z" fill="url(#wp-fold)" />
        <path class="edge" d="M-120 790C160 700 400 900 640 800S960 640 1120 710" filter="url(#wp-soft)" />
      </g>
    </svg>
    <span class="dim" />
    <span class="grain" />
  </div>
</template>

<style scoped>
.wallpaper {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #1a1150;
}

svg {
  position: absolute;
  inset: -4%;
  width: 108%;
  height: 108%;
}

.shadow {
  fill: #000;
  opacity: 0.5;
  transform: translateY(22px);
}

.edge {
  fill: none;
  stroke: #fff;
  stroke-opacity: 0.5;
  stroke-width: 2.5;
}

/* Very slow drift, so blurred glass above always has a little motion to pick up */
.ribbon {
  transform-box: view-box;
  transform-origin: 50% 50%;
  animation: float 28s ease-in-out infinite alternate;
}

.r0 {
  animation-duration: 34s;
}

.r1 {
  animation-duration: 26s;
  animation-delay: -6s;
}

.r2 {
  animation-duration: 30s;
  animation-delay: -12s;
  animation-direction: alternate-reverse;
}

.r3 {
  animation-duration: 38s;
  animation-delay: -3s;
}

@keyframes float {
  from {
    transform: translate(-1.5%, 0) rotate(-1deg);
  }
  to {
    transform: translate(1.5%, 1.2%) rotate(1deg);
  }
}

/* iOS dims the wallpaper in dark mode */
.dim {
  position: absolute;
  inset: 0;
  background: #000;
  opacity: 0;
  transition: opacity 400ms ease;
}

@media (prefers-color-scheme: dark) {
  :global(:root:not([data-theme='light'])) .dim {
    opacity: 0.28;
  }
}

:global(:root[data-theme='dark']) .dim {
  opacity: 0.28;
}

.grain {
  position: absolute;
  inset: 0;
  opacity: 0.05;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

@media (prefers-reduced-motion: reduce) {
  .ribbon {
    animation: none;
  }
}
</style>
