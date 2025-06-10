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
