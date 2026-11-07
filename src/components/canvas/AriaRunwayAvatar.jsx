import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Helper: Create the Classic Smooth Rounded Cylindrical Roblox Head Geometry
function createRobloxHeadGeometry(radius = 0.46, height = 0.94) {
  const profilePoints = [];
  const halfH = height / 2;
  const bottomR = 0.18;
  const topR = 0.24;

  const bottomSteps = 14;
  for (let i = 0; i <= bottomSteps; i++) {
    const t = i / bottomSteps;
    const angle = -Math.PI / 2 + t * (Math.PI / 2);
    const r = radius - bottomR + Math.cos(angle) * bottomR;
    const y = -halfH + bottomR + Math.sin(angle) * bottomR;
    profilePoints.push(new THREE.Vector2(Math.max(0.001, r), y));
  }

  const midSteps = 12;
  const yStart = -halfH + bottomR;
  const yEnd = halfH - topR;
  for (let i = 1; i < midSteps; i++) {
    const t = i / midSteps;
    const y = yStart + t * (yEnd - yStart);
    const bulge = Math.sin(t * Math.PI) * 0.008;
    profilePoints.push(new THREE.Vector2(radius + bulge, y));
  }

  const topSteps = 16;
  for (let i = 0; i <= topSteps; i++) {
    const t = i / topSteps;
    const angle = t * (Math.PI / 2);
    const r = radius - topR + Math.cos(angle) * topR;
    const y = halfH - topR + Math.sin(angle) * topR;
    profilePoints.push(new THREE.Vector2(Math.max(0.001, r), y));
  }

  const geo = new THREE.LatheGeometry(profilePoints, 64);

  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const angle = Math.atan2(x, z);
    const u = 0.5 + angle / (Math.PI * 2);
    const v = (y + halfH) / height;
    uv.setXY(i, u, Math.max(0, Math.min(1, v)));
  }
  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

// Helper: Aspect-Ratio-Corrected Face Texture for the New Explorer/Dino Avatar
// Circumference (2 * PI * 0.46 = 2.89) vs Height (0.94) => ~3.07 : 1 aspect ratio!
function createExplorerHeadTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 668;
  const ctx = canvas.getContext("2d");

  // Warm peach-cream skin base (#dfc2a8)
  ctx.fillStyle = "#dfc2a8";
  ctx.fillRect(0, 0, 2048, 668);

  // Subtle warm shading on front face (center x = 1024)
  const chinShadow = ctx.createLinearGradient(1024, 200, 1024, 640);
  chinShadow.addColorStop(0, "rgba(255, 238, 220, 0.15)");
  chinShadow.addColorStop(0.65, "rgba(215, 178, 148, 0)");
  chinShadow.addColorStop(1, "rgba(175, 136, 108, 0.28)");
  ctx.fillStyle = chinShadow;
  ctx.fillRect(650, 0, 748, 668);

  // 1. Soft Rosy-Peach Blush under the outer corners of the eyes
  const drawBlush = (cx, cy) => {
    const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 62);
    grad.addColorStop(0, "rgba(214, 130, 118, 0.58)");
    grad.addColorStop(0.55, "rgba(214, 130, 118, 0.25)");
    grad.addColorStop(1, "rgba(214, 130, 118, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 62, 34, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  drawBlush(1024 - 118, 412);
  drawBlush(1024 + 118, 412);

  // 2. Thin Arched Eyebrows & Upper Eyelid Lines
  ctx.strokeStyle = "#4d3627";
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  // Left brow
  ctx.beginPath();
  ctx.moveTo(1024 - 160, 256);
  ctx.quadraticCurveTo(1024 - 110, 240, 1024 - 56, 254);
  ctx.stroke();
  // Right brow
  ctx.beginPath();
  ctx.moveTo(1024 + 56, 254);
  ctx.quadraticCurveTo(1024 + 110, 240, 1024 + 160, 256);
  ctx.stroke();

  // Subtle eyelid crease line right above eyes
  ctx.strokeStyle = "rgba(75, 48, 34, 0.55)";
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.moveTo(1024 - 158, 294);
  ctx.quadraticCurveTo(1024 - 110, 282, 1024 - 62, 296);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(1024 + 62, 296);
  ctx.quadraticCurveTo(1024 + 110, 282, 1024 + 158, 294);
  ctx.stroke();

  // 3. Large Deep Obsidian-Black Anime Eyes (matching the new uploaded avatar!)
  const drawDarkAnimeEye = (cx, cy, isLeft) => {
    const dir = isLeft ? -1 : 1;
    ctx.save();

    // Crisp white sclera shape (almond/rounded-rect)
    ctx.fillStyle = "#f7f5f2";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 4, 62, 42, isLeft ? 0.04 : -0.04, 0, Math.PI * 2);
    ctx.fill();

    // Large Deep Charcoal/Obsidian Iris filling the center of the eye
    const irisGrad = ctx.createLinearGradient(cx, cy - 36, cx, cy + 44);
    irisGrad.addColorStop(0, "#050508");
    irisGrad.addColorStop(0.65, "#101016");
    irisGrad.addColorStop(1, "#2a2b33");
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 4, 49, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Subtle soft grey crescent reflection at bottom of dark iris
    ctx.fillStyle = "rgba(95, 98, 112, 0.35)";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 22, 32, 13, 0, 0, Math.PI);
    ctx.fill();

    // Pure black center pupil
    ctx.fillStyle = "#040406";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 2, 26, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Thick Sweeping Black Upper Lash Line with Winged Outer Corner
    ctx.strokeStyle = "#08070a";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx - dir * 56, cy + 6);
    ctx.quadraticCurveTo(cx, cy - 42, cx + dir * 64, cy - 2);
    ctx.stroke();

    // Outer winged eyelash spikes
    ctx.lineWidth = 5.5;
    ctx.beginPath();
    ctx.moveTo(cx + dir * 52, cy - 10);
    ctx.lineTo(cx + dir * 70, cy - 22);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + dir * 58, cy + 4);
    ctx.lineTo(cx + dir * 72, cy + 2);
    ctx.stroke();

    // Lower lash line with tiny outer lash ticks
    ctx.strokeStyle = "#181416";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - dir * 46, cy + 36);
    ctx.quadraticCurveTo(cx, cy + 46, cx + dir * 58, cy + 28);
    ctx.stroke();

    // Tiny lower outer lash spikes
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx + dir * 44, cy + 34);
    ctx.lineTo(cx + dir * 54, cy + 42);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - dir * 32, cy + 38);
    ctx.lineTo(cx - dir * 40, cy + 45);
    ctx.stroke();

    ctx.restore();
  };

  drawDarkAnimeEye(1024 - 112, 350, true);
  drawDarkAnimeEye(1024 + 112, 350, false);

  // 4. Cute Little ":3" / "w" Cat Smile in the center (matching the front screenshot!)
  ctx.strokeStyle = "#3a2218";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(1024 - 22, 462);
  ctx.quadraticCurveTo(1024 - 11, 470, 1024, 461);
  ctx.quadraticCurveTo(1024 + 11, 470, 1024 + 22, 462);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

