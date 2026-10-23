const imageInput = document.getElementById('imageInput');
const targetSelect = document.getElementById('targetSize');
const compressBtn = document.getElementById('compressBtn');
const downloadLink = document.getElementById('downloadLink');
const beforeSize = document.getElementById('beforeSize');
const afterSize = document.getElementById('afterSize');
const beforeAfter = document.getElementById('beforeAfter');

let originalFile = null;
let originalDataUrl = '';
let compressedDataUrl = '';

function formatBytes(bytes) {
  if (!bytes) return '0 KB';
  let value = bytes;
  let unit = 0;
  const units = ['B', 'KB', 'MB'];
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(1)} ${units[unit]}`;
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve({ img, dataUrl: reader.result });
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function compressImageToTarget(dataUrl, targetKB) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxWidth = 1600;
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let quality = 0.9;
      let compressed = canvas.toDataURL('image/jpeg', quality);
      while (compressed.length > targetKB * 1024 && quality > 0.1) {
        quality -= 0.05;
        compressed = canvas.toDataURL('image/jpeg', quality);
      }

      resolve(compressed);
    };
    img.src = dataUrl;
  });
}

async function handleImageUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  originalFile = file;
  const loaded = await readImage(file);
  originalDataUrl = loaded.dataUrl;
  if (beforeSize) beforeSize.textContent = formatBytes(file.size);
}

if (imageInput) {
  imageInput.addEventListener('change', handleImageUpload);
}

async function compressImage() {
  if (!originalDataUrl) return;
  const targetKB = Number(targetSelect ? targetSelect.value : 100);
  compressedDataUrl = await compressImageToTarget(originalDataUrl, targetKB);
  const encoded = atob(compressedDataUrl.split(',')[1]);
  const size = encoded.length;
  if (afterSize) afterSize.textContent = formatBytes(size);
  if (beforeAfter) beforeAfter.style.display = 'flex';
  if (downloadLink) {
    downloadLink.href = compressedDataUrl;
    downloadLink.download = `compressed-${targetKB}kb.jpg`;
    downloadLink.style.display = 'inline-flex';
  }
}

if (compressBtn) {
  compressBtn.addEventListener('click', compressImage);
}



































































































































































































































































"}]}