// engine.js
// Renderiza el árbol de state.js en el DOM y conecta los controles de cada celda.

import { state, splitNode, setBlockType, getStateJSON } from './state.js';

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

export function render() {
  canvas.innerHTML = '';
  canvas.appendChild(renderNode(state.root));
  if (jsonPanel.classList.contains('open')) {
    jsonOutput.textContent = getStateJSON();
  }
}

function renderNode(node) {
  return node.children.length === 0 ? renderLeaf(node) : renderSplit(node);
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

  const select = document.createElement('select');
  select.className = 'type-select';
  BLOCK_TYPES.forEach((opt) => {
    const optionEl = document.createElement('option');
    optionEl.value = opt.value;
    optionEl.textContent = opt.label;
    optionEl.selected = (node.blockType || '') === opt.value;
    select.appendChild(optionEl);
  });
  select.addEventListener('change', (e) => {
    setBlockType(node.id, e.target.value);
    render();
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

  controls.append(select, splitColsBtn, splitRowsBtn);

  const label = document.createElement('span');
  label.className = 'cell-label';
  label.textContent = node.blockType
    ? BLOCK_TYPES.find((t) => t.value === node.blockType).label
    : 'Vacío';

  cell.append(controls, label);
  return cell;
}

toggleJsonBtn.addEventListener('click', () => {
  jsonPanel.classList.toggle('open');
  if (jsonPanel.classList.contains('open')) {
    jsonOutput.textContent = getStateJSON();
  }
});

render();
