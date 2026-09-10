const API_URL = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      data?.errores?.join('. ') || data?.error || 'No fue posible completar la operación.',
    )
  }

  return data
}

export function listarNotas() {
  return request('/notas')
}

export function crearNota(nota) {
  return request('/notas', {
    method: 'POST',
    body: JSON.stringify(nota),
  })
}

export function actualizarNota(idnota, nota) {
  return request(`/notas/${idnota}`, {
    method: 'PUT',
    body: JSON.stringify(nota),
  })
}

export function eliminarNota(idnota) {
  return request(`/notas/${idnota}`, { method: 'DELETE' })
}
