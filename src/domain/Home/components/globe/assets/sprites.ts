import * as THREE from "three";

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export function createGlowSprite() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new THREE.Sprite();
  }

  const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
  gradient.addColorStop(0, "rgba(110,231,183,0.9)");
  gradient.addColorStop(0.5, "rgba(34,211,238,0.32)");
  gradient.addColorStop(1, "rgba(34,211,238,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });

  return new THREE.Sprite(material);
}

export function createBadgeSprite(label: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 144;
  canvas.height = 112;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new THREE.Sprite();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.shadowColor = "rgba(15,23,42,0.48)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;
  roundedRect(ctx, 22, 18, 80, 56, 16);
  ctx.fillStyle = "rgba(224,231,255,0.94)";
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(165,180,252,0.92)";
  ctx.stroke();

  ctx.fillStyle = "rgba(55,48,163,0.96)";
  ctx.font = "700 30px Space Grotesk, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 62, 46);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });

  return new THREE.Sprite(material);
}
