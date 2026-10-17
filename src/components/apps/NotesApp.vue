<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import { folders, type Folder, type Note } from '../../data/notes'

/**
 * Notes, modelled on iOS Notes: Folders → notes list → note, with a push/pop slide,
 * search across all notes, pinned section, and tappable checklists (local only).
 */
type Screen = { kind: 'folders' } | { kind: 'list'; folder: Folder } | { kind: 'note'; folder: Folder; note: Note }

const stack = ref<Screen[]>([{ kind: 'folders' }])
const dir = ref<'push' | 'pop'>('push')
const query = ref('')
const root = ref<HTMLElement>()
const top = computed(() => stack.value[stack.value.length - 1])

// Checklist state lives here, so ticking a box doesn't mutate the source data
const done = reactive<Record<string, boolean>>({})
function isDone(note: Note, i: number) {
  const k = `${note.id}:${i}`
  const b = note.blocks[i]
  return k in done ? done[k] : b.t === 'check' && !!b.done
}
function toggle(note: Note, i: number) {
  done[`${note.id}:${i}`] = !isDone(note, i)
}

async function push(s: Screen) {
  dir.value = 'push'
  stack.value = [...stack.value, s]
  await nextTick()
  scrollTop()
}
async function pop() {
  dir.value = 'pop'
  stack.value = stack.value.slice(0, -1)
  await nextTick()
  scrollTop()
}
function scrollTop() {
  const content = root.value?.closest('.content')
  if (content) content.scrollTop = 0
}

const total = computed(() => folders.reduce((n, f) => n + f.notes.length, 0))

/* ---------- Formatting like Notes ---------- */
function listDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const y = new Date(now)
  y.setDate(now.getDate() - 1)
  if (d.toDateString() === y.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
function fullDate(iso: string) {
  const d = new Date(iso)
  return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
}
function preview(n: Note) {
  const b = n.blocks.find((x) => x.t !== 'h') ?? n.blocks[0]
  return b ? b.text : 'No additional text'
}
function sorted(notes: Note[]) {
  return [...notes].sort((a, b) => +new Date(b.date) - +new Date(a.date))
}

/* ---------- Search ---------- */
const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return folders.flatMap((f) =>
    f.notes
      .filter((n) => n.title.toLowerCase().includes(q) || n.blocks.some((b) => b.text.toLowerCase().includes(q)))
      .map((n) => ({ folder: f, note: n })),
  )
})
</script>

