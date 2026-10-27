import * as THREE from 'three';

// Utility to generate photorealistic procedural canvas textures with zero external asset dependencies

export const createWoodFloorTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base luxury warm oak / modern grey-washed tone
  ctx.fillStyle = '#222831';
  ctx.fillRect(0, 0, 1024, 1024);

  const plankHeight = 64;
  const numPlanks = 1024 / plankHeight;

  for (let i = 0; i < numPlanks; i++) {
    const y = i * plankHeight;
    // Alternate plank shade slightly
    const shade = 35 + ((i * 17) % 15);
    ctx.fillStyle = `rgb(${shade + 5}, ${shade + 8}, ${shade + 12})`;
    ctx.fillRect(0, y, 1024, plankHeight - 2);

    // Plank seam bevel
    ctx.fillStyle = '#0f141c';
    ctx.fillRect(0, y + plankHeight - 2, 1024, 2);

    // Staggered vertical plank joints
    const offset = ((i * 380) % 1024);
    for (let x = offset; x < 1024; x += 340) {
      ctx.fillStyle = '#0a0d13';
      ctx.fillRect(x, y, 2, plankHeight - 2);
    }
  }

  // Subtle grain noise
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let j = 0; j < data.length; j += 4) {
    const noise = (Math.random() - 0.5) * 8;
    data[j] = Math.max(0, Math.min(255, data[j] + noise));
    data[j + 1] = Math.max(0, Math.min(255, data[j + 1] + noise));
    data[j + 2] = Math.max(0, Math.min(255, data[j + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 4);
  return texture;
};

export const createCarpetTexture = (colorHex: string): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, 512, 512);

  // Woven textured loop pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let x = 0; x < 512; x += 4) {
    ctx.fillRect(x, 0, 1, 512);
  }
  for (let y = 0; y < 512; y += 4) {
    ctx.fillRect(0, y, 512, 1);
  }

  // Subtle noise
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let j = 0; j < data.length; j += 4) {
    const noise = (Math.random() - 0.5) * 12;
    data[j] = Math.max(0, Math.min(255, data[j] + noise));
    data[j + 1] = Math.max(0, Math.min(255, data[j + 1] + noise));
    data[j + 2] = Math.max(0, Math.min(255, data[j + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
};

export const createCodeScreenTexture = (
  accentColor: string,
  fileName: string = 'worker.ts'
): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;

  // IDE dark background
  ctx.fillStyle = '#181b20';
  ctx.fillRect(0, 0, 512, 320);

  // Top window header
  ctx.fillStyle = '#111317';
  ctx.fillRect(0, 0, 512, 32);

  // Mac/Linux style window dots
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(14, 16, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(30, 16, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(46, 16, 5, 0, Math.PI * 2);
  ctx.fill();

  // Active Tab
  ctx.fillStyle = '#22272e';
  ctx.fillRect(70, 4, 130, 28);
  ctx.fillStyle = '#e6edf3';
  ctx.font = 'bold 12px monospace';
  ctx.fillText(fileName, 82, 22);

  // Gutter background
  ctx.fillStyle = '#14161b';
  ctx.fillRect(0, 32, 40, 288);

  // Line numbers
  ctx.fillStyle = '#6e7681';
  ctx.font = '10px monospace';
  for (let i = 1; i <= 14; i++) {
    ctx.fillText(`${i}`, 14, 38 + i * 19);
  }

  // Syntax highlighted code lines
  const codeLines = [
    { text: 'import { SwarmAgent } from "@swarm/core";', color: '#79c0ff' },
    { text: 'export class AutonomousWorker {', color: '#ff7b72' },
    { text: '  private status = "RUNNING";', color: '#d2a8ff' },
    { text: '  async executeLifecycle(task) {', color: '#79c0ff' },
    { text: '    const result = await task.run();', color: '#ffa657' },
    { text: '    if (!result.verified) {', color: '#ff7b72' },
    { text: '      throw new Defect("QA failed");', color: '#f0883e' },
    { text: '    }', color: '#ff7b72' },
    { text: '    return reportToSenior(result);', color: '#7ee787' },
    { text: '  }', color: '#ff7b72' },
    { text: '}', color: '#ff7b72' },
    { text: '// Connected to Orchestrator EventBus', color: '#8b949e' },
    { text: 'console.log("Ready for deployment");', color: '#a5d6ff' },
  ];

  ctx.font = '11px monospace';
  codeLines.forEach((line, idx) => {
    ctx.fillStyle = line.color;
    ctx.fillText(line.text, 50, 57 + idx * 19);
  });

  // Glowing status accent on the bottom border
  ctx.fillStyle = accentColor;
  ctx.fillRect(0, 316, 512, 4);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

export const createWhiteboardTexture = (title: string): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Whiteboard glossy surface
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 1024, 512);

  // Title
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(title, 40, 50);

  // Subtitle
  ctx.fillStyle = '#64748b';
  ctx.font = '16px sans-serif';
  ctx.fillText('Autonomous Engineering Swarm • System Architecture & DAG State Machine', 40, 80);

  // Draw DAG boxes & arrows
  const drawBox = (x: number, y: number, w: number, h: number, text: string, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(text, x + 15, y + 26);
  };

  drawBox(40, 120, 160, 42, '1. Aditya (Chief)', '#1e293b');
  drawBox(260, 120, 170, 42, '2. Giriraj (Lead)', '#6b21a8');
  drawBox(490, 120, 160, 42, '3. Rohan (Dev)', '#1d4ed8');
  drawBox(710, 120, 160, 42, '4. Abhishek (QA)', '#047857');
  drawBox(710, 220, 160, 42, '5. Ashish (Test)', '#059669');
  drawBox(490, 220, 170, 42, '6. Defect Fix', '#b91c1c');
  drawBox(260, 220, 170, 42, '7. Harshit (DevOps)', '#c2410c');
  drawBox(40, 220, 160, 42, '8. Verified Complete', '#0f766e');

  // Connecting arrows
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(200, 141);
  ctx.lineTo(260, 141);
  ctx.moveTo(430, 141);
  ctx.lineTo(490, 141);
  ctx.moveTo(650, 141);
  ctx.lineTo(710, 141);
  ctx.moveTo(790, 162);
  ctx.lineTo(790, 220);
  ctx.stroke();

  // Sticky notes (Yellow, Pink, Cyan)
  const drawSticky = (x: number, y: number, text: string, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 90, 75);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(text, x + 8, y + 22);
  };

  drawSticky(60, 350, 'BA Gate: Pass', '#fef08a');
  drawSticky(180, 350, '18 Agents OK', '#fed7aa');
  drawSticky(300, 350, 'Zero-Trust Gate', '#fbcfe8');
  drawSticky(420, 350, 'VM Fleet: Staged', '#a7f3d0');

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};
