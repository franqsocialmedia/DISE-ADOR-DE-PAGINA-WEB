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
  root: null
};
export function createGrid(cols, rows) {
  const total = cols * rows;
  const children = [];
  for (let i = 0; i < total; i++) children.push(createLeaf());

  state.root = {
    id: generateId(),
    direction: 'grid',
    cols,
    rows,
    children,
    sizes: [],
    blockType: null
  };
}
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
export function deleteNode(nodeId) {
  if (state.root && state.root.id === nodeId) {
    state.root = null;
    return;
  }
  const result = findParentOf(state.root, nodeId);
  if (!result) return;

  const { parent, index } = result;
  parent.children.splice(index, 1);
  if (parent.sizes.length) parent.sizes.splice(index, 1);

  // Si un split (row/column) queda con un solo hijo, se colapsa en ese hijo
  if (parent.direction !== 'grid' && parent.children.length === 1) {
    const remaining = parent.children[0];
    parent.direction = remaining.direction;
    parent.children = remaining.children;
    parent.sizes = remaining.sizes;
    parent.blockType = remaining.blockType;
  }
}

function findParentOf(node, id) {
  for (const child of node.children) {
    if (child.id === id) return { parent: node, index: node.children.indexOf(child) };
    const found = findParentOf(child, id);
    if (found) return found;
  }
  return null;
}
export function getStateJSON() {
  return JSON.stringify(state.root, null, 2);
}
