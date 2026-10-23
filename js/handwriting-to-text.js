const imageInput = document.getElementById('imageInput');
const languageSelect = document.getElementById('languageSelect');
const ocrBtn = document.getElementById('ocrBtn');
const resultBox = document.getElementById('resultBox');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const status = document.getElementById('status');

function loadTesseract() {
  return new Promise((resolve, reject) => {
    if (window.Tesseract) {
      resolve(window.Tesseract);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    script.onload = () => resolve(window.Tesseract);
    script.onerror = () => reject(new Error('Tesseract failed to load'));
    document.head.appendChild(script);
  });
}

async function runOcr() {
  if (!imageInput.files || !imageInput.files[0]) return;
  const file = imageInput.files[0];
  const lang = languageSelect ? languageSelect.value : 'eng';
  status.style.display = 'block';
  status.textContent = 'Processing your image...';
  try {
    const Tesseract = await loadTesseract();
    const { data } = await Tesseract.recognize(file, lang, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          status.textContent = `Processing... ${Math.round(m.progress * 100)}%`;
        }
      }
    });
    resultBox.value = data.text.trim();
  } catch (error) {
    resultBox.value = 'OCR failed. Please try another image or a clearer scan.';
  } finally {
    status.style.display = 'none';
  }
}

if (ocrBtn) {
  ocrBtn.addEventListener('click', runOcr);
}

if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    if (!resultBox.value) return;
    await navigator.clipboard.writeText(resultBox.value);
    copyBtn.textContent = 'Copied';
    setTimeout(() => {
      copyBtn.textContent = 'Copy';
    }, 1200);
  });
}

if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    if (!resultBox.value) return;
    const blob = new Blob([resultBox.value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ocr-output.txt';
    link.click();
    URL.revokeObjectURL(url);
  });
}

if (imageInput) {
  imageInput.addEventListener('change', () => {
    if (imageInput.files && imageInput.files[0]) {
      const preview = new FileReader();
      preview.onload = () => {
        resultBox.value = 'Image ready. Click “Extract text” to continue.';
      };
      preview.readAsDataURL(imageInput.files[0]);
    }
  });
}
