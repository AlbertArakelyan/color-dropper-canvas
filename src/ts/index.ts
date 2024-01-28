import {
  getPixelData,
  getColorMatrixFromPixelData,
} from './helpers.ts';

import {
  COLOR_DROPPER_SIZE,
  IMAGE_PATH,
} from './constants.ts';

// DOM elements
const colorDropperBtn = document.querySelector('.color-dropper-btn') as HTMLButtonElement;
const pickedColor = document.querySelector('.picked-color') as HTMLSpanElement;
const zoomedColors = document.querySelector('.zoomed-colors') as HTMLDivElement;
const tipsBtn = document.querySelector('.tips-btn') as HTMLButtonElement;

// Global variables
let isColorDropperActive = false;
let hoveredColor = '#000000';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// Load the image
const img = new Image();
img.crossOrigin = 'anonymous';
img.src = IMAGE_PATH;
img.addEventListener('load', () => {
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
});

// Event listeners
colorDropperBtn.addEventListener('click', toggleColorDropper);
window.addEventListener('keypress', toggleColorDropperOnKeypress);

canvas.addEventListener('mousemove', pickColor);
canvas.addEventListener('mouseleave', hideZoomedColors);
canvas.addEventListener('click', selectColor);

tipsBtn.addEventListener('click', showTips);

// Listeners functions
function pickColor(e: MouseEvent) {
  if (!isColorDropperActive) {
    return;
  }

  const pixelData = getPixelData(canvas, ctx, e.clientX, e.clientY);

  setZoomedColorsCoords(e.pageX, e.pageY);
  collectColorsFromPixelDataAndDraw(pixelData);
}

function toggleColorDropper() {
  isColorDropperActive = !isColorDropperActive;
  if (isColorDropperActive) {
    canvas.style.cursor = 'none';
    zoomedColors.style.display = 'none';
    colorDropperBtn.classList.add('active');
  } else {
    canvas.style.cursor = 'auto';
    zoomedColors.style.display = 'none';
    colorDropperBtn.classList.remove('active');
  }
}

function toggleColorDropperOnKeypress(e: KeyboardEvent) {
  if (e.key === 'c') {
    toggleColorDropper();
  }
}

function hideZoomedColors() {
  zoomedColors.style.display = 'none';
}

function selectColor() {
  if (!isColorDropperActive) {
    return;
  }

  pickedColor.textContent = hoveredColor;
  resetCanvasState();
}

function showTips() {
  alert('Press "C" button to toggle color dropper mode');
}

// Other functions
function setZoomedColorsCoords(pageX: number, pageY: number) {
  zoomedColors.style.left = `${pageX}px`;
  zoomedColors.style.top = `${pageY}px`;
  zoomedColors.style.transform = `translate(-50%, -50%)`;
  zoomedColors.style.display = 'block';
  zoomedColors.dataset.color = hoveredColor;
}

function collectColorsFromPixelDataAndDraw(data: Uint8ClampedArray) {
  const colorMatrix = getColorMatrixFromPixelData(data);

  const centerColor = getCenterColorFromMatrix(colorMatrix);

  zoomedColors.style.borderColor = centerColor;

  hoveredColor = centerColor;

  renderTableOfColors(colorMatrix);
}

function getCenterColorFromMatrix(colorMatrix: string[][]) {
  const centerRowIndex = Math.floor(COLOR_DROPPER_SIZE / 2);
  const centerColIndex = Math.floor(COLOR_DROPPER_SIZE / 2);
  return colorMatrix[centerRowIndex][centerColIndex];
}

function renderTableOfColors(colorsMatrix: string[][]) {
  zoomedColors.innerHTML = `
    <table class="zoomed-colors-table" style="">
      ${colorsMatrix.map((row, rowIndex) => `
        <tr>
          ${row.map((color, colIndex) => `
            <td class="zoomed-colors-table-cell" data-x="${rowIndex}" data-y="${colIndex}" style="background-color: ${color}">
              ${rowIndex === Math.floor(COLOR_DROPPER_SIZE / 2) && colIndex === Math.floor(COLOR_DROPPER_SIZE / 2) ? `<div></div>` : ''}
            </td>
          `).join('')}
        </tr>
      `).join('')}
    </table>
  `;
}

function resetCanvasState() {
  isColorDropperActive = false;
  canvas.style.cursor = 'auto';
  colorDropperBtn.classList.remove('active');
  hoveredColor = '';
  hideZoomedColors();
}
