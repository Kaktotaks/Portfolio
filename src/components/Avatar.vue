<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Leonid as a 3D-emoji-style avatar, drawn in SVG (original artwork, not Apple's Memoji).
 * The head "turns" toward the pointer through parallax: the face layer moves more than the hair,
 * the ears counter-move, and the pupils lead. Blinks every few seconds.
 */
const root = ref<SVGSVGElement>()
const look = ref({ x: 0, y: 0 })
const blinking = ref(false)

let target = { x: 0, y: 0 }
let raf = 0
let blinkTimer = 0
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function onPointer(e: PointerEvent) {
  const r = root.value?.getBoundingClientRect()
  if (!r) return
  const dx = e.clientX - (r.left + r.width / 2)
  const dy = e.clientY - (r.top + r.height * 0.45)
  // Soft saturation: far away ≈ ±1, close by moves gently
  target = { x: dx / (Math.abs(dx) + 220), y: dy / (Math.abs(dy) + 220) }
}

function tick() {
  const c = look.value
  const x = c.x + (target.x - c.x) * 0.12
  const y = c.y + (target.y - c.y) * 0.12
  if (Math.abs(x - c.x) > 0.0005 || Math.abs(y - c.y) > 0.0005) look.value = { x, y }
  raf = requestAnimationFrame(tick)
}

function scheduleBlink() {
  blinkTimer = window.setTimeout(() => {
    blinking.value = true
    window.setTimeout(() => (blinking.value = false), 150)
    scheduleBlink()
  }, 2500 + Math.random() * 3500)
}

onMounted(() => {
  if (reduceMotion) return
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('pointerdown', onPointer, { passive: true })
  raf = requestAnimationFrame(tick)
  scheduleBlink()
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointer)
  window.removeEventListener('pointerdown', onPointer)
  cancelAnimationFrame(raf)
  window.clearTimeout(blinkTimer)
})

const t = (kx: number, ky: number) => `translate(${look.value.x * kx} ${look.value.y * ky})`
</script>