<template>
  <div ref="root" class="notes">
    <Transition :name="dir">
      <!-- Folders -->
      <section v-if="top.kind === 'folders'" key="folders" class="screen">
        <h1>Folders</h1>

        <label class="search">
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="2" /><path d="m13 13 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
          <input v-model="query" type="search" placeholder="Search" aria-label="Search notes" />
        </label>

        <template v-if="query.trim()">
          <p class="section-label">{{ results.length ? 'Top hits' : 'No results' }}</p>
          <ul v-if="results.length" class="card">
            <li v-for="r in results" :key="r.note.id">
              <button type="button" class="row note-row" @click="push({ kind: 'note', folder: r.folder, note: r.note })">
                <span class="nr-title">{{ r.note.title }}</span>
                <span class="nr-meta"><span class="nr-date">{{ r.folder.name }}</span> {{ preview(r.note) }}</span>
              </button>
            </li>
          </ul>
        </template>

        <template v-else>
          <p class="section-label big">iCloud</p>
          <ul class="card">
            <li v-for="f in folders" :key="f.id">
              <button type="button" class="row folder-row" @click="push({ kind: 'list', folder: f })">
                <svg class="folder-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.6c.6 0 1.1.2 1.5.6l1.3 1.3c.4.4.9.6 1.5.6h5.1A2.5 2.5 0 0 1 21 10v6.5A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5Z" fill="none" stroke="currentColor" stroke-width="1.7" /></svg>
                <span class="folder-name">{{ f.name }}</span>
                <span class="count">{{ f.notes.length }}</span>
                <svg class="chev" viewBox="0 0 8 14" width="8" height="14" aria-hidden="true"><path d="m1 1 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </button>
            </li>
          </ul>
          <p class="footer-count">{{ total }} Notes</p>
        </template>
      </section>

      <!-- Notes list -->
      <section v-else-if="top.kind === 'list'" :key="'list-' + top.folder.id" class="screen">
        <button type="button" class="back" @click="pop">
          <svg viewBox="0 0 12 20" width="11" height="18" aria-hidden="true"><path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
          Folders
        </button>
        <h1>{{ top.folder.name }}</h1>

        <template v-for="group in [{ label: 'Pinned', items: sorted(top.folder.notes.filter((n) => n.pinned)) }, { label: 'Notes', items: sorted(top.folder.notes.filter((n) => !n.pinned)) }]" :key="group.label">
          <template v-if="group.items.length">
            <p class="section-label">
              <svg v-if="group.label === 'Pinned'" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M10.5 1.5 14.5 5.5 11 8l-.5 3.5-5-5L9 6Z M7.5 8.5 2 14" fill="currentColor" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" /></svg>
              {{ group.label }}
            </p>
            <ul class="card">
              <li v-for="n in group.items" :key="n.id">
                <button type="button" class="row note-row" @click="push({ kind: 'note', folder: top.folder, note: n })">
                  <span class="nr-title">{{ n.title }}</span>
                  <span class="nr-meta"><span class="nr-date">{{ listDate(n.date) }}</span> {{ preview(n) }}</span>
                </button>
              </li>
            </ul>
          </template>
        </template>
        <p class="footer-count">{{ top.folder.notes.length }} {{ top.folder.notes.length === 1 ? 'Note' : 'Notes' }}</p>
      </section>

      <!-- Note -->
      <article v-else :key="'note-' + top.note.id" class="screen note">
        <button type="button" class="back" @click="pop">
          <svg viewBox="0 0 12 20" width="11" height="18" aria-hidden="true"><path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
          {{ stack.length > 2 && stack[stack.length - 2].kind === 'list' ? top.folder.name : 'Folders' }}
        </button>
        <p class="note-date">{{ fullDate(top.note.date) }}</p>
        <h2 class="note-title">{{ top.note.title }}</h2>

        <template v-for="(b, i) in top.note.blocks" :key="i">
          <h3 v-if="b.t === 'h'" class="nb-h">{{ b.text }}</h3>
          <p v-else-if="b.t === 'p'" class="nb-p">{{ b.text }}</p>
          <p v-else-if="b.t === 'li'" class="nb-li">{{ b.text }}</p>
          <button
            v-else
            type="button"
            class="nb-check"
            :class="{ done: isDone(top.note, i) }"
            role="checkbox"
            :aria-checked="isDone(top.note, i)"
            @click="toggle(top.note, i)"
          >
            <span class="box" aria-hidden="true">
              <svg v-if="isDone(top.note, i)" viewBox="0 0 16 16" width="12" height="12"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
            <span class="label">{{ b.text }}</span>
          </button>
        </template>
      </article>
    </Transition>
  </div>
</template>

<style scoped>
.notes {
  position: relative;
  min-height: 100%;
  overflow-x: hidden;
  padding-bottom: 60px;
}

.screen {
  padding: 0 16px;
  max-width: 720px;
  margin: 0 auto;
}

h1 {
  margin: 4px 4px 10px;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 0 0 4px -4px;
  padding: 4px;
  border: 0;
  font: inherit;
  font-size: 17px;
  color: var(--notes-tint);
  background: none;
  cursor: pointer;
}

.search {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 18px;
  padding: 8px 10px;
  border-radius: 10px;
  color: var(--ink-secondary);
  background: rgb(120 120 128 / 0.14);
}

.search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  font: inherit;
  font-size: 17px;
  color: var(--ink);
  background: none;
}

.search:focus-within {
  outline: 2px solid var(--notes-tint);
}

