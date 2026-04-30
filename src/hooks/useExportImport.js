import { GRID_SIZE, TIPOS } from '../constants/tiposInstalacion'

function tipoForma(tipo) {
  const t = TIPOS.find(t => t.tipo === tipo)
  return t ? t.forma : 'circulo'
}

export function useExportImport(state, dispatch) {

  async function exportarConPicker() {
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
  }

  function exportarConNombre(nombre) {
    const json = buildJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nombre
    a.click()
    URL.revokeObjectURL(url)
  }

  const usaPicker = !!window.showSaveFilePicker

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
          cloracion: n.data.cloracion ?? false,
          notas: n.data.notas || '',
          resp1: n.data.resp1 || '',
          tfno1: n.data.tfno1 || '',
          resp2: n.data.resp2 || '',
          tfno2: n.data.tfno2 || '',
          resp3: n.data.resp3 || '',
          tfno3: n.data.tfno3 || '',
          posicion: {
            x: Math.round(n.position.x / GRID_SIZE),
            y: Math.round(n.position.y / GRID_SIZE),
          },
        })),
      uniones: state.nodes
        .filter(n => n.type === 'union')
        .map(n => ({
          id: n.id,
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
            cloracion: inst.cloracion ?? false,
            notas: inst.notas,
            resp1: inst.resp1 || '',
            tfno1: inst.tfno1 || '',
            resp2: inst.resp2 || '',
            tfno2: inst.tfno2 || '',
            resp3: inst.resp3 || '',
            tfno3: inst.tfno3 || '',
            ...nodeHandlers,
          },
        }))
        const unionNodes = (schema.uniones || []).map(u => ({
          id: u.id,
          type: 'union',
          position: { x: u.posicion.x * GRID_SIZE, y: u.posicion.y * GRID_SIZE },
          data: { id: u.id, tipo: 0 },
        }))
        const edges = schema.conexiones.map(con => ({
          id: con.id,
          source: con.origen,
          target: con.destino,
          type: 'ramal',
          data: { ramal: con.ramal, ...edgeHandlers },
        }))
        dispatch({ type: 'LOAD_SCHEMA', payload: { nodes: [...nodes, ...unionNodes], edges } })
      } catch {
        alert('Error al cargar el fichero. Verifica que es un JSON válido.')
      }
    }
    reader.readAsText(file)
  }

  return { exportarConPicker, exportarConNombre, usaPicker, importar }
}