// Helper: Cocoa-Brown Overalls & Khaki Collar Shirt Texture (Front & Back)
function createOverallsTorsoTexture(mode = "front") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  // Warm khaki/oat undershirt base (#bfa88e)
  ctx.fillStyle = "#bfa88e";
  ctx.fillRect(0, 0, 512, 512);

  // Subtle vertical fabric shading on shirt
  const shirtGrad = ctx.createLinearGradient(0, 0, 512, 0);
  shirtGrad.addColorStop(0, "rgba(80, 55, 35, 0.18)");
  shirtGrad.addColorStop(0.5, "rgba(255, 245, 230, 0.1)");
  shirtGrad.addColorStop(1, "rgba(80, 55, 35, 0.18)");
  ctx.fillStyle = shirtGrad;
  ctx.fillRect(0, 0, 512, 512);

  if (mode === "front") {
    // 1. Cream-White Pointed Sailor/Peter-Pan Collar at top neck
    ctx.fillStyle = "#efe6d8";
    ctx.strokeStyle = "#22140c";
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";

    // Left collar point
    ctx.beginPath();
    ctx.moveTo(145, 0);
    ctx.lineTo(215, 110);
    ctx.lineTo(256, 38);
    ctx.lineTo(256, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right collar point
    ctx.beginPath();
    ctx.moveTo(367, 0);
    ctx.lineTo(297, 110);
    ctx.lineTo(256, 38);
    ctx.lineTo(256, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Subtle center shirt seam under collar
    ctx.strokeStyle = "rgba(95, 70, 48, 0.35)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(256, 45);
    ctx.lineTo(256, 260);
    ctx.stroke();

    // 2. Cocoa-Brown Overalls (Bib + Shoulder Straps + Side Panels)
    ctx.fillStyle = "#5c4028";
    ctx.strokeStyle = "#1e120a";
    ctx.lineWidth = 12;

    // Main overalls body with curved U-shaped chest scoop & two straps
    ctx.beginPath();
    // Start top-left strap
    ctx.moveTo(92, 0);
    ctx.lineTo(155, 0);
    // Curve down into center chest scoop
    ctx.quadraticCurveTo(165, 255, 256, 255);
    ctx.quadraticCurveTo(347, 255, 357, 0);
    // Top-right strap
    ctx.lineTo(420, 0);
    // Outer right edge of overalls curving down to waist
    ctx.quadraticCurveTo(400, 290, 465, 490);
    ctx.lineTo(512, 490);
    ctx.lineTo(512, 512);
    ctx.lineTo(0, 512);
    ctx.lineTo(0, 490);
    ctx.lineTo(47, 490);
    ctx.quadraticCurveTo(112, 290, 92, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cute Gear/Flower Rosette Pin Badge on her left chest strap (viewer's right, x=352, y=145)
    ctx.save();
    ctx.translate(355, 148);
    // Brown ribbon tails under badge
    ctx.fillStyle = "#3b2414";
    ctx.beginPath();
    ctx.moveTo(-18, 20);
    ctx.lineTo(-28, 65);
    ctx.lineTo(0, 50);
    ctx.lineTo(24, 68);
    ctx.lineTo(18, 20);
    ctx.closePath();
    ctx.fill();
    // White scalloped rosette petals
    ctx.fillStyle = "#f2ece1";
    ctx.strokeStyle = "#22140c";
    ctx.lineWidth = 5;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 5) {
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 22, Math.sin(a) * 22, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    // Brown center button of rosette
    ctx.fillStyle = "#6e4b2e";
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Two Cream Spiral Strap Buttons on the overalls bib (x=130 & x=382, y=245)
    const drawSpiralButton = (bx, by) => {
      ctx.strokeStyle = "#e8dec8";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(bx, by, 16, 0, Math.PI * 1.75);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bx, by, 8, Math.PI * 0.3, Math.PI * 1.5);
      ctx.stroke();
    };
    drawSpiralButton(132, 242);
    drawSpiralButton(380, 242);

    // Center Front Pocket on the Overalls Bib
    ctx.fillStyle = "#7a593c";
    ctx.strokeStyle = "#1e120a";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(186, 365);
    ctx.quadraticCurveTo(256, 385, 326, 365);
    ctx.lineTo(318, 445);
    ctx.quadraticCurveTo(256, 495, 194, 445);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cream stripe detail across pocket
    ctx.strokeStyle = "#d9c8b0";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(200, 412);
    ctx.quadraticCurveTo(256, 435, 312, 412);
    ctx.stroke();
  } else if (mode === "back") {
    // Back of Overalls: Two vertical cocoa-brown straps meeting the lower waist
    ctx.fillStyle = "#5c4028";
    ctx.strokeStyle = "#1e120a";
    ctx.lineWidth = 12;

    // Left strap
    ctx.beginPath();
    ctx.rect(88, 0, 74, 420);
    ctx.fill();
    ctx.stroke();

    // Right strap
    ctx.beginPath();
    ctx.rect(350, 0, 74, 420);
    ctx.fill();
    ctx.stroke();

    // Lower back waist band
    ctx.beginPath();
    ctx.rect(0, 390, 512, 122);
    ctx.fill();
    ctx.stroke();
  } else {
    // Side of torso: Khaki top + diagonal dark-brown overall side seam + cocoa bottom
    ctx.fillStyle = "#5c4028";
    ctx.strokeStyle = "#1e120a";
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(0, 360);
    ctx.lineTo(512, 360);
    ctx.lineTo(512, 512);
    ctx.lineTo(0, 512);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Helper: Short Sleeve + Peach Forearm + Cocoa Stitched Wristband Texture
function createExplorerArmTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  // 1. Top Khaki Short Sleeve (0..165)
  ctx.fillStyle = "#bfa88e";
  ctx.fillRect(0, 0, 256, 150);

  // Cream sleeve cuff band with two black outline stripes (145..185)
  ctx.fillStyle = "#efe6d8";
  ctx.fillRect(0, 145, 256, 38);
  ctx.strokeStyle = "#1e120a";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(0, 145);
  ctx.lineTo(256, 145);
  ctx.moveTo(0, 164);
  ctx.lineTo(256, 164);
  ctx.moveTo(0, 183);
  ctx.lineTo(256, 183);
  ctx.stroke();

  // 2. Middle Forearm in Warm Peach-Cream Skin (185..380)
  ctx.fillStyle = "#dfc2a8";
  ctx.fillRect(0, 185, 256, 200);

  // 3. Cocoa-Brown Wristband Bracer at bottom of arm (380..512)
  ctx.fillStyle = "#4d3520";
  ctx.fillRect(0, 380, 256, 132);

  // Dark top border on wristband
  ctx.strokeStyle = "#1e120a";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, 382);
  ctx.lineTo(256, 382);
  ctx.stroke();

  // Cute tan zig-zag/vertical stitching along top of wristband (matching screenshot!)
  ctx.strokeStyle = "#b89972";
  ctx.lineWidth = 4;
  for (let x = 8; x < 256; x += 14) {
    ctx.beginPath();
    ctx.moveTo(x, 396);
    ctx.lineTo(x + 4, 422);
    ctx.lineTo(x + 10, 398);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Helper: Bare Peach Thigh with Knee Blush + Fluffy White Fur-Cuff Cocoa Boot Texture
function createBootLegTexture(includeFrontStrings = false) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  // 1. Upper Thigh in Warm Peach-Cream Skin (0..185)
  ctx.fillStyle = "#dfc2a8";
  ctx.fillRect(0, 0, 256, 185);

  if (includeFrontStrings) {
    // Soft oval rosy-tan knee blush right in the center of the thigh!
    const kneeGrad = ctx.createRadialGradient(128, 95, 6, 128, 95, 58);
    kneeGrad.addColorStop(0, "rgba(206, 148, 124, 0.65)");
    kneeGrad.addColorStop(0.6, "rgba(206, 148, 124, 0.25)");
    kneeGrad.addColorStop(1, "rgba(206, 148, 124, 0)");
    ctx.fillStyle = kneeGrad;
    ctx.beginPath();
    ctx.ellipse(128, 95, 58, 28, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Fluffy Snowy-White Fur Boot Cuff (180..265)
  ctx.fillStyle = "#f0eee9";
  ctx.fillRect(0, 180, 256, 82);

  // Soft grey-cream fur shading at bottom of fur cuff
  const furGrad = ctx.createLinearGradient(0, 180, 0, 265);
  furGrad.addColorStop(0, "#ffffff");
  furGrad.addColorStop(0.6, "#eceae4");
  furGrad.addColorStop(1, "#d2cec6");
  ctx.fillStyle = furGrad;
  ctx.fillRect(0, 185, 256, 78);

  // Tan braided trim under the white fur cuff (262..282)
  ctx.fillStyle = "#5c4028";
  ctx.fillRect(0, 262, 256, 22);
  ctx.fillStyle = "#a68562";
  for (let x = 6; x < 256; x += 22) {
    ctx.beginPath();
    ctx.arc(x + 6, 272, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Rich Cocoa-Brown Boot Shaft (282..512)
  const bootGrad = ctx.createLinearGradient(0, 282, 256, 512);
  bootGrad.addColorStop(0, "#4e351f");
  bootGrad.addColorStop(0.5, "#593d24");
  bootGrad.addColorStop(1, "#3d2815");
  ctx.fillStyle = bootGrad;
  ctx.fillRect(0, 282, 256, 230);

  if (includeFrontStrings) {
    // Two dark-brown pom-pom strings hanging down the front of the boot
    ctx.strokeStyle = "#221309";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    // Left string
    ctx.beginPath();
    ctx.moveTo(106, 265);
    ctx.quadraticCurveTo(92, 320, 92, 365);
    ctx.stroke();
    // Right string
    ctx.beginPath();
    ctx.moveTo(138, 265);
    ctx.quadraticCurveTo(150, 330, 152, 390);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Helper: Reflective Aviator Goggle Lens Texture
function createGoggleLensTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, "#9ca2a8");
  grad.addColorStop(0.45, "#cfd4d9");
  grad.addColorStop(1, "#82888e");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Diagonal white glass reflection stripes
  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  ctx.beginPath();
  ctx.moveTo(30, 256);
  ctx.lineTo(175, 0);
  ctx.lineTo(220, 0);
  ctx.lineTo(75, 256);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Helper: Soft Ground Shadow Texture
function createShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(128, 128, 14, 128, 128, 120);
  grad.addColorStop(0, "rgba(65, 45, 30, 0.28)");
  grad.addColorStop(0.5, "rgba(65, 45, 30, 0.12)");
  grad.addColorStop(1, "rgba(65, 45, 30, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

// Helper: Rounded Trapezoid Ray Shape for the Yellow Comic Burst Symbol (!)
function createComicRayShape(wBottom = 0.08, wTop = 0.18, height = 0.42) {
  const shape = new THREE.Shape();
  const r = 0.03;
  shape.moveTo(-wBottom / 2 + r, 0);
  shape.lineTo(wBottom / 2 - r, 0);
  shape.quadraticCurveTo(wBottom / 2, 0, wTop / 2, height - r);
  shape.quadraticCurveTo(wTop / 2, height, wTop / 2 - r, height);
  shape.lineTo(-wTop / 2 + r, height);
  shape.quadraticCurveTo(-wTop / 2, height, -wBottom / 2, r);
  shape.quadraticCurveTo(-wBottom / 2, 0, -wBottom / 2 + r, 0);
  return shape;
}

const AriaRunwayAvatar = ({ isExploded = false, cameraAngle = "front" }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.3, 100);
    camera.position.set(0, 0.22, 6.8);

    // Renderer
    let renderer;
    let dom;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      dom = renderer.domElement;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.06;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(dom);
    } catch (err) {
      console.warn("WebGL initialization failed:", err);
      return;
    }

    // Warm Cream & Golden-Oat Studio Lighting (matching the soft warm glow of the 4 reference images!)
    const ambientLight = new THREE.AmbientLight(0xfffaf0, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffdf8, 1.65);
    keyLight.position.set(3.2, 5.2, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const warmSunRim = new THREE.SpotLight(0xfff0b8, 2.6, 18, Math.PI / 2.4, 0.6);
    warmSunRim.position.set(-4, 3.5, 3);
    scene.add(warmSunRim);

    const softPeachFill = new THREE.PointLight(0xffebe0, 1.8, 14);
    softPeachFill.position.set(3, -1.5, 4);
    scene.add(softPeachFill);

    // Master Avatar Group
    const avatarMasterGroup = new THREE.Group();
    avatarMasterGroup.scale.set(0.95, 0.95, 0.95);
    const initialOffsetX = window.innerWidth >= 1024 ? 0.72 : 0;
    avatarMasterGroup.position.set(initialOffsetX, -0.05, 0);
    scene.add(avatarMasterGroup);

    // Textures & Materials
    const headTexture = createExplorerHeadTexture();
    const torsoFrontTex = createOverallsTorsoTexture("front");
    const torsoBackTex = createOverallsTorsoTexture("back");
    const torsoSideTex = createOverallsTorsoTexture("side");
    const armTex = createExplorerArmTexture();
    const legFrontTex = createBootLegTexture(true);
    const legPlainTex = createBootLegTexture(false);
    const goggleLensTex = createGoggleLensTexture();
    const shadowTex = createShadowTexture();

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xdfc2a8,
      roughness: 0.55,
      metalness: 0.01,
    });

    const robloxHeadMat = new THREE.MeshStandardMaterial({
      map: headTexture,
      roughness: 0.5,
      metalness: 0.01,
    });

    // Milk-tea / sandy ash-blonde hair materials
    const milkTeaHairMat = new THREE.MeshStandardMaterial({
      color: 0xcab2a0,
      roughness: 0.42,
      metalness: 0.03,
    });

    const milkTeaHighlightMat = new THREE.MeshStandardMaterial({
      color: 0xd9c3b2,
      roughness: 0.38,
      metalness: 0.04,
    });

    const milkTeaShadowMat = new THREE.MeshStandardMaterial({
      color: 0xb39a88,
      roughness: 0.46,
      metalness: 0.02,
    });

    // Goggle materials
    const darkLeatherMat = new THREE.MeshStandardMaterial({
      color: 0x332117,
      roughness: 0.42,
      metalness: 0.12,
    });

    const strapBlackBrownMat = new THREE.MeshStandardMaterial({
      color: 0x241710,
      roughness: 0.5,
      metalness: 0.05,
    });

    const silverRimMat = new THREE.MeshStandardMaterial({
      color: 0xb0b6bd,
      roughness: 0.22,
      metalness: 0.82,
    });

    const goggleLensMat = new THREE.MeshStandardMaterial({
      map: goggleLensTex,
      roughness: 0.15,
      metalness: 0.35,
    });

    // Outfit materials
    const torsoFrontMat = new THREE.MeshStandardMaterial({
      map: torsoFrontTex,
      roughness: 0.52,
    });
    const torsoBackMat = new THREE.MeshStandardMaterial({
      map: torsoBackTex,
      roughness: 0.52,
    });
    const torsoSideMat = new THREE.MeshStandardMaterial({
      map: torsoSideTex,
      roughness: 0.52,
    });
    const khakiTopMat = new THREE.MeshStandardMaterial({
      color: 0xbfa88e,
      roughness: 0.55,
    });
    const cocoaOverallsMat = new THREE.MeshStandardMaterial({
      color: 0x5c4028,
      roughness: 0.5,
    });
    const darkOutlineMat = new THREE.MeshStandardMaterial({
      color: 0x22140c,
      roughness: 0.6,
    });
    const armMat = new THREE.MeshStandardMaterial({
      map: armTex,
      roughness: 0.5,
    });
    const legFrontMat = new THREE.MeshStandardMaterial({
      map: legFrontTex,
      roughness: 0.5,
    });
    const legPlainMat = new THREE.MeshStandardMaterial({
      map: legPlainTex,
      roughness: 0.5,
    });
    const bootSoleMat = new THREE.MeshStandardMaterial({
      color: 0x3b2614,
      roughness: 0.48,
    });
    const whitePomMat = new THREE.MeshStandardMaterial({
      color: 0xf4f2ee,
      roughness: 0.65,
    });

    // Dino Tail & Red Bow Materials
    const dinoYellowMat = new THREE.MeshStandardMaterial({
      color: 0xebd08e,
      roughness: 0.48,
    });
    const dinoStripeMat = new THREE.MeshStandardMaterial({
      color: 0xe3b176,
      roughness: 0.48,
    });
    const dinoSpotMat = new THREE.MeshStandardMaterial({
      color: 0x9c493e,
      roughness: 0.5,
    });
    const dinoBellyMat = new THREE.MeshStandardMaterial({
      color: 0xebe7e0,
      roughness: 0.52,
    });
    const dinoSpikeMat = new THREE.MeshStandardMaterial({
      color: 0x882f2c,
      roughness: 0.42,
    });
    const redBowMat = new THREE.MeshStandardMaterial({
      color: 0xa6413d,
      roughness: 0.42,
    });

    // Floating Yellow Comic Burst Material
    const comicYellowMat = new THREE.MeshStandardMaterial({
      color: 0xfff01f,
      emissive: 0xffd900,
      emissiveIntensity: 0.55,
      roughness: 0.2,
    });
    const comicBorderMat = new THREE.MeshStandardMaterial({
      color: 0xf2c200,
      emissive: 0xe5b800,
      emissiveIntensity: 0.35,
      roughness: 0.25,
    });

    // Soft Ground Shadow under boots
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 1.8),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.42;
    avatarMasterGroup.add(shadowPlane);

    // Character Model Group
    const characterGroup = new THREE.Group();
    characterGroup.position.y = -0.05;
    avatarMasterGroup.add(characterGroup);

    const bodyCoreGroup = new THREE.Group();
    const headGroup = new THREE.Group();
    const hairGroup = new THREE.Group();
    const gogglesGroup = new THREE.Group();
    const shortsGroup = new THREE.Group();
    const tailGroup = new THREE.Group();
    const legsAndShoesGroup = new THREE.Group();
    const sparkGroup = new THREE.Group();

    characterGroup.add(bodyCoreGroup);
    characterGroup.add(headGroup);
    characterGroup.add(hairGroup);
    characterGroup.add(gogglesGroup);
    characterGroup.add(shortsGroup);
    characterGroup.add(tailGroup);
    characterGroup.add(legsAndShoesGroup);
    characterGroup.add(sparkGroup);

    // --- 1. HEAD & NECK ---
    const robloxHeadGeo = createRobloxHeadGeometry(0.46, 0.94);
    const headMesh = new THREE.Mesh(robloxHeadGeo, robloxHeadMat);
    headMesh.position.y = 1.5;
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.22, 28), skinMat);
    neckMesh.position.set(0, 1.01, 0);
    headGroup.add(neckMesh);

    // --- 2. MILK-TEA / SANDY ASH-BLONDE FEATHERED WOLF-CUT HAIR ---
    // Top Left & Right Crown Domes (meeting at center part in back & top)
    const crownL = new THREE.Mesh(new THREE.SphereGeometry(0.46, 32, 24), milkTeaHairMat);
    crownL.scale.set(0.92, 0.78, 1.06);
    crownL.position.set(-0.12, 1.74, -0.03);

    const crownR = new THREE.Mesh(new THREE.SphereGeometry(0.46, 32, 24), milkTeaHairMat);
    crownR.scale.set(0.92, 0.78, 1.06);
    crownR.position.set(0.12, 1.74, -0.03);
    hairGroup.add(crownL, crownR);

    // Tiny Ahoge Sprout Loop at the very top of her head!
    const ahoge = new THREE.Mesh(
      new THREE.TorusGeometry(0.08, 0.016, 10, 20, Math.PI * 1.3),
      milkTeaShadowMat
    );
    ahoge.position.set(0.02, 2.08, 0.04);
    ahoge.rotation.z = 0.4;
    hairGroup.add(ahoge);

    // Straight Wispy Forehead Bangs (7 tapered vertical locks across the forehead)
    const bangOffsets = [-0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3];
    bangOffsets.forEach((bx, idx) => {
      const bLen = 0.28 + (idx % 2 === 0 ? 0.04 : 0);
      const bangLock = new THREE.Mesh(
        new THREE.ConeGeometry(0.072, bLen, 12),
        idx % 2 === 0 ? milkTeaHairMat : milkTeaHighlightMat
      );
      // Invert cone so point faces downward toward eyebrows
      bangLock.rotation.z = Math.PI + bx * 0.18;
      bangLock.rotation.x = -0.16;
      bangLock.position.set(bx, 1.78, 0.43 - Math.abs(bx) * 0.22);
      hairGroup.add(bangLock);
    });

    // Cheek-Framing Inward-Curving Locks + Outward Feathered Side Flares (Left & Right)
    const createFeatheredSideHair = (isLeft) => {
      const s = isLeft ? -1 : 1;
      const sideGroup = new THREE.Group();

      // Main cheek-framing lock curving inward toward chin and down onto chest
      const cheekLockUpper = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.13, 0.56, 12, 18),
        milkTeaHighlightMat
      );
      cheekLockUpper.position.set(s * 0.44, 1.48, 0.2);
      cheekLockUpper.rotation.z = s * 0.08;
      cheekLockUpper.rotation.x = 0.12;

      const cheekLockLower = new THREE.Mesh(
        new THREE.ConeGeometry(0.13, 0.58, 14),
        milkTeaHairMat
      );
      cheekLockLower.position.set(s * 0.36, 1.04, 0.24);
      cheekLockLower.rotation.z = Math.PI + s * -0.24;
      cheekLockLower.rotation.x = -0.15;

      // Feathered outward-flaring wisps on the sides (matching the wispy wolf-cut silhouette!)
      const flareUpper = new THREE.Mesh(
        new THREE.ConeGeometry(0.085, 0.46, 12),
        milkTeaHighlightMat
      );
      flareUpper.position.set(s * 0.56, 1.52, 0.05);
      flareUpper.rotation.z = Math.PI + s * 0.58;

      const flareMid = new THREE.Mesh(
        new THREE.ConeGeometry(0.095, 0.5, 12),
        milkTeaHairMat
      );
      flareMid.position.set(s * 0.55, 1.32, -0.02);
      flareMid.rotation.z = Math.PI + s * 0.42;

      const flareLow = new THREE.Mesh(
        new THREE.ConeGeometry(0.085, 0.44, 12),
        milkTeaShadowMat
      );
      flareLow.position.set(s * 0.48, 1.12, -0.08);
      flareLow.rotation.z = Math.PI + s * 0.28;

      sideGroup.add(cheekLockUpper, cheekLockLower, flareUpper, flareMid, flareLow);
      return sideGroup;
    };
    hairGroup.add(createFeatheredSideHair(true), createFeatheredSideHair(false));

    // Back Feathered Shoulder-Length Hair Curtain (matching Back & Profile screenshots!)
    for (let i = -4; i <= 4; i++) {
      const angle = i * 0.22;
      const rx = Math.sin(angle) * 0.44;
      const rz = -Math.cos(angle) * 0.44 - 0.04;
      const len = 0.82 - Math.abs(i) * 0.03;

      const upperBackStrand = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.13, 0.48, 12, 16),
        Math.abs(i) % 2 === 0 ? milkTeaHairMat : milkTeaHighlightMat
      );
      upperBackStrand.position.set(rx, 1.48, rz);
      upperBackStrand.rotation.z = i * -0.05;

      const lowerBackTip = new THREE.Mesh(
        new THREE.ConeGeometry(0.125, len, 12),
        Math.abs(i) % 2 === 0 ? milkTeaHairMat : milkTeaShadowMat
      );
      lowerBackTip.position.set(rx * 1.06, 1.05, rz - 0.04);
      lowerBackTip.rotation.z = Math.PI + i * 0.08;
      lowerBackTip.rotation.x = 0.14;

      hairGroup.add(upperBackStrand, lowerBackTip);
    }

    // --- 3. STEAMPUNK / AVIATOR GOGGLES ON FOREHEAD + BACK STRAP ---
    // Dark brown leather strap wrapping around the head (tilted from high front to mid-back)
    const goggleStrap = new THREE.Mesh(
      new THREE.TorusGeometry(0.495, 0.032, 14, 48),
      strapBlackBrownMat
    );
    goggleStrap.position.set(0, 1.66, -0.02);
    goggleStrap.rotation.x = Math.PI / 2 + 0.34;
    gogglesGroup.add(goggleStrap);

    // Helper for Left & Right Goggle Cups
    const createGoggleEyeCup = (isLeft) => {
      const s = isLeft ? -1 : 1;
      const cupGroup = new THREE.Group();
      cupGroup.position.set(s * 0.23, 1.88, 0.36);
      cupGroup.rotation.x = -0.45;
      cupGroup.rotation.y = s * 0.24;
      cupGroup.rotation.z = s * -0.1;

      // Dark-brown leather outer cushion ring
      const leatherCushion = new THREE.Mesh(
        new THREE.TorusGeometry(0.185, 0.058, 16, 32),
        darkLeatherMat
      );
      cupGroup.add(leatherCushion);

      // Brushed silver metallic bezel rim
      const silverBezel = new THREE.Mesh(
        new THREE.TorusGeometry(0.16, 0.026, 16, 32),
        silverRimMat
      );
      silverBezel.position.z = 0.038;
      cupGroup.add(silverBezel);

      // Reflective glass lens disc
      const glassLens = new THREE.Mesh(
        new THREE.CylinderGeometry(0.155, 0.155, 0.02, 32),
        goggleLensMat
      );
      glassLens.rotation.x = Math.PI / 2;
      glassLens.position.z = 0.035;
      cupGroup.add(glassLens);

      // Side silver hinge bracket where strap attaches
      const sideHinge = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.07, 0.08),
        silverRimMat
      );
      sideHinge.position.set(s * 0.21, 0, -0.02);
      cupGroup.add(sideHinge);

      return cupGroup;
    };

    // Silver center nose-bridge clasp between the two goggle lenses
    const goggleBridge = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.055, 0.06),
      silverRimMat
    );
    goggleBridge.position.set(0, 1.91, 0.41);
    goggleBridge.rotation.x = -0.45;

    gogglesGroup.add(createGoggleEyeCup(true), createGoggleEyeCup(false), goggleBridge);

    // --- 4. TORSO: COCOA-BROWN OVERALLS & KHAKI COLLAR SHIRT ---
    const torsoMaterials = [
      torsoSideMat, // right
      torsoSideMat, // left
      khakiTopMat, // top
      cocoaOverallsMat, // bottom
      torsoFrontMat, // front (collar, badge, bib & pocket)
      torsoBackMat, // back (straps)
    ];
    const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.78, 0.46), torsoMaterials);
    torsoMesh.position.y = 0.56;
    torsoMesh.castShadow = true;
    bodyCoreGroup.add(torsoMesh);

    // Stepped Flared Overalls Shorts / Hip Block (matching the boxy overall shorts in screenshot!)
    const waistStep = new THREE.Mesh(
      new THREE.BoxGeometry(0.94, 0.1, 0.5),
      cocoaOverallsMat
    );
    waistStep.position.y = 0.15;
    shortsGroup.add(waistStep);

    const createShortLegBlock = (isLeft) => {
      const s = isLeft ? -1 : 1;
      const shortGroup = new THREE.Group();
      shortGroup.position.set(s * 0.25, 0.02, 0);
      shortGroup.rotation.z = s * -0.05;

      const shortBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.49, 0.22, 0.52),
        cocoaOverallsMat
      );
      shortGroup.add(shortBox);

      // Dark brown bottom hem outline on shorts
      const hemLine = new THREE.Mesh(
        new THREE.BoxGeometry(0.495, 0.03, 0.525),
        darkOutlineMat
      );
      hemLine.position.y = -0.1;
      shortGroup.add(hemLine);

      return shortGroup;
    };
    shortsGroup.add(createShortLegBlock(true), createShortLegBlock(false));

    // --- 5. ARMS, WRISTBANDS & ROBLOX C-HANDS ---
    const createExplorerArm = (isLeft) => {
      const s = isLeft ? -1 : 1;
      const armPivot = new THREE.Group();
      armPivot.position.set(s * 0.52, 0.88, 0);
      armPivot.rotation.z = s * -0.32; // Outward explorer stance matching Front & Back screenshots

      const armMesh = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.86, 0.34), armMat);
      armMesh.position.y = -0.37;
      armMesh.castShadow = true;
      armPivot.add(armMesh);

      // Classic Roblox C-shaped Hand in warm peach-cream skin
      const cHand = new THREE.Mesh(
        new THREE.TorusGeometry(0.105, 0.052, 16, 28, Math.PI * 1.45),
        skinMat
      );
      cHand.position.y = -0.9;
      cHand.rotation.z = Math.PI * 0.78;
      armPivot.add(cHand);

      return armPivot;
    };
    bodyCoreGroup.add(createExplorerArm(true), createExplorerArm(false));

    // --- 6. GIANT CURLED CREAM-YELLOW SPOTTED DINO TAIL WITH BIG BERRY-RED BOW ---
    // Visible from Back, Left, Right, and peeking out with its red bow from the Front!
    const tailSpinePoints = [
      new THREE.Vector3(0, 0.28, -0.22),
      new THREE.Vector3(0, 0.16, -0.52),
      new THREE.Vector3(0, 0.04, -0.84),
      new THREE.Vector3(0, 0.02, -1.12),
      new THREE.Vector3(0, 0.14, -1.34),
      new THREE.Vector3(0, 0.32, -1.44),
      new THREE.Vector3(0, 0.45, -1.36),
      new THREE.Vector3(0, 0.44, -1.22),
      new THREE.Vector3(0, 0.35, -1.2),
      new THREE.Vector3(0, 0.34, -1.27),
    ];
    const tailCurve = new THREE.CatmullRomCurve3(tailSpinePoints);

    // Build smooth overlapping chubby tail segments along the curve
    const segmentSteps = 38;
    for (let i = 0; i <= segmentSteps; i++) {
      const t = i / segmentSteps;
      const pt = tailCurve.getPoint(t);
      // Chubby base tapering smoothly into the curled spiral tip
      const r =
        t < 0.25
          ? 0.24 + Math.sin((t / 0.25) * Math.PI * 0.5) * 0.06
          : 0.3 * Math.pow(1 - (t - 0.25) / 0.75, 0.72) + 0.045;

      // Alternate warm buttery yellow and soft peach-orange stripes
      const segMat = i % 5 === 2 ? dinoStripeMat : dinoYellowMat;
      const segSphere = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 16), segMat);
      segSphere.position.copy(pt);
      segSphere.scale.set(0.92, 1.0, 1.0);
      tailGroup.add(segSphere);

      // Ribbed snowy-cream belly underside along the tail
      if (t < 0.85) {
        const bellySphere = new THREE.Mesh(
          new THREE.SphereGeometry(r * 0.88, 16, 12),
          dinoBellyMat
        );
        bellySphere.position.set(pt.x, pt.y - r * 0.32, pt.z - r * 0.12);
        bellySphere.scale.set(0.82, 0.78, 0.95);
        tailGroup.add(bellySphere);
      }
    }

    // Cute Terracotta-Brown Spots on both sides of the chubby Dino Tail (matching Side screenshots!)
    const spotOffsets = [
      { x: 0.25, y: 0.12, z: -0.78, r: 0.075 },
      { x: 0.23, y: 0.18, z: -0.72, r: 0.055 },
      { x: 0.23, y: 0.06, z: -0.72, r: 0.055 },
      { x: 0.24, y: 0.12, z: -0.85, r: 0.055 },
      { x: 0.2, y: 0.02, z: -0.96, r: 0.045 },
      { x: -0.22, y: 0.08, z: -0.92, r: 0.06 },
      { x: -0.18, y: 0.14, z: -1.04, r: 0.045 },
    ];
    spotOffsets.forEach((sp) => {
      const spotMesh = new THREE.Mesh(new THREE.SphereGeometry(sp.r, 12, 12), dinoSpotMat);
      spotMesh.position.set(sp.x, sp.y, sp.z);
      spotMesh.scale.set(0.45, 1, 1);
      tailGroup.add(spotMesh);
    });

    // 3 Cute Dark-Red Conical Dino Spikes along the top ridge of the tail!
    const spikeConfigs = [
      { y: 0.46, z: -0.42, rotX: -0.25, scale: 1.0 },
      { y: 0.34, z: -0.68, rotX: -0.45, scale: 0.92 },
      { y: 0.22, z: -0.92, rotX: -0.6, scale: 0.82 },
    ];
    spikeConfigs.forEach((sc) => {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.16, 14), dinoSpikeMat);
      spike.position.set(0, sc.y, sc.z);
      spike.rotation.x = sc.rotX;
      spike.scale.setScalar(sc.scale);
      tailGroup.add(spike);
    });

    // Big Puffy Berry-Red Ribbon Bow + White Ruffled Lace Trim on the Tail!
    // Positioned so its right side peeks out behind her right hip from the Front view (just like the Front screenshot!)
    // and sits grandly across the tail in the Back and Side views!
    const tailBowGroup = new THREE.Group();
    tailBowGroup.position.set(0, 0.16, -0.58);

    // Left & Right Puffy Red Bow Loops (wide enough to peek out from behind her waist!)
    const createTailBowSide = (isLeft) => {
      const s = isLeft ? -1 : 1;
      const sideBow = new THREE.Group();

      // Puffy red bow wing
      const bowWing = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.24, 0.16),
        redBowMat
      );
      bowWing.position.set(s * 0.26, 0.02, 0.08);
      bowWing.rotation.z = s * -0.15;
      bowWing.rotation.y = s * 0.25;
      sideBow.add(bowWing);

      // White scalloped lace frill peeking out at the outer edge of the red bow!
      for (let f = -2; f <= 2; f++) {
        const frill = new THREE.Mesh(
          new THREE.SphereGeometry(0.048, 12, 12),
          whitePomMat
        );
        frill.position.set(s * 0.41, 0.02 + f * 0.045, 0.12);
        sideBow.add(frill);
      }

      // Long hanging notched red ribbon tail
      const ribbonTail = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.62, 0.05),
        redBowMat
      );
      ribbonTail.position.set(s * 0.24, -0.34, -0.32);
      ribbonTail.rotation.z = s * -0.18;
      ribbonTail.rotation.x = 0.22;
      sideBow.add(ribbonTail);

      return sideBow;
    };

    tailBowGroup.add(createTailBowSide(true), createTailBowSide(false));
    tailGroup.add(tailBowGroup);

    // --- 7. LEGS, FLUFFY FUR-TRIMMED COCOA BOOTS & WHITE POM-POMS ---
    const createBootLeg = (isLeft) => {
      const s = isLeft ? -1 : 1;
      const legPivot = new THREE.Group();
      legPivot.position.set(s * 0.24, -0.1, 0);
      legPivot.rotation.z = s * -0.05;

      const legMaterials = [
        legPlainMat,
        legPlainMat,
        skinMat,
        bootSoleMat,
        legFrontMat, // Front has knee blush & pom-pom strings
        legPlainMat,
      ];
      const legMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.12, 0.46), legMaterials);
      legMesh.position.y = -0.58;
      legMesh.castShadow = true;
      legPivot.add(legMesh);

      // 3D Fluffy White Sherpa Fur Cuff Ring around the top of the boot
      const furCuff = new THREE.Mesh(
        new THREE.BoxGeometry(0.475, 0.18, 0.485),
        whitePomMat
      );
      furCuff.position.y = -0.51;
      legPivot.add(furCuff);

      // Two 3D Fluffy White Pom-Pom Balls hanging on the front of each boot!
      const pomLeft = new THREE.Mesh(new THREE.SphereGeometry(0.042, 14, 14), whitePomMat);
      pomLeft.position.set(-0.06, -0.78, 0.24);

      const pomRight = new THREE.Mesh(new THREE.SphereGeometry(0.042, 14, 14), whitePomMat);
      pomRight.position.set(0.05, -0.83, 0.24);
      legPivot.add(pomLeft, pomRight);

      // Stepped Cocoa Boot Sole at bottom
      const bootSole = new THREE.Mesh(
        new THREE.BoxGeometry(0.47, 0.12, 0.5),
        bootSoleMat
      );
      bootSole.position.set(0, -1.16, 0.01);
      legPivot.add(bootSole);

      return legPivot;
    };

    legsAndShoesGroup.add(createBootLeg(true), createBootLeg(false));

    // --- 8. FLOATING BRIGHT-YELLOW COMIC 3-RAY BURST SYMBOL (!) ---
    // Matches the 3 bright yellow comic burst wedges floating at top-left of her head!
    const buildComicRay = (wB, wT, h) => {
      const shape = createComicRayShape(wB, wT, h);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.045,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.012,
        bevelSegments: 2,
      });
      geo.center();
      const mesh = new THREE.Mesh(geo, comicYellowMat);

      // Slightly larger border plate behind/around for the crisp darker-yellow outline
      const borderMesh = new THREE.Mesh(geo, comicBorderMat);
      borderMesh.scale.set(1.12, 1.08, 0.85);
      borderMesh.position.z = -0.005;
      const group = new THREE.Group();
      group.add(borderMesh, mesh);
      return group;
    };

    // Position the 3-ray yellow burst next to the upper-left of her head (viewer's left)
    sparkGroup.position.set(-0.82, 1.92, 0.38);

    // Top-right small vertical ray
    const rayTop = buildComicRay(0.09, 0.16, 0.26);
    rayTop.position.set(0.18, 0.22, 0);
    rayTop.rotation.z = -0.15;

    // Middle large diagonal ray
    const rayMid = buildComicRay(0.11, 0.24, 0.44);
    rayMid.position.set(-0.08, 0.12, 0);
    rayMid.rotation.z = 0.58;

    // Bottom horizontal/angled ray
    const rayBot = buildComicRay(0.09, 0.19, 0.34);
    rayBot.position.set(-0.18, -0.18, 0);
    rayBot.rotation.z = 1.25;

    sparkGroup.add(rayTop, rayMid, rayBot);

    // Subtle Warm Floating Sunbeams / Star Motes in Background
    const bgParticleGroup = new THREE.Group();
    scene.add(bgParticleGroup);
    const bgMotes = [];
    const moteGeo = new THREE.OctahedronGeometry(0.06, 0);

    for (let i = 0; i < 16; i++) {
      const pMesh = new THREE.Mesh(
        moteGeo,
        i % 2 === 0 ? comicYellowMat : whitePomMat
      );
      const s = 0.5 + Math.random() * 0.7;
      pMesh.scale.setScalar(s);
      pMesh.position.set(
        (Math.random() - 0.5) * 9.5,
        (Math.random() - 0.5) * 6.5 + 0.4,
        (Math.random() - 0.5) * 2.5 - 2.6
      );
      pMesh.userData = {
        speedY: Math.random() * 0.004 + 0.0018,
        swaySpeed: Math.random() * 1.2 + 0.6,
        swayOffset: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      };
      bgMotes.push(pMesh);
      bgParticleGroup.add(pMesh);
    }

    // Drag / Orbit & Scroll interaction
    let mouseX = 0,
      mouseY = 0;
    let isDragging = false;
    let dragX = 0,
      dragY = 0;
    let lastMouseX = 0,
      lastMouseY = 0;
    let scrollProgress = 0;
    let targetScroll = 0;

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        targetScroll = window.scrollY / maxScroll;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        dragX += deltaX * 0.006;
        dragY += deltaY * 0.006;
        dragY = Math.max(-0.3, Math.min(0.3, dragY));
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    };

    const onMouseDown = (e) => {
      if (e.target.closest("button, a, input, select, textarea, [role='button']")) return;
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });

    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth || window.innerWidth;
      const h = mountRef.current.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Animation Loop
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      scrollProgress += (targetScroll - scrollProgress) * 0.07;

      let scrollExplode = 0;
      if (scrollProgress > 0.25 && scrollProgress < 0.5) {
        scrollExplode = Math.min(0.6, Math.max(0.0, (scrollProgress - 0.25) / 0.2));
      }
      const currentExplode = Math.max(scrollExplode, window.explodedWardrobeOverride || 0);

      // Smooth 3D Outfit Inspection ("Pop Outfit Apart" mode)
      gogglesGroup.position.y = currentExplode * 0.52;
      hairGroup.position.y = currentExplode * 0.32;
      headGroup.position.y = currentExplode * 0.18;
      tailGroup.position.z = -currentExplode * 0.48;
      shortsGroup.position.y = -currentExplode * 0.14;
      legsAndShoesGroup.position.y = -currentExplode * 0.38;

      // Animate the Yellow Comic Burst (!) with a lively comic pulse & bob
      const sparkPulse = 1 + Math.sin(time * 4.2) * 0.06;
      sparkGroup.scale.setScalar(sparkPulse);
      sparkGroup.position.y = 1.92 + Math.sin(time * 2.8) * 0.04 + currentExplode * 0.4;
      sparkGroup.position.x = -0.82 - currentExplode * 0.35;

      // Gentle wag on the Cute Dino Tail!
      tailGroup.rotation.y = Math.sin(time * 2.4) * 0.08;

      // Position Aria on the right stage on desktop when at the top Hero section
      const isDesktop = window.innerWidth >= 1024;
      const heroRightOffset = isDesktop ? Math.max(0, 1 - scrollProgress * 4.5) * 0.72 : 0;
      avatarMasterGroup.position.x += (heroRightOffset - avatarMasterGroup.position.x) * 0.08;

      // Gentle floating bob
      const floatBob = Math.sin(time * 2.0) * 0.055;
      avatarMasterGroup.position.y = -0.05 + floatBob;
      characterGroup.rotation.z = Math.sin(time * 1.3) * 0.012;

      // Camera positioning & View Presets (Front, Side/Tail View, 360 Spin)
      let targetCamZ = 6.7 - Math.sin(scrollProgress * Math.PI) * 0.4;
      let targetCamY = 0.22 - scrollProgress * 0.15;

      if (window.currentCameraAngle === "wing") {
        // Side/Back profile view to show off her cute Dino Tail & Red Bow!
        targetCamZ = 6.2;
        targetCamY = 0.25;
      } else if (window.currentCameraAngle === "orbit") {
        targetCamZ = 7.0;
      }

      camera.position.z += (targetCamZ - camera.position.z) * 0.06;
      camera.position.y += (targetCamY - camera.position.y) * 0.06;

      let baseAngleY = Math.sin(time * 0.5) * 0.14;
      if (window.currentCameraAngle === "wing") {
        baseAngleY = -Math.PI * 0.62 + Math.sin(time * 0.6) * 0.15;
      } else if (window.currentCameraAngle === "orbit") {
        baseAngleY = time * 0.75;
      }

      const targetRotX = dragY + mouseY * 0.1;
      const targetRotY = dragX + mouseX * 0.22 + baseAngleY;

      avatarMasterGroup.rotation.x += (targetRotX - avatarMasterGroup.rotation.x) * 0.08;
      avatarMasterGroup.rotation.y += (targetRotY - avatarMasterGroup.rotation.y) * 0.08;

      // Drift ambient background motes upward
      bgMotes.forEach((p) => {
        p.position.y += p.userData.speedY;
        p.position.x += Math.sin(time * p.userData.swaySpeed + p.userData.swayOffset) * 0.0018;
        p.rotation.y += p.userData.rotSpeed;
        p.rotation.x += p.userData.rotSpeed;
        if (p.position.y > 4.2) p.position.y = -3.2;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);
      if (container && dom && container.contains(dom)) {
        container.removeChild(dom);
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  useEffect(() => {
    window.explodedWardrobeOverride = isExploded ? 1.0 : 0.0;
  }, [isExploded]);

  useEffect(() => {
    window.currentCameraAngle = cameraAngle;
  }, [cameraAngle]);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default AriaRunwayAvatar;
