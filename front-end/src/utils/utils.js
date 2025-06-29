export function formatDate (iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    return '–'
  }
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatSize (bytes) {
  const n = Number(bytes)
  if (Number.isNaN(n)) {
    return '–'
  }
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

export function formatLength (sec) {
  const s = Number(sec)
  if (Number.isNaN(s)) {
    return '–'
  }
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const ss = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${ss}`
}

export function getExtension (name) {
  if (!name || typeof name !== 'string') {
    return ''
  }

  const parts = name.split('.')

  if (parts.length <= 1) {
    return ''
  }

  return parts.pop().toLowerCase()
}

export function removeExtension (name) {
  if (!name || typeof name !== 'string') {
    return ''
  }
  return name.replace(/\.[^/.]+$/, '')
}
