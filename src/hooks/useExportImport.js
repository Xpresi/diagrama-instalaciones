import { GRID_SIZE, TIPOS } from '../constants/tiposInstalacion'

function tipoForma(tipo) {
  const t = TIPOS.find(t => t.tipo === tipo)
  return t ? t.forma : 'circulo'
}

export function useExportImport(state, dispatch) {

  async function exportar() {
    // showSaveFilePicker debe ser la primera llamada para mantener el contexto de gesto
    if (window.showSaveFilePicker) {
      let handle
      try {
        handle = await window.showSaveFilePicker({
          suggestedName: 'diagrama.json',
          types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
        })
      } catch (e) {
        if (e.name !== 'AbortError') alert('Error al abrir el diálogo de guardado.')
        return
      }
      const json = buildJson()
      try {
        const writable = await handle.createWritable()
        await writable.write(json)
        await writable.close()
      } catch {
        alert('Error al escribir el fichero.')
      }
    } else {
      const json = buildJson()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'diagrama.json'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  function buildJson() {
    const schema = {
      instalaciones: state.nodes
        .filter(n => n.type !== 'union')
        .map(n => ({
          id: n.id,
          tipo: n.data.tipo,
          nombre: n.data.nombre || '',
          valorMin: n.data.valorMin ?? null,
          valorMax: n.data.valorMax ?? null,
          cl: n.data.cl ?? null,
          notas: n.data.notas || '',
          posicion: {
            x: Math.round(n.position.x / GRID_SIZE),
            y: Math.round(n.position.y / GRID_SIZE),
          },
        })),
      conexiones: state.edges.map(e => ({
        id: e.id,
        origen: e.source,
        destino: e.target,
        ramal: e.data?.ramal ?? null,
      })),
    }
    return JSON.stringify(schema, null, 2)
  }

  function importar(file, nodeHandlers, edgeHandlers) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const schema = JSON.parse(e.target.result)
        const nodes = schema.instalaciones.map(inst => ({
          id: inst.id,
          type: tipoForma(inst.tipo),
          position: { x: inst.posicion.x * GRID_SIZE, y: inst.posicion.y * GRID_SIZE },
          data: {
            id: inst.id,
            tipo: inst.tipo,
            nombre: inst.nombre,
            valorMin: inst.valorMin,
            valorMax: inst.valorMax,
            cl: inst.cl,
            notas: inst.notas,
            ...nodeHandlers,
          },
        }))
        const edges = schema.conexiones.map(con => ({
          id: con.id,
          source: con.origen,
          target: con.destino,
          type: 'ramal',
          data: { ramal: con.ramal, ...edgeHandlers },
        }))
        dispatch({ type: 'LOAD_SCHEMA', payload: { nodes, edges } })
      } catch {
        alert('Error al cargar el fichero. Verifica que es un JSON válido.')
      }
    }
    reader.readAsText(file)
  }

  return { exportar, importar }
}
