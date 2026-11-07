import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// -----------------------------------------------------------------------------
// 1. GEOMETRY HELPERS: HEAD, CURVED HAIR LOCKS, TAPERED TORSO, C-HAND & TAIL
// -----------------------------------------------------------------------------

// Classic Smooth Rounded Chibi Roblox Head Geometry
function createRobloxHeadGeometry(radius = 0.47, height = 0.92) {
  const profilePoints = [];
  const halfH = height / 2;
  const bottomR = 0.19;
  const topR = 0.25;

  const bottomSteps = 16;
  for (let i = 0; i <= bottomSteps; i++) {
    const t = i / bottomSteps;
    const angle = -Math.PI / 2 + t * (Math.PI / 2);
    const r = radius - bottomR + Math.cos(angle) * bottomR;
    const y = -halfH + bottomR + Math.sin(angle) * bottomR;
    profilePoints.push(new THREE.Vector2(Math.max(0.001, r), y));
  }

  const midSteps = 14;
  const yStart = -halfH + bottomR;
  const yEnd = halfH - topR;
  for (let i = 1; i < midSteps; i++) {
    const t = i / midSteps;
    const y = yStart + t * (yEnd - yStart);
    // Soft cheek fullness on lower half of face
    const cheekBulge = Math.sin(t * Math.PI) * 0.012 + (1 - t) * 0.008;
    profilePoints.push(new THREE.Vector2(radius + cheekBulge, y));
  }

  const topSteps = 18;
  for (let i = 0; i <= topSteps; i++) {
    const t = i / topSteps;
    const angle = t * (Math.PI / 2);
    const r = radius - topR + Math.cos(angle) * topR;
    const y = halfH - topR + Math.sin(angle) * topR;
    profilePoints.push(new THREE.Vector2(Math.max(0.001, r), y));
  }

  const geo = new THREE.LatheGeometry(profilePoints, 72);

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

// Sculpted Curved Anime Hair Lock Geometry (Replaces basic cones!)
// Creates a smooth, curved, lenticular/ribbon hair lock along a 3D curve that tapers to a soft point
function createCurvedHairLockGeo(
  points,
  width = 0.14,
  thickness = 0.045,
  tubularSegments = 24,
  radialSegments = 14,
  rootTaper = 0.75,
  tipPower = 1.35
) {
  const curve = new THREE.CatmullRomCurve3(points);
  const frames = curve.computeFrenetFrames(tubularSegments, false);
  const vertices = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= tubularSegments; i++) {
    const v = i / tubularSegments;
    const pt = curve.getPointAt(v);

    // Smooth taper profile from root (v=0) through body to pointed tip (v=1)
    const rootFactor = rootTaper + (1 - rootTaper) * Math.min(1, v * 3.5);
    const tipFactor = Math.pow(Math.max(0, 1 - v), tipPower * 0.65);
    const scaleW = width * rootFactor * (0.12 + 0.88 * tipFactor);
    const scaleT = thickness * rootFactor * (0.1 + 0.9 * tipFactor);

    // Stable local frame using tangent and outward radial direction from head center
    const tangent = frames.tangents[i].clone().normalize();
    const radialOut = new THREE.Vector3(pt.x, 0, pt.z);
    if (radialOut.lengthSq() < 0.0001) radialOut.set(0, 0, 1);
    radialOut.normalize();

    const side = new THREE.Vector3().crossVectors(tangent, radialOut).normalize();
    const normal = new THREE.Vector3().crossVectors(side, tangent).normalize();

    for (let j = 0; j <= radialSegments; j++) {
      const u = j / radialSegments;
      const theta = u * Math.PI * 2;
      // Lenticular anime hair cross-section with a subtle center ridge
      const lx = Math.cos(theta) * scaleW * 0.5;
      const ridge = Math.sin(theta) > 0 ? Math.pow(Math.sin(theta), 0.85) : Math.sin(theta) * 0.6;
      const lz = ridge * scaleT * 0.5;

      const vx = pt.x + side.x * lx + normal.x * lz;
      const vy = pt.y + side.y * lx + normal.y * lz;
      const vz = pt.z + side.z * lx + normal.z * lz;

      vertices.push(vx, vy, vz);
      uvs.push(u, 1 - v);
    }
  }

  const ringVerts = radialSegments + 1;
  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * ringVerts + j;
      const b = (i + 1) * ringVerts + j;
      const c = (i + 1) * ringVerts + (j + 1);
      const d = i * ringVerts + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// Tapered R15 Girl/Chibi Torso Geometry (Narrower waist flaring smoothly to chest & hips)
function createTaperedTorsoGeo(width = 0.86, height = 0.78, depth = 0.44) {
  const geo = new RoundedBoxGeometry(width, height, depth, 6, 0.065);
  const pos = geo.attributes.position;
  const halfH = height / 2;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    // Normalized height t from 0 (bottom waist) to 1 (top shoulders)
    const t = (y + halfH) / height;
    // Slight inward taper at lower-mid waist (t ~ 0.25), wider at shoulders (t ~ 0.9)
    const waistCurve = 0.88 + 0.14 * Math.pow(t - 0.22, 2);
    const depthCurve = 0.94 + 0.08 * Math.sin(t * Math.PI);
    pos.setX(i, x * waistCurve);
    pos.setZ(i, z * depthCurve);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

// Sculpted Roblox Blocky C-Hand Geometry (Matches reference photos instead of a thin donut!)
function createRobloxCHandGeometry() {
  const shape = new THREE.Shape();
  const outerR = 0.135;
  const innerR = 0.058;
  const startAngle = -Math.PI * 0.22;
  const endAngle = Math.PI * 1.22;

  // Outer C arc
  shape.absarc(0, 0, outerR, startAngle, endAngle, false);
  // Rounded finger tip cap
  const tipX = Math.cos(endAngle) * ((outerR + innerR) / 2);
  const tipY = Math.sin(endAngle) * ((outerR + innerR) / 2);
  shape.absarc(tipX, tipY, (outerR - innerR) / 2, endAngle, endAngle + Math.PI, false);
  // Inner C arc
  shape.absarc(0, 0, innerR, endAngle, startAngle, true);
  // Rounded thumb tip cap
  const thumbX = Math.cos(startAngle) * ((outerR + innerR) / 2);
  const thumbY = Math.sin(startAngle) * ((outerR + innerR) / 2);
  shape.absarc(thumbX, thumbY, (outerR - innerR) / 2, startAngle + Math.PI, startAngle + Math.PI * 2, false);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.19,
    bevelEnabled: true,
    bevelThickness: 0.032,
    bevelSize: 0.028,
    bevelSegments: 5,
    curveSegments: 24,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

// Continuous Smooth Curled Dino Tail Geometry + Ribbed White Underbelly Geometry
function createContinuousDinoTailGeo(curve, tubularSegments = 72, radialSegments = 28) {
  const frames = curve.computeFrenetFrames(tubularSegments, false);
  const vertices = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    const pt = curve.getPointAt(t);

    // Plump base tapering smoothly into the curled snail-spiral tip
    const r =
      t < 0.22
        ? 0.245 + Math.sin((t / 0.22) * Math.PI * 0.5) * 0.045
        : 0.29 * Math.pow(1 - (t - 0.22) / 0.78, 0.78) + 0.032;

    const tangent = new THREE.Vector3(0, frames.tangents[i].y, frames.tangents[i].z).normalize();
    const right = new THREE.Vector3(1, 0, 0);
    const up = new THREE.Vector3().crossVectors(tangent, right).normalize();

    for (let j = 0; j <= radialSegments; j++) {
      const u = j / radialSegments;
      const theta = u * Math.PI * 2;
      const lx = Math.sin(theta) * r * 0.92;
      const ly = Math.cos(theta) * r;

      const vx = pt.x + right.x * lx + up.x * ly;
      const vy = pt.y + right.y * lx + up.y * ly;
      const vz = pt.z + right.z * lx + up.z * ly;

      vertices.push(vx, vy, vz);
      uvs.push(u, t);
    }
  }

  const ring = radialSegments + 1;
  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * ring + j;
      const b = (i + 1) * ring + j;
      const c = (i + 1) * ring + (j + 1);
      const d = i * ring + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// Sculpted Segmented Cream-White Underbelly Strip along the outer curve of the Dino Tail
function createDinoBellyStripGeo(curve, tubularSegments = 64, arcSegments = 14) {
  const frames = curve.computeFrenetFrames(tubularSegments, false);
  const vertices = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    const pt = curve.getPointAt(t);

    const baseR =
      t < 0.22
        ? 0.245 + Math.sin((t / 0.22) * Math.PI * 0.5) * 0.045
        : 0.29 * Math.pow(1 - (t - 0.22) / 0.78, 0.78) + 0.032;

    // Gentle segmented ribbing along the white belly plates
    const ribBump = 1 + Math.sin(t * Math.PI * 26) * 0.022;
    const r = baseR * 1.035 * ribBump;

    const tangent = new THREE.Vector3(0, frames.tangents[i].y, frames.tangents[i].z).normalize();
    const right = new THREE.Vector3(1, 0, 0);
    const up = new THREE.Vector3().crossVectors(tangent, right).normalize();

    for (let j = 0; j <= arcSegments; j++) {
      const u = j / arcSegments;
      // Bottom/outer arc from -0.38*PI to +0.38*PI around the underside (theta = PI)
      const theta = Math.PI + (u - 0.5) * Math.PI * 0.74;
      // Smoothly bevel the edges of the belly plate into the yellow tail body
      const edgePinch = Math.sin(u * Math.PI);
      const rad = baseR * 0.97 + (r - baseR * 0.97) * Math.pow(edgePinch, 0.45);

      const lx = Math.sin(theta) * rad * 0.92;
      const ly = Math.cos(theta) * rad;

      const vx = pt.x + right.x * lx + up.x * ly;
      const vy = pt.y + right.y * lx + up.y * ly;
      const vz = pt.z + right.z * lx + up.z * ly;

      vertices.push(vx, vy, vz);
      uvs.push(u, t);
    }
  }

  const ring = arcSegments + 1;
  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < arcSegments; j++) {
      const a = i * ring + j;
      const b = (i + 1) * ring + j;
      const c = (i + 1) * ring + (j + 1);
      const d = i * ring + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// -----------------------------------------------------------------------------
// 2. PROCEDURAL STUDIO TEXTURES (HIGH-RES HAND-PAINTED LOOK)
// -----------------------------------------------------------------------------

// Brushed Milk-Tea Ash-Blonde Hair Texture (Adds fine vertical strand depth & halo sheen)
function createBrushedHairTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  // Base vertical gradient (root shadow -> warm milk-tea -> halo highlight -> soft tip)
  const baseGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  baseGrad.addColorStop(0, "#b69c8a");
  baseGrad.addColorStop(0.22, "#d4bfb0");
  baseGrad.addColorStop(0.38, "#e3d1c3"); // Soft anime angel-ring highlight band
  baseGrad.addColorStop(0.55, "#cbb4a2");
  baseGrad.addColorStop(0.85, "#bfa694");
  baseGrad.addColorStop(1, "#aa907e");
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Hundreds of fine vertical brushed hair strands
  for (let i = 0; i < 420; i++) {
    const x = (i * 2.45 + (i % 7) * 1.3) % 1024;
    const w = 1.2 + (i % 4) * 0.9;
    const isLight = i % 3 === 0;
    ctx.fillStyle = isLight ? "rgba(250, 238, 228, 0.22)" : "rgba(128, 102, 84, 0.18)";
    ctx.fillRect(x, 0, w, 1024);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 4;
  return tex;
}

// Expressive Face Texture Generator ("open", "blink", "happy")
function createExplorerHeadTexture(eyeState = "open") {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 668;
  const ctx = canvas.getContext("2d");

  // Warm porcelain-peach skin base (#dfc3aa)
  ctx.fillStyle = "#dfc3aa";
  ctx.fillRect(0, 0, 2048, 668);

  // Soft studio subsurface face shading (warm forehead glow, soft lower cheek & chin contour)
  const faceGrad = ctx.createLinearGradient(1024, 120, 1024, 650);
  faceGrad.addColorStop(0, "rgba(255, 244, 232, 0.22)");
  faceGrad.addColorStop(0.55, "rgba(223, 195, 170, 0)");
  faceGrad.addColorStop(1, "rgba(176, 136, 108, 0.32)");
  ctx.fillStyle = faceGrad;
  ctx.fillRect(620, 0, 808, 668);

  // Soft Rosy-Peach Airbrushed Blush under outer corners of eyes
  const drawBlush = (cx, cy) => {
    const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 68);
    grad.addColorStop(0, "rgba(216, 128, 114, 0.62)");
    grad.addColorStop(0.55, "rgba(216, 128, 114, 0.26)");
    grad.addColorStop(1, "rgba(216, 128, 114, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 68, 36, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  drawBlush(1024 - 118, 412);
  drawBlush(1024 + 118, 412);

  // Thin Softly Arched Eyebrows
  ctx.strokeStyle = "#523929";
  ctx.lineWidth = 3.8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(1024 - 162, 248);
  ctx.quadraticCurveTo(1024 - 110, 232, 1024 - 58, 246);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(1024 + 58, 246);
  ctx.quadraticCurveTo(1024 + 110, 232, 1024 + 162, 248);
  ctx.stroke();

  // Subtle Double-Eyelid Crease Lines above Eyes
  ctx.strokeStyle = "rgba(78, 50, 35, 0.58)";
  ctx.lineWidth = 3.0;
  ctx.beginPath();
  ctx.moveTo(1024 - 156, 288);
  ctx.quadraticCurveTo(1024 - 110, 275, 1024 - 64, 290);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(1024 + 64, 290);
  ctx.quadraticCurveTo(1024 + 110, 275, 1024 + 156, 288);
  ctx.stroke();

  // Draw Left & Right Eyes based on eyeState ("open", "blink", "happy")
  const drawEye = (cx, cy, isLeft) => {
    const dir = isLeft ? -1 : 1;
    ctx.save();

    if (eyeState === "blink") {
      // Peaceful closed sleeping/blinking eye curve with winged outer lashes
      ctx.strokeStyle = "#09080c";
      ctx.lineWidth = 11;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx - dir * 56, cy + 16);
      ctx.quadraticCurveTo(cx, cy + 34, cx + dir * 64, cy + 12);
      ctx.stroke();

      // Winged outer lash flick
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx + dir * 54, cy + 14);
      ctx.lineTo(cx + dir * 72, cy + 4);
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (eyeState === "happy") {
      // Joyful kawaii ^ ^ arched smiling eye
      ctx.strokeStyle = "#09080c";
      ctx.lineWidth = 12;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx - dir * 54, cy + 20);
      ctx.quadraticCurveTo(cx, cy - 26, cx + dir * 62, cy + 14);
      ctx.stroke();

      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx + dir * 52, cy + 4);
      ctx.lineTo(cx + dir * 70, cy - 6);
      ctx.stroke();
      ctx.restore();
      return;
    }

    // --- DEFAULT "OPEN": Half-Lidded Chill Kawaii Obsidian Anime Eyes (Exact match to aria-front.jpg!) ---
    // 1. Crisp porcelain-white sclera
    ctx.fillStyle = "#f9f7f4";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 5, 63, 41, isLeft ? 0.04 : -0.04, 0, Math.PI * 2);
    ctx.fill();

    // Subtle upper-sclera shadow from heavy upper lashes
    const scleraShadow = ctx.createLinearGradient(cx, cy - 34, cx, cy + 10);
    scleraShadow.addColorStop(0, "rgba(45, 35, 35, 0.35)");
    scleraShadow.addColorStop(1, "rgba(45, 35, 35, 0)");
    ctx.fillStyle = scleraShadow;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 5, 63, 41, isLeft ? 0.04 : -0.04, 0, Math.PI * 2);
    ctx.fill();

    // 2. Large Deep Obsidian-Black Iris filling center of eye
    const irisGrad = ctx.createLinearGradient(cx, cy - 36, cx, cy + 44);
    irisGrad.addColorStop(0, "#040407");
    irisGrad.addColorStop(0.62, "#0e0f15");
    irisGrad.addColorStop(1, "#2f323d");
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 4, 50, 39, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Soft slate-grey lower crescent reflection inside dark iris (matches screenshot!)
    ctx.fillStyle = "rgba(115, 120, 138, 0.42)";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 22, 33, 13, 0, 0, Math.PI);
    ctx.fill();

    // 4. Deep velvet-black center pupil
    ctx.fillStyle = "#030305";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 2, 26, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // 5. Subtle glossy studio catchlight glint (gives life & polish without breaking the dark-eye look)
    ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
    ctx.beginPath();
    ctx.ellipse(cx - dir * 18, cy - 8, 7, 4.5, -0.25, 0, Math.PI * 2);
    ctx.fill();

    // 6. Thick Sweeping Jet-Black Upper Eyelash Line (Slightly half-lidded chill curve)
    ctx.strokeStyle = "#070609";
    ctx.lineWidth = 15;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx - dir * 56, cy + 5);
    ctx.quadraticCurveTo(cx, cy - 41, cx + dir * 64, cy - 2);
    ctx.stroke();

    // Winged outer upper lash spikes
    ctx.lineWidth = 5.8;
    ctx.beginPath();
    ctx.moveTo(cx + dir * 51, cy - 11);
    ctx.lineTo(cx + dir * 71, cy - 23);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + dir * 58, cy + 3);
    ctx.lineTo(cx + dir * 74, cy + 1);
    ctx.stroke();

    // 7. Delicate Lower Lash Line & Outer Lower Lash Ticks
    ctx.strokeStyle = "#181316";
    ctx.lineWidth = 4.2;
    ctx.beginPath();
    ctx.moveTo(cx - dir * 46, cy + 36);
    ctx.quadraticCurveTo(cx, cy + 46, cx + dir * 58, cy + 28);
    ctx.stroke();

    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(cx + dir * 44, cy + 34);
    ctx.lineTo(cx + dir * 55, cy + 43);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - dir * 32, cy + 38);
    ctx.lineTo(cx - dir * 41, cy + 45);
    ctx.stroke();

    ctx.restore();
  };

  drawEye(1024 - 112, 348, true);
  drawEye(1024 + 112, 348, false);

  // Cute Little ":3" Cat Smile in the Center
  ctx.strokeStyle = "#3a2218";
  ctx.lineWidth = 4.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const mouthW = eyeState === "happy" ? 27 : 22;
  const mouthDepth = eyeState === "happy" ? 474 : 470;
  ctx.beginPath();
  ctx.moveTo(1024 - mouthW, 461);
  ctx.quadraticCurveTo(1024 - mouthW * 0.5, mouthDepth, 1024, 460);
  ctx.quadraticCurveTo(1024 + mouthW * 0.5, mouthDepth, 1024 + mouthW, 461);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