.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 18px 4px 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-secondary);
}

.section-label.big {
  font-size: 22px;
  font-weight: 700;
  color: var(--ink);
}

.card {
  list-style: none;
  margin: 0;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
  background: var(--notes-card);
}

.card li + li .row {
  border-top: 0.5px solid var(--separator);
}

.card li + li .folder-row {
  border-top: 0;
  box-shadow: inset 50px 0.5px 0 var(--notes-card), inset 0 0.5px 0 var(--separator);
}

.row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 0;
  font: inherit;
  text-align: left;
  color: var(--ink);
  background: none;
  cursor: pointer;
  transition: background 120ms ease;
}

.row:active {
  background: rgb(120 120 128 / 0.16);
}

.row:focus-visible,
.back:focus-visible,
.nb-check:focus-visible {
  outline: 2px solid var(--notes-tint);
  outline-offset: -2px;
}

.folder-icon {
  flex: none;
  color: var(--notes-tint);
}

.folder-name {
  flex: 1;
  font-size: 17px;
}

.count {
  color: var(--ink-secondary);
  font-size: 17px;
}

.chev {
  color: rgb(120 120 128 / 0.6);
}

.note-row {
  flex-direction: column;
  align-items: stretch;
  gap: 2px;
}

.nr-title {
  font-size: 17px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nr-meta {
  font-size: 15px;
  color: var(--ink-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nr-date {
  color: var(--ink);
  opacity: 0.75;
  margin-right: 6px;
}

.footer-count {
  margin: 22px 0 0;
  text-align: center;
  font-size: 13px;
  color: var(--ink-secondary);
}

/* ---------- Note body ---------- */
.note {
  padding: 0 22px;
}

.note .back {
  margin-left: -10px;
}

.note-date {
  margin: 6px 0 12px;
  text-align: center;
  font-size: 13px;
  color: var(--ink-secondary);
}

.note-title {
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.nb-h {
  margin: 18px 0 6px;
  font-size: 20px;
  font-weight: 700;
}

.nb-p {
  margin: 8px 0;
  font-size: 17px;
  line-height: 1.5;
}

.nb-li {
  position: relative;
  margin: 6px 0;
  padding-left: 22px;
  font-size: 17px;
  line-height: 1.5;
}

.nb-li::before {
  content: '•';
  position: absolute;
  left: 4px;
  color: var(--ink);
}

.nb-check {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  margin: 2px 0;
  padding: 7px 0;
  border: 0;
  font: inherit;
  font-size: 17px;
  line-height: 1.45;
  text-align: left;
  color: var(--ink);
  background: none;
  cursor: pointer;
}

.box {
  flex: none;
  width: 22px;
  height: 22px;
  margin-top: 1px;
  border-radius: 50%;
  border: 1.6px solid rgb(120 120 128 / 0.55);
  display: grid;
  place-items: center;
  transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
}

.nb-check.done .box {
  border-color: var(--notes-tint);
  background: var(--notes-tint);
}

.nb-check:active .box {
  transform: scale(0.88);
}

.nb-check.done .label {
  color: var(--ink-secondary);
}

/* ---------- Push / pop like UINavigationController ---------- */
.push-enter-active,
.push-leave-active,
.pop-enter-active,
.pop-leave-active {
  transition:
    transform 380ms cubic-bezier(0.32, 0.72, 0, 1),
    opacity 380ms ease;
}

.push-leave-active,
.pop-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.push-enter-from {
  transform: translateX(100%);
}

.push-leave-to {
  transform: translateX(-30%);
  opacity: 0;
}

.pop-enter-from {
  transform: translateX(-30%);
  opacity: 0;
}

.pop-leave-to {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .push-enter-active,
  .push-leave-active,
  .pop-enter-active,
  .pop-leave-active {
    transition: opacity 150ms ease;
  }

  .push-enter-from,
  .push-leave-to,
  .pop-enter-from,
  .pop-leave-to {
    transform: none;
  }
}
</style>
