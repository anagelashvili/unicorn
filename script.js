const video = document.querySelector("#camera");
const snapshotCanvas = document.querySelector("#snapshotCanvas");
const overlayCanvas = document.querySelector("#overlayCanvas");
const pixelCanvas = document.querySelector("#pixelCanvas");
const videoWrap = document.querySelector(".video-wrap");
const clickMarker = document.querySelector("#clickMarker");
const startCameraButton = document.querySelector("#startCamera");
const captureButton = document.querySelector("#captureFrame");
const demoButton = document.querySelector("#demoFrame");
const liveButton = document.querySelector("#liveAnalysis");
const cameraStatus = document.querySelector("#cameraStatus");
const resolutionLabel = document.querySelector("#resolutionLabel");
const fpsLabel = document.querySelector("#fpsLabel");
const tensorShape = document.querySelector("#tensorShape");
const matrixReadout = document.querySelector("#matrixReadout");
const vectorBars = document.querySelector("#vectorBars");
const miniVector = document.querySelector("#miniVector");
const vectorCode = document.querySelector("#vectorCode");
const layerTitle = document.querySelector("#layerTitle");
const layerCopy = document.querySelector("#layerCopy");
const formulaBox = document.querySelector("#formulaBox");
const lessonList = document.querySelector("#lessonList");
const confidenceLabel = document.querySelector("#confidenceLabel");
const confidenceFill = document.querySelector("#confidenceFill");
const chatLog = document.querySelector("#chatLog");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const tutorDetails = document.querySelector("#tutorDetails");
const lessonStepButtons = document.querySelectorAll(".quest-step");
const generateSummaryButton = document.querySelector("#generateSummary");
const xpLabel = document.querySelector("#xpLabel");
const xpFill = document.querySelector("#xpFill");
const stageNumber = document.querySelector("#stageNumber");
const pixelBadge = document.querySelector("#pixelBadge");
const summaryBadge = document.querySelector("#summaryBadge");

const snapshotContext = snapshotCanvas.getContext("2d", { willReadFrequently: true });
const overlayContext = overlayCanvas.getContext("2d");
const pixelContext = pixelCanvas.getContext("2d");

let activeStream = null;
let currentImageData = null;
let currentStats = null;
let currentVector = [];
let liveAnalysis = true;
let frozen = false;
let frameCount = 0;
let lastFrameTime = performance.now();
let lastAnalysisTime = 0;
let scanOffset = 0;
let activeLessonIndex = 0;
let autoCycleLessons = false;
let selectedPoint = null;

function readSavedFlag(key) {
  try {
    return window.localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

function saveFlag(key) {
  try {
    window.localStorage.setItem(key, "true");
  } catch {
    // The app still works if the browser blocks local storage.
  }
}

let clickedPixel = readSavedFlag("clickedPixel");
let generatedSummary = readSavedFlag("generatedSummary");

const stages = [
  {
    key: "pixels",
    title: "Pixels - tiny squares start the story",
    copy: "Every image begins as small color squares. Click the frame and Nova will show the hidden color numbers.",
    formula: "I[y][x] = [R, G, B]",
  },
  {
    key: "matrix",
    title: "Numbers - AI's first language",
    copy:
      "Before AI understands a face or object, it reads a grid of numbers: row, column, and color channel.",
    formula: "frame.shape = [height, width, 3]",
  },
  {
    key: "edges",
    title: "Outlines - where shapes appear",
    copy:
      "Where light meets dark, AI draws a clue line. These outline clues help shapes emerge from the pixels.",
    formula: "edge(x,y) = |I(x,y)-I(x+1,y)| + |I(x,y)-I(x,y+1)|",
  },
  {
    key: "vector",
    title: "Fingerprint - your AI signature",
    copy:
      "The frame becomes a feature vector: a compact list of clues that acts like an AI fingerprint for this moment.",
    formula: "v = normalize(features(I))",
  },
  {
    key: "model",
    title: "The guess - AI compares patterns",
    copy:
      "A real model compares this fingerprint with patterns it learned before, then makes a prediction or explanation.",
    formula: "prediction = softmax(Wv + b)",
  },
];

function setStatus(message) {
  cameraStatus.textContent = message;
}

async function startCamera() {
  try {
    activeStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });
    video.srcObject = activeStream;
    await video.play();
    snapshotCanvas.style.display = "none";
    captureButton.disabled = false;
    frozen = false;
    liveAnalysis = true;
    liveButton.classList.add("active");
    setStatus("camera");
  } catch (error) {
    setStatus("blocked");
    layerTitle.textContent = "Camera blocked";
    layerCopy.textContent =
      "No stress. You can use Demo mode instead, and the learning experience still works.";
    console.error(error);
  }
}

