// state.js
// Modelo de datos del constructor: un árbol de nodos.
// Nodo hoja (sin dividir): { id, direction: null, children: [], sizes: [], blockType: null }
// Nodo dividido:            { id, direction: 'row'|'column', children: [nodo, nodo], sizes: [50,50], blockType: null }

let idCounter = 0;
function generateId() {
  idCounter += 1;
  return `node-${idCounter}`;
}

function createLeaf() {
  return {
    id: generateId(),
    direction: null,
    children: [],
    sizes: [],
    blockType: null
  };
}

export const state = {
  root: createLeaf()
};

export function findNode(node, id) {
  if (node.id === id) return node;
  for (const child of node.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

// Divide una hoja en dos. direction: 'row' (lado a lado) | 'column' (uno sobre otro)
export function splitNode(nodeId, direction) {
  const node = findNode(state.root, nodeId);
  if (!node || node.children.length > 0) return;

  node.direction = direction;
  node.children = [createLeaf(), createLeaf()];
  node.sizes = [50, 50];
  node.blockType = null;
}

export function setBlockType(nodeId, type) {
  const node = findNode(state.root, nodeId);
  if (!node) return;
  node.blockType = type || null;
}

export function getStateJSON() {
  return JSON.stringify(state.root, null, 2);
}
