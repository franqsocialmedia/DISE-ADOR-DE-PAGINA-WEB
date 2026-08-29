// engine.js
// Renderiza el árbol de state.js en el DOM y conecta los controles de cada celda.

import { state, splitNode, setBlockType, getStateJSON, createGrid, deleteNode } from './state.js';

const BLOCK_TYPES = [
  { value: '', label: 'Vacío' },
  { value: 'image', label: 'Imagen' },
  { value: 'text', label: 'Texto' },
  { value: 'video', label: 'Video' },
  { value: 'slider', label: 'Slider' }
];

const canvas = document.getElementById('canvas');
const jsonOutput = document.getElementById('json-output');
const jsonPanel = document.getElementById('json-panel');
const toggleJsonBtn = document.getElementById('toggle-json');
const createGridBtn = document.getElementById('create-grid');

export function render() {
  canvas.innerHTML = '';
  if (!state.root) {
    canvas.appendChild(renderEmptyState());
  } else {
    canvas.appendChild(renderNode(state.root));
  }
  if (jsonPanel.classList.contains('open')) {
    jsonOutput.textContent = getStateJSON();
  }
}

function renderEmptyState() {
  const empty = document.createElement('div');
  empty.className = 'canvas-empty';
  empty.textContent = 'Creá tu grid para empezar (botón "+ Grid")';
  return empty;
}

function renderNode(node) {
  if (node.children.length === 0) return renderLeaf(node);
  return node.direction === 'grid' ? renderGrid(node) : renderSplit(node);
}

function renderGrid(node) {
  const wrapper = document.createElement('div');
  wrapper.className = 'split split-grid';
  wrapper.style.gridTemplateColumns = `repeat(${node.cols}, 1fr)`;
  wrapper.style.gridTemplateRows = `repeat(${node.rows}, 1fr)`;
  node.children.forEach((child) => {
    wrapper.appendChild(renderNode(child));
  });
  return wrapper;
}

function renderSplit(node) {
  const wrapper = document.createElement('div');
  wrapper.className = `split split-${node.direction}`;
  node.children.forEach((child, i) => {
    const childEl = renderNode(child);
    childEl.style.flexBasis = `${node.sizes[i]}%`;
    wrapper.appendChild(childEl);
  });
  return wrapper;
}

function renderLeaf(node) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.dataset.id = node.id;

  const controls = document.createElement('div');
  controls.className = 'cell-controls';

  const insertBtn = document.createElement('button');
  insertBtn.type = 'button';
  insertBtn.className = 'insert-btn';
  insertBtn.textContent = 'Insertar';

  const insertMenu = document.createElement('div');
  insertMenu.className = 'insert-menu';

  const textBtn = document.createElement('button');
  textBtn.type = 'button';
  textBtn.className = 'insert-option';
  textBtn.textContent = 'Texto';

  const imageBtn = document.createElement('button');
  imageBtn.type = 'button';
  imageBtn.className = 'insert-option';
  imageBtn.textContent = 'Imagen';

    const moveBtn = document.createElement('button');
  moveBtn.type = 'button';
  moveBtn.className = 'insert-option';
  moveBtn.textContent = 'Mover';
  insertMenu.append(textBtn, imageBtn, moveBtn);

  insertBtn.addEventListener('click', () => {
    insertMenu.classList.toggle('open');
  });

  const splitColsBtn = document.createElement('button');
  splitColsBtn.type = 'button';
  splitColsBtn.className = 'split-btn';
  splitColsBtn.title = 'Dividir en columnas';
  splitColsBtn.textContent = '↔';
  splitColsBtn.addEventListener('click', () => {
    splitNode(node.id, 'row');
    render();
  });

  const splitRowsBtn = document.createElement('button');
  splitRowsBtn.type = 'button';
  splitRowsBtn.className = 'split-btn';
  splitRowsBtn.title = 'Dividir en filas';
  splitRowsBtn.textContent = '↕';
  splitRowsBtn.addEventListener('click', () => {
    splitNode(node.id, 'column');
    render();
  });

  controls.append(insertBtn, splitColsBtn, splitRowsBtn);
  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'delete-btn';
  deleteBtn.title = 'Eliminar';
  deleteBtn.textContent = '×';
  deleteBtn.addEventListener('click', () => {
    deleteNode(node.id);
    render();
  });
  cell.append(controls, insertMenu, deleteBtn);
  return cell;
}

toggleJsonBtn.addEventListener('click', () => {
  jsonPanel.classList.toggle('open');
  if (jsonPanel.classList.contains('open')) {
    jsonOutput.textContent = getStateJSON();
  }
});
createGridBtn.addEventListener('click', openGridModal);

function openGridModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal';

  const title = document.createElement('h3');
  title.textContent = 'Crear grid';

  const colsLabel = document.createElement('label');
  colsLabel.textContent = 'Columnas';
  const colsInput = document.createElement('input');
  colsInput.type = 'number';
  colsInput.min = '1';
  colsInput.value = '2';
  colsLabel.appendChild(colsInput);

  const rowsLabel = document.createElement('label');
  rowsLabel.textContent = 'Filas';
  const rowsInput = document.createElement('input');
  rowsInput.type = 'number';
  rowsInput.min = '1';
  rowsInput.value = '1';
  rowsLabel.appendChild(rowsInput);

  const actions = document.createElement('div');
  actions.className = 'modal-actions';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'ghost-btn';
  cancelBtn.textContent = 'Cancelar';
  cancelBtn.addEventListener('click', () => overlay.remove());

  const confirmBtn = document.createElement('button');
  confirmBtn.type = 'button';
  confirmBtn.className = 'primary-btn';
  confirmBtn.textContent = 'Crear';
  confirmBtn.addEventListener('click', () => {
    const cols = Math.max(1, parseInt(colsInput.value, 10) || 1);
    const rows = Math.max(1, parseInt(rowsInput.value, 10) || 1);
    createGrid(cols, rows);
    render();
    overlay.remove();
  });

  actions.append(cancelBtn, confirmBtn);
  modal.append(title, colsLabel, rowsLabel, actions);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
render();