function captureFrame() {
  if (!video.videoWidth || !video.videoHeight) return;
  snapshotCanvas.width = video.videoWidth;
  snapshotCanvas.height = video.videoHeight;
  snapshotContext.drawImage(video, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
  currentImageData = snapshotContext.getImageData(0, 0, snapshotCanvas.width, snapshotCanvas.height);
  snapshotCanvas.style.display = "block";
  frozen = true;
  liveAnalysis = false;
  liveButton.classList.remove("active");
  setStatus("frozen");
  analyzeFrame(currentImageData);
}

function useDemoFrame() {
  snapshotCanvas.width = 640;
  snapshotCanvas.height = 400;
  renderDemoPerson(performance.now());
  currentImageData = snapshotContext.getImageData(0, 0, snapshotCanvas.width, snapshotCanvas.height);
  snapshotCanvas.style.display = "block";
  frozen = false;
  liveAnalysis = true;
  liveButton.classList.add("active");
  setStatus("demo");
  analyzeFrame(currentImageData);
}

function toggleLiveAnalysis() {
  liveAnalysis = !liveAnalysis;
  frozen = false;
  snapshotCanvas.style.display = activeStream ? "none" : "block";
  liveButton.classList.toggle("active", liveAnalysis);
  setStatus(liveAnalysis ? (activeStream ? "camera" : "demo") : "paused");
}

function renderDemoPerson(time) {
  const width = snapshotCanvas.width;
  const height = snapshotCanvas.height;
  const x = width * 0.5 + Math.sin(time / 900) * 26;
  const y = height * 0.47 + Math.cos(time / 1100) * 12;

  const background = snapshotContext.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, "#0b1113");
  background.addColorStop(1, "#171013");
  snapshotContext.fillStyle = background;
  snapshotContext.fillRect(0, 0, width, height);

  snapshotContext.fillStyle = "#1b2a2c";
  for (let index = 0; index < 8; index += 1) {
    snapshotContext.fillRect(index * 90 - ((time / 35) % 90), 0, 2, height);
  }

  snapshotContext.fillStyle = "#c9926a";
  snapshotContext.beginPath();
  snapshotContext.arc(x, y - 76, 54, 0, Math.PI * 2);
  snapshotContext.fill();

  snapshotContext.fillStyle = "#20272a";
  snapshotContext.beginPath();
  snapshotContext.ellipse(x, y + 62, 128, 132, 0, 0, Math.PI * 2);
  snapshotContext.fill();

  snapshotContext.fillStyle = "#d2a17a";
  snapshotContext.fillRect(x - 32, y - 30, 64, 56);
  snapshotContext.fillStyle = "#111719";
  snapshotContext.beginPath();
  snapshotContext.ellipse(x - 18, y - 84, 8, 5, 0, 0, Math.PI * 2);
  snapshotContext.ellipse(x + 18, y - 84, 8, 5, 0, 0, Math.PI * 2);
  snapshotContext.fill();
}

