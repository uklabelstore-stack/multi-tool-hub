"use client";

import { useEffect, useRef } from 'react';

export default function ToolRenderer({ slug, html }) {
  const containerRef = useRef(null);

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-src="${src}"]`);
      if (existing) {
        if (existing.getAttribute('data-loaded') === 'true') return resolve();
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Script load error')));
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-src', src);
      script.addEventListener('load', () => {
        script.setAttribute('data-loaded', 'true');
        resolve();
      });
      script.addEventListener('error', () => reject(new Error('Script load error')));
      document.head.appendChild(script);
    });
  }

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = html;

    // Generic text tools
    if (slug === 'word-counter') {
      const input = containerRef.current.querySelector('#word-counter-input');
      const words = containerRef.current.querySelector('#word-counter-words');
      const chars = containerRef.current.querySelector('#word-counter-chars');
      const lines = containerRef.current.querySelector('#word-counter-lines');

      const update = () => {
        const value = input.value;
        const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
        words.textContent = String(wordCount);
        chars.textContent = String(value.length);
        lines.textContent = String(value.split(/\n/).filter(Boolean).length || 0);
      };

      input.addEventListener('input', update);
      update();
      return () => input.removeEventListener('input', update);
    }

    if (slug === 'case-converter') {
      const input = containerRef.current.querySelector('#case-converter-input');
      const output = containerRef.current.querySelector('#case-converter-output');
      const upper = containerRef.current.querySelector('#case-upper');
      const lower = containerRef.current.querySelector('#case-lower');
      const title = containerRef.current.querySelector('#case-title');
      const clear = containerRef.current.querySelector('#case-clear');

      const toTitle = (value) =>
        value
          .toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

      upper.addEventListener('click', () => (output.value = input.value.toUpperCase()));
      lower.addEventListener('click', () => (output.value = input.value.toLowerCase()));
      title.addEventListener('click', () => (output.value = toTitle(input.value)));
      clear.addEventListener('click', () => {
        input.value = '';
        output.value = '';
      });

      return () => {
        upper.removeEventListener('click', () => {});
        lower.removeEventListener('click', () => {});
        title.removeEventListener('click', () => {});
        clear.removeEventListener('click', () => {});
      };
    }

    if (slug === 'bmi-calculator') {
      const weight = containerRef.current.querySelector('#bmi-weight');
      const height = containerRef.current.querySelector('#bmi-height');
      const btn = containerRef.current.querySelector('#bmi-calc');
      const out = containerRef.current.querySelector('#bmi-result');

      const calc = () => {
        const w = Number(weight.value);
        const h = Number(height.value) / 100;
        if (!w || !h) {
          out.textContent = 'Enter weight and height';
          return;
        }
        const bmi = w / (h * h);
        const label = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
        out.textContent = `${bmi.toFixed(1)} (${label})`;
      };

      btn.addEventListener('click', calc);
      return () => btn.removeEventListener('click', calc);
    }

    if (slug === 'age-calculator') {
      const dob = containerRef.current.querySelector('#age-dob');
      const btn = containerRef.current.querySelector('#age-calc');
      const out = containerRef.current.querySelector('#age-result');

      const calc = () => {
        if (!dob.value) {
          out.textContent = 'Pick a date';
          return;
        }

        const birth = new Date(dob.value);
        const today = new Date();
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();

        if (days < 0) {
          months -= 1;
          const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
          days += lastMonth.getDate();
        }

        if (months < 0) {
          years -= 1;
          months += 12;
        }

        out.textContent = `Your age: ${years} years, ${months} months, ${days} days`;
      };

      btn.addEventListener('click', calc);
      return () => btn.removeEventListener('click', calc);
    }

    if (slug === 'kg-to-lbs') {
      const input = containerRef.current.querySelector('#kg-input');
      const btn = containerRef.current.querySelector('#kg-convert');
      const out = containerRef.current.querySelector('#kg-result');

      const convert = () => {
        const kg = Number(input.value);
        if (!Number.isFinite(kg)) {
          out.textContent = 'Enter valid value';
          return;
        }
        out.textContent = `${(kg * 2.20462).toFixed(2)} lbs`;
      };

      btn.addEventListener('click', convert);
      return () => btn.removeEventListener('click', convert);
    }

    if (slug === 'password-generator') {
      const length = containerRef.current.querySelector('#pwd-length');
      const output = containerRef.current.querySelector('#pwd-output');
      const generate = containerRef.current.querySelector('#pwd-generate');
      const copy = containerRef.current.querySelector('#pwd-copy');
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';

      const makePassword = () => {
        const value = Math.max(4, Math.min(64, Number(length.value) || 16));
        let result = '';
        for (let i = 0; i < value; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        output.value = result;
      };

      const handleCopy = async () => {
        if (!output.value) return;
        await navigator.clipboard.writeText(output.value);
        copy.textContent = 'Copied';
        setTimeout(() => (copy.textContent = 'Copy'), 1200);
      };

      generate.addEventListener('click', makePassword);
      copy.addEventListener('click', handleCopy);
      makePassword();
      return () => {
        generate.removeEventListener('click', makePassword);
        copy.removeEventListener('click', handleCopy);
      };
    }

    if (slug === 'qr-code-generator') {
      const input = containerRef.current.querySelector('#qr-input');
      const btn = containerRef.current.querySelector('#qr-generate');
      const clear = containerRef.current.querySelector('#qr-clear');
      const out = containerRef.current.querySelector('#qr-output');

      const generate = () => {
        const val = input.value.trim();
        if (!val) {
          out.innerHTML = '<div class="text-sm text-slate-500">Enter text or URL to generate a QR code.</div>';
          return;
        }
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(val)}`;
        out.innerHTML = `<img src="${url}" alt="QR code" class="h-48 w-48 border border-slate-200 bg-white p-2" />`;
      };

      btn.addEventListener('click', generate);
      clear.addEventListener('click', () => {
        input.value = '';
        out.innerHTML = '';
      });
      return () => {
        btn.removeEventListener('click', generate);
        clear.removeEventListener('click', () => {});
      };
    }

    if (slug === 'base64') {
      const input = containerRef.current.querySelector('#b64-input');
      const encodeBtn = containerRef.current.querySelector('#b64-encode');
      const decodeBtn = containerRef.current.querySelector('#b64-decode');
      const output = containerRef.current.querySelector('#b64-output');

      const encode = () => {
        try {
          output.value = btoa(unescape(encodeURIComponent(input.value || '')));
        } catch {
          output.value = 'Encoding error';
        }
      };

      const decode = () => {
        try {
          output.value = decodeURIComponent(escape(atob(input.value || '')));
        } catch {
          output.value = 'Decoding error';
        }
      };

      encodeBtn.addEventListener('click', encode);
      decodeBtn.addEventListener('click', decode);
      return () => {
        encodeBtn.removeEventListener('click', encode);
        decodeBtn.removeEventListener('click', decode);
      };
    }

    if (slug === 'percentage-calculator') {
      const base = containerRef.current.querySelector('#pct-base');
      const percent = containerRef.current.querySelector('#pct-percent');
      const btn = containerRef.current.querySelector('#pct-calc');
      const out = containerRef.current.querySelector('#pct-result');

      const calc = () => {
        const b = Number(base.value);
        const p = Number(percent.value);
        if (!Number.isFinite(b) || !Number.isFinite(p)) {
          out.textContent = 'Enter valid numbers';
          return;
        }
        out.textContent = `${((b * p) / 100).toFixed(2)}`;
      };

      btn.addEventListener('click', calc);
      return () => btn.removeEventListener('click', calc);
    }

    if (slug === 'lorem-ipsum') {
      const count = containerRef.current.querySelector('#lorem-count');
      const btn = containerRef.current.querySelector('#lorem-gen');
      const out = containerRef.current.querySelector('#lorem-output');
      const sample = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent blandit lorem vitae sapien varius, at blandit nibh tincidunt.';

      const generate = () => {
        const n = Math.max(1, Math.min(10, Number(count.value) || 3));
        out.innerHTML = Array.from({ length: n }, () => `<p class="mb-2 text-sm text-slate-700">${sample}</p>`).join('');
      };

      btn.addEventListener('click', generate);
      generate();
      return () => btn.removeEventListener('click', generate);
    }

    // PDF & Image tools
    const loadPdfJs = async () => {
      const pdfJsUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
      const workerUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
      await loadScript(pdfJsUrl);
      if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
      }
    };

    const loadPdfLib = async () => {
      await loadScript('https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js');
    };

    if (slug === 'pdf-to-text') {
      const input = containerRef.current.querySelector('#pdf2txt-file');
      const btn = containerRef.current.querySelector('#pdf2txt-extract');
      const clear = containerRef.current.querySelector('#pdf2txt-clear');
      const out = containerRef.current.querySelector('#pdf2txt-output');
      const status = containerRef.current.querySelector('#pdf2txt-status');

      const extract = async () => {
        const file = input.files?.[0];
        if (!file) {
          status.textContent = 'Select a PDF file first.';
          return;
        }
        try {
          await loadPdfJs();
          const pdf = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item) => item.str).join(' ') + '\n\n';
          }
          out.value = text.trim();
          status.textContent = 'PDF text extracted successfully.';
        } catch (error) {
          status.textContent = 'Could not extract text from PDF.';
          console.error(error);
        }
      };

      btn.addEventListener('click', extract);
      clear.addEventListener('click', () => {
        input.value = '';
        out.value = '';
        status.textContent = '';
      });
      return () => {
        btn.removeEventListener('click', extract);
        clear.removeEventListener('click', () => {});
      };
    }

    if (slug === 'pdf-page-count') {
      const input = containerRef.current.querySelector('#pdf-pagecount-file');
      const btn = containerRef.current.querySelector('#pdf-pagecount-btn');
      const out = containerRef.current.querySelector('#pdf-pagecount-result');
      const status = containerRef.current.querySelector('#pdf-pagecount-status');

      const count = async () => {
        const file = input.files?.[0];
        if (!file) {
          status.textContent = 'Select a PDF file.';
          return;
        }
        try {
          await loadPdfJs();
          const pdf = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
          out.textContent = String(pdf.numPages);
          status.textContent = 'Page count loaded.';
        } catch (error) {
          status.textContent = 'Could not read PDF.';
        }
      };

      btn.addEventListener('click', count);
      return () => btn.removeEventListener('click', count);
    }

    if (slug === 'pdf-preview') {
      const input = containerRef.current.querySelector('#pdf-preview-file');
      const btn = containerRef.current.querySelector('#pdf-preview-btn');
      const canvasWrap = containerRef.current.querySelector('#pdf-preview-canvas');
      const status = containerRef.current.querySelector('#pdf-preview-status');

      const preview = async () => {
        const file = input.files?.[0];
        if (!file) {
          status.textContent = 'Select a PDF file.';
          return;
        }
        try {
          await loadPdfJs();
          const pdf = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1.2 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          await page.render({ canvasContext: ctx, viewport }).promise;
          canvasWrap.innerHTML = '';
          canvasWrap.appendChild(canvas);
          status.textContent = 'Preview ready.';
        } catch (error) {
          status.textContent = 'Could not preview PDF.';
          console.error(error);
        }
      };

      btn.addEventListener('click', preview);
      return () => btn.removeEventListener('click', preview);
    }

    if (slug === 'pdf-merge') {
      const input = containerRef.current.querySelector('#pdf-merge-files');
      const btn = containerRef.current.querySelector('#pdf-merge-btn');
      const download = containerRef.current.querySelector('#pdf-merge-download');
      const status = containerRef.current.querySelector('#pdf-merge-status');

      const merge = async () => {
        const files = Array.from(input.files || []);
        if (files.length < 2) {
          status.textContent = 'Select at least two PDF files.';
          return;
        }
        try {
          await loadPdfLib();
          const { PDFDocument } = window.PDFLib;
          const merged = await PDFDocument.create();
          for (const file of files) {
            const src = await PDFDocument.load(await file.arrayBuffer());
            const pages = await merged.copyPages(src, src.getPageIndices());
            pages.forEach((page) => merged.addPage(page));
          }
          const bytes = await merged.save();
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          download.href = url;
          download.classList.remove('hidden');
          status.textContent = 'Merged PDF ready.';
        } catch (error) {
          status.textContent = 'Could not merge PDFs.';
          console.error(error);
        }
      };

      btn.addEventListener('click', merge);
      return () => btn.removeEventListener('click', merge);
    }

    if (slug === 'pdf-split') {
      const input = containerRef.current.querySelector('#pdf-split-file');
      const btn = containerRef.current.querySelector('#pdf-split-btn');
      const out = containerRef.current.querySelector('#pdf-split-links');
      const status = containerRef.current.querySelector('#pdf-split-status');

      const split = async () => {
        const file = input.files?.[0];
        if (!file) {
          status.textContent = 'Select a PDF file.';
          return;
        }
        try {
          await loadPdfLib();
          const { PDFDocument } = window.PDFLib;
          const src = await PDFDocument.load(await file.arrayBuffer());
          out.innerHTML = '';
          for (let i = 0; i < src.getPageCount(); i++) {
            const newDoc = await PDFDocument.create();
            const [page] = await newDoc.copyPages(src, [i]);
            newDoc.addPage(page);
            const bytes = await newDoc.save();
            const blob = new Blob([bytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `page-${i + 1}.pdf`;
            link.textContent = `Download page ${i + 1}`;
            link.className = 'block text-sm text-blue-600 hover:underline';
            out.appendChild(link);
          }
          status.textContent = 'Pages ready to download.';
        } catch (error) {
          status.textContent = 'Could not split PDF.';
          console.error(error);
        }
      };

      btn.addEventListener('click', split);
      return () => btn.removeEventListener('click', split);
    }

    if (slug === 'image-resizer') {
      const input = containerRef.current.querySelector('#img-resize-file');
      const width = containerRef.current.querySelector('#img-resize-width');
      const height = containerRef.current.querySelector('#img-resize-height');
      const btn = containerRef.current.querySelector('#img-resize-btn');
      const download = containerRef.current.querySelector('#img-resize-download');
      const status = containerRef.current.querySelector('#img-resize-status');

      const resize = async () => {
        const file = input.files?.[0];
        if (!file) {
          status.textContent = 'Select an image first.';
          return;
        }

        const img = await createImageBitmap(file);
        const targetW = Number(width.value) || img.width;
        const targetH = Number(height.value) || img.height;
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, targetW, targetH);
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          download.href = url;
          download.classList.remove('hidden');
          status.textContent = 'Image resized.';
        }, 'image/png');
      };

      btn.addEventListener('click', resize);
      return () => btn.removeEventListener('click', resize);
    }

    if (slug === 'image-to-base64') {
      const input = containerRef.current.querySelector('#img2b64-file');
      const btn = containerRef.current.querySelector('#img2b64-btn');
      const out = containerRef.current.querySelector('#img2b64-output');
      const status = containerRef.current.querySelector('#img2b64-status');

      const convert = () => {
        const file = input.files?.[0];
        if (!file) {
          status.textContent = 'Select an image.';
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          out.value = String(reader.result);
          status.textContent = 'Base64 generated.';
        };
        reader.readAsDataURL(file);
      };

      btn.addEventListener('click', convert);
      return () => btn.removeEventListener('click', convert);
    }

    if (slug === 'base64-to-image') {
      const input = containerRef.current.querySelector('#b642img-input');
      const btn = containerRef.current.querySelector('#b642img-btn');
      const out = containerRef.current.querySelector('#b642img-output');
      const download = containerRef.current.querySelector('#b642img-download');

      const preview = () => {
        const value = input.value.trim();
        if (!value) return;
        const data = value.startsWith('data:') ? value : `data:image/png;base64,${value}`;
        const img = document.createElement('img');
        img.src = data;
        img.className = 'max-w-full rounded border border-slate-200 bg-white';
        out.innerHTML = '';
        out.appendChild(img);
        download.href = data;
        download.classList.remove('hidden');
      };

      btn.addEventListener('click', preview);
      return () => btn.removeEventListener('click', preview);
    }

    if (slug === 'image-compressor') {
      const input = containerRef.current.querySelector('#img-compress-file');
      const quality = containerRef.current.querySelector('#img-compress-quality');
      const qVal = containerRef.current.querySelector('#img-compress-qval');
      const btn = containerRef.current.querySelector('#img-compress-btn');
      const download = containerRef.current.querySelector('#img-compress-download');
      const status = containerRef.current.querySelector('#img-compress-status');

      const updateLabel = () => {
        qVal.textContent = Number(quality.value).toFixed(2);
      };

      quality.addEventListener('input', updateLabel);
      updateLabel();

      const compress = async () => {
        const file = input.files?.[0];
        if (!file) {
          status.textContent = 'Select an image to compress.';
          return;
        }

        const img = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          download.href = url;
          download.classList.remove('hidden');
          status.textContent = 'Compression complete.';
        }, 'image/jpeg', Number(quality.value));
      };

      btn.addEventListener('click', compress);
      return () => {
        btn.removeEventListener('click', compress);
        quality.removeEventListener('input', updateLabel);
      };
    }

    if (slug === 'image-converter') {
      const input = containerRef.current.querySelector('#img-conv-file');
      const target = containerRef.current.querySelector('#img-conv-target');
      const btn = containerRef.current.querySelector('#img-conv-btn');
      const download = containerRef.current.querySelector('#img-conv-download');
      const status = containerRef.current.querySelector('#img-conv-status');

      const convert = async () => {
        const file = input.files?.[0];
        if (!file) {
          status.textContent = 'Select an image.';
          return;
        }
        const img = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          download.href = url;
          download.download = `converted.${target.value === 'image/png' ? 'png' : 'jpg'}`;
          download.classList.remove('hidden');
          status.textContent = 'Converted.';
        }, target.value, 0.92);
      };

      btn.addEventListener('click', convert);
      return () => btn.removeEventListener('click', convert);
    }

    if (slug === 'image-crop') {
      const input = containerRef.current.querySelector('#img-crop-file');
      const x = containerRef.current.querySelector('#img-crop-x');
      const y = containerRef.current.querySelector('#img-crop-y');
      const w = containerRef.current.querySelector('#img-crop-w');
      const h = containerRef.current.querySelector('#img-crop-h');
      const btn = containerRef.current.querySelector('#img-crop-btn');
      const download = containerRef.current.querySelector('#img-crop-download');
      const status = containerRef.current.querySelector('#img-crop-status');

      const crop = async () => {
        const file = input.files?.[0];
        if (!file) {
          status.textContent = 'Select an image.';
          return;
        }
        const img = await createImageBitmap(file);
        const cropX = Number(x.value) || 0;
        const cropY = Number(y.value) || 0;
        const cropW = Number(w.value) || 0;
        const cropH = Number(h.value) || 0;

        if (!cropW || !cropH) {
          status.textContent = 'Enter crop width and height.';
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = cropW;
        canvas.height = cropH;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          download.href = url;
          download.classList.remove('hidden');
          status.textContent = 'Cropped image ready.';
        }, 'image/png');
      };

      btn.addEventListener('click', crop);
      return () => btn.removeEventListener('click', crop);
    }

    if (slug === 'dominant-color') {
      const input = containerRef.current.querySelector('#img-color-file');
      const btn = containerRef.current.querySelector('#img-color-btn');
      const out = containerRef.current.querySelector('#img-color-result');

      const extract = async () => {
        const file = input.files?.[0];
        if (!file) {
          out.textContent = 'Select an image.';
          return;
        }

        const img = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 32, 32);
        const data = ctx.getImageData(0, 0, 32, 32).data;
        const counts = {};

        for (let i = 0; i < data.length; i += 4) {
          const r = Math.round(data[i] / 16) * 16;
          const g = Math.round(data[i + 1] / 16) * 16;
          const b = Math.round(data[i + 2] / 16) * 16;
          const key = `${r},${g},${b}`;
          counts[key] = (counts[key] || 0) + 1;
        }

        const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '0,0,0';
        const [r, g, b] = dominant.split(',').map(Number);
        out.innerHTML = `
          <div class="h-10 w-10 rounded border border-slate-200" style="background: rgb(${r}, ${g}, ${b});"></div>
          <div class="text-sm">rgb(${r}, ${g}, ${b})</div>
        `;
      };

      btn.addEventListener('click', extract);
      return () => btn.removeEventListener('click', extract);
    }

    if (slug === 'image-thumbnail') {
      const input = containerRef.current.querySelector('#img-thumb-file');
      const size = containerRef.current.querySelector('#img-thumb-size');
      const btn = containerRef.current.querySelector('#img-thumb-btn');
      const out = containerRef.current.querySelector('#img-thumb-output');
      const download = containerRef.current.querySelector('#img-thumb-download');

      const gen = async () => {
        const file = input.files?.[0];
        if (!file) return;
        const img = await createImageBitmap(file);
        const target = Number(size.value) || 150;
        const canvas = document.createElement('canvas');
        canvas.width = target;
        canvas.height = target;
        const ctx = canvas.getContext('2d');
        const ratio = Math.max(target / img.width, target / img.height);
        const newW = img.width * ratio;
        const newH = img.height * ratio;
        const x = (target - newW) / 2;
        const y = (target - newH) / 2;
        ctx.drawImage(img, x, y, newW, newH);
        const url = canvas.toDataURL('image/png');
        out.innerHTML = `<img src="${url}" class="max-w-full border border-slate-200 bg-white" />`;
        download.href = url;
        download.classList.remove('hidden');
      };

      btn.addEventListener('click', gen);
      return () => btn.removeEventListener('click', gen);
    }

    if (slug === 'image-metadata') {
      const input = containerRef.current.querySelector('#img-meta-file');
      const btn = containerRef.current.querySelector('#img-meta-btn');
      const out = containerRef.current.querySelector('#img-meta-output');

      const show = () => {
        const file = input.files?.[0];
        if (!file) {
          out.textContent = 'Select an image.';
          return;
        }
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          out.textContent = JSON.stringify({
            name: file.name,
            type: file.type,
            size: file.size,
            width: img.naturalWidth,
            height: img.naturalHeight,
          }, null, 2);
          URL.revokeObjectURL(url);
        };
        img.src = url;
      };

      btn.addEventListener('click', show);
      return () => btn.removeEventListener('click', show);
    }

    if (slug === 'image-grayscale') {
      const input = containerRef.current.querySelector('#img-gray-file');
      const btn = containerRef.current.querySelector('#img-gray-btn');
      const out = containerRef.current.querySelector('#img-gray-output');
      const download = containerRef.current.querySelector('#img-gray-download');

      const apply = async () => {
        const file = input.files?.[0];
        if (!file) return;
        const img = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = data.data;

        for (let i = 0; i < pixels.length; i += 4) {
          const gray = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
          pixels[i] = gray;
          pixels[i + 1] = gray;
          pixels[i + 2] = gray;
        }

        ctx.putImageData(data, 0, 0);
        const url = canvas.toDataURL('image/png');
        out.innerHTML = `<img src="${url}" class="max-w-full border border-slate-200 bg-white" />`;
        download.href = url;
        download.classList.remove('hidden');
      };

      btn.addEventListener('click', apply);
      return () => btn.removeEventListener('click', apply);
    }

    // Calculator + converter batch
    if (slug === 'loan-calculator') {
      const p = containerRef.current.querySelector('#loan-principal');
      const r = containerRef.current.querySelector('#loan-rate');
      const y = containerRef.current.querySelector('#loan-years');
      const btn = containerRef.current.querySelector('#loan-calc');
      const monthly = containerRef.current.querySelector('#loan-monthly');
      const total = containerRef.current.querySelector('#loan-total');

      const calc = () => {
        const principal = Number(p.value) || 0;
        const rate = Number(r.value) || 0;
        const years = Number(y.value) || 0;
        if (principal <= 0 || years <= 0) {
          monthly.textContent = '—';
          total.textContent = '—';
          return;
        }
        const monthlyRate = rate / 100 / 12;
        const n = years * 12;
        const payment = monthlyRate === 0 ? principal / n : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
        monthly.textContent = payment.toFixed(2);
        total.textContent = (payment * n).toFixed(2);
      };

      btn.addEventListener('click', calc);
      return () => btn.removeEventListener('click', calc);
    }

    if (slug === 'tip-calculator') {
      const bill = containerRef.current.querySelector('#tip-bill');
      const percent = containerRef.current.querySelector('#tip-percent');
      const people = containerRef.current.querySelector('#tip-people');
      const btn = containerRef.current.querySelector('#tip-calc');
      const tip = containerRef.current.querySelector('#tip-amount');
      const totalOut = containerRef.current.querySelector('#tip-total');
      const per = containerRef.current.querySelector('#tip-per');

      const calc = () => {
        const b = Number(bill.value) || 0;
        const p = Number(percent.value) || 0;
        const peopleCount = Math.max(1, Number(people.value) || 1);
        const tipAmount = (b * p) / 100;
        const totalAmount = b + tipAmount;
        tip.textContent = tipAmount.toFixed(2);
        totalOut.textContent = totalAmount.toFixed(2);
        per.textContent = (totalAmount / peopleCount).toFixed(2);
      };

      btn.addEventListener('click', calc);
      return () => btn.removeEventListener('click', calc);
    }

    if (slug === 'compound-interest') {
      const p = containerRef.current.querySelector('#ci-principal');
      const r = containerRef.current.querySelector('#ci-rate');
      const times = containerRef.current.querySelector('#ci-times');
      const y = containerRef.current.querySelector('#ci-years');
      const btn = containerRef.current.querySelector('#ci-calc');
      const out = containerRef.current.querySelector('#ci-result');

      const calc = () => {
        const principal = Number(p.value) || 0;
        const rate = Number(r.value) || 0;
        const n = Math.max(1, Number(times.value) || 1);
        const years = Number(y.value) || 0;
        const value = principal * Math.pow(1 + rate / 100 / n, n * years);
        out.textContent = value.toFixed(2);
      };

      btn.addEventListener('click', calc);
      return () => btn.removeEventListener('click', calc);
    }

    if (slug === 'cagr-calculator') {
      const start = containerRef.current.querySelector('#cagr-start');
      const end = containerRef.current.querySelector('#cagr-end');
      const years = containerRef.current.querySelector('#cagr-years');
      const btn = containerRef.current.querySelector('#cagr-calc');
      const out = containerRef.current.querySelector('#cagr-result');

      const calc = () => {
        const s = Number(start.value) || 0;
        const e = Number(end.value) || 0;
        const y = Number(years.value) || 0;
        if (s <= 0 || y <= 0) {
          out.textContent = 'Invalid inputs';
          return;
        }
        const cagr = (Math.pow(e / s, 1 / y) - 1) * 100;
        out.textContent = `${cagr.toFixed(2)}%`;
      };

      btn.addEventListener('click', calc);
      return () => btn.removeEventListener('click', calc);
    }

    if (slug === 'emi-calculator') {
      const principal = containerRef.current.querySelector('#emi-principal');
      const rate = containerRef.current.querySelector('#emi-rate');
      const tenure = containerRef.current.querySelector('#emi-tenure');
      const btn = containerRef.current.querySelector('#emi-calc');
      const out = containerRef.current.querySelector('#emi-result');

      const calc = () => {
        const p = Number(principal.value) || 0;
        const r = Number(rate.value) || 0;
        const n = Number(tenure.value) || 0;
        if (p <= 0 || n <= 0) {
          out.textContent = 'Invalid inputs';
          return;
        }
        const monthlyRate = r / 100 / 12;
        const emi = monthlyRate === 0 ? p / n : (p * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
        out.textContent = emi.toFixed(2);
      };

      btn.addEventListener('click', calc);
      return () => btn.removeEventListener('click', calc);
    }

    if (slug === 'discount-calculator') {
      const original = containerRef.current.querySelector('#discount-original');
      const percent = containerRef.current.querySelector('#discount-percent');
      const btn = containerRef.current.querySelector('#discount-calc');
      const finalOutput = containerRef.current.querySelector('#discount-final');
      const saveOutput = containerRef.current.querySelector('#discount-saved');

      const calc = () => {
        const o = Number(original.value) || 0;
        const p = Number(percent.value) || 0;
        const saved = o * (p / 100);
        finalOutput.textContent = (o - saved).toFixed(2);
        saveOutput.textContent = saved.toFixed(2);
      };

      btn.addEventListener('click', calc);
      return () => btn.removeEventListener('click', calc);
    }

    if (slug === 'simple-interest-calculator') {
      const principal = containerRef.current.querySelector('#si-principal');
      const rate = containerRef.current.querySelector('#si-rate');
      const years = containerRef.current.querySelector('#si-years');
      const btn = containerRef.current.querySelector('#si-calc');
      const interest = containerRef.current.querySelector('#si-interest');
      const total = containerRef.current.querySelector('#si-total');

      const calc = () => {
        const p = Number(principal.value) || 0;
        const r = Number(rate.value) || 0;
        const y = Number(years.value) || 0;
        const si = (p * r * y) / 100;
        interest.textContent = si.toFixed(2);
        total.textContent = (p + si).toFixed(2);
      };

      btn.addEventListener('click', calc);
      return () => btn.removeEventListener('click', calc);
    }

    if (slug === 'date-diff-calculator') {
      const start = containerRef.current.querySelector('#dd-start');
      const end = containerRef.current.querySelector('#dd-end');
      const btn = containerRef.current.querySelector('#dd-calc');
      const out = containerRef.current.querySelector('#dd-result');

      const calc = () => {
        if (!start.value || !end.value) {
          out.textContent = 'Pick both dates';
          return;
        }
        const diff = Math.ceil((new Date(end.value) - new Date(start.value)) / (1000 * 60 * 60 * 24));
        out.textContent = `${diff} days`;
      };

      btn.addEventListener('click', calc);
      return () => btn.removeEventListener('click', calc);
    }

    if (slug === 'mortgage-calculator') {
      const price = containerRef.current.querySelector('#mort-price');
      const down = containerRef.current.querySelector('#mort-down');
      const rate = containerRef.current.querySelector('#mort-rate');
      const years = containerRef.current.querySelector('#mort-years');
      const btn = containerRef.current.querySelector('#mort-calc');
      const out = containerRef.current.querySelector('#mort-result');

      const calc = () => {
        const principal = Number(price.value) - Number(down.value || 0);
        const r = (Number(rate.value) || 0) / 100 / 12;
        const n = (Number(years.value) || 0) * 12;
        if (principal <= 0 || n <= 0) {
          out.textContent = 'Invalid inputs';
          return;
        }
        const payment = r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));
        out.textContent = payment.toFixed(2);
      };

      btn.addEventListener('click', calc);
      return () => btn.removeEventListener('click', calc);
    }

    if (slug === 'fuel-cost-calculator') {
      const distance = containerRef.current.querySelector('#fuel-distance');
      const mpg = containerRef.current.querySelector('#fuel-mpg');
      const price = containerRef.current.querySelector('#fuel-price');
      const btn = containerRef.current.querySelector('#fuel-calc');
      const out = containerRef.current.querySelector('#fuel-result');

      const calc = () => {
        const d = Number(distance.value) || 0;
        const m = Number(mpg.value) || 0;
        const p = Number(price.value) || 0;
        if (m <= 0) {
          out.textContent = 'Invalid fuel economy';
          return;
        }
        out.textContent = ((d / m) * p).toFixed(2);
      };

      btn.addEventListener('click', calc);
      return () => btn.removeEventListener('click', calc);
    }

    if (slug === 'unit-price-calculator') {
      const total = containerRef.current.querySelector('#unit-total');
      const qty = containerRef.current.querySelector('#unit-qty');
      const btn = containerRef.current.querySelector('#unit-calc');
      const out = containerRef.current.querySelector('#unit-result');

      const calc = () => {
        const t = Number(total.value) || 0;
        const q = Number(qty.value) || 0;
        if (q <= 0) {
          out.textContent = 'Invalid quantity';
          return;
        }
        out.textContent = (t / q).toFixed(2);
      };

      btn.addEventListener('click', calc);
      return () => btn.removeEventListener('click', calc);
    }

    if (slug === 'savings-goal') {
      const goal = containerRef.current.querySelector('#save-goal');
      const current = containerRef.current.querySelector('#save-current');
      const monthly = containerRef.current.querySelector('#save-monthly');
      const rate = containerRef.current.querySelector('#save-rate');
      const btn = containerRef.current.querySelector('#save-calc');
      const out = containerRef.current.querySelector('#save-result');

      const calc = () => {
        const g = Number(goal.value) || 0;
        const c = Number(current.value) || 0;
        const m = Number(monthly.value) || 0;
        const r = Number(rate.value) || 0;
        if (g <= c || m <= 0) {
          out.textContent = 'Invalid inputs';
          return;
        }
        let balance = c;
        let months = 0;
        const monthlyRate = r / 100 / 12;
        while (balance < g && months < 10000) {
          balance = balance * (1 + monthlyRate) + m;
          months += 1;
        }
        out.textContent = months === 10000 ? 'Not reached in 10000 months' : String(months);
      };

      btn.addEventListener('click', calc);
      return () => btn.removeEventListener('click', calc);
    }

    if (slug === 'km-to-miles') {
      const input = containerRef.current.querySelector('#km-input');
      const btn = containerRef.current.querySelector('#km-convert');
      const out = containerRef.current.querySelector('#km-result');

      const convert = () => {
        const km = Number(input.value) || 0;
        out.textContent = (km * 0.621371).toFixed(2);
      };

      btn.addEventListener('click', convert);
      return () => btn.removeEventListener('click', convert);
    }

    if (slug === 'celsius-to-fahrenheit') {
      const input = containerRef.current.querySelector('#temp-input');
      const toF = containerRef.current.querySelector('#to-f');
      const toC = containerRef.current.querySelector('#to-c');
      const out = containerRef.current.querySelector('#temp-result');

      const fCalc = () => {
        const v = Number(input.value) || 0;
        out.textContent = `Result: ${(v * 9) / 5 + 32} °F`;
      };
      const cCalc = () => {
        const v = Number(input.value) || 0;
        out.textContent = `Result: ${((v - 32) * 5) / 9} °C`;
      };

      toF.addEventListener('click', fCalc);
      toC.addEventListener('click', cCalc);
      return () => {
        toF.removeEventListener('click', fCalc);
        toC.removeEventListener('click', cCalc);
      };
    }

    if (slug === 'bytes-to-human') {
      const input = containerRef.current.querySelector('#bytes-input');
      const btn = containerRef.current.querySelector('#bytes-convert');
      const out = containerRef.current.querySelector('#bytes-result');

      const convert = () => {
        let bytes = Number(input.value) || 0;
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let i = 0;
        while (bytes >= 1024 && i < units.length - 1) {
          bytes /= 1024;
          i++;
        }
        out.textContent = `${bytes.toFixed(2)} ${units[i]}`;
      };

      btn.addEventListener('click', convert);
      return () => btn.removeEventListener('click', convert);
    }

    if (slug === 'hex-to-rgb') {
      const input = containerRef.current.querySelector('#hex-input');
      const btn = containerRef.current.querySelector('#hex-convert');
      const out = containerRef.current.querySelector('#hex-result');

      const convert = () => {
        const value = (input.value || '').replace('#', '').trim();
        if (!/^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(value)) {
          out.textContent = 'Invalid hex color';
          return;
        }
        const hex = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        out.textContent = `rgb(${r}, ${g}, ${b})`;
      };

      btn.addEventListener('click', convert);
      return () => btn.removeEventListener('click', convert);
    }

    if (slug === 'rgb-to-hex') {
      const r = containerRef.current.querySelector('#r-input');
      const g = containerRef.current.querySelector('#g-input');
      const b = containerRef.current.querySelector('#b-input');
      const btn = containerRef.current.querySelector('#rgb-convert');
      const out = containerRef.current.querySelector('#rgb-result');

      const convert = () => {
        const red = Number(r.value) || 0;
        const green = Number(g.value) || 0;
        const blue = Number(b.value) || 0;
        if ([red, green, blue].some((v) => v < 0 || v > 255)) {
          out.textContent = 'Enter values 0-255';
          return;
        }
        const hex = '#' + [red, green, blue].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
        out.textContent = hex;
      };

      btn.addEventListener('click', convert);
      return () => btn.removeEventListener('click', convert);
    }

    if (slug === 'ms-to-time') {
      const input = containerRef.current.querySelector('#ms-input');
      const btn = containerRef.current.querySelector('#ms-convert');
      const out = containerRef.current.querySelector('#ms-result');

      const convert = () => {
        const ms = Number(input.value) || 0;
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        out.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      };

      btn.addEventListener('click', convert);
      return () => btn.removeEventListener('click', convert);
    }

    if (slug === 'minutes-to-hours') {
      const input = containerRef.current.querySelector('#min-input');
      const btn = containerRef.current.querySelector('#min-convert');
      const out = containerRef.current.querySelector('#min-result');

      const convert = () => {
        const mins = Number(input.value) || 0;
        const hours = Math.floor(mins / 60);
        const remainder = mins % 60;
        out.textContent = `${hours}h ${remainder}m`;
      };

      btn.addEventListener('click', convert);
      return () => btn.removeEventListener('click', convert);
    }

    if (slug === 'html-escape') {
      const input = containerRef.current.querySelector('#html-input');
      const output = containerRef.current.querySelector('#html-output');
      const escBtn = containerRef.current.querySelector('#html-escape-btn');
      const unBtn = containerRef.current.querySelector('#html-unescape-btn');

      const escape = () => {
        output.value = input.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      };
      const unescape = () => {
        output.value = input.value.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
      };

      escBtn.addEventListener('click', escape);
      unBtn.addEventListener('click', unescape);
      return () => {
        escBtn.removeEventListener('click', escape);
        unBtn.removeEventListener('click', unescape);
      };
    }

    if (slug === 'svg-to-dataurl') {
      const input = containerRef.current.querySelector('#svg-input');
      const btn = containerRef.current.querySelector('#svg-convert');
      const out = containerRef.current.querySelector('#svg-output');

      const convert = () => {
        const svg = input.value.trim();
        if (!svg) {
          out.value = '';
          return;
        }
        out.value = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      };

      btn.addEventListener('click', convert);
      return () => btn.removeEventListener('click', convert);
    }

    if (slug === 'json-pretty') {
      const input = containerRef.current.querySelector('#json-input');
      const pretty = containerRef.current.querySelector('#json-pretty-btn');
      const minify = containerRef.current.querySelector('#json-minify-btn');
      const output = containerRef.current.querySelector('#json-output');

      const prettyJson = () => {
        try {
          output.value = JSON.stringify(JSON.parse(input.value), null, 2);
        } catch {
          output.value = 'Invalid JSON';
        }
      };

      const minifiedJson = () => {
        try {
          output.value = JSON.stringify(JSON.parse(input.value));
        } catch {
          output.value = 'Invalid JSON';
        }
      };

      pretty.addEventListener('click', prettyJson);
      minify.addEventListener('click', minifiedJson);
      return () => {
        pretty.removeEventListener('click', prettyJson);
        minify.removeEventListener('click', minifiedJson);
      };
    }

    if (slug === 'unix-timestamp') {
      const tsInput = containerRef.current.querySelector('#ts-input');
      const toDateBtn = containerRef.current.querySelector('#ts-to-date');
      const dateInput = containerRef.current.querySelector('#date-input');
      const toTsBtn = containerRef.current.querySelector('#date-to-ts');
      const out = containerRef.current.querySelector('#ts-result');

      const toDate = () => {
        const ts = Number(tsInput.value) || 0;
        out.textContent = `Result: ${new Date(ts * 1000).toISOString()}`;
      };
      const toTs = () => {
        const value = new Date(dateInput.value).getTime() / 1000;
        out.textContent = `Result: ${Math.floor(value)}`;
      };

      toDateBtn.addEventListener('click', toDate);
      toTsBtn.addEventListener('click', toTs);
      return () => {
        toDateBtn.removeEventListener('click', toDate);
        toTsBtn.removeEventListener('click', toTs);
      };
    }

    if (slug === 'roman-numeral') {
      const numInput = containerRef.current.querySelector('#roman-number');
      const romanInput = containerRef.current.querySelector('#roman-input');
      const toRomanBtn = containerRef.current.querySelector('#int-to-roman');
      const toIntBtn = containerRef.current.querySelector('#roman-to-int');
      const out = containerRef.current.querySelector('#roman-result');

      const toRoman = () => {
        const value = Number(numInput.value) || 0;
        const map = [
          [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
          [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
        ];
        let result = '';
        let n = value;
        for (const [num, symbol] of map) {
          while (n >= num) {
            result += symbol;
            n -= num;
          }
        }
        out.textContent = `Result: ${result || 'Invalid number'}`;
      };

      const toInt = () => {
        const str = romanInput.value.trim();
        const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
        let total = 0;
        for (let i = 0; i < str.length; i++) {
          const current = map[str[i]] || 0;
          const next = map[str[i + 1]] || 0;
          total += current < next ? -current : current;
        }
        out.textContent = `Result: ${total}`;
      };

      toRomanBtn.addEventListener('click', toRoman);
      toIntBtn.addEventListener('click', toInt);
      return () => {
        toRomanBtn.removeEventListener('click', toRoman);
        toIntBtn.removeEventListener('click', toInt);
      };
    }

    if (slug === 'fraction-to-decimal') {
      const input = containerRef.current.querySelector('#frac-input');
      const btn = containerRef.current.querySelector('#frac-convert');
      const out = containerRef.current.querySelector('#frac-result');

      const convert = () => {
        const value = input.value.trim();
        const [n, d] = value.split('/');
        const numerator = Number(n);
        const denominator = Number(d);
        if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
          out.textContent = 'Invalid fraction';
          return;
        }
        out.textContent = (numerator / denominator).toString();
      };

      btn.addEventListener('click', convert);
      return () => btn.removeEventListener('click', convert);
    }

    if (slug === 'meters-to-feet') {
      const input = containerRef.current.querySelector('#m-input');
      const btn = containerRef.current.querySelector('#m-convert');
      const out = containerRef.current.querySelector('#m-result');

      const convert = () => {
        const meters = Number(input.value) || 0;
        out.textContent = (meters * 3.28084).toFixed(2);
      };

      btn.addEventListener('click', convert);
      return () => btn.removeEventListener('click', convert);
    }

    if (slug === 'inches-to-cm') {
      const input = containerRef.current.querySelector('#inch-input');
      const btn = containerRef.current.querySelector('#inch-convert');
      const out = containerRef.current.querySelector('#inch-result');

      const convert = () => {
        const inches = Number(input.value) || 0;
        out.textContent = (inches * 2.54).toFixed(2);
      };

      btn.addEventListener('click', convert);
      return () => btn.removeEventListener('click', convert);
    }

    return;
  }, [slug, html]);

  return <div ref={containerRef} />;
}
