import {
  COLOR_DROPPER_SIZE,
} from './constants.ts';

export function getPixelData(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, pageX: number, pageY: number) {
  const bounding = canvas.getBoundingClientRect();
  const x = pageX - bounding.left - Math.floor(COLOR_DROPPER_SIZE / 2);
  const y = pageY - bounding.top - Math.floor(COLOR_DROPPER_SIZE / 2);
  const pixel = ctx.getImageData(x, y, COLOR_DROPPER_SIZE, COLOR_DROPPER_SIZE);
  return pixel.data;
}

export function getNormalizedHexColor(r: number, g: number, b: number) {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function getColorMatrixFromPixelData(data: Uint8ClampedArray) {
  let index = 0;
  const colorMatrix: string[][] = [];

  for (let i = 0; i < data.length; i += 4) {
    if (!colorMatrix[index]) {
      colorMatrix.push([]);
    }
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const normalizedHexColor = getNormalizedHexColor(r, g, b);
    colorMatrix[index].push(normalizedHexColor);
    if ((i + 4) % COLOR_DROPPER_SIZE === 0 && i !== 0) {
      index++;
    }
  }

  return colorMatrix;
}