function animationLoop(now) {
  frameCount += 1;
  const elapsed = now - lastFrameTime;
  if (elapsed > 500) {
    fpsLabel.textContent = `${Math.round((frameCount / elapsed) * 1000)} fps`;
    frameCount = 0;
    lastFrameTime = now;
  }

  if (!activeStream && !frozen && liveAnalysis) {
    renderDemoPerson(now);
    currentImageData = snapshotContext.getImageData(0, 0, snapshotCanvas.width, snapshotCanvas.height);
  }

  if (activeStream && liveAnalysis && !frozen && video.videoWidth && now - lastAnalysisTime > 120) {
    snapshotCanvas.width = video.videoWidth;
    snapshotCanvas.height = video.videoHeight;
    snapshotContext.drawImage(video, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
    currentImageData = snapshotContext.getImageData(0, 0, snapshotCanvas.width, snapshotCanvas.height);
  }

  if (currentImageData && liveAnalysis && now - lastAnalysisTime > 120) {
    analyzeFrame(currentImageData);
    lastAnalysisTime = now;
  }

  if (currentImageData) {
    drawPerceptionOverlay(currentImageData, now);
  }

  requestAnimationFrame(animationLoop);
}

function analyzeFrame(imageData) {
  currentStats = computeImageStats(imageData);
  currentVector = buildFeatureVector(currentStats);
  renderMatrixSample(imageData, currentStats);
  renderVector(currentVector);
  renderLessons(imageData, currentStats, currentVector);
  updateStageText();
}

function computeImageStats(imageData) {
  const { data, width, height } = imageData;
  let red = 0;
  let green = 0;
  let blue = 0;
  let brightness = 0;
  let edgeEnergy = 0;
  let edgeCount = 0;
  let saturated = 0;
  const buckets = new Array(24).fill(0);

  for (let y = 0; y < height - 2; y += 2) {
    for (let x = 0; x < width - 2; x += 2) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const light = (r + g + b) / 3;
      const edge = edgeAt(imageData, x, y);

      red += r;
      green += g;
      blue += b;
      brightness += light;
      edgeEnergy += edge;
      if (edge > 58) edgeCount += 1;
      if (Math.max(r, g, b) - Math.min(r, g, b) > 62) saturated += 1;
      buckets[Math.min(23, Math.floor(light / 11))] += 1;
    }
  }

  const sampled = Math.ceil((width * height) / 4);
  return {
    width,
    height,
    red: red / sampled,
    green: green / sampled,
    blue: blue / sampled,
    brightness: brightness / sampled,
    edgeEnergy: edgeEnergy / sampled,
    edgeRatio: edgeCount / sampled,
    saturation: saturated / sampled,
    buckets: buckets.map((bucket) => bucket / sampled),
  };
}

function edgeAt(imageData, x, y) {
  const width = imageData.width;
  const height = imageData.height;
  const center = brightnessAt(imageData, x, y);
  const right = brightnessAt(imageData, Math.min(x + 2, width - 1), y);
  const down = brightnessAt(imageData, x, Math.min(y + 2, height - 1));
  return Math.min(255, Math.abs(center - right) * 1.8 + Math.abs(center - down) * 1.8);
}