// High-Res Cocoa-Brown Overalls & Khaki Sailor-Collar Shirt Texture (1024x1024)
function createOverallsTorsoTexture(mode = "front") {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  ctx.scale(2, 2); // Keep 512x512 coordinate space at 2x crispness

  // Warm oat-khaki undershirt base (#bfa88e)
  ctx.fillStyle = "#bfa88e";
  ctx.fillRect(0, 0, 512, 512);

  // Soft vertical fabric folds on khaki shirt
  const shirtGrad = ctx.createLinearGradient(0, 0, 512, 0);
  shirtGrad.addColorStop(0, "rgba(75, 52, 32, 0.22)");
  shirtGrad.addColorStop(0.3, "rgba(245, 232, 215, 0.08)");
  shirtGrad.addColorStop(0.5, "rgba(95, 68, 44, 0.14)");
  shirtGrad.addColorStop(0.7, "rgba(245, 232, 215, 0.08)");
  shirtGrad.addColorStop(1, "rgba(75, 52, 32, 0.22)");
  ctx.fillStyle = shirtGrad;
  ctx.fillRect(0, 0, 512, 512);

  if (mode === "front") {
    // 1. Cream-White Pointed Sailor/Peter-Pan Collar at top neck
    ctx.fillStyle = "#f2eadc";
    ctx.strokeStyle = "#1e120a";
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";

    // Left collar flap
    ctx.beginPath();
    ctx.moveTo(142, 0);
    ctx.lineTo(214, 112);
    ctx.lineTo(256, 38);
    ctx.lineTo(256, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right collar flap
    ctx.beginPath();
    ctx.moveTo(370, 0);
    ctx.lineTo(298, 112);
    ctx.lineTo(256, 38);
    ctx.lineTo(256, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Subtle vertical placket seam under collar
    ctx.strokeStyle = "rgba(90, 64, 42, 0.38)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(256, 44);
    ctx.lineTo(256, 255);
    ctx.stroke();

    // 2. Deep Cocoa-Brown Overalls Bib & Straps (#593d25)
    const bibGrad = ctx.createLinearGradient(0, 0, 0, 512);
    bibGrad.addColorStop(0, "#63452b");
    bibGrad.addColorStop(0.6, "#573b23");
    bibGrad.addColorStop(1, "#48301b");
    ctx.fillStyle = bibGrad;
    ctx.strokeStyle = "#1c1008";
    ctx.lineWidth = 12;

    ctx.beginPath();
    ctx.moveTo(90, 0);
    ctx.lineTo(156, 0);
    ctx.quadraticCurveTo(164, 254, 256, 254);
    ctx.quadraticCurveTo(348, 254, 356, 0);
    ctx.lineTo(422, 0);
    ctx.quadraticCurveTo(400, 290, 466, 490);
    ctx.lineTo(512, 490);
    ctx.lineTo(512, 512);
    ctx.lineTo(0, 512);
    ctx.lineTo(0, 490);
    ctx.lineTo(46, 490);
    ctx.quadraticCurveTo(112, 290, 90, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Two Cream Spiral Strap Buttons on Overalls Bib
    const drawSpiralButton = (bx, by) => {
      ctx.fillStyle = "#2b190e";
      ctx.beginPath();
      ctx.arc(bx, by, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ede2ce";
      ctx.lineWidth = 5.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(bx, by, 15, 0.2, Math.PI * 1.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bx, by, 7.5, Math.PI * 0.4, Math.PI * 1.55);
      ctx.stroke();
    };
    drawSpiralButton(132, 240);
    drawSpiralButton(380, 240);

    // Center Front Pouch Pocket on Bib
    ctx.fillStyle = "#7c5b3e";
    ctx.strokeStyle = "#1c1008";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(184, 362);
    ctx.quadraticCurveTo(256, 384, 328, 362);
    ctx.lineTo(318, 446);
    ctx.quadraticCurveTo(256, 496, 194, 446);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cream horizontal stripe across front pocket
    ctx.strokeStyle = "#dfd0b8";
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(198, 412);
    ctx.quadraticCurveTo(256, 434, 314, 412);
    ctx.stroke();
  } else if (mode === "back") {
    // Back of Overalls (Matches aria-back.jpg: two slightly V-tapered straps + waist band)
    ctx.fillStyle = "#593d25";
    ctx.strokeStyle = "#1c1008";
    ctx.lineWidth = 12;

    // Left back strap
    ctx.beginPath();
    ctx.moveTo(86, 0);
    ctx.lineTo(156, 0);
    ctx.lineTo(172, 410);
    ctx.lineTo(104, 410);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right back strap
    ctx.beginPath();
    ctx.moveTo(356, 0);
    ctx.lineTo(426, 0);
    ctx.lineTo(408, 410);
    ctx.lineTo(340, 410);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Lower back waist band
    ctx.beginPath();
    ctx.rect(0, 392, 512, 120);
    ctx.fill();
    ctx.stroke();
  } else {
    // Side of torso: Khaki shirt top + dark-brown overall side panel at bottom
    ctx.fillStyle = "#ede4d4";
    ctx.strokeStyle = "#1c1008";
    ctx.lineWidth = 8;
    // Double collar trim stripe at top of shoulder/side
    ctx.fillRect(0, 0, 512, 26);
    ctx.strokeRect(0, 0, 512, 26);

    ctx.fillStyle = "#593d25";
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
  texture.anisotropy = 4;
  return texture;
}

// High-Res Explorer Arm Texture (Khaki Sleeve + Cream Double-Stripe Cuff + Peach Forearm + Stitched Bracer)
function createExplorerArmTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  ctx.scale(2, 2);

  // 1. Top Khaki Short Sleeve (0..148)
  ctx.fillStyle = "#bfa88e";
  ctx.fillRect(0, 0, 256, 148);

  // Cream sleeve cuff band with two crisp black outline stripes (144..184)
  ctx.fillStyle = "#f2eadc";
  ctx.fillRect(0, 144, 256, 40);
  ctx.strokeStyle = "#1c1008";
  ctx.lineWidth = 6.5;
  ctx.beginPath();
  ctx.moveTo(0, 144);
  ctx.lineTo(256, 144);
  ctx.moveTo(0, 164);
  ctx.lineTo(256, 164);
  ctx.moveTo(0, 184);
  ctx.lineTo(256, 184);
  ctx.stroke();

  // 2. Forearm in Warm Porcelain-Peach Skin (184..382)
  ctx.fillStyle = "#dfc3aa";
  ctx.fillRect(0, 184, 256, 198);

  // 3. Dark Cocoa-Brown Wristband Bracer (382..512)
  const bracerGrad = ctx.createLinearGradient(0, 382, 256, 512);
  bracerGrad.addColorStop(0, "#523822");
  bracerGrad.addColorStop(0.5, "#3e2917");
  bracerGrad.addColorStop(1, "#4d341f");
  ctx.fillStyle = bracerGrad;
  ctx.fillRect(0, 382, 256, 130);

  // Crisp dark top border on wristband
  ctx.strokeStyle = "#160c06";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, 382);
  ctx.lineTo(256, 382);
  ctx.stroke();

  // Tan zig-zag embroidery stitching along top of wristband (Exact match to reference photos!)
  ctx.strokeStyle = "#c2a37b";
  ctx.lineWidth = 3.8;
  ctx.lineJoin = "round";
  for (let x = 6; x < 256; x += 13) {
    ctx.beginPath();
    ctx.moveTo(x, 396);
    ctx.lineTo(x + 4, 420);
    ctx.lineTo(x + 9, 397);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

// High-Res Leg & Sherpa Fur Boot Texture (512x1024)
function createBootLegTexture(includeFrontDetails = false) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  ctx.scale(2, 2);

  // 1. Bare Upper Thigh in Warm Porcelain-Peach Skin (0..186)
  ctx.fillStyle = "#dfc3aa";
  ctx.fillRect(0, 0, 256, 186);

  if (includeFrontDetails) {
    // Signature Soft Oval Rosy-Tan Knee Blush in center of thigh (aria-front.jpg)
    const kneeGrad = ctx.createRadialGradient(128, 96, 6, 128, 96, 58);
    kneeGrad.addColorStop(0, "rgba(205, 146, 122, 0.68)");
    kneeGrad.addColorStop(0.6, "rgba(205, 146, 122, 0.28)");
    kneeGrad.addColorStop(1, "rgba(205, 146, 122, 0)");
    ctx.fillStyle = kneeGrad;
    ctx.beginPath();
    ctx.ellipse(128, 96, 58, 28, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Fluffy Snowy-White Sherpa Fur Cuff Band (182..264)
  const furGrad = ctx.createLinearGradient(0, 182, 0, 264);
  furGrad.addColorStop(0, "#ffffff");
  furGrad.addColorStop(0.55, "#f2f0eb");
  furGrad.addColorStop(1, "#d5d0c7");
  ctx.fillStyle = furGrad;
  ctx.fillRect(0, 182, 256, 82);

  // Subtle fluffy fur tufts texture
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  for (let x = 8; x < 256; x += 18) {
    ctx.beginPath();
    ctx.arc(x, 248, 9, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tan & Cocoa Braided Trim directly under the white fur cuff (260..284)
  ctx.fillStyle = "#4d341e";
  ctx.fillRect(0, 260, 256, 24);
  ctx.fillStyle = "#a88763";
  for (let x = 6; x < 256; x += 20) {
    ctx.beginPath();
    ctx.roundRect(x, 265, 11, 13, 4);
    ctx.fill();
  }

  // 3. Rich Cocoa-Brown Winter Boot Shaft (284..512)
  const bootGrad = ctx.createLinearGradient(0, 284, 256, 512);
  bootGrad.addColorStop(0, "#563b22");
  bootGrad.addColorStop(0.45, "#634529");
  bootGrad.addColorStop(1, "#3f2a17");
  ctx.fillStyle = bootGrad;
  ctx.fillRect(0, 284, 256, 228);

  if (includeFrontDetails) {
    // Subtle dark string shadow lines behind the 3D pom-pom cords
    ctx.strokeStyle = "rgba(24, 12, 5, 0.65)";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(112, 268);
    ctx.quadraticCurveTo(96, 320, 96, 368);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(138, 268);
    ctx.quadraticCurveTo(150, 332, 150, 392);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

// Continuous Dino Tail Texture (Buttery Yellow + Warm Apricot Stripes + Terracotta Spots!)
function createDinoTailTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  // Buttery Cream-Yellow Base (#ecd18f)
  ctx.fillStyle = "#ecd18f";
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft Warm Amber/Apricot Curved Tiger-Dino Stripes across the upper back/sides
  ctx.fillStyle = "#e1ae70";
  const stripeVPositions = [180, 340, 500, 660, 810];
  stripeVPositions.forEach((vy) => {
    ctx.beginPath();
    ctx.ellipse(512, vy, 460, 48, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Signature Cluster of Terracotta-Reddish-Brown Spots on both sides (Matches aria-left.jpg & aria-right.jpg!)
  ctx.fillStyle = "#9d4a3e";
  const drawSpotCluster = (cx, cy, dir) => {
    // Large main spot
    ctx.beginPath();
    ctx.ellipse(cx, cy, 52, 64, dir * 0.15, 0, Math.PI * 2);
    ctx.fill();
    // 3 smaller satellite spots around it (like a cute dino print!)
    ctx.beginPath();
    ctx.ellipse(cx - dir * 56, cy - 42, 24, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + dir * 52, cy - 36, 22, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + dir * 18, cy + 78, 26, 30, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  // Left side (u ~ 0.25 -> x ~ 256) and Right side (u ~ 0.75 -> x ~ 768)
  drawSpotCluster(250, 390, -1);
  drawSpotCluster(774, 410, 1);

  // Extra cute spots near the curled tip
  ctx.beginPath();
  ctx.arc(260, 860, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(764, 860, 28, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// Segmented Cream-White Dino Underbelly Texture (with subtle tan transverse ribs)
function createDinoBellyTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f0ede6";
  ctx.fillRect(0, 0, 512, 1024);

  // Subtle warm cream edge shading
  const sideGrad = ctx.createLinearGradient(0, 0, 512, 0);
  sideGrad.addColorStop(0, "#dfd7c8");
  sideGrad.addColorStop(0.18, "#f2efe9");
  sideGrad.addColorStop(0.82, "#f2efe9");
  sideGrad.addColorStop(1, "#dfd7c8");
  ctx.fillStyle = sideGrad;
  ctx.fillRect(0, 0, 512, 1024);

  // Tan horizontal segment lines (matching aria-back.jpg & aria-left.jpg!)
  ctx.strokeStyle = "#d5c6ad";
  ctx.lineWidth = 10;
  for (let y = 48; y < 1024; y += 68) {
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.quadraticCurveTo(256, y + 14, 492, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// Reflective Steampunk Aviator Goggle Lens Texture
function createGoggleLensTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, "#8d949c");
  grad.addColorStop(0.45, "#d6dce2");
  grad.addColorStop(0.75, "#9ea5ad");
  grad.addColorStop(1, "#747b82");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Crisp diagonal cel-shaded white glass reflection bands
  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.beginPath();
  ctx.moveTo(50, 512);
  ctx.lineTo(340, 0);
  ctx.lineTo(430, 0);
  ctx.lineTo(140, 512);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.beginPath();
  ctx.moveTo(190, 512);
  ctx.lineTo(470, 0);
  ctx.lineTo(505, 0);
  ctx.lineTo(225, 512);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Soft Ground Contact Shadow Texture
function createShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(256, 256, 24, 256, 256, 235);
  grad.addColorStop(0, "rgba(62, 42, 26, 0.34)");
  grad.addColorStop(0.45, "rgba(62, 42, 26, 0.16)");
  grad.addColorStop(0.78, "rgba(62, 42, 26, 0.04)");
  grad.addColorStop(1, "rgba(62, 42, 26, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  return new THREE.CanvasTexture(canvas);
}

// Rounded Trapezoid Ray Shape for the Floating Yellow Comic Burst (!)
function createComicRayShape(wBottom = 0.08, wTop = 0.18, height = 0.42) {
  const shape = new THREE.Shape();
  const r = 0.032;
  shape.moveTo(-wBottom / 2 + r, 0);
  shape.lineTo(wBottom / 2 - r, 0);
  shape.quadraticCurveTo(wBottom / 2, 0, wTop / 2, height - r);
  shape.quadraticCurveTo(wTop / 2, height, wTop / 2 - r, height);
  shape.lineTo(-wTop / 2 + r, height);
  shape.quadraticCurveTo(-wTop / 2, height, -wBottom / 2, r);
  shape.quadraticCurveTo(-wBottom / 2, 0, -wBottom / 2 + r, 0);
  return shape;
}

// -----------------------------------------------------------------------------
// 3. MAIN STUDIO 3D AVATAR COMPONENT
// -----------------------------------------------------------------------------

const AriaRunwayAvatar = ({
  isExploded = false,
  cameraAngle = "front",
  activeEmote = null,
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, width / height, 0.3, 100);
    camera.position.set(0, 0.22, 6.75);

    // WebGL Renderer + Studio IBL Environment (RoomEnvironment)
    let renderer;
    let dom;
    let pmremGenerator;
    let envTarget;
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
      renderer.toneMappingExposure = 1.04;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(dom);

      // Authentic Studio Image-Based Lighting (IBL) for metallic & soft subsurface polish
      pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();
      envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.045);
      scene.environment = envTarget.texture;
      if ("environmentIntensity" in scene) {
        scene.environmentIntensity = 0.48;
      }
    } catch (err) {
      console.warn("WebGL initialization failed:", err);
      return;
    }

    // Warm Cream, Butter-Yellow & Soft Peach Studio Lighting (Matches the 4 reference photos!)
    const hemiLight = new THREE.HemisphereLight(0xfffdf6, 0xeadbc8, 1.75);
    hemiLight.position.set(0, 6, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffcf5, 1.55);
    keyLight.position.set(3.4, 5.4, 6.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 16;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const warmSunRim = new THREE.SpotLight(0xfff2ba, 2.4, 18, Math.PI / 2.2, 0.65);
    warmSunRim.position.set(-4.2, 3.8, -3.2);
    scene.add(warmSunRim);

    const softPeachFill = new THREE.PointLight(0xffece2, 1.35, 14);
    softPeachFill.position.set(3.2, -1.2, 4.2);
    scene.add(softPeachFill);

    // Master Avatar Group
    const avatarMasterGroup = new THREE.Group();
    avatarMasterGroup.scale.set(0.96, 0.96, 0.96);
    const initialOffsetX = window.innerWidth >= 1024 ? 0.74 : 0;
    avatarMasterGroup.position.set(initialOffsetX, -0.04, 0);
    scene.add(avatarMasterGroup);

    // Textures
    const headTexOpen = createExplorerHeadTexture("open");
    const headTexBlink = createExplorerHeadTexture("blink");
    const headTexHappy = createExplorerHeadTexture("happy");
    const brushedHairTex = createBrushedHairTexture();
    const torsoFrontTex = createOverallsTorsoTexture("front");
    const torsoBackTex = createOverallsTorsoTexture("back");
    const torsoSideTex = createOverallsTorsoTexture("side");
    const armTex = createExplorerArmTexture();
    const legFrontTex = createBootLegTexture(true);
    const legPlainTex = createBootLegTexture(false);
    const dinoTailTex = createDinoTailTexture();
    const dinoBellyTex = createDinoBellyTexture();
    const goggleLensTex = createGoggleLensTexture();
    const shadowTex = createShadowTexture();

    // Studio Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xdfc3aa,
      roughness: 0.58,
      metalness: 0.01,
    });

    const robloxHeadMat = new THREE.MeshStandardMaterial({
      map: headTexOpen,
      roughness: 0.52,
      metalness: 0.01,
    });

    // Brushed Milk-Tea Hair Materials (3 subtle tonal layers for lush anime depth)
    const milkTeaHairMat = new THREE.MeshStandardMaterial({
      map: brushedHairTex,
      color: 0xf7f2ee,
      roughness: 0.44,
      metalness: 0.03,
    });

    const milkTeaHighlightMat = new THREE.MeshStandardMaterial({
      map: brushedHairTex,
      color: 0xffffff,
      roughness: 0.38,
      metalness: 0.05,
    });

    const milkTeaShadowMat = new THREE.MeshStandardMaterial({
      map: brushedHairTex,
      color: 0xe3d5c8,
      roughness: 0.48,
      metalness: 0.02,
    });

    // Steampunk Goggle Materials
    const darkLeatherMat = new THREE.MeshStandardMaterial({
      color: 0x2e1c12,
      roughness: 0.38,
      metalness: 0.12,
    });

    const strapBlackBrownMat = new THREE.MeshStandardMaterial({
      color: 0x21140d,
      roughness: 0.46,
      metalness: 0.06,
    });

    const silverRimMat = new THREE.MeshStandardMaterial({
      color: 0xc8cfd6,
      roughness: 0.2,
      metalness: 0.86,
    });

    const goggleLensMat = new THREE.MeshPhysicalMaterial({
      map: goggleLensTex,
      roughness: 0.12,
      metalness: 0.25,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });

    // Outfit Materials
    const torsoFrontMat = new THREE.MeshStandardMaterial({
      map: torsoFrontTex,
      roughness: 0.55,
    });
    const torsoBackMat = new THREE.MeshStandardMaterial({
      map: torsoBackTex,
      roughness: 0.55,
    });
    const torsoSideMat = new THREE.MeshStandardMaterial({
      map: torsoSideTex,
      roughness: 0.55,
    });
    const khakiTopMat = new THREE.MeshStandardMaterial({
      color: 0xbfa88e,
      roughness: 0.58,
    });
    const cocoaOverallsMat = new THREE.MeshStandardMaterial({
      color: 0x593d25,
      roughness: 0.52,
    });
    const darkOutlineMat = new THREE.MeshStandardMaterial({
      color: 0x1e1109,
      roughness: 0.62,
    });
    const creamCollarMat = new THREE.MeshStandardMaterial({
      color: 0xf2eadc,
      roughness: 0.48,
    });
    const armMat = new THREE.MeshStandardMaterial({
      map: armTex,
      roughness: 0.54,
    });
    const legFrontMat = new THREE.MeshStandardMaterial({
      map: legFrontTex,
      roughness: 0.52,
    });
    const legPlainMat = new THREE.MeshStandardMaterial({
      map: legPlainTex,
      roughness: 0.52,
    });
    const bootSoleMat = new THREE.MeshStandardMaterial({
      color: 0x3a2513,
      roughness: 0.48,
    });
    const whitePomMat = new THREE.MeshStandardMaterial({
      color: 0xf7f5f0,
      roughness: 0.72,
    });

    // Continuous Dino Tail & Berry-Red Bow Materials
    const dinoTailMat = new THREE.MeshStandardMaterial({
      map: dinoTailTex,
      roughness: 0.5,
    });
    const dinoBellyMat = new THREE.MeshStandardMaterial({
      map: dinoBellyTex,
      roughness: 0.54,
    });
    const dinoSpikeMat = new THREE.MeshStandardMaterial({
      color: 0x8a2e2b,
      roughness: 0.42,
    });
    const redBowMat = new THREE.MeshStandardMaterial({
      color: 0xa63e3a,
      roughness: 0.44,
    });
    const redBowCreaseMat = new THREE.MeshStandardMaterial({
      color: 0x7d2926,
      roughness: 0.48,
    });

    // Floating Yellow Comic Burst Material
    const comicYellowMat = new THREE.MeshStandardMaterial({
      color: 0xfff220,
      emissive: 0xffd900,
      emissiveIntensity: 0.62,
      roughness: 0.18,
    });
    const comicBorderMat = new THREE.MeshStandardMaterial({
      color: 0xf0be00,
      emissive: 0xe0aa00,
      emissiveIntensity: 0.4,
      roughness: 0.25,
    });

    // Ground Contact Shadow
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 1.9),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.42;
    avatarMasterGroup.add(shadowPlane);

    // Character Model Group Hierarchy
    const characterGroup = new THREE.Group();
    characterGroup.position.y = -0.04;
    avatarMasterGroup.add(characterGroup);

    const bodyCoreGroup = new THREE.Group();
    const headRigGroup = new THREE.Group(); // Allows natural head tilt & cursor look!
    headRigGroup.position.set(0, 1.05, 0);

    const headGroup = new THREE.Group();
    const hairGroup = new THREE.Group();
    const gogglesGroup = new THREE.Group();
    headRigGroup.add(headGroup, hairGroup, gogglesGroup);

    const shortsGroup = new THREE.Group();
    const tailGroup = new THREE.Group();
    const legsAndShoesGroup = new THREE.Group();
    const sparkGroup = new THREE.Group();

    characterGroup.add(bodyCoreGroup);
    characterGroup.add(headRigGroup);
    characterGroup.add(shortsGroup);
    characterGroup.add(tailGroup);
    characterGroup.add(legsAndShoesGroup);
    characterGroup.add(sparkGroup);

    // Note: Inside headRigGroup (origin at y = 1.05), local y = worldY - 1.05
    const HY = -1.05;

    // --- 1. HEAD & NECK ---
    const robloxHeadGeo = createRobloxHeadGeometry(0.47, 0.92);
    const headMesh = new THREE.Mesh(robloxHeadGeo, robloxHeadMat);
    headMesh.position.y = 1.5 + HY;
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.25, 0.22, 32), skinMat);
    neckMesh.position.set(0, 1.01 + HY, 0);
    headGroup.add(neckMesh);

    // --- 2. SCULPTED MILK-TEA FEATHERED WOLF-CUT HAIR (NO CONES!) ---
    // Upper Left & Right Sculpted Crown Hemispheres (forming a natural center part groove)
    const crownL = new THREE.Mesh(new THREE.SphereGeometry(0.485, 36, 28), milkTeaHairMat);
    crownL.scale.set(0.94, 0.82, 1.06);
    crownL.position.set(-0.09, 1.72 + HY, -0.02);

    const crownR = new THREE.Mesh(new THREE.SphereGeometry(0.485, 36, 28), milkTeaHairMat);
    crownR.scale.set(0.94, 0.82, 1.06);
    crownR.position.set(0.09, 1.72 + HY, -0.02);
    hairGroup.add(crownL, crownR);

    // Full Back Cranium Volume Dome
    const backSkullDome = new THREE.Mesh(new THREE.SphereGeometry(0.51, 36, 28), milkTeaHairMat);
    backSkullDome.scale.set(1.02, 0.88, 1.04);
    backSkullDome.position.set(0, 1.66 + HY, -0.06);
    hairGroup.add(backSkullDome);

    // Cute Curved Ahoge Sprout Lock at Top Center Part
    const ahogeGeo = createCurvedHairLockGeo(
      [
        new THREE.Vector3(0.0, 2.02 + HY, 0.02),
        new THREE.Vector3(-0.03, 2.13 + HY, 0.05),
        new THREE.Vector3(0.05, 2.18 + HY, 0.04),
        new THREE.Vector3(0.11, 2.11 + HY, 0.02),
      ],
      0.045,
      0.022,
      18,
      10
    );
    const ahogeMesh = new THREE.Mesh(ahogeGeo, milkTeaHighlightMat);
    hairGroup.add(ahogeMesh);

    // Forehead Bangs: 9 Sculpted Curved Ribbon Locks (Matches aria-front.jpg parted fringe!)
    const bangConfigs = [
      { x: -0.34, tipX: -0.38, yEnd: 1.44, zPush: 0.36, w: 0.13, mat: milkTeaShadowMat },
      { x: -0.25, tipX: -0.27, yEnd: 1.49, zPush: 0.43, w: 0.115, mat: milkTeaHairMat },
      { x: -0.16, tipX: -0.16, yEnd: 1.53, zPush: 0.47, w: 0.095, mat: milkTeaHighlightMat },
      { x: -0.07, tipX: -0.06, yEnd: 1.54, zPush: 0.49, w: 0.088, mat: milkTeaHairMat },
      { x: 0.01, tipX: 0.02, yEnd: 1.55, zPush: 0.495, w: 0.082, mat: milkTeaHighlightMat },
      { x: 0.09, tipX: 0.1, yEnd: 1.54, zPush: 0.49, w: 0.09, mat: milkTeaHairMat },
      { x: 0.18, tipX: 0.19, yEnd: 1.53, zPush: 0.465, w: 0.098, mat: milkTeaHighlightMat },
      { x: 0.26, tipX: 0.28, yEnd: 1.49, zPush: 0.425, w: 0.115, mat: milkTeaHairMat },
      { x: 0.34, tipX: 0.39, yEnd: 1.44, zPush: 0.355, w: 0.13, mat: milkTeaShadowMat },
    ];

    bangConfigs.forEach((b) => {
      const lockGeo = createCurvedHairLockGeo(
        [
          new THREE.Vector3(b.x * 0.82, 1.91 + HY, b.zPush * 0.72),
          new THREE.Vector3(b.x * 0.96, 1.77 + HY, b.zPush * 0.98),
          new THREE.Vector3(b.tipX * 0.98, 1.63 + HY, b.zPush * 1.03),
          new THREE.Vector3(b.tipX, b.yEnd + HY, b.zPush * 0.97),
        ],
        b.w,
        0.038,
        20,
        12,
        0.8,
        1.25
      );
      const lockMesh = new THREE.Mesh(lockGeo, b.mat);
      hairGroup.add(lockMesh);
    });

    // Cheek-Framing Inward-Curving Wolf-Cut Locks & Feathered Side Wisps (Left & Right)
    [-1, 1].forEach((s) => {
      // 1. Primary Inner Cheek-Framing Lock (curves down around cheek and curls inward onto chest)
      const innerCheekGeo = createCurvedHairLockGeo(
        [
          new THREE.Vector3(s * 0.38, 1.82 + HY, 0.22),
          new THREE.Vector3(s * 0.49, 1.54 + HY, 0.24),
          new THREE.Vector3(s * 0.45, 1.24 + HY, 0.25),
          new THREE.Vector3(s * 0.34, 0.98 + HY, 0.26),
          new THREE.Vector3(s * 0.27, 0.78 + HY, 0.25),
        ],
        0.21,
        0.058,
        28,
        14,
        0.85,
        1.3
      );
      hairGroup.add(new THREE.Mesh(innerCheekGeo, milkTeaHighlightMat));

      // 2. Secondary Cheek-Framing Lock (hugs the jawline and curves inward toward the collar)
      const jawCurlGeo = createCurvedHairLockGeo(
        [
          new THREE.Vector3(s * 0.42, 1.74 + HY, 0.12),
          new THREE.Vector3(s * 0.52, 1.44 + HY, 0.16),
          new THREE.Vector3(s * 0.47, 1.18 + HY, 0.20),
          new THREE.Vector3(s * 0.34, 1.02 + HY, 0.23),
        ],
        0.18,
        0.05,
        24,
        12,
        0.85,
        1.4
      );
      hairGroup.add(new THREE.Mesh(jawCurlGeo, milkTeaHairMat));

      // 3. Upper Outward-Sweeping Feathered Wolf-Cut Flare (Matches wispy side silhouette!)
      const upperFlareGeo = createCurvedHairLockGeo(
        [
          new THREE.Vector3(s * 0.44, 1.76 + HY, 0.06),
          new THREE.Vector3(s * 0.56, 1.62 + HY, 0.04),
          new THREE.Vector3(s * 0.68, 1.48 + HY, 0.01),
          new THREE.Vector3(s * 0.76, 1.36 + HY, -0.02),
        ],
        0.13,
        0.036,
        20,
        12,
        0.75,
        1.5
      );
      hairGroup.add(new THREE.Mesh(upperFlareGeo, milkTeaHighlightMat));

      // 4. Mid Outward-Curving Wispy Strand
      const midFlareGeo = createCurvedHairLockGeo(
        [
          new THREE.Vector3(s * 0.46, 1.64 + HY, -0.02),
          new THREE.Vector3(s * 0.58, 1.44 + HY, -0.03),
          new THREE.Vector3(s * 0.66, 1.24 + HY, -0.04),
          new THREE.Vector3(s * 0.63, 1.06 + HY, -0.02),
        ],
        0.14,
        0.04,
        20,
        12,
        0.8,
        1.45
      );
      hairGroup.add(new THREE.Mesh(midFlareGeo, milkTeaHairMat));

      // 5. Lower Shoulder-Skimming Side Lock
      const lowerSideGeo = createCurvedHairLockGeo(
        [
          new THREE.Vector3(s * 0.45, 1.54 + HY, -0.1),
          new THREE.Vector3(s * 0.53, 1.28 + HY, -0.1),
          new THREE.Vector3(s * 0.51, 1.04 + HY, -0.08),
          new THREE.Vector3(s * 0.55, 0.86 + HY, -0.06),
        ],
        0.16,
        0.045,
        22,
        12,
        0.8,
        1.35
      );
      hairGroup.add(new THREE.Mesh(lowerSideGeo, milkTeaShadowMat));
    });

    // Back Feathered Shoulder-Length Hair Curtain (11 Sculpted Curved Locks matching aria-back.jpg!)
    for (let i = -5; i <= 5; i++) {
      const t = i / 5;
      const angle = t * 0.95; // Wraps around the back hemisphere
      const sinA = Math.sin(angle);
      const cosA = Math.cos(angle);

      const yBottom = 0.84 + Math.abs(t) * 0.08;
      const flareOut = 1.08 + Math.abs(t) * 0.06;

      const backStrandGeo = createCurvedHairLockGeo(
        [
          new THREE.Vector3(sinA * 0.42, 1.82 + HY, -cosA * 0.42 - 0.04),
          new THREE.Vector3(sinA * 0.49, 1.55 + HY, -cosA * 0.48 - 0.05), // Slight inward pinch under goggle strap
          new THREE.Vector3(sinA * 0.48, 1.24 + HY, -cosA * 0.47 - 0.05),
          new THREE.Vector3(sinA * 0.46 * flareOut, yBottom + HY, -cosA * 0.49 - 0.08),
        ],
        0.2,
        0.055,
        24,
        12,
        0.9,
        1.35
      );
      const mat =
        Math.abs(i) % 3 === 0
          ? milkTeaHighlightMat
          : Math.abs(i) % 2 === 0
          ? milkTeaHairMat
          : milkTeaShadowMat;
      hairGroup.add(new THREE.Mesh(backStrandGeo, mat));
    }

    // --- 3. STEAMPUNK / AVIATOR GOGGLES ON FOREHEAD + CONTOURED BACK STRAP ---
    // Contoured Dark-Brown Leather Strap wrapping from goggles around the back of the head
    const strapPoints = [];
    const strapSteps = 48;
    for (let i = 0; i <= strapSteps; i++) {
      const theta = (i / strapSteps) * Math.PI * 2;
      const sx = Math.sin(theta) * 0.515;
      const sz = Math.cos(theta) * 0.515 - 0.03;
      // High on forehead (cos=1 -> y=1.84), slanting down across back of hair (cos=-1 -> y=1.50)
      const sy = 1.67 + Math.cos(theta) * 0.18 - (sz < 0 ? Math.pow(Math.sin(theta), 2) * 0.02 : 0);
      strapPoints.push(new THREE.Vector3(sx, sy + HY, sz));
    }
    const strapCurve = new THREE.CatmullRomCurve3(strapPoints, true);
    const goggleStrapMesh = new THREE.Mesh(
      new THREE.TubeGeometry(strapCurve, 64, 0.028, 12, true),
      strapBlackBrownMat
    );
    gogglesGroup.add(goggleStrapMesh);

    // Detailed Left & Right Aviator Goggle Cups
    const createGoggleEyeCup = (isLeft) => {
      const s = isLeft ? -1 : 1;
      const cupGroup = new THREE.Group();
      cupGroup.position.set(s * 0.225, 1.88 + HY, 0.37);
      cupGroup.rotation.x = -0.46;
      cupGroup.rotation.y = s * 0.25;
      cupGroup.rotation.z = s * -0.1;

      // 1. Thick Contoured Dark-Espresso Leather Cushion Ring
      const leatherCushion = new THREE.Mesh(
        new THREE.TorusGeometry(0.185, 0.062, 20, 40),
        darkLeatherMat
      );
      leatherCushion.scale.set(1.04, 0.96, 1.15);
      cupGroup.add(leatherCushion);

      // Inner dark housing cylinder
      const housingBarrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.175, 0.185, 0.08, 36, 1, true),
        darkLeatherMat
      );
      housingBarrel.rotation.x = Math.PI / 2;
      housingBarrel.position.z = 0.01;
      cupGroup.add(housingBarrel);

      // 2. Channeled Brushed-Silver Metallic Bezel Rim
      const silverBezel = new THREE.Mesh(
        new THREE.TorusGeometry(0.162, 0.026, 20, 40),
        silverRimMat
      );
      silverBezel.scale.set(1.04, 0.96, 1.0);
      silverBezel.position.z = 0.044;
      cupGroup.add(silverBezel);

      // 4 Raised Rectangular Silver Lug Notches around the Bezel (Matches reference photos!)
      const lugAngles = [0.35, -0.35, Math.PI - 0.35, Math.PI + 0.35];
      lugAngles.forEach((ang) => {
        const lug = new THREE.Mesh(
          new THREE.BoxGeometry(0.042, 0.032, 0.045),
          silverRimMat
        );
        lug.position.set(Math.cos(ang) * 0.178, Math.sin(ang) * 0.165, 0.04);
        lug.rotation.z = ang;
        cupGroup.add(lug);
      });

      // 3. Slightly Convex Reflective Glass Lens
      const glassLens = new THREE.Mesh(
        new THREE.SphereGeometry(0.162, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.32),
        goggleLensMat
      );
      glassLens.scale.set(1.04, 0.96, 0.45);
      glassLens.position.z = 0.012;
      cupGroup.add(glassLens);

      // 4. Outer Silver Strap Hinge Clasp
      const sideHinge = new THREE.Mesh(
        new THREE.BoxGeometry(0.065, 0.075, 0.085),
        silverRimMat
      );
      sideHinge.position.set(s * 0.215, -0.01, -0.015);
      cupGroup.add(sideHinge);

      return cupGroup;
    };

    // Silver Center Nose-Bridge with X-Crossbar Embossing (Matches aria-front.jpg!)
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(0, 1.91 + HY, 0.42);
    bridgeGroup.rotation.x = -0.46;

    const bridgeBase = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.052, 0.055), silverRimMat);
    const bridgeCross1 = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.016, 0.062), silverRimMat);
    bridgeCross1.rotation.z = 0.48;
    const bridgeCross2 = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.016, 0.062), silverRimMat);
    bridgeCross2.rotation.z = -0.48;
    bridgeGroup.add(bridgeBase, bridgeCross1, bridgeCross2);

    gogglesGroup.add(createGoggleEyeCup(true), createGoggleEyeCup(false), bridgeGroup);

    // --- 4. TAPERED TORSO, 3D ROSETTE PIN BADGE & FLARED OVERALL SHORTS ---
    const torsoMaterials = [
      torsoSideMat, // right
      torsoSideMat, // left
      khakiTopMat, // top
      cocoaOverallsMat, // bottom
      torsoFrontMat, // front
      torsoBackMat, // back
    ];
    const torsoGeo = createTaperedTorsoGeo(0.86, 0.78, 0.44);
    const torsoMesh = new THREE.Mesh(torsoGeo, torsoMaterials);
    torsoMesh.position.y = 0.56;
    torsoMesh.castShadow = true;
    bodyCoreGroup.add(torsoMesh);

    // 3D Relieved Flower/Gear Rosette Pin Badge on Her Left Chest Strap (viewer's right)
    const badgeGroup = new THREE.Group();
    badgeGroup.position.set(0.17, 0.71, 0.225);

    for (let a = 0; a < Math.PI * 2; a += Math.PI / 5) {
      const petal = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.016, 12), creamCollarMat);
      petal.rotation.x = Math.PI / 2;
      petal.position.set(Math.cos(a) * 0.042, Math.sin(a) * 0.042, 0);
      badgeGroup.add(petal);
    }
    const badgeCenter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.032, 0.022, 20),
      cocoaOverallsMat
    );
    badgeCenter.rotation.x = Math.PI / 2;
    badgeCenter.position.z = 0.004;
    badgeGroup.add(badgeCenter);
    bodyCoreGroup.add(badgeGroup);

    // Stepped Flared Overalls Shorts / Hip Block (RoundedBoxGeometry for smooth studio bevels)
    const waistStep = new THREE.Mesh(
      new RoundedBoxGeometry(0.92, 0.11, 0.49, 4, 0.025),
      cocoaOverallsMat
    );
    waistStep.position.y = 0.15;
    shortsGroup.add(waistStep);

    const createShortLegBlock = (isLeft) => {
      const s = isLeft ? -1 : 1;
      const shortGroup = new THREE.Group();
      shortGroup.position.set(s * 0.245, 0.02, 0);
      shortGroup.rotation.z = s * -0.05;

      const shortBox = new THREE.Mesh(
        new RoundedBoxGeometry(0.49, 0.23, 0.52, 4, 0.035),
        cocoaOverallsMat
      );
      shortGroup.add(shortBox);

      // Crisp dark-brown bottom hem outline on shorts
      const hemLine = new THREE.Mesh(
        new RoundedBoxGeometry(0.498, 0.034, 0.528, 3, 0.01),
        darkOutlineMat
      );
      hemLine.position.y = -0.1;
      shortGroup.add(hemLine);

      return shortGroup;
    };
    shortsGroup.add(createShortLegBlock(true), createShortLegBlock(false));

    // --- 5. BEVELED ARMS, STITCHED WRISTBANDS & SCULPTED BLOCKY C-HANDS ---
    const cHandGeo = createRobloxCHandGeometry();

    const createExplorerArm = (isLeft) => {
      const s = isLeft ? -1 : 1;
      const armPivot = new THREE.Group();
      armPivot.position.set(s * 0.5, 0.88, 0);
      armPivot.rotation.z = s * -0.33; // Signature outward A-stance matching reference photos

      const armGeo = new RoundedBoxGeometry(0.32, 0.84, 0.32, 4, 0.045);
      const armMesh = new THREE.Mesh(armGeo, armMat);
      armMesh.position.y = -0.36;
      armMesh.castShadow = true;
      armPivot.add(armMesh);

      // Sculpted Blocky C-Hand (Matches reference photos!)
      const cHand = new THREE.Mesh(cHandGeo, skinMat);
      cHand.position.y = -0.88;
      cHand.rotation.z = -Math.PI / 2 + s * -0.12;
      cHand.castShadow = true;
      armPivot.add(cHand);

      return armPivot;
    };
    const leftArmPivot = createExplorerArm(true);
    const rightArmPivot = createExplorerArm(false);
    bodyCoreGroup.add(leftArmPivot, rightArmPivot);

    // --- 6. CONTINUOUS CURLED DINO TAIL + RIBBED BELLY + GRAND BERRY-RED BOW ---
    const tailSpinePoints = [
      new THREE.Vector3(0, 0.26, -0.2),
      new THREE.Vector3(0, 0.14, -0.52),
      new THREE.Vector3(0, 0.02, -0.84),
      new THREE.Vector3(0, 0.01, -1.14),
      new THREE.Vector3(0, 0.14, -1.36),
      new THREE.Vector3(0, 0.34, -1.45),
      new THREE.Vector3(0, 0.47, -1.35),
      new THREE.Vector3(0, 0.45, -1.2),
      new THREE.Vector3(0, 0.35, -1.19),
      new THREE.Vector3(0, 0.35, -1.27),
    ];
    const tailCurve = new THREE.CatmullRomCurve3(tailSpinePoints);

    // Smooth continuous yellow/striped/spotted tail body
    const continuousTailMesh = new THREE.Mesh(
      createContinuousDinoTailGeo(tailCurve, 72, 28),
      dinoTailMat
    );
    continuousTailMesh.castShadow = true;
    tailGroup.add(continuousTailMesh);

    // Smooth continuous segmented cream-white underbelly strip
    const continuousBellyMesh = new THREE.Mesh(
      createDinoBellyStripGeo(tailCurve, 68, 14),
      dinoBellyMat
    );
    tailGroup.add(continuousBellyMesh);

    // Rounded end-cap at the very tip of the snail spiral
    const spiralTipCap = new THREE.Mesh(new THREE.SphereGeometry(0.036, 16, 16), dinoTailMat);
    spiralTipCap.position.set(0, 0.35, -1.27);
    tailGroup.add(spiralTipCap);

    // Dark-Red Conical Dino Spikes along the top ridge (Matches aria-left.jpg & aria-back.jpg!)
    const spikeConfigs = [
      { y: 0.44, z: -0.39, rotX: -0.28, scale: 1.05 },
      { y: 0.31, z: -0.66, rotX: -0.5, scale: 0.96 },
    ];
    spikeConfigs.forEach((sc) => {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.068, 0.175, 20), dinoSpikeMat);
      spike.position.set(0, sc.y, sc.z);
      spike.rotation.x = sc.rotX;
      spike.scale.setScalar(sc.scale);
      tailGroup.add(spike);
    });

    // Grand Puffy Berry-Red Ribbon Bow + White Ruffled Lace Trim on the Tail!
    const tailBowGroup = new THREE.Group();
    tailBowGroup.position.set(0, 0.15, -0.58);

    // Center bow knot saddle over the tail
    const bowCenterKnot = new THREE.Mesh(
      new RoundedBoxGeometry(0.18, 0.16, 0.16, 4, 0.04),
      redBowMat
    );
    bowCenterKnot.position.set(0, 0.06, -0.08);
    tailBowGroup.add(bowCenterKnot);

    const ribbonTails = [];
    const createTailBowSide = (isLeft) => {
      const s = isLeft ? -1 : 1;
      const sideBow = new THREE.Group();

      // Sculpted puffy crimson bow loop (wide enough to peek behind her right hip from Front!)
      const bowWing = new THREE.Mesh(
        new RoundedBoxGeometry(0.34, 0.25, 0.17, 5, 0.055),
        redBowMat
      );
      bowWing.position.set(s * 0.26, 0.02, 0.06);
      bowWing.rotation.z = s * -0.14;
      bowWing.rotation.y = s * 0.26;
      sideBow.add(bowWing);

      // Subtle darker crimson inner bow dimple/crease
      const bowCrease = new THREE.Mesh(
        new RoundedBoxGeometry(0.18, 0.045, 0.18, 3, 0.015),
        redBowCreaseMat
      );
      bowCrease.position.set(s * 0.22, 0.02, 0.06);
      bowCrease.rotation.z = s * -0.14;
      bowCrease.rotation.y = s * 0.26;
      sideBow.add(bowCrease);

      // White scalloped lace frill peeking out along the outer edge of the red bow!
      for (let f = -2.5; f <= 2.5; f += 1) {
        const frill = new THREE.Mesh(
          new THREE.SphereGeometry(0.048, 16, 16),
          whitePomMat
        );
        frill.scale.set(0.7, 1.0, 0.85);
        frill.position.set(
          s * (0.415 - Math.abs(f) * 0.008),
          0.02 + f * 0.038,
          0.11
        );
        sideBow.add(frill);
      }

      // Long hanging notched crimson ribbon tail (sways gently in animation loop!)
      const ribbonPivot = new THREE.Group();
      ribbonPivot.position.set(s * 0.21, -0.06, -0.26);

      const ribbonTailGeo = createCurvedHairLockGeo(
        [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(s * 0.04, -0.22, -0.04),
          new THREE.Vector3(s * 0.07, -0.46, -0.05),
          new THREE.Vector3(s * 0.08, -0.66, -0.02),
        ],
        0.13,
        0.032,
        18,
        10,
        0.9,
        0.4
      );
      const ribbonMesh = new THREE.Mesh(ribbonTailGeo, redBowMat);
      ribbonPivot.add(ribbonMesh);
      ribbonTails.push({ pivot: ribbonPivot, side: s });
      sideBow.add(ribbonPivot);

      return sideBow;
    };

    tailBowGroup.add(createTailBowSide(true), createTailBowSide(false));
    tailGroup.add(tailBowGroup);

    // --- 7. BEVELED CHIBI LEGS, FLUSH SHERPA FUR CUFFS & SWAYING POM-POMS ---
    const pomGroups = [];
    const createBootLeg = (isLeft) => {
      const s = isLeft ? -1 : 1;
      const legPivot = new THREE.Group();
      legPivot.position.set(s * 0.24, -0.1, 0);
      legPivot.rotation.z = s * -0.048;

      const legMaterials = [
        legPlainMat,
        legPlainMat,
        skinMat,
        bootSoleMat,
        legFrontMat, // Front has knee blush & pom-pom strings
        legPlainMat,
      ];
      const legGeo = new RoundedBoxGeometry(0.45, 1.12, 0.46, 5, 0.048);
      const legMesh = new THREE.Mesh(legGeo, legMaterials);
      legMesh.position.y = -0.58;
      legMesh.castShadow = true;
      legPivot.add(legMesh);

      // Flush 3D Fluffy White Sherpa Fur Cuff Collar (Softly rounded, not a jutting block!)
      const furCuff = new THREE.Mesh(
        new RoundedBoxGeometry(0.468, 0.165, 0.478, 5, 0.055),
        whitePomMat
      );
      furCuff.position.y = -0.505;
      legPivot.add(furCuff);

      // 3D Dark-Brown Strings + Fluffy White Pom-Pom Balls on the Front of Each Boot
      const pomHolder = new THREE.Group();
      pomHolder.position.set(0, -0.58, 0.235);

      const cordLCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.02, 0.02, 0),
        new THREE.Vector3(-0.055, -0.1, 0.015),
        new THREE.Vector3(-0.06, -0.2, 0.012),
      ]);
      const cordLCyl = new THREE.Mesh(
        new THREE.TubeGeometry(cordLCurve, 12, 0.009, 8, false),
        darkOutlineMat
      );

      const cordRCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.02, 0.02, 0),
        new THREE.Vector3(0.048, -0.12, 0.015),
        new THREE.Vector3(0.052, -0.25, 0.012),
      ]);
      const cordRCyl = new THREE.Mesh(
        new THREE.TubeGeometry(cordRCurve, 12, 0.009, 8, false),
        darkOutlineMat
      );

      const pomLeft = new THREE.Mesh(new THREE.SphereGeometry(0.044, 18, 18), whitePomMat);
      pomLeft.position.set(-0.06, -0.21, 0.015);

      const pomRight = new THREE.Mesh(new THREE.SphereGeometry(0.044, 18, 18), whitePomMat);
      pomRight.position.set(0.052, -0.26, 0.015);

      pomHolder.add(cordLCyl, cordRCyl, pomLeft, pomRight);
      pomGroups.push(pomHolder);
      legPivot.add(pomHolder);

      // Beveled Stepped Cocoa Boot Sole at bottom
      const bootSole = new THREE.Mesh(
        new RoundedBoxGeometry(0.466, 0.11, 0.495, 4, 0.03),
        bootSoleMat
      );
      bootSole.position.set(0, -1.15, 0.01);
      legPivot.add(bootSole);

      return legPivot;
    };

    legsAndShoesGroup.add(createBootLeg(true), createBootLeg(false));

    // --- 8. FLOATING BRIGHT-YELLOW COMIC 3-RAY BURST SYMBOL (!) ---
    const buildComicRay = (wB, wT, h) => {
      const shape = createComicRayShape(wB, wT, h);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.045,
        bevelEnabled: true,
        bevelThickness: 0.016,
        bevelSize: 0.014,
        bevelSegments: 3,
      });
      geo.center();
      const mesh = new THREE.Mesh(geo, comicYellowMat);

      const borderMesh = new THREE.Mesh(geo, comicBorderMat);
      borderMesh.scale.set(1.13, 1.09, 0.85);
      borderMesh.position.z = -0.005;
      const group = new THREE.Group();
      group.add(borderMesh, mesh);
      return group;
    };

    sparkGroup.position.set(-0.82, 1.92, 0.36);

    const rayTop = buildComicRay(0.09, 0.16, 0.26);
    rayTop.position.set(0.18, 0.22, 0);
    rayTop.rotation.z = -0.15;

    const rayMid = buildComicRay(0.11, 0.24, 0.44);
    rayMid.position.set(-0.08, 0.12, 0);
    rayMid.rotation.z = 0.58;

    const rayBot = buildComicRay(0.09, 0.19, 0.34);
    rayBot.position.set(-0.18, -0.18, 0);
    rayBot.rotation.z = 1.25;

    sparkGroup.add(rayTop, rayMid, rayBot);

    // Subtle Warm Floating Studio Sparkles in Background
    const bgParticleGroup = new THREE.Group();
    scene.add(bgParticleGroup);
    const bgMotes = [];
    const moteGeo = new THREE.OctahedronGeometry(0.055, 0);

    for (let i = 0; i < 16; i++) {
      const pMesh = new THREE.Mesh(
        moteGeo,
        i % 2 === 0 ? comicYellowMat : whitePomMat
      );
      const s = 0.45 + Math.random() * 0.65;
      pMesh.scale.setScalar(s);
      pMesh.position.set(
        (Math.random() - 0.5) * 9.5,
        (Math.random() - 0.5) * 6.5 + 0.4,
        (Math.random() - 0.5) * 2.5 - 2.6
      );
      pMesh.userData = {
        speedY: Math.random() * 0.0038 + 0.0016,
        swaySpeed: Math.random() * 1.2 + 0.6,
        swayOffset: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      };
      bgMotes.push(pMesh);
      bgParticleGroup.add(pMesh);
    }

    // --- 9. INTERACTION, BLINK ENGINE, EMOTES & ANIMATION LOOP ---
    let mouseX = 0,
      mouseY = 0;
    let isDragging = false;
    let dragX = 0,
      dragY = 0;
    let lastMouseX = 0,
      lastMouseY = 0;
    let scrollProgress = 0;
    let targetScroll = 0;

    // Natural Blinking State
    let nextBlinkTime = 2.4;
    let blinkEndTime = 0;
    let currentEyeMode = "open";

    const setEyeTexture = (mode) => {
      if (currentEyeMode === mode) return;
      currentEyeMode = mode;
      robloxHeadMat.map =
        mode === "happy" ? headTexHappy : mode === "blink" ? headTexBlink : headTexOpen;
      robloxHeadMat.needsUpdate = true;
    };

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
        dragX += deltaX * 0.007;
        dragY += deltaY * 0.006;
        dragY = Math.max(-0.32, Math.min(0.32, dragY));
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

      // Emote check ("wave" or "jump")
      const emote = window.currentAriaEmote;

      // Natural Blinking & Happy Emote Eyes
      if (emote === "wave" || emote === "jump") {
        setEyeTexture("happy");
      } else if (time > nextBlinkTime) {
        if (time < blinkEndTime) {
          setEyeTexture("blink");
        } else {
          setEyeTexture("open");
          nextBlinkTime = time + 2.8 + Math.random() * 2.6;
          blinkEndTime = nextBlinkTime + 0.14;
        }
      } else {
        setEyeTexture("open");
      }

      // Outfit Deconstruct ("Pop Outfit Apart")
      let scrollExplode = 0;
      if (scrollProgress > 0.25 && scrollProgress < 0.5) {
        scrollExplode = Math.min(0.55, Math.max(0.0, (scrollProgress - 0.25) / 0.2));
      }
      const currentExplode = Math.max(scrollExplode, window.explodedWardrobeOverride || 0);

      gogglesGroup.position.y = currentExplode * 0.46;
      hairGroup.position.y = currentExplode * 0.22;
      tailGroup.position.z = -currentExplode * 0.48;
      shortsGroup.position.y = -currentExplode * 0.14;
      legsAndShoesGroup.position.y = -currentExplode * 0.36;

      // Alive Breathing & Emote Motion
      const breath = Math.sin(time * 2.2);
      const jumpArc =
        emote === "jump" ? Math.abs(Math.sin(time * 7.5)) * 0.32 : 0;

      // Right arm wave animation when emote === "wave"
      if (emote === "wave") {
        const targetWaveZ = 2.35 + Math.sin(time * 11) * 0.28;
        rightArmPivot.rotation.z += (targetWaveZ - rightArmPivot.rotation.z) * 0.18;
        rightArmPivot.rotation.x += (-0.25 - rightArmPivot.rotation.x) * 0.18;
      } else {
        const idleRightZ = -0.33 - breath * 0.025;
        rightArmPivot.rotation.z += (idleRightZ - rightArmPivot.rotation.z) * 0.12;
        rightArmPivot.rotation.x += (0 - rightArmPivot.rotation.x) * 0.12;
      }
      leftArmPivot.rotation.z = 0.33 + breath * 0.025;

      // Natural Subtle Head Tracking toward Cursor
      const lookYaw = mouseX * 0.18;
      const lookPitch = -mouseY * 0.1 + Math.sin(time * 1.5) * 0.02;
      const headTilt =
        emote === "wave" ? 0.12 : Math.sin(time * 1.1) * 0.025 - mouseX * 0.04;
      headRigGroup.rotation.y += (lookYaw - headRigGroup.rotation.y) * 0.09;
      headRigGroup.rotation.x += (lookPitch - headRigGroup.rotation.x) * 0.09;
      headRigGroup.rotation.z += (headTilt - headRigGroup.rotation.z) * 0.09;

      // Ahoge sprout gentle springy bounce
      ahogeMesh.rotation.z = Math.sin(time * 3.4) * 0.08;

      // Yellow Comic Burst (!) lively pulse & float
      const sparkSpeed = emote ? 7.5 : 4.0;
      const sparkPulse = 1 + Math.sin(time * sparkSpeed) * 0.065;
      sparkGroup.scale.setScalar(sparkPulse);
      sparkGroup.position.y = 1.92 + Math.sin(time * 2.8) * 0.04 + currentExplode * 0.36;
      sparkGroup.position.x = -0.82 - currentExplode * 0.32;

      // Lively Dino Tail Wag + Ribbon Tails Sway + Boot Pom-Poms Sway
      const wagFreq = emote ? 6.5 : 2.5;
      const wagAmp = emote ? 0.18 : 0.085;
      tailGroup.rotation.y = Math.sin(time * wagFreq) * wagAmp;
      tailGroup.rotation.x = Math.cos(time * (wagFreq * 0.5)) * 0.025;

      ribbonTails.forEach((rt) => {
        rt.pivot.rotation.z = rt.side * 0.05 + Math.sin(time * wagFreq - 0.6) * 0.09;
        rt.pivot.rotation.x = 0.08 + Math.cos(time * 2.2) * 0.04;
      });

      pomGroups.forEach((pg, idx) => {
        pg.rotation.z = Math.sin(time * 3.0 + idx) * 0.05;
      });

      // Position Aria on the right stage on desktop when at the top Hero section
      const isDesktop = window.innerWidth >= 1024;
      const heroRightOffset = isDesktop ? Math.max(0, 1 - scrollProgress * 4.2) * 0.74 : 0;
      avatarMasterGroup.position.x += (heroRightOffset - avatarMasterGroup.position.x) * 0.08;

      // Gentle floating bob + jump arc
      const floatBob = Math.sin(time * 2.1) * 0.05;
      avatarMasterGroup.position.y = -0.04 + floatBob + jumpArc;
      characterGroup.rotation.z = Math.sin(time * 1.3) * 0.012;

      // Dynamic shadow scale with jump/float height
      const shadowScale = Math.max(0.65, 1 - (floatBob + jumpArc) * 0.45);
      shadowPlane.scale.setScalar(shadowScale);

      // Camera Positioning & View Presets (Front, Back/Tail, Left Profile, Right Profile, 360 Orbit)
      const viewMode = window.currentCameraAngle || "front";
      let targetCamZ = 6.65 - Math.sin(scrollProgress * Math.PI) * 0.35;
      let targetCamY = 0.22 - scrollProgress * 0.14;

      if (viewMode === "wing" || viewMode === "back") {
        targetCamZ = 6.25;
        targetCamY = 0.24;
      } else if (viewMode === "left" || viewMode === "right") {
        targetCamZ = 6.35;
        targetCamY = 0.22;
      } else if (viewMode === "orbit") {
        targetCamZ = 6.85;
      }

      camera.position.z += (targetCamZ - camera.position.z) * 0.06;
      camera.position.y += (targetCamY - camera.position.y) * 0.06;

      let baseAngleY = Math.sin(time * 0.5) * 0.12;
      if (viewMode === "wing" || viewMode === "back") {
        // Back & Tail View (matches aria-back.jpg!)
        baseAngleY = Math.PI + Math.sin(time * 0.5) * 0.1;
      } else if (viewMode === "left") {
        // Left Profile View (matches aria-left.jpg!)
        baseAngleY = -Math.PI * 0.5 + Math.sin(time * 0.5) * 0.08;
      } else if (viewMode === "right") {
        // Right Profile View (matches aria-right.jpg!)
        baseAngleY = Math.PI * 0.5 + Math.sin(time * 0.5) * 0.08;
      } else if (viewMode === "orbit") {
        baseAngleY = time * 0.78;
      }

      // Reset manual drag when user clicks a preset camera button
      if (window.resetAvatarDrag) {
        dragX *= 0.82;
        dragY *= 0.82;
        if (Math.abs(dragX) < 0.005 && Math.abs(dragY) < 0.005) {
          dragX = 0;
          dragY = 0;
          window.resetAvatarDrag = false;
        }
      }

      const targetRotX = dragY + mouseY * 0.08;
      const targetRotY = dragX + mouseX * 0.18 + baseAngleY;

      avatarMasterGroup.rotation.x += (targetRotX - avatarMasterGroup.rotation.x) * 0.08;
      avatarMasterGroup.rotation.y += (targetRotY - avatarMasterGroup.rotation.y) * 0.08;

      // Drift ambient background sparkles upward
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
      if (envTarget) envTarget.dispose();
      if (pmremGenerator) pmremGenerator.dispose();
      if (renderer) renderer.dispose();
    };
  }, []);

  useEffect(() => {
    window.explodedWardrobeOverride = isExploded ? 1.0 : 0.0;
  }, [isExploded]);

  useEffect(() => {
    window.currentCameraAngle = cameraAngle;
    window.resetAvatarDrag = true;
  }, [cameraAngle]);

  useEffect(() => {
    window.currentAriaEmote = activeEmote;
  }, [activeEmote]);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default AriaRunwayAvatar;