<template>
  <svg ref="root" class="avatar" viewBox="0 0 200 200" role="img" aria-label="Leonid's avatar">
    <defs>
      <radialGradient id="av-skin" cx="0.42" cy="0.38" r="0.7">
        <stop offset="0" stop-color="#ffe0c7" />
        <stop offset="0.55" stop-color="#f0b994" />
        <stop offset="1" stop-color="#cf8f6a" />
      </radialGradient>
      <linearGradient id="av-neck" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#b9785a" />
        <stop offset="1" stop-color="#dfa07d" />
      </linearGradient>
      <radialGradient id="av-ear" cx="0.5" cy="0.45" r="0.6">
        <stop offset="0" stop-color="#f3b896" />
        <stop offset="1" stop-color="#cd8a66" />
      </radialGradient>
      <linearGradient id="av-hair" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#4a362c" />
        <stop offset="0.5" stop-color="#2a1d17" />
        <stop offset="1" stop-color="#1c130f" />
      </linearGradient>
      <linearGradient id="av-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3a2a22" stop-opacity="0.9" />
        <stop offset="1" stop-color="#6b5245" stop-opacity="0.35" />
      </linearGradient>
      <radialGradient id="av-beard" cx="0.5" cy="0.3" r="0.75">
        <stop offset="0" stop-color="#3b2a21" />
        <stop offset="1" stop-color="#1a110d" />
      </radialGradient>
      <linearGradient id="av-jacket" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#6b7079" />
        <stop offset="1" stop-color="#3a3e46" />
      </linearGradient>
      <radialGradient id="av-iris" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stop-color="#8a5a36" />
        <stop offset="1" stop-color="#3b2416" />
      </radialGradient>
      <radialGradient id="av-gloss" cx="0.35" cy="0.25" r="0.6">
        <stop offset="0" stop-color="#fff" stop-opacity="0.45" />
        <stop offset="1" stop-color="#fff" stop-opacity="0" />
      </radialGradient>
      <filter id="av-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>

    <!-- Body -->
    <g :transform="t(1.5, 0.5)">
      <path d="M26 202C30 168 58 154 100 152C142 154 170 168 174 202Z" fill="url(#av-jacket)" />
      <path d="M80 154C88 166 112 166 120 154L124 202H76Z" fill="#f4f4f6" />
      <path d="M80 154 70 162 86 186 92 168Z" fill="#555a62" />
      <path d="M120 154 130 162 114 186 108 168Z" fill="#555a62" />
      <path d="M86 134H114L118 156C110 166 90 166 82 156Z" fill="url(#av-neck)" />
    </g>

    <!-- Head: turns with the pointer -->
    <g :transform="`${t(5, 4)} rotate(${look.x * 5} 100 150)`">
      <!-- Ears counter-move to fake rotation -->
      <g :transform="t(-4.5, 0)">
        <ellipse cx="52" cy="100" rx="9.5" ry="14" fill="url(#av-ear)" />
        <ellipse cx="148" cy="100" rx="9.5" ry="14" fill="url(#av-ear)" />
        <path d="M51 93c-3 4-3 11 0 15" stroke="#b97a5a" stroke-width="2" fill="none" stroke-linecap="round" />
        <path d="M149 93c3 4 3 11 0 15" stroke="#b97a5a" stroke-width="2" fill="none" stroke-linecap="round" />
      </g>

      <!-- Head shape -->
      <ellipse cx="100" cy="93" rx="47" ry="55" fill="url(#av-skin)" />

      <!-- Hair: fade on the sides, fuller on top -->
      <g :transform="t(3, 2)">
        <path d="M53 96C49 82 50 66 56 56C60 64 61 78 60 92Z" fill="url(#av-fade)" />
        <path d="M147 96C151 82 150 66 144 56C140 64 139 78 140 92Z" fill="url(#av-fade)" />
        <path
          d="M55 72C54 48 72 34 100 33C128 34 146 48 145 72C140 64 133 59 126 58C112 61 88 61 74 58C67 59 60 64 55 72Z"
          fill="url(#av-hair)"
        />
        <path d="M70 46C84 38 116 38 132 47" stroke="#6b5245" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5" />
      </g>

      <!-- Face features: move the most -->
      <g :transform="t(9, 6.5)">
        <!-- Trimmed beard: soft stubble halo, then jawline beard with clear cheeks -->
        <path
          d="M53 86C53 122 72 154 100 156C128 154 147 122 147 86L142 86C141 100 138 108 130 114C120 108 108 108 100 108C92 108 80 108 70 114C62 108 59 100 58 86Z"
          fill="#3b2a21"
          opacity="0.16"
        />
        <path
          d="M55 88C55 120 72 150 100 152C128 150 145 120 145 88L141 88C140 101 136 112 124 119C121 121 118 121 116 119C112 113 106 112 100 113C94 112 88 113 84 119C82 121 79 121 76 119C64 112 60 101 59 88Z"
          fill="url(#av-beard)"
        />
        <path d="M70 120C78 136 88 144 100 146C112 144 122 136 130 120" stroke="#4a3528" stroke-width="1.2" fill="none" opacity="0.45" />

        <!-- Mouth: gentle smile -->
        <path d="M88 124C94 131 106 131 112 124C106 127 94 127 88 124Z" fill="#7a3328" />
        <path d="M91 124.6C97 127 103 127 109 124.6C103 126 97 126 91 124.6Z" fill="#fff" opacity="0.85" />

        <!-- Cheeks -->
        <ellipse cx="72" cy="104" rx="9" ry="5" fill="#f08f78" opacity="0.18" />
        <ellipse cx="128" cy="104" rx="9" ry="5" fill="#f08f78" opacity="0.18" />

        <!-- Nose -->
        <path d="M100 90C97 99 93 104 95 107C97 110 103 110 105 107" stroke="#b9765a" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.7" />
        <ellipse cx="99" cy="103" rx="4" ry="2.6" fill="#fff" opacity="0.18" />

        <!-- Brows -->
        <path d="M68 77C76 70 86 70 93 74L92 79C85 76 77 76 70 81Z" fill="#24180f" />
        <path d="M132 77C124 70 114 70 107 74L108 79C115 76 123 76 130 81Z" fill="#24180f" />

        <!-- Eyes -->
        <g>
          <ellipse cx="81" cy="90" rx="9.5" ry="7" fill="#fff" />
          <ellipse cx="119" cy="90" rx="9.5" ry="7" fill="#fff" />
          <g :transform="t(3.5, 3)">
            <circle cx="81" cy="90.5" r="5" fill="url(#av-iris)" />
            <circle cx="119" cy="90.5" r="5" fill="url(#av-iris)" />
            <circle cx="81" cy="90.5" r="2.4" fill="#0d0907" />
            <circle cx="119" cy="90.5" r="2.4" fill="#0d0907" />
            <circle cx="79.4" cy="88.8" r="1.4" fill="#fff" />
            <circle cx="117.4" cy="88.8" r="1.4" fill="#fff" />
          </g>
          <!-- Upper lash lines -->
          <path d="M71.5 89C75 83.5 87 83.5 90.5 89" stroke="#2a1b12" stroke-width="2.2" fill="none" stroke-linecap="round" />
          <path d="M109.5 89C113 83.5 125 83.5 128.5 89" stroke="#2a1b12" stroke-width="2.2" fill="none" stroke-linecap="round" />
          <!-- Eyelids for blinking -->
          <g class="lids" :class="{ closed: blinking }">
            <ellipse class="lid" cx="81" cy="90" rx="10.5" ry="8" fill="#eab08c" />
            <ellipse class="lid" cx="119" cy="90" rx="10.5" ry="8" fill="#eab08c" />
          </g>
        </g>
      </g>

      <!-- Soft gloss on the forehead sells the 3D look -->
      <ellipse cx="86" cy="66" rx="26" ry="16" fill="url(#av-gloss)" :transform="t(5, 3)" />
    </g>
  </svg>
</template>

<style scoped>
.avatar {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
  filter: drop-shadow(0 6px 10px rgb(0 0 0 / 0.25));
}

.lid {
  transform-box: fill-box;
  transform-origin: 50% 0;
  transform: scaleY(0);
  transition: transform 70ms ease-in;
}

.lids.closed .lid {
  transform: scaleY(1);
}
</style>
