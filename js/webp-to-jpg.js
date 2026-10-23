const imageInput = document.getElementById('imageInput');
const outputFormat = document.getElementById('outputFormat');
const convertBtn = document.getElementById('convertBtn');
const downloadLink = document.getElementById('downloadLink');

function convertWebpToOutput(file, type) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => resolve(blob), type, 0.9);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function convertImage() {
  if (!imageInput.files || !imageInput.files[0]) return;
  const file = imageInput.files[0];
  const type = outputFormat ? outputFormat.value : 'image/jpeg';
  const blob = await convertWebpToOutput(file, type);
  const url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = type === 'image/png' ? 'converted.png' : 'converted.jpg';
  downloadLink.style.display = 'inline-flex';
}

if (convertBtn) {
  convertBtn.addEventListener('click', convertImage);
}












































































































































































































































"}]}