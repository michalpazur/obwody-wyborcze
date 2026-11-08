import { Map } from "maplibre-gl";

const stripeWidth = 6;

export const TIE_PATTERN_PREFIX = "tie";
export const TIE_PATTERN_JOINER = "-";

export const createHatchPattern = (colors: string[]) => {
  const pixelRatio = window.devicePixelRatio || 1;
  const size = Math.round(stripeWidth * colors.length * pixelRatio);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const width = size / colors.length;
  ctx.lineWidth = width / Math.SQRT2;
  colors.forEach((color, idx) => {
    const center = (idx + 1.5) * width;
    ctx.strokeStyle = color;
    ctx.beginPath();
    [-size, 0, size].forEach((offset) => {
      const c = center + offset;
      ctx.moveTo(-size, c + size);
      ctx.lineTo(c + size, -size);
    });
    ctx.stroke();
  });

  return { image: ctx.getImageData(0, 0, size, size), pixelRatio };
};

const handlers = new WeakSet<Map>();

export const registerTiePatterns = (map: Map) => {
  if (handlers.has(map)) {
    return;
  }
  handlers.add(map);

  map.on("styleimagemissing", ({ id }) => {
    if (!id.startsWith(TIE_PATTERN_PREFIX) || map.hasImage(id)) {
      return;
    }

    const prefix = `${TIE_PATTERN_PREFIX}${TIE_PATTERN_JOINER}`;
    const colors = id.slice(prefix.length).split(TIE_PATTERN_JOINER);
    const { image, pixelRatio } = createHatchPattern(colors);
    map.addImage(id, image, { pixelRatio });
  });
};
