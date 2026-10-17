/**
 * Minimal pointer-drag tracker shared by every gesture (shades, home indicator, edge swipe).
 * Works for touch, pen and mouse. Reports the offset from the start point and, on release,
 * the velocity over the last ~100 ms so a quick flick can complete a gesture early — like iOS.
 */
export interface DragState {
  dx: number
  dy: number
  /** px per ms, positive = right / down */
  vx: number
  vy: number
  /** true when the pointer barely moved — treat as a tap */
  tap: boolean
  startX: number
  startY: number
}

interface Handlers {
  /**
   * Capture the pointer only after it moves past the tap slop. Use on large surfaces with buttons
   * inside (so taps still reach them). Small grab zones should capture at once, or a fast mouse
   * leaves the zone before the drag is recognised.
   */
  lazyCapture?: boolean
  start?: (s: DragState, e: PointerEvent) => boolean | void
  move?: (s: DragState, e: PointerEvent) => void
  end?: (s: DragState, e: PointerEvent) => void
}

const TAP_SLOP = 6

export function useDrag(h: Handlers) {
  let active = false
  let captured = false
  let el: HTMLElement | null = null
  let startX = 0
  let startY = 0
  let samples: { t: number; x: number; y: number }[] = []

  function state(e: PointerEvent): DragState {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    const now = performance.now()
    samples.push({ t: now, x: e.clientX, y: e.clientY })
    samples = samples.filter((s) => now - s.t < 100)
    const first = samples[0]
    const dt = Math.max(1, now - first.t)
    return {
      dx,
      dy,
      vx: (e.clientX - first.x) / dt,
      vy: (e.clientY - first.y) / dt,
      tap: Math.hypot(dx, dy) < TAP_SLOP,
      startX,
      startY,
    }
  }

  function onPointerdown(e: PointerEvent) {
    if (e.button !== 0) return
    startX = e.clientX
    startY = e.clientY
    samples = [{ t: performance.now(), x: startX, y: startY }]
    const s = state(e)
    if (h.start?.(s, e) === false) return
    active = true
    captured = false
    el = e.currentTarget as HTMLElement
    if (!h.lazyCapture) {
      captured = true
      el.setPointerCapture(e.pointerId)
    }
  }

  function onPointermove(e: PointerEvent) {
    if (!active) return
    const s = state(e)
    // Capture only once it is really a drag, so taps still reach buttons and links inside
    if (!captured) {
      if (s.tap) return
      // Lazy capture: grab the pointer now that this is clearly a drag
      captured = true
      el?.setPointerCapture(e.pointerId)
    }
    h.move?.(s, e)
  }

  function onPointerup(e: PointerEvent) {
    if (!active) return
    active = false
    h.end?.(state(e), e)
  }

  return { onPointerdown, onPointermove, onPointerup, onPointercancel: onPointerup }
}

/** Rubber-band resistance past a limit, like UIScrollView overscroll. */
export function rubberband(offset: number, limit: number) {
  if (offset <= limit) return offset
  const over = offset - limit
  return limit + over / (1 + over / 120)
}