function brightnessAt(imageData, x, y) {
  const index = (y * imageData.width + x) * 4;
  return (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3;
}

function buildFeatureVector(stats) {
  return stats.buckets.map((bucket, index) => {
    const edgePull = stats.edgeRatio * (index % 2 === 0 ? 2.2 : 1.1);
    const colorPull = index % 3 === 0 ? stats.red / 255 : index % 3 === 1 ? stats.green / 255 : stats.blue / 255;
    const wave = Math.sin(scanOffset / 34 + index * 0.7) * 0.05;
    return Math.max(-0.99, Math.min(0.99, bucket * 9 - 0.45 + edgePull + colorPull * 0.32 + wave));
  });
}

function renderMatrixSample(imageData, stats) {
  const sampleSize = 14;
  const cellWidth = pixelCanvas.width / sampleSize;
  const cellHeight = pixelCanvas.height / sampleSize;
  const stepX = imageData.width / sampleSize;
  const stepY = imageData.height / sampleSize;

  pixelContext.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
  pixelContext.font = "9px Cascadia Mono, Consolas, monospace";
  pixelContext.textAlign = "center";
  pixelContext.textBaseline = "middle";

  for (let y = 0; y < sampleSize; y += 1) {
    for (let x = 0; x < sampleSize; x += 1) {
      const sourceX = Math.floor(x * stepX);
      const sourceY = Math.floor(y * stepY);
      const index = (sourceY * imageData.width + sourceX) * 4;
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      const edge = edgeAt(imageData, sourceX, sourceY);
      pixelContext.fillStyle = edge > 60 ? `rgba(53, 230, 198, ${0.3 + edge / 360})` : `rgb(${r}, ${g}, ${b})`;
      pixelContext.fillRect(x * cellWidth, y * cellHeight, cellWidth + 1, cellHeight + 1);
      pixelContext.strokeStyle = "rgba(255,255,255,0.12)";
      pixelContext.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);

      if (edge > 55 || (x + y + Math.floor(scanOffset / 12)) % 6 === 0) {
        pixelContext.fillStyle = edge > 60 ? "#03100d" : "rgba(238,247,244,0.78)";
        pixelContext.fillText(Math.round(edge).toString().padStart(3, "0"), x * cellWidth + cellWidth / 2, y * cellHeight + cellHeight / 2);
      }
    }
  }

  resolutionLabel.textContent = `${imageData.width} x ${imageData.height}`;
  tensorShape.textContent = `shape: ${imageData.height} x ${imageData.width} x 3`;
  matrixReadout.innerHTML = [
    ["pixels", `${(imageData.width * imageData.height).toLocaleString()} cells`, "each cell has RGB"],
    ["raw values", `${(imageData.width * imageData.height * 3).toLocaleString()} numbers`, "before ML"],
    ["avg RGB", `R ${stats.red.toFixed(1)} G ${stats.green.toFixed(1)}`, `B ${stats.blue.toFixed(1)}`],
    ["contour signal", `${stats.edgeEnergy.toFixed(1)} avg edge`, `${Math.round(stats.edgeRatio * 100)}% strong edges`],
  ]
    .map(([title, line1, line2]) => `<div class="matrix-cell"><strong>${title}</strong>${line1}<br>${line2}</div>`)
    .join("");
}

function renderVector(vector) {
  const bars = vector
    .map((value) => {
      const height = 7 + Math.abs(value) * 156;
      return `<div class="vector-bar" style="height:${height}px; opacity:${0.5 + Math.abs(value) * 0.5}"></div>`;
    })
    .join("");

  vectorBars.innerHTML = bars;
  miniVector.innerHTML = vector
    .slice(0, 12)
    .map((value) => `<span style="height:${8 + Math.abs(value) * 42}px"></span>`)
    .join("");

  const rows = [];
  for (let index = 0; index < vector.length; index += 6) {
    rows.push(
      vector
        .slice(index, index + 6)
        .map((value, localIndex) => `${value >= 0 ? " " : ""}${value.toFixed(3)}${index + localIndex === vector.length - 1 ? "" : ","}`)
        .join(" "),
    );
  }

  vectorCode.textContent = `v_person_frame = [
  ${rows.join("\n  ")}
]

edge_score = mean(|neighbor_pixel_difference|)
embedding = normalize(v_person_frame)
similarity = dot(embedding, learned_patterns)`;
}

function renderLessons(imageData, stats, vector) {
  const pixels = imageData.width * imageData.height;
  const values = pixels * 3;
  const signal = Math.min(98, Math.max(28, Math.round(stats.edgeEnergy + stats.edgeRatio * 120 + stats.saturation * 30)));
  const strongest = strongestVectorComponent(vector);

  lessonList.innerHTML = [
    [
      "1. Camera frame",
      `This frame is ${imageData.width} x ${imageData.height}, which means ${pixels.toLocaleString()} pixels and ${values.toLocaleString()} raw RGB numbers.`,
    ],
    [
      "2. Contour",
      "Contours are found by comparing neighboring pixels. A big change means a likely boundary: face edge, hair, shoulder, hand, or clothing line.",
    ],
    [
      "3. Matrix",
      "Mathematically, the frame is I[y][x][c]. y is row, x is column, and c is the color channel. Example: I[120][80] = [34, 91, 77].",
    ],
    [
      "4. Vector",
      `The frame is compressed into a 24-dimensional teaching vector. The strongest component right now is v[${strongest.index}] = ${strongest.value.toFixed(3)}.`,
    ],
    [
      "5. ML pipeline",
      "A real vision model stacks many layers: pixels -> edges -> shapes -> parts -> embedding -> classification or language explanation.",
    ],
  ]
    .map(([title, copy]) => `<div class="lesson-item"><strong>${title}</strong><span>${copy}</span></div>`)
    .join("");

  confidenceLabel.textContent = `contour signal: ${signal}%`;
  confidenceFill.style.width = `${signal}%`;
}

