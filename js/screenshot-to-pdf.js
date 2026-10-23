const imageInput = document.getElementById('imageInput');
const imageList = document.getElementById('imageList');
const pageSizeSelect = document.getElementById('pageSize');
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('downloadBtn');

let files = [];
let pdfBlobUrl = '';

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
      img.onload = () => resolve({ file, img, dataUrl: reader.result });
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function renderImages() {
  if (!imageList) return;
  imageList.innerHTML = '';
  files.forEach((item, index) => {
    const entry = document.createElement('div');
    entry.className = 'image-item';
    entry.draggable = true;
    entry.dataset.index = String(index);
    entry.innerHTML = `
      <img src="${item.dataUrl}" alt="${item.file.name}" />
      <div class="image-meta">
        <div class="image-name">${item.file.name}</div>
        <small>${formatBytes(item.file.size)}</small>
      </div>
      <button class="image-remove" type="button" aria-label="Remove image">×</button>
    `;

    const removeBtn = entry.querySelector('.image-remove');
    removeBtn.addEventListener('click', () => {
      files.splice(index, 1);
      renderImages();
    });

    entry.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', String(index));
      entry.style.opacity = '0.5';
    });
    entry.addEventListener('dragend', () => {
      entry.style.opacity = '1';
    });
    entry.addEventListener('dragover', (event) => event.preventDefault());
    entry.addEventListener('drop', (event) => {
      event.preventDefault();
      const from = Number(event.dataTransfer.getData('text/plain'));
      const to = index;
      if (from === to) return;
      const [moved] = files.splice(from, 1);
      files.splice(to, 0, moved);
      renderImages();
    });

    imageList.appendChild(entry);
  });
}

async function addFiles(fileList) {
  const images = await Promise.all(
    Array.from(fileList).filter((file) => file.type.startsWith('image/')).map(async (file) => {
      const loaded = await readImage(file);
      return { ...loaded, file };
    })
  );

  files = [...files, ...images];
  renderImages();
}

if (imageInput) {
  imageInput.addEventListener('change', async (event) => {
    await addFiles(event.target.files);
    imageInput.value = '';
  });
}

function loadJsPdf() {
  return new Promise((resolve, reject) => {
    if (window.jspdf) {
      resolve(window.jspdf);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => resolve(window.jspdf);
    script.onerror = () => reject(new Error('Failed to load jsPDF'));
    document.head.appendChild(script);
  });
}

function getPageSize(sizeName) {
  const map = {
    A4: { width: 210, height: 297 },
    Letter: { width: 216, height: 279 },
    Fit: { width: 210, height: 297 }
  };
  return map[sizeName] || map.A4;
}

async function buildPdf() {
  if (!files.length) return;
  const { jsPDF } = await loadJsPdf();
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageMode = pageSizeSelect ? pageSizeSelect.value : 'A4';

  files.forEach((item, index) => {
    if (index > 0) pdf.addPage();
    const img = item.img;
    const page = getPageSize(pageMode);
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;
    const scale = Math.min(page.width / imgWidth, page.height / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;
    const x = (page.width - drawWidth) / 2;
    const y = (page.height - drawHeight) / 2;
    pdf.addImage(item.dataUrl, 'PNG', x, y, drawWidth, drawHeight, undefined, 'FAST');
  });

  pdfBlobUrl = URL.createObjectURL(pdf.output('blob'));
  if (downloadBtn) {
    downloadBtn.hidden = false;
    downloadBtn.disabled = false;
  }

  if (downloadBtn) downloadBtn.click();
}

if (convertBtn) convertBtn.addEventListener('click', buildPdf);

if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    if (!pdfBlobUrl) return;
    const link = document.createElement('a');
    link.href = pdfBlobUrl;
    link.download = 'screenshot-to-pdf.pdf';
    link.click();
  });
}

window.addEventListener('paste', (event) => {
  const clipboardItems = event.clipboardData && event.clipboardData.items;
  if (!clipboardItems) return;
  const imageFiles = Array.from(clipboardItems)
    .filter((item) => item.type.startsWith('image/'))
    .map((item) => item.getAsFile())
    .filter(Boolean);

  if (!imageFiles.length) return;
  addFiles(imageFiles);
});

if (typeof window !== 'undefined') {
  window.screenshotToPdf = buildPdf;
}















































































































































































































































































































































"}]}