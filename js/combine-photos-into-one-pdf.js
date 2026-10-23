const imageInput = document.getElementById('imageInput');
const imageList = document.getElementById('imageList');
const pageSizeSelect = document.getElementById('pageSize');
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('downloadBtn');

let files = [];
let pdfBlobUrl = '';

function formatBytes(bytes) {
  if (!bytes) return '0 KB';
  const units = ['B', 'KB', 'MB', 'GB'];
  let index = 0;
  let value = bytes;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(1)} ${units[index]}`;
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

    entry.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    entry.addEventListener('drop', (event) => {
      event.preventDefault();
      const sourceIndex = Number(event.dataTransfer.getData('text/plain'));
      const targetIndex = index;
      if (sourceIndex === targetIndex) return;
      const [moved] = files.splice(sourceIndex, 1);
      files.splice(targetIndex, 0, moved);
      renderImages();
    });

    imageList.appendChild(entry);
  });
}

async function addFiles(newFiles) {
  const loaded = await Promise.all(
    Array.from(newFiles).map(async (file) => {
      if (!file.type.startsWith('image/')) return null;
      const image = await readImage(file);
      return { ...image, file };
    })
  );

  files = [...files, ...loaded.filter(Boolean)];
  renderImages();
  if (downloadBtn.hidden) {
    downloadBtn.hidden = false;
  }
}

if (imageInput) {
  imageInput.addEventListener('change', async (event) => {
    await addFiles(event.target.files);
    imageInput.value = '';
  });
}

function getPageDimensions(size) {
  const mm = { A4: [210, 297], Letter: [216, 279], Fit: [210, 297] };
  const [width, height] = mm[size] || mm.A4;
  return { width, height };
}

function getPdfInstance() {
  const { jsPDF } = window.jspdf;
  return new jsPDF('p', 'mm', 'a4');
}

function addImageToPdf(pdf, item, sizeMode) {
  const { img } = item;
  const { width: pageWidth, height: pageHeight } = getPageDimensions(sizeMode === 'Fit' ? 'A4' : sizeMode);
  const imgWidth = img.naturalWidth || img.width;
  const imgHeight = img.naturalHeight || img.height;
  const scale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
  const drawWidth = imgWidth * scale;
  const drawHeight = imgHeight * scale;
  const x = (pageWidth - drawWidth) / 2;
  const y = (pageHeight - drawHeight) / 2;

  if (sizeMode === 'Fit') {
    pdf.addImage(item.dataUrl, 'PNG', x, y, drawWidth, drawHeight, undefined, 'FAST');
    return;
  }

  pdf.addImage(item.dataUrl, 'PNG', x, y, drawWidth, drawHeight, undefined, 'FAST');
}

function generatePdf() {
  if (!files.length || !window.jspdf) return;
  const pdf = getPdfInstance();
  const pageMode = pageSizeSelect && pageSizeSelect.value ? pageSizeSelect.value : 'A4';

  files.forEach((item, index) => {
    if (index > 0) {
      pdf.addPage();
    }
    addImageToPdf(pdf, item, pageMode);
  });

  const fileName = `combined-photos-${Date.now()}.pdf`;
  pdf.save(fileName);
  pdfBlobUrl = URL.createObjectURL(pdf.output('blob'));
}

if (convertBtn) {
  convertBtn.addEventListener('click', generatePdf);
}

if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    if (pdfBlobUrl) {
      const link = document.createElement('a');
      link.href = pdfBlobUrl;
      link.download = 'combined-photos.pdf';
      link.click();
    }
  });
}

if (typeof window !== 'undefined') {
  window.addFiles = addFiles;
}