function strongestVectorComponent(vector) {
  return vector.reduce((best, value, index) => (Math.abs(value) > Math.abs(best.value) ? { value, index } : best), {
    value: 0,
    index: 0,
  });
}

function updateStageText() {
  if (autoCycleLessons) {
    activeLessonIndex = Math.floor(scanOffset / 120) % stages.length;
    syncLessonButtons();
  }
  const stage = stages[activeLessonIndex];
  layerTitle.textContent = stage.title;
  layerCopy.textContent = stage.copy;
  formulaBox.textContent = stage.formula;
  stageNumber.textContent = activeLessonIndex + 1;
  updateQuestProgress();
}

function setActiveLesson(index, shouldExplain = true) {
  activeLessonIndex = index;
  autoCycleLessons = false;
  syncLessonButtons();
  updateStageText();

  if (shouldExplain) {
    const stage = stages[index];
    addMessage(
      "assistant",
      `<strong>Lesson ${index + 1}: ${stage.title}</strong><br>${stage.copy}<br><br><code>${stage.formula}</code>`,
    );
  }
}

function syncLessonButtons() {
  lessonStepButtons.forEach((button, index) => {
    button.classList.toggle("active", index === activeLessonIndex);
    button.classList.toggle("complete", index < activeLessonIndex);
  });
}

function updateQuestProgress() {
  const baseXp = (activeLessonIndex + 1) * 16;
  const bonusXp = (clickedPixel ? 10 : 0) + (generatedSummary ? 10 : 0);
  const xp = Math.min(100, baseXp + bonusXp);
  xpLabel.textContent = `${xp} / 100 XP`;
  xpFill.style.width = `${xp}%`;
  pixelBadge.classList.toggle("earned", clickedPixel);
  summaryBadge.classList.toggle("earned", generatedSummary);
}

function drawPerceptionOverlay(imageData, now) {
  const width = overlayCanvas.clientWidth;
  const height = overlayCanvas.clientHeight;
  if (overlayCanvas.width !== width || overlayCanvas.height !== height) {
    overlayCanvas.width = width;
    overlayCanvas.height = height;
  }

  scanOffset = (scanOffset + 1.55) % 10000;
  overlayContext.clearRect(0, 0, width, height);
  drawContourNumbers(imageData, width, height, now);
  drawVectorField(imageData, width, height, now);
  drawScanLine(width, height);
}

function drawContourNumbers(imageData, width, height, now) {
  const columns = 42;
  const rows = 24;
  const cellWidth = width / columns;
  const cellHeight = height / rows;

  overlayContext.font = "10px Cascadia Mono, Consolas, monospace";
  overlayContext.textBaseline = "middle";
  overlayContext.textAlign = "center";

  for (let y = 1; y < rows - 1; y += 1) {
    for (let x = 1; x < columns - 1; x += 1) {
      const sourceX = Math.floor((x / columns) * imageData.width);
      const sourceY = Math.floor((y / rows) * imageData.height);
      const edge = edgeAt(imageData, sourceX, sourceY);
      if (edge < 42) continue;

      const pulse = 0.52 + Math.sin(now / 190 + x * 0.7 + y * 0.35) * 0.25;
      const alpha = Math.min(0.92, 0.22 + edge / 255 + pulse * 0.18);
      const value = Math.round(edge).toString().padStart(3, "0");
      const drawX = x * cellWidth + cellWidth / 2;
      const drawY = y * cellHeight + cellHeight / 2;

      overlayContext.fillStyle = `rgba(53, 230, 198, ${alpha})`;
      overlayContext.fillText(value, drawX, drawY);

      if (edge > 90) {
        overlayContext.fillStyle = `rgba(157, 230, 111, ${alpha * 0.55})`;
        overlayContext.fillRect(drawX - 1, drawY - 1, 2, 2);
      }
    }
  }
}

function drawVectorField(imageData, width, height, now) {
  const columns = 11;
  const rows = 6;
  overlayContext.lineWidth = 1.2;

  for (let y = 1; y < rows; y += 1) {
    for (let x = 1; x < columns; x += 1) {
      const sourceX = Math.floor((x / columns) * imageData.width);
      const sourceY = Math.floor((y / rows) * imageData.height);
      const center = brightnessAt(imageData, sourceX, sourceY);
      const right = brightnessAt(imageData, Math.min(sourceX + 4, imageData.width - 1), sourceY);
      const down = brightnessAt(imageData, sourceX, Math.min(sourceY + 4, imageData.height - 1));
      const dx = right - center;
      const dy = down - center;
      const magnitude = Math.hypot(dx, dy);
      if (magnitude < 18) continue;

      const startX = (x / columns) * width;
      const startY = (y / rows) * height;
      const length = Math.min(34, 12 + magnitude / 3);
      const angle = Math.atan2(dy, dx) + Math.sin(now / 800) * 0.05;
      const endX = startX + Math.cos(angle) * length;
      const endY = startY + Math.sin(angle) * length;

      overlayContext.strokeStyle = "rgba(233, 187, 99, 0.62)";
      overlayContext.beginPath();
      overlayContext.moveTo(startX, startY);
      overlayContext.lineTo(endX, endY);
      overlayContext.stroke();

      overlayContext.fillStyle = "rgba(233, 187, 99, 0.82)";
      overlayContext.beginPath();
      overlayContext.arc(endX, endY, 2, 0, Math.PI * 2);
      overlayContext.fill();
    }
  }
}

function drawScanLine(width, height) {
  const scanY = (scanOffset * 2.1) % height;
  overlayContext.strokeStyle = "rgba(53, 230, 198, 0.65)";
  overlayContext.lineWidth = 1.5;
  overlayContext.beginPath();
  overlayContext.moveTo(0, scanY);
  overlayContext.lineTo(width, scanY);
  overlayContext.stroke();
}

function inspectPoint(event) {
  if (!currentImageData) return;
  const rect = videoWrap.getBoundingClientRect();
  const localX = event.clientX - rect.left;
  const localY = event.clientY - rect.top;
  const clampedX = Math.max(0, Math.min(rect.width, localX));
  const clampedY = Math.max(0, Math.min(rect.height, localY));
  const imageX = Math.floor((clampedX / rect.width) * currentImageData.width);
  const imageY = Math.floor((clampedY / rect.height) * currentImageData.height);
  const sample = samplePixel(currentImageData, imageX, imageY);

  selectedPoint = { ...sample, screenX: clampedX, screenY: clampedY };
  clickedPixel = true;
  saveFlag("clickedPixel");
  clickMarker.style.display = "block";
  clickMarker.style.left = `${clampedX}px`;
  clickMarker.style.top = `${clampedY}px`;

  autoCycleLessons = false;
  activeLessonIndex = 2;
  syncLessonButtons();
  updateStageText();
  addMessage("assistant", explainClickedSample(sample));
}

function samplePixel(imageData, x, y) {
  const safeX = Math.max(0, Math.min(imageData.width - 1, x));
  const safeY = Math.max(0, Math.min(imageData.height - 1, y));
  const index = (safeY * imageData.width + safeX) * 4;
  const red = imageData.data[index];
  const green = imageData.data[index + 1];
  const blue = imageData.data[index + 2];
  const brightness = (red + green + blue) / 3;
  const edge = edgeAt(imageData, safeX, safeY);

  return {
    x: safeX,
    y: safeY,
    red,
    green,
    blue,
    brightness,
    edge,
  };
}

function explainClickedSample(sample) {
  const edgeMeaning =
    sample.edge > 90
      ? "That is a strong visual clue. This pixel is probably sitting where one shape changes into another."
      : sample.edge > 45
        ? "That is a medium clue. The nearby pixels are changing a little, but not dramatically."
        : "That is a calm area. Nearby pixels are similar, so the model treats it as a smoother region.";

  return `<strong>Pixel clue unlocked: I[${sample.y}][${sample.x}]</strong><br>
RGB = [${sample.red}, ${sample.green}, ${sample.blue}]<br>
brightness = ${sample.brightness.toFixed(1)}<br>
edge score = ${sample.edge.toFixed(1)}<br><br>
${edgeMeaning}<br><br>
<code>edge = |gray(x,y)-gray(x+1,y)| + |gray(x,y)-gray(x,y+1)|</code>`;
}

function addMessage(role, html) {
  const message = document.createElement("div");
  message.className = `message ${role}`;
  message.innerHTML = html;
  chatLog.append(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function answerQuestion(question) {
  const q = question.toLowerCase();
  const stats = currentStats;
  const vector = currentVector;
  const pixels = stats ? stats.width * stats.height : 0;
  const values = pixels * 3;
  const strongest = vector.length ? strongestVectorComponent(vector) : { index: 0, value: 0 };

  if (q.includes("matrix") || q.includes("tensor") || q.includes("resolution")) {
    return `<strong>Matrix view:</strong> the frame is a tensor shaped <strong>${stats.height} x ${stats.width} x 3</strong>. That is ${pixels.toLocaleString()} pixels and ${values.toLocaleString()} RGB values. In notation: <strong>I[y][x][c]</strong>, where c is R, G, or B.<br><br><a href="https://cs231n.github.io/convolutional-networks/" target="_blank" rel="noreferrer">Go deeper: CS231n convolution notes</a>`;
  }

  if (q.includes("edge") || q.includes("contour") || q.includes("number")) {
    return `<strong>Edge numbers:</strong> each number is a local contrast score. I compare a pixel with its right and lower neighbors. If the difference is high, the app draws the number on that spot. Current average edge energy is <strong>${stats.edgeEnergy.toFixed(1)}</strong>, with about <strong>${Math.round(stats.edgeRatio * 100)}%</strong> strong contour samples.<br><br><a href="https://distill.pub/2017/feature-visualization/" target="_blank" rel="noreferrer">Go deeper: feature visualization</a>`;
  }

  if (q.includes("vector") || q.includes("embedding")) {
    return `<strong>Vector:</strong> the bars compress the frame into 24 coordinates. This teaching vector mixes brightness buckets, color averages, and edge strength. Strongest coordinate now: <strong>v[${strongest.index}] = ${strongest.value.toFixed(3)}</strong>. In real ML, embeddings are often hundreds or thousands of dimensions.<br><br><a href="https://developers.google.com/machine-learning/crash-course/embeddings" target="_blank" rel="noreferrer">Go deeper: Google ML embeddings</a>`;
  }

  if (q.includes("rgb") || q.includes("color") || q.includes("channel")) {
    return `<strong>RGB channels:</strong> every pixel has three values: red, green, and blue. Current averages are <strong>R ${stats.red.toFixed(1)}</strong>, <strong>G ${stats.green.toFixed(1)}</strong>, <strong>B ${stats.blue.toFixed(1)}</strong>. A model often normalizes them by dividing by 255.<br><br><a href="https://www.tensorflow.org/tutorials/images/cnn" target="_blank" rel="noreferrer">Go deeper: TensorFlow image CNN tutorial</a>`;
  }

  if (q.includes("math") || q.includes("formula") || q.includes("equation")) {
    return `<strong>Math sketch:</strong><br>I[y][x] = [R,G,B]<br>gray(x,y) = (R+G+B)/3<br>edge(x,y) = |gray(x,y)-gray(x+1,y)| + |gray(x,y)-gray(x,y+1)|<br>v = normalize(features(I))<br>prediction = softmax(Wv + b)<br><br><a href="https://cs231n.github.io/convolutional-networks/" target="_blank" rel="noreferrer">Go deeper: convolutional networks</a>`;
  }

  if (q.includes("model") || q.includes("ai") || q.includes("ml") || q.includes("learn")) {
    return `<strong>ML pipeline:</strong> a vision model starts with pixels, learns filters for edges and textures, combines those into shapes and parts, then compresses the result into an embedding vector. A classifier or language model can then use that vector to describe what it sees.<br><br><a href="https://www.tensorflow.org/tutorials/images/cnn" target="_blank" rel="noreferrer">Go deeper: TensorFlow CNN tutorial</a>`;
  }

  if (q.includes("simple") || q.includes("simpler")) {
    return `<strong>Nova version:</strong> AI does not magically understand the image. First it turns the picture into color numbers. Then it looks for changes, like where bright pixels meet dark pixels. Those changes become clues, and the clues become a short number list the model can compare with things it learned before.`;
  }

  return `<strong>Short answer:</strong> this frame is being turned into numbers in stages: pixels become an RGB matrix, contrast creates contours, contours and color statistics become a vector, and that vector is what an ML system would compare against learned patterns. Try asking about "edges", "matrix", "RGB", "vector", or "math".<br><br><a href="https://www.tensorflow.org/tutorials/images/cnn" target="_blank" rel="noreferrer">Go deeper: image classification with CNNs</a>`;
}

function generateLearningSummary() {
  tutorDetails.open = true;
  generatedSummary = true;
  saveFlag("generatedSummary");
  updateQuestProgress();

  if (!currentStats || !currentVector.length) {
    addMessage(
      "assistant",
      "<strong>Learning summary:</strong> start the camera or use the demo frame first, then I can summarize the current visual data.",
    );
    return;
  }

  const pixels = currentStats.width * currentStats.height;
  const strongest = strongestVectorComponent(currentVector);
  const contourPercent = Math.round(currentStats.edgeRatio * 100);

  addMessage(
    "assistant",
    `<strong>What your brain just learned</strong><br>
Input: ${currentStats.width} x ${currentStats.height} frame with ${pixels.toLocaleString()} pixels.<br>
Process: the app samples RGB values, compares neighboring pixels, estimates contour strength, and compresses the result into a 24-value teaching vector.<br>
Output: average RGB is R ${currentStats.red.toFixed(1)}, G ${currentStats.green.toFixed(1)}, B ${currentStats.blue.toFixed(1)}. Strong contour samples are about ${contourPercent}%, and the strongest vector coordinate is v[${strongest.index}] = ${strongest.value.toFixed(3)}.<br><br>
This is the same basic path a computer vision model follows: pixels -> features -> vector -> prediction or explanation.`,
  );
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = chatInput.value.trim();
  if (!question || !currentStats) return;
  addMessage("user", question.replace(/[<>&]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[char]));
  addMessage("assistant", answerQuestion(question));
  chatInput.value = "";
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    chatInput.value = button.dataset.prompt;
    chatForm.requestSubmit();
  });
});

lessonStepButtons.forEach((button, index) => {
  button.addEventListener("click", () => setActiveLesson(index));
});

videoWrap.addEventListener("click", inspectPoint);
startCameraButton.addEventListener("click", startCamera);
captureButton.addEventListener("click", captureFrame);
demoButton.addEventListener("click", useDemoFrame);
liveButton.addEventListener("click", toggleLiveAnalysis);
generateSummaryButton.addEventListener("click", generateLearningSummary);

useDemoFrame();
addMessage(
  "assistant",
  "<strong>Nova here. Ask me anything about the current frame.</strong> I can explain pixels, color numbers, outlines, fingerprints, or the math in a beginner-friendly way.",
);
requestAnimationFrame(animationLoop);
