"use client";

import { useEffect, useRef } from 'react';

const toTitle = (value) =>
  value
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const safeNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const textFrom = (selector) => {
  const el = document.querySelector(selector);
  return el ? el.value || '' : '';
};

const setResult = (selector, value) => {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
};

const bindAction = (buttonId, handler) => {
  const button = document.getElementById(buttonId);
  if (!button) return undefined;
  const action = () => handler();
  button.addEventListener('click', action);
  return () => button.removeEventListener('click', action);
};

const bindClear = (buttonId, fields) => {
  const button = document.getElementById(buttonId);
  if (!button) return undefined;
  const action = () => {
    fields.forEach(({ selector, type = 'value' }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      if (type === 'innerHTML') {
        el.innerHTML = '';
      } else {
        el.value = '';
      }
    });
  };
  button.addEventListener('click', action);
  return () => button.removeEventListener('click', action);
};

export default function ToolRenderer({ slug, html }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cleanup = [];

    const addCleanup = (fn) => {
      if (fn) cleanup.push(fn);
    };

    const applyTextCounter = (inputId, wordId, charId, lineId) => {
      const input = document.getElementById(inputId);
      if (!input) return;
      const update = () => {
        const value = input.value || '';
        const words = value.trim() ? value.trim().split(/\s+/).length : 0;
        const chars = value.length;
        const lines = value.split(/\r?\n/).filter((line) => line.trim() !== '').length;
        setResult(`#${wordId}`, String(words));
        setResult(`#${charId}`, String(chars));
        setResult(`#${lineId}`, String(lines));
      };
      input.addEventListener('input', update);
      addCleanup(() => input.removeEventListener('input', update));
      update();
    };

    switch (slug) {
      case 'word-counter':
        applyTextCounter('word-counter-input', 'word-counter-words', 'word-counter-chars', 'word-counter-lines');
        break;
      case 'case-converter': {
        const input = document.getElementById('case-converter-input');
        const output = document.getElementById('case-converter-output');
        const toTitleCase = (value) =>
          value
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        if (input && output) {
          const setUpper = () => {
            output.value = input.value.toUpperCase();
          };
          const setLower = () => {
            output.value = input.value.toLowerCase();
          };
          const setTitle = () => {
            output.value = toTitleCase(input.value);
          };
          const clear = () => {
            input.value = '';
            output.value = '';
          };
          document.getElementById('case-upper')?.addEventListener('click', setUpper);
          document.getElementById('case-lower')?.addEventListener('click', setLower);
          document.getElementById('case-title')?.addEventListener('click', setTitle);
          document.getElementById('case-clear')?.addEventListener('click', clear);
          addCleanup(() => {
            document.getElementById('case-upper')?.removeEventListener('click', setUpper);
            document.getElementById('case-lower')?.removeEventListener('click', setLower);
            document.getElementById('case-title')?.removeEventListener('click', setTitle);
            document.getElementById('case-clear')?.removeEventListener('click', clear);
          });
        }
        break;
      }
      case 'bmi-calculator':
        addCleanup(
          bindAction('bmi-calc', () => {
            const weight = safeNumber(document.getElementById('bmi-weight')?.value, NaN);
            const heightCm = safeNumber(document.getElementById('bmi-height')?.value, NaN);
            const result = document.getElementById('bmi-result');
            if (!result || Number.isNaN(weight) || Number.isNaN(heightCm) || heightCm <= 0) {
              result.textContent = 'Enter valid values';
              return;
            }
            const bmi = weight / ((heightCm / 100) ** 2);
            const label = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
            result.textContent = `${bmi.toFixed(1)} (${label})`;
          }),
        );
        break;
      case 'age-calculator':
        addCleanup(
          bindAction('age-calc', () => {
            const dobInput = document.getElementById('age-dob');
            const result = document.getElementById('age-result');
            if (!dobInput || !result) return;
            const birth = new Date(dobInput.value);
            if (Number.isNaN(birth.getTime())) {
              result.textContent = 'Pick a valid date';
              return;
            }
            const today = new Date();
            let ageYears = today.getFullYear() - birth.getFullYear();
            let ageMonths = today.getMonth() - birth.getMonth();
            let ageDays = today.getDate() - birth.getDate();
            if (ageDays < 0) {
              ageMonths -= 1;
              const prevMonthDate = new Date(today.getFullYear(), today.getMonth(), 0);
              ageDays += prevMonthDate.getDate();
            }
            if (ageMonths < 0) {
              ageYears -= 1;
              ageMonths += 12;
            }
            result.textContent = `Your age: ${ageYears} years, ${ageMonths} months, ${ageDays} days`;
          }),
        );
        break;
      case 'kg-to-lbs':
        addCleanup(
          bindAction('kg-convert', () => {
            const input = document.getElementById('kg-input');
            const result = document.getElementById('kg-result');
            if (!input || !result) return;
            const kg = Number(input.value);
            result.textContent = Number.isFinite(kg) ? `${(kg * 2.20462).toFixed(2)} lbs` : 'Enter a valid value';
          }),
        );
        break;
      case 'password-generator': {
        const lengthInput = document.getElementById('pwd-length');
        const output = document.getElementById('pwd-output');
        const generate = () => {
          const length = clamp(Number(lengthInput?.value || 16), 4, 64);
          const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
          let result = '';
          for (let i = 0; i < length; i += 1) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          if (output) output.value = result;
        };
        addCleanup(bindAction('pwd-generate', generate));
        addCleanup(bindAction('pwd-copy', async () => {
          if (!output || !output.value) return;
          await navigator.clipboard.writeText(output.value);
        }));
        generate();
        break;
      }
      case 'qr-code-generator':
        addCleanup(
          bindAction('qr-generate', () => {
            const input = document.getElementById('qr-input');
            const output = document.getElementById('qr-output');
            if (!input || !output) return;
            const value = input.value.trim();
            if (!value) {
              output.innerHTML = '<div class="text-sm text-slate-500">Enter text or URL to generate a QR code.</div>';
              return;
            }
            const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(value)}`;
            output.innerHTML = `<img src="${url}" alt="QR code" class="h-48 w-48 rounded border border-slate-200 bg-white p-2" />`;
          }),
        );
        addCleanup(
          bindAction('qr-clear', () => {
            const input = document.getElementById('qr-input');
            const output = document.getElementById('qr-output');
            if (input) input.value = '';
            if (output) output.innerHTML = '';
          }),
        );
        break;
      case 'base64': {
        const input = document.getElementById('b64-input');
        const output = document.getElementById('b64-output');
        if (input && output) {
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
          document.getElementById('b64-encode')?.addEventListener('click', encode);
          document.getElementById('b64-decode')?.addEventListener('click', decode);
          addCleanup(() => {
            document.getElementById('b64-encode')?.removeEventListener('click', encode);
            document.getElementById('b64-decode')?.removeEventListener('click', decode);
          });
        }
        break;
      }
      case 'percentage-calculator':
        addCleanup(
          bindAction('pct-calc', () => {
            const base = Number(document.getElementById('pct-base')?.value || 0);
            const percent = Number(document.getElementById('pct-percent')?.value || 0);
            const result = document.getElementById('pct-result');
            if (!result) return;
            result.textContent = `${((base * percent) / 100).toFixed(2)}`;
          }),
        );
        break;
      case 'lorem-ipsum':
        addCleanup(
          bindAction('lorem-gen', () => {
            const count = Math.max(1, Math.min(10, Number(document.getElementById('lorem-count')?.value || 3)));
            const filler = [
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
              'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
              'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            ];
            const output = document.getElementById('lorem-output');
            if (!output) return;
            output.innerHTML = Array.from({ length: count }, (_, index) => `<p class="mb-3 text-sm text-slate-600">${filler[index % filler.length]}</p>`).join('');
          }),
        );
        break;
      case 'text-summary':
        addCleanup(
          bindAction('text-summary-action', () => {
            const value = textFrom('#text-summary-input');
            const words = value.trim() ? value.trim().split(/\s+/).length : 0;
            const sentences = value.split(/[.!?]+/).filter(Boolean).length;
            const paragraphs = value.split(/\n{2,}/).filter(Boolean).length || 1;
            const summary = `Words: ${words}\nSentences: ${sentences}\nParagraphs: ${paragraphs}\nLength: ${value.length} chars`;
            setResult('#text-summary-result', summary);
          }),
        );
        addCleanup(bindClear('text-summary-clear', [{ selector: '#text-summary-input' }, { selector: '#text-summary-result', type: 'innerHTML' }]));
        break;
      case 'character-counter':
        addCleanup(
          bindAction('character-counter-action', () => {
            const value = textFrom('#character-counter-input');
            const stats = {
              chars: value.length,
              charsNoSpaces: value.replace(/\s/g, '').length,
              words: value.trim() ? value.trim().split(/\s+/).length : 0,
              spaces: (value.match(/\s/g) || []).length,
            };
            setResult('#character-counter-result', `Characters: ${stats.chars}\nNo spaces: ${stats.charsNoSpaces}\nWords: ${stats.words}\nSpaces: ${stats.spaces}`);
          }),
        );
        addCleanup(bindClear('character-counter-clear', [{ selector: '#character-counter-input' }, { selector: '#character-counter-result', type: 'innerHTML' }]));
        break;
      case 'reverse-text':
        addCleanup(
          bindAction('reverse-text-action', () => {
            setResult('#reverse-text-result', textFrom('#reverse-text-input').split('').reverse().join(''));
          }),
        );
        addCleanup(bindClear('reverse-text-clear', [{ selector: '#reverse-text-input' }, { selector: '#reverse-text-result', type: 'innerHTML' }]));
        break;
      case 'duplicate-line-remover':
        addCleanup(
          bindAction('duplicate-line-remover-action', () => {
            const lines = textFrom('#duplicate-line-remover-input').split(/\r?\n/);
            const clean = [...new Set(lines.filter((line) => line.trim() !== ''))];
            setResult('#duplicate-line-remover-result', clean.join('\n'));
          }),
        );
        addCleanup(bindClear('duplicate-line-remover-clear', [{ selector: '#duplicate-line-remover-input' }, { selector: '#duplicate-line-remover-result', type: 'innerHTML' }]));
        break;
      case 'find-and-replace':
        addCleanup(
          bindAction('find-and-replace-action', () => {
            const input = textFrom('#find-and-replace-input');
            const find = document.getElementById('find-and-replace-find')?.value || '';
            const replace = document.getElementById('find-and-replace-replace')?.value || '';
            setResult('#find-and-replace-result', input.replaceAll(find, replace));
          }),
        );
        addCleanup(bindClear('find-and-replace-clear', [{ selector: '#find-and-replace-input' }, { selector: '#find-and-replace-find' }, { selector: '#find-and-replace-replace' }, { selector: '#find-and-replace-result', type: 'innerHTML' }]));
        break;
      case 'text-to-slug':
        addCleanup(
          bindAction('text-to-slug-action', () => {
            const value = textFrom('#text-to-slug-input');
            const slug = value
              .toLowerCase()
              .trim()
              .normalize('NFKD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9\s-]/g, '')
              .trim()
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-');
            setResult('#text-to-slug-result', slug || 'your-slug-here');
          }),
        );
        addCleanup(bindClear('text-to-slug-clear', [{ selector: '#text-to-slug-input' }, { selector: '#text-to-slug-result', type: 'innerHTML' }]));
        break;
      case 'email-extractor':
        addCleanup(
          bindAction('email-extractor-action', () => {
            const matches = [...new Set((textFrom('#email-extractor-input').match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []))];
            setResult('#email-extractor-result', matches.length ? matches.join('\n') : 'No email addresses found');
          }),
        );
        addCleanup(bindClear('email-extractor-clear', [{ selector: '#email-extractor-input' }, { selector: '#email-extractor-result', type: 'innerHTML' }]));
        break;
      case 'random-text-sample':
        addCleanup(
          bindAction('random-text-sample-action', () => {
            const choices = [
              'Strategic planning is critical when building durable workflows and sustainable products.',
              'The most reliable systems are simple to understand, easy to adjust, and consistent in use.',
              'Strong communication reduces friction and keeps teams aligned around shared goals.',
              'Efficient documentation helps teams move faster without losing clarity or trust.',
            ];
            const seed = textFrom('#random-text-sample-input').trim();
            const value = seed ? `${seed}\n\n${choices[Math.floor(Math.random() * choices.length)]}` : choices[Math.floor(Math.random() * choices.length)];
            setResult('#random-text-sample-result', value);
          }),
        );
        addCleanup(bindClear('random-text-sample-clear', [{ selector: '#random-text-sample-input' }, { selector: '#random-text-sample-result', type: 'innerHTML' }]));
        break;
      case 'readability-score':
        addCleanup(
          bindAction('readability-score-action', () => {
            const text = textFrom('#readability-score-input');
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
            const syllables = (text.toLowerCase().match(/[aeiouy]+/g) || []).length;
            const score = words === 0 ? 0 : 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
            setResult('#readability-score-result', `Estimated Flesch reading ease: ${score.toFixed(1)}`);
          }),
        );
        addCleanup(bindClear('readability-score-clear', [{ selector: '#readability-score-input' }, { selector: '#readability-score-result', type: 'innerHTML' }]));
        break;
      case 'sentence-counter':
        addCleanup(
          bindAction('sentence-counter-action', () => {
            const value = textFrom('#sentence-counter-input');
            const sentences = value.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0).length;
            setResult('#sentence-counter-result', `Sentences: ${sentences}\nWords: ${(value.match(/\b\w+\b/g) || []).length}\nCharacters: ${value.length}`);
          }),
        );
        addCleanup(bindClear('sentence-counter-clear', [{ selector: '#sentence-counter-input' }, { selector: '#sentence-counter-result', type: 'innerHTML' }]));
        break;
      case 'json-formatter':
        addCleanup(
          bindAction('json-formatter-action', () => {
            try {
              const parsed = JSON.parse(textFrom('#json-formatter-input'));
              setResult('#json-formatter-result', JSON.stringify(parsed, null, 2));
            } catch {
              setResult('#json-formatter-result', 'Invalid JSON');
            }
          }),
        );
        addCleanup(bindClear('json-formatter-clear', [{ selector: '#json-formatter-input' }, { selector: '#json-formatter-result', type: 'innerHTML' }]));
        break;
      case 'json-validator':
        addCleanup(
          bindAction('json-validator-action', () => {
            try {
              JSON.parse(textFrom('#json-validator-input'));
              setResult('#json-validator-result', 'Valid JSON');
            } catch {
              setResult('#json-validator-result', 'Invalid JSON');
            }
          }),
        );
        addCleanup(bindClear('json-validator-clear', [{ selector: '#json-validator-input' }, { selector: '#json-validator-result', type: 'innerHTML' }]));
        break;
      case 'url-parser':
        addCleanup(
          bindAction('url-parser-action', () => {
            try {
              const url = new URL(textFrom('#url-parser-input'));
              const result = [
                `Protocol: ${url.protocol}`,
                `Host: ${url.host}`,
                `Hostname: ${url.hostname}`,
                `Path: ${url.pathname}`,
                `Query: ${url.search || '(none)'}`,
                `Hash: ${url.hash || '(none)'}`,
              ].join('\n');
              setResult('#url-parser-result', result);
            } catch {
              setResult('#url-parser-result', 'Please enter a valid URL');
            }
          }),
        );
        addCleanup(bindClear('url-parser-clear', [{ selector: '#url-parser-input' }, { selector: '#url-parser-result', type: 'innerHTML' }]));
        break;
      case 'hex-color-tool':
        addCleanup(
          bindAction('hex-color-tool-action', () => {
            const value = textFrom('#hex-color-tool-input').trim();
            const match = value.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
            if (!match) {
              setResult('#hex-color-tool-result', 'Enter a valid hex color like #2563eb');
              return;
            }
            const hex = match[1].length === 3 ? match[1].split('').map((c) => c + c).join('') : match[1];
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            const rgb = `rgb(${r}, ${g}, ${b})`;
            setResult('#hex-color-tool-result', `${rgb}\nHex: #${hex.toUpperCase()}`);
            const swatch = document.getElementById('hex-color-tool-swatch');
            if (swatch) swatch.style.background = `#${hex}`;
          }),
        );
        addCleanup(bindClear('hex-color-tool-clear', [{ selector: '#hex-color-tool-input' }, { selector: '#hex-color-tool-result', type: 'innerHTML' }, { selector: '#hex-color-tool-swatch', type: 'innerHTML' }]));
        break;
      case 'css-beautifier':
        addCleanup(
          bindAction('css-beautifier-action', () => {
            const value = textFrom('#css-beautifier-input');
            const easy = value.replace(/\s*\{\s*/g, ' {\n  ').replace(/;\s*/g, ';\n  ').replace(/\s*\}\s*/g, '\n}\n');
            setResult('#css-beautifier-result', easy.trim());
          }),
        );
        addCleanup(bindClear('css-beautifier-clear', [{ selector: '#css-beautifier-input' }, { selector: '#css-beautifier-result', type: 'innerHTML' }]));
        break;
      case 'base-converter':
        addCleanup(
          bindAction('base-converter-action', () => {
            const value = textFrom('#base-converter-input');
            const target = document.getElementById('base-converter-target')?.value || 'decimal';
            try {
              const parseValue = (source) => {
                if (source === 'decimal') return Number(value);
                if (source === 'binary') return parseInt(value, 2);
                if (source === 'hex') return parseInt(value.replace(/^0x/, ''), 16);
                return Number(value);
              };
              const num = parseValue('decimal');
              let result = '';
              if (target === 'binary') result = num.toString(2);
              else if (target === 'hex') result = `0x${num.toString(16)}`;
              else result = String(num);
              setResult('#base-converter-result', result);
            } catch {
              setResult('#base-converter-result', 'Invalid input');
            }
          }),
        );
        addCleanup(bindClear('base-converter-clear', [{ selector: '#base-converter-input' }, { selector: '#base-converter-result', type: 'innerHTML' }]));
        break;
      case 'uuid-generator':
        addCleanup(
          bindAction('uuid-generator-action', () => {
            const value = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
              const r = Math.random() * 16 | 0;
              const v = c === 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });
            setResult('#uuid-generator-result', value);
          }),
        );
        addCleanup(bindClear('uuid-generator-clear', [{ selector: '#uuid-generator-result', type: 'innerHTML' }]));
        break;
      case 'sha256-hash':
        addCleanup(
          bindAction('sha256-hash-action', async () => {
            const text = textFrom('#sha256-hash-input');
            const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
            const bytes = Array.from(new Uint8Array(hash));
            const hex = bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('');
            setResult('#sha256-hash-result', hex);
          }),
        );
        addCleanup(bindClear('sha256-hash-clear', [{ selector: '#sha256-hash-input' }, { selector: '#sha256-hash-result', type: 'innerHTML' }]));
        break;
      case 'regex-tester':
        addCleanup(
          bindAction('regex-tester-action', () => {
            const patternInput = document.getElementById('regex-tester-pattern');
            const source = textFrom('#regex-tester-input');
            try {
              const regex = new RegExp(patternInput?.value || '', 'g');
              const matches = Array.from(source.matchAll(regex)).map((match) => match[0]);
              setResult('#regex-tester-result', matches.length ? matches.join(', ') : 'No matches');
            } catch {
              setResult('#regex-tester-result', 'Invalid regex pattern');
            }
          }),
        );
        addCleanup(bindClear('regex-tester-clear', [{ selector: '#regex-tester-input' }, { selector: '#regex-tester-pattern' }, { selector: '#regex-tester-result', type: 'innerHTML' }]));
        break;
      case 'markdown-preview':
        addCleanup(
          bindAction('markdown-preview-action', () => {
            const text = textFrom('#markdown-preview-input');
            const html = text
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.+?)\*/g, '<em>$1</em>')
              .replace(/`(.+?)`/g, '<code>$1</code>')
              .replace(/\n/g, '<br />');
            const output = document.getElementById('markdown-preview-result');
            if (output) output.innerHTML = html || 'Preview appears here';
          }),
        );
        addCleanup(bindClear('markdown-preview-clear', [{ selector: '#markdown-preview-input' }, { selector: '#markdown-preview-result', type: 'innerHTML' }]));
        break;
      case 'average-calculator':
        addCleanup(
          bindAction('average-calculator-action', () => {
            const numbers = textFrom('#average-calculator-values').split(',').map((part) => Number(part.trim())).filter((n) => Number.isFinite(n));
            const result = numbers.length ? numbers.reduce((sum, n) => sum + n, 0) / numbers.length : 0;
            setResult('#average-calculator-result', result.toFixed(2));
          }),
        );
        break;
      case 'percentage-difference':
        addCleanup(
          bindAction('percentage-difference-action', () => {
            const a = Number(document.getElementById('percentage-difference-a')?.value || 0);
            const b = Number(document.getElementById('percentage-difference-b')?.value || 0);
            const diff = b === 0 ? 0 : ((b - a) / a) * 100;
            setResult('#percentage-difference-result', `${diff.toFixed(2)}%`);
          }),
        );
        break;
      case 'compound-interest':
        addCleanup(
          bindAction('compound-interest-action', () => {
            const principal = Number(document.getElementById('compound-interest-principal')?.value || 0);
            const rate = Number(document.getElementById('compound-interest-rate')?.value || 0) / 100;
            const years = Number(document.getElementById('compound-interest-years')?.value || 0);
            const periods = Number(document.getElementById('compound-interest-periods')?.value || 12);
            const value = principal * (1 + rate / periods) ** (periods * years);
            setResult('#compound-interest-result', `$${value.toFixed(2)}`);
          }),
        );
        break;
      case 'loan-calculator':
        addCleanup(
          bindAction('loan-calculator-action', () => {
            const amount = Number(document.getElementById('loan-calculator-amount')?.value || 0);
            const rate = Number(document.getElementById('loan-calculator-rate')?.value || 0) / 100 / 12;
            const months = Number(document.getElementById('loan-calculator-months')?.value || 0);
            const payment = rate === 0 ? amount / months : (amount * rate) / (1 - (1 + rate) ** -months);
            setResult('#loan-calculator-result', `$${payment.toFixed(2)}/mo`);
          }),
        );
        break;
      case 'fraction-simplifier':
        addCleanup(
          bindAction('fraction-simplifier-action', () => {
            const numerator = Number(document.getElementById('fraction-simplifier-numerator')?.value || 0);
            const denominator = Number(document.getElementById('fraction-simplifier-denominator')?.value || 1);
            const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
            const div = gcd(Math.abs(numerator), Math.abs(denominator));
            setResult('#fraction-simplifier-result', `${numerator / div}/${denominator / div}`);
          }),
        );
        break;
      case 'quadratic-solver':
        addCleanup(
          bindAction('quadratic-solver-action', () => {
            const a = Number(document.getElementById('quadratic-solver-a')?.value || 0);
            const b = Number(document.getElementById('quadratic-solver-b')?.value || 0);
            const c = Number(document.getElementById('quadratic-solver-c')?.value || 0);
            const disc = b * b - 4 * a * c;
            if (disc < 0) {
              setResult('#quadratic-solver-result', 'No real roots');
              return;
            }
            const root1 = (-b + Math.sqrt(disc)) / (2 * a);
            const root2 = (-b - Math.sqrt(disc)) / (2 * a);
            setResult('#quadratic-solver-result', `x₁ = ${root1.toFixed(2)}, x₂ = ${root2.toFixed(2)}`);
          }),
        );
        break;
      case 'prime-checker':
        addCleanup(
          bindAction('prime-checker-action', () => {
            const n = Number(document.getElementById('prime-checker-value')?.value || 0);
            if (n < 2) {
              setResult('#prime-checker-result', 'Not prime');
              return;
            }
            let prime = true;
            for (let i = 2; i <= Math.sqrt(n); i += 1) {
              if (n % i === 0) prime = false;
            }
            setResult('#prime-checker-result', prime ? 'Prime' : 'Not prime');
          }),
        );
        break;
      case 'factorial-calculator':
        addCleanup(
          bindAction('factorial-calculator-action', () => {
            let n = Number(document.getElementById('factorial-calculator-value')?.value || 0);
            if (n < 0 || !Number.isInteger(n)) {
              setResult('#factorial-calculator-result', 'Use a non-negative integer');
              return;
            }
            let result = 1;
            for (let i = 2; i <= n; i += 1) result *= i;
            setResult('#factorial-calculator-result', String(result));
          }),
        );
        break;
      case 'random-number-generator':
        addCleanup(
          bindAction('random-number-generator-action', () => {
            const min = Number(document.getElementById('random-number-generator-min')?.value || 0);
            const max = Number(document.getElementById('random-number-generator-max')?.value || 100);
            const value = min + Math.random() * (max - min);
            setResult('#random-number-generator-result', value.toFixed(2));
          }),
        );
        break;
      case 'arithmetic-sequence':
        addCleanup(
          bindAction('arithmetic-sequence-action', () => {
            const start = Number(document.getElementById('arithmetic-sequence-start')?.value || 0);
            const diff = Number(document.getElementById('arithmetic-sequence-diff')?.value || 1);
            const terms = Number(document.getElementById('arithmetic-sequence-terms')?.value || 5);
            const values = Array.from({ length: terms }, (_, index) => start + index * diff);
            setResult('#arithmetic-sequence-result', values.join(', '));
          }),
        );
        break;
      case 'roi-calculator':
        addCleanup(
          bindAction('roi-calculator-action', () => {
            const investment = Number(document.getElementById('roi-calculator-investment')?.value || 0);
            const final = Number(document.getElementById('roi-calculator-final')?.value || 0);
            const roi = investment === 0 ? 0 : ((final - investment) / investment) * 100;
            setResult('#roi-calculator-result', `${roi.toFixed(2)}%`);
          }),
        );
        break;
      case 'discount-calculator':
        addCleanup(
          bindAction('discount-calculator-action', () => {
            const price = Number(document.getElementById('discount-calculator-price')?.value || 0);
            const discount = Number(document.getElementById('discount-calculator-discount')?.value || 0);
            const finalPrice = price * (1 - discount / 100);
            setResult('#discount-calculator-result', `$${finalPrice.toFixed(2)}`);
          }),
        );
        break;
      case 'emi-calculator':
        addCleanup(
          bindAction('emi-calculator-action', () => {
            const amount = Number(document.getElementById('emi-calculator-amount')?.value || 0);
            const rate = Number(document.getElementById('emi-calculator-rate')?.value || 0) / 12 / 100;
            const months = Number(document.getElementById('emi-calculator-months')?.value || 0);
            const emi = rate === 0 ? amount / months : (amount * rate) / (1 - Math.pow(1 + rate, -months));
            setResult('#emi-calculator-result', `$${emi.toFixed(2)}`);
          }),
        );
        break;
      case 'tax-estimator':
        addCleanup(
          bindAction('tax-estimator-action', () => {
            const amount = Number(document.getElementById('tax-estimator-amount')?.value || 0);
            const rate = Number(document.getElementById('tax-estimator-rate')?.value || 0) / 100;
            const tax = amount * rate;
            setResult('#tax-estimator-result', `$${tax.toFixed(2)}`);
          }),
        );
        break;
      case 'currency-converter':
        addCleanup(
          bindAction('currency-converter-action', () => {
            const amount = Number(document.getElementById('currency-converter-amount')?.value || 0);
            const rate = Number(document.getElementById('currency-converter-rate')?.value || 1);
            setResult('#currency-converter-result', `${(amount * rate).toFixed(2)}`);
          }),
        );
        break;
      case 'net-salary-calculator':
        addCleanup(
          bindAction('net-salary-calculator-action', () => {
            const gross = Number(document.getElementById('net-salary-calculator-gross')?.value || 0);
            const tax = Number(document.getElementById('net-salary-calculator-tax')?.value || 0) / 100;
            const deductions = Number(document.getElementById('net-salary-calculator-deductions')?.value || 0);
            const net = gross * (1 - tax) - deductions;
            setResult('#net-salary-calculator-result', `$${net.toFixed(2)}`);
          }),
        );
        break;
      case 'future-value-calculator':
        addCleanup(
          bindAction('future-value-calculator-action', () => {
            const present = Number(document.getElementById('future-value-calculator-present')?.value || 0);
            const rate = Number(document.getElementById('future-value-calculator-rate')?.value || 0) / 100;
            const years = Number(document.getElementById('future-value-calculator-years')?.value || 0);
            const future = present * (1 + rate) ** years;
            setResult('#future-value-calculator-result', `$${future.toFixed(2)}`);
          }),
        );
        break;
      case 'break-even-calculator':
        addCleanup(
          bindAction('break-even-calculator-action', () => {
            const fixedCosts = Number(document.getElementById('break-even-calculator-fixed')?.value || 0);
            const variable = Number(document.getElementById('break-even-calculator-variable')?.value || 0);
            const price = Number(document.getElementById('break-even-calculator-price')?.value || 0);
            const units = price > variable ? fixedCosts / (price - variable) : 0;
            setResult('#break-even-calculator-result', `${units.toFixed(0)} units`);
          }),
        );
        break;
      case 'inflation-adjuster':
        addCleanup(
          bindAction('inflation-adjuster-action', () => {
            const amount = Number(document.getElementById('inflation-adjuster-amount')?.value || 0);
            const rate = Number(document.getElementById('inflation-adjuster-rate')?.value || 0) / 100;
            const years = Number(document.getElementById('inflation-adjuster-years')?.value || 0);
            const adjusted = amount * (1 + rate) ** years;
            setResult('#inflation-adjuster-result', `$${adjusted.toFixed(2)}`);
          }),
        );
        break;
      case 'monthly-budget-planner':
        addCleanup(
          bindAction('monthly-budget-planner-action', () => {
            const income = Number(document.getElementById('monthly-budget-planner-income')?.value || 0);
            const essentials = Number(document.getElementById('monthly-budget-planner-essentials')?.value || 0);
            const savings = Number(document.getElementById('monthly-budget-planner-savings')?.value || 0);
            const remaining = income - essentials - savings;
            setResult('#monthly-budget-planner-result', `Remaining: $${remaining.toFixed(2)}`);
          }),
        );
        break;
      case 'days-between-dates':
        addCleanup(
          bindAction('days-between-dates-action', () => {
            const start = document.getElementById('days-between-dates-start')?.value;
            const end = document.getElementById('days-between-dates-end')?.value;
            if (!start || !end) {
              setResult('#days-between-dates-result', 'Choose valid dates');
              return;
            }
            const diff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
            setResult('#days-between-dates-result', `${diff} days`);
          }),
        );
        break;
      case 'add-days':
        addCleanup(
          bindAction('add-days-action', () => {
            const date = document.getElementById('add-days-date')?.value;
            const days = Number(document.getElementById('add-days-days')?.value || 0);
            if (!date) {
              setResult('#add-days-result', 'Choose a date');
              return;
            }
            const value = new Date(date);
            value.setDate(value.getDate() + days);
            setResult('#add-days-result', value.toISOString().slice(0, 10));
          }),
        );
        break;
      case 'timezone-converter':
        addCleanup(
          bindAction('timezone-converter-action', () => {
            const time = document.getElementById('timezone-converter-time')?.value;
            const offset = Number(document.getElementById('timezone-converter-offset')?.value || 0);
            if (!time) {
              setResult('#timezone-converter-result', 'Choose a time');
              return;
            }
            const [hours, minutes] = time.split(':').map(Number);
            const utcMinutes = hours * 60 + minutes - offset * 60;
            const totalMinutes = ((utcMinutes % 1440) + 1440) % 1440;
            const formatted = `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
            setResult('#timezone-converter-result', `${formatted} UTC±${offset}`);
          }),
        );
        break;
      case 'countdown-timer':
        addCleanup(
          bindAction('countdown-timer-action', () => {
            const date = document.getElementById('countdown-timer-date')?.value;
            const time = document.getElementById('countdown-timer-time')?.value;
            const output = document.getElementById('countdown-timer-result');
            if (!date || !time || !output) return;
            const target = new Date(`${date}T${time}`);
            const update = () => {
              const diff = target.getTime() - Date.now();
              if (diff <= 0) {
                output.textContent = 'Countdown complete';
                return;
              }
              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
              const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
              const minutes = Math.floor((diff / (1000 * 60)) % 60);
              const seconds = Math.floor((diff / 1000) % 60);
              output.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            };
            update();
            const interval = setInterval(update, 1000);
            addCleanup(() => clearInterval(interval));
          }),
        );
        break;
      case 'day-of-year':
        addCleanup(
          bindAction('day-of-year-action', () => {
            const date = document.getElementById('day-of-year-date')?.value;
            if (!date) return;
            const d = new Date(date);
            const start = new Date(d.getFullYear(), 0, 0);
            const diff = (d - start) / 1000 / 60 / 60 / 24;
            setResult('#day-of-year-result', String(Math.floor(diff) + 1));
          }),
        );
        break;
      case 'weekday-finder':
        addCleanup(
          bindAction('weekday-finder-action', () => {
            const date = document.getElementById('weekday-finder-date')?.value;
            if (!date) return;
            setResult('#weekday-finder-result', new Date(date).toLocaleDateString('en-US', { weekday: 'long' }));
          }),
        );
        break;
      case 'next-birthday':
        addCleanup(
          bindAction('next-birthday-action', () => {
            const birth = document.getElementById('next-birthday-date')?.value;
            if (!birth) return;
            const dob = new Date(birth);
            const now = new Date();
            const next = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
            if (next < now) next.setFullYear(now.getFullYear() + 1);
            setResult('#next-birthday-result', next.toISOString().slice(0, 10));
          }),
        );
        break;
      case 'business-days':
        addCleanup(
          bindAction('business-days-action', () => {
            const start = new Date(document.getElementById('business-days-start')?.value || 0);
            const end = new Date(document.getElementById('business-days-end')?.value || 0);
            let count = 0;
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
              const day = d.getDay();
              if (day !== 0 && day !== 6) count += 1;
            }
            setResult('#business-days-result', `${count} business days`);
          }),
        );
        break;
      case 'time-ago':
        addCleanup(
          bindAction('time-ago-action', () => {
            const date = new Date(document.getElementById('time-ago-date')?.value || Date.now());
            const diff = Date.now() - date.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            setResult('#time-ago-result', days > 0 ? `${days} days ago` : 'Today');
          }),
        );
        break;
      case 'age-in-days':
        addCleanup(
          bindAction('age-in-days-action', () => {
            const birth = new Date(document.getElementById('age-in-days-date')?.value || Date.now());
            const diff = Math.max(0, Date.now() - birth.getTime());
            setResult('#age-in-days-result', `${Math.floor(diff / (1000 * 60 * 60 * 24))} days`);
          }),
        );
        break;
      case 'celsius-to-fahrenheit':
        addCleanup(
          bindAction('celsius-to-fahrenheit-action', () => {
            const value = Number(document.getElementById('celsius-to-fahrenheit-celsius')?.value || 0);
            setResult('#celsius-to-fahrenheit-result', `${((value * 9) / 5 + 32).toFixed(2)}°F`);
          }),
        );
        break;
      case 'fahrenheit-to-celsius':
        addCleanup(
          bindAction('fahrenheit-to-celsius-action', () => {
            const value = Number(document.getElementById('fahrenheit-to-celsius-fahrenheit')?.value || 0);
            setResult('#fahrenheit-to-celsius-result', `${((value - 32) * 5 / 9).toFixed(2)}°C`);
          }),
        );
        break;
      case 'cm-to-inches':
        addCleanup(
          bindAction('cm-to-inches-action', () => {
            const value = Number(document.getElementById('cm-to-inches-value')?.value || 0);
            setResult('#cm-to-inches-result', `${(value / 2.54).toFixed(2)} in`);
          }),
        );
        break;
      case 'inch-to-cm':
        addCleanup(
          bindAction('inch-to-cm-action', () => {
            const value = Number(document.getElementById('inch-to-cm-value')?.value || 0);
            setResult('#inch-to-cm-result', `${(value * 2.54).toFixed(2)} cm`);
          }),
        );
        break;
      case 'miles-to-km':
        addCleanup(
          bindAction('miles-to-km-action', () => {
            const value = Number(document.getElementById('miles-to-km-value')?.value || 0);
            setResult('#miles-to-km-result', `${(value * 1.60934).toFixed(2)} km`);
          }),
        );
        break;
      case 'km-to-miles':
        addCleanup(
          bindAction('km-to-miles-action', () => {
            const value = Number(document.getElementById('km-to-miles-value')?.value || 0);
            setResult('#km-to-miles-result', `${(value / 1.60934).toFixed(2)} mi`);
          }),
        );
        break;
      case 'bytes-to-mb':
        addCleanup(
          bindAction('bytes-to-mb-action', () => {
            const value = Number(document.getElementById('bytes-to-mb-value')?.value || 0);
            setResult('#bytes-to-mb-result', `${(value / 1024 / 1024).toFixed(4)} MB`);
          }),
        );
        break;
      case 'mb-to-bytes':
        addCleanup(
          bindAction('mb-to-bytes-action', () => {
            const value = Number(document.getElementById('mb-to-bytes-value')?.value || 0);
            setResult('#mb-to-bytes-result', `${(value * 1024 * 1024).toFixed(0)} bytes`);
          }),
        );
        break;
      case 'minutes-to-hours':
        addCleanup(
          bindAction('minutes-to-hours-action', () => {
            const value = Number(document.getElementById('minutes-to-hours-value')?.value || 0);
            setResult('#minutes-to-hours-result', `${(value / 60).toFixed(2)} hr`);
          }),
        );
        break;
      case 'hours-to-minutes':
        addCleanup(
          bindAction('hours-to-minutes-action', () => {
            const value = Number(document.getElementById('hours-to-minutes-value')?.value || 0);
            setResult('#hours-to-minutes-result', `${(value * 60).toFixed(2)} min`);
          }),
        );
        break;
      case 'random-name-generator':
        addCleanup(
          bindAction('random-name-generator-action', () => {
            const names = ['Ava', 'Noah', 'Mila', 'Leo', 'Zoe', 'Mason', 'Ivy', 'Lucas'];
            const surnames = ['Harper', 'Carter', 'Brooks', 'Stone', 'Lane', 'Reed', 'Foster', 'Wells'];
            setResult('#random-name-generator-result', `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`);
          }),
        );
        break;
      case 'business-name-generator':
        addCleanup(
          bindAction('business-name-generator-action', () => {
            const prefixes = ['North', 'Summit', 'Bright', 'Crest', 'Harbor', 'Peak'];
            const suffixes = ['Works', 'Labs', 'Studio', 'Collective', 'Group', 'Co'];
            setResult('#business-name-generator-result', `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`);
          }),
        );
        break;
      case 'color-palette-generator':
        addCleanup(
          bindAction('color-palette-generator-action', () => {
            const palette = ['#2563eb', '#7c3aed', '#14b8a6', '#f59e0b', '#ef4444'];
            setResult('#color-palette-generator-result', palette.join('  '));
          }),
        );
        break;
      case 'dummy-text-generator':
        addCleanup(
          bindAction('dummy-text-generator-action', () => {
            const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.';
            setResult('#dummy-text-generator-result', text);
          }),
        );
        break;
      case 'passphrase-generator':
        addCleanup(
          bindAction('passphrase-generator-action', () => {
            const words = ['amber', 'river', 'forest', 'light', 'cloud', 'stone', 'signal', 'garden'];
            const phrase = Array.from({ length: 4 }, () => words[Math.floor(Math.random() * words.length)]).join('-');
            setResult('#passphrase-generator-result', phrase);
          }),
        );
        break;
      case 'quote-generator':
        addCleanup(
          bindAction('quote-generator-action', () => {
            const quotes = ['Focus on clarity, not volume.', 'Consistency compounds over time.', 'Good systems create quiet confidence.'];
            setResult('#quote-generator-result', quotes[Math.floor(Math.random() * quotes.length)]);
          }),
        );
        break;
      case 'emoji-picker':
        addCleanup(
          bindAction('emoji-picker-action', () => {
            const items = ['😀', '🚀', '✨', '💡', '🎯', '🔥'];
            setResult('#emoji-picker-result', items.join(' '));
          }),
        );
        break;
      case 'slug-generator':
        addCleanup(
          bindAction('slug-generator-action', () => {
            const text = document.getElementById('slug-generator-input')?.value || '';
            const slug = text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            setResult('#slug-generator-result', slug || 'your-slug');
          }),
        );
        break;
      case 'tag-generator':
        addCleanup(
          bindAction('tag-generator-action', () => {
            const topic = document.getElementById('tag-generator-input')?.value || 'marketing';
            const tags = topic.split(/\s+/).slice(0, 5).map((word) => `#${word.toLowerCase()}`);
            setResult('#tag-generator-result', tags.join(' '));
          }),
        );
        break;
      case 'idea-generator':
        addCleanup(
          bindAction('idea-generator-action', () => {
            const ideas = ['AI onboarding assistant for small businesses', 'Smart expense journal for freelancers', 'Community event planner with local SEO insights'];
            setResult('#idea-generator-result', ideas[Math.floor(Math.random() * ideas.length)]);
          }),
        );
        break;
      case 'password-strength-checker':
        addCleanup(
          bindAction('password-strength-checker-action', () => {
            const value = textFrom('#password-strength-checker-input');
            let score = 0;
            if (value.length >= 8) score += 1;
            if (/[A-Z]/.test(value)) score += 1;
            if (/[0-9]/.test(value)) score += 1;
            if (/[^A-Za-z0-9]/.test(value)) score += 1;
            const labels = ['Very weak', 'Weak', 'Medium', 'Strong', 'Very strong'];
            setResult('#password-strength-checker-result', labels[Math.min(score, labels.length - 1)]);
          }),
        );
        break;
      case 'xor-cipher':
        addCleanup(
          bindAction('xor-cipher-action', () => {
            const value = textFrom('#xor-cipher-input');
            const key = Number(document.getElementById('xor-cipher-key')?.value || 7);
            const encoded = [...value].map((char) => String.fromCharCode(char.charCodeAt(0) ^ key)).join('');
            setResult('#xor-cipher-result', encoded);
          }),
        );
        break;
      case 'rot13-converter':
        addCleanup(
          bindAction('rot13-converter-action', () => {
            const value = textFrom('#rot13-converter-input');
            const converted = value.replace(/[A-Za-z]/g, (char) => {
              const offset = char <= 'Z' ? 65 : 97;
              return String.fromCharCode(offset + ((char.charCodeAt(0) - offset + 13) % 26));
            });
            setResult('#rot13-converter-result', converted);
          }),
        );
        break;
      case 'md5-hash':
        addCleanup(
          bindAction('md5-hash-action', async () => {
            const data = new TextEncoder().encode(textFrom('#md5-hash-input'));
            const hashBuffer = await crypto.subtle.digest('MD5', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            setResult('#md5-hash-result', hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''));
          }),
        );
        break;
      case 'sha1-hash':
        addCleanup(
          bindAction('sha1-hash-action', async () => {
            const data = new TextEncoder().encode(textFrom('#sha1-hash-input'));
            const hashBuffer = await crypto.subtle.digest('SHA-1', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            setResult('#sha1-hash-result', hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''));
          }),
        );
        break;
      case 'token-generator':
        addCleanup(
          bindAction('token-generator-action', () => {
            const prefix = document.getElementById('token-generator-prefix')?.value || 'tok_';
            const bytes = new Uint8Array(16);
            crypto.getRandomValues(bytes);
            const token = Array.from(bytes).map((byte) => byte.toString(16).padStart(2, '0')).join('');
            setResult('#token-generator-result', `${prefix}${token}`);
          }),
        );
        break;
      case 'jwt-decoder':
        addCleanup(
          bindAction('jwt-decoder-action', () => {
            const token = textFrom('#jwt-decoder-input');
            try {
              const [, payload] = token.split('.');
              if (!payload) throw new Error('Invalid');
              const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
              setResult('#jwt-decoder-result', JSON.stringify(decoded, null, 2));
            } catch {
              setResult('#jwt-decoder-result', 'Invalid JWT payload');
            }
          }),
        );
        break;
      case 'hmac-demo':
        addCleanup(
          bindAction('hmac-demo-action', async () => {
            const key = document.getElementById('hmac-demo-key')?.value || 'demo-key';
            const message = textFrom('#hmac-demo-input');
            const enc = new TextEncoder();
            const cryptoKey = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
            const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message));
            setResult('#hmac-demo-result', Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join(''));
          }),
        );
        break;
      case 'api-key-generator':
        addCleanup(
          bindAction('api-key-generator-action', () => {
            const prefix = document.getElementById('api-key-generator-prefix')?.value || 'sk';
            const value = Array.from({ length: 32 }, () => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 62))).join('');
            setResult('#api-key-generator-result', `${prefix}_${value}`);
          }),
        );
        break;
      case 'credit-card-luhn-check':
        addCleanup(
          bindAction('credit-card-luhn-check-action', () => {
            const digits = textFrom('#credit-card-luhn-check-input').replace(/\s+/g, '');
            let sum = 0;
            let shouldDouble = false;
            for (let i = digits.length - 1; i >= 0; i -= 1) {
              let digit = Number(digits[i]);
              if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
              }
              sum += digit;
              shouldDouble = !shouldDouble;
            }
            setResult('#credit-card-luhn-check-result', `${sum % 10 === 0 ? 'Valid' : 'Invalid'} card number`);
          }),
        );
        break;
      case 'meta-tag-generator':
        addCleanup(
          bindAction('meta-tag-generator-action', () => {
            const title = document.getElementById('meta-tag-generator-title')?.value || 'My Page';
            const description = document.getElementById('meta-tag-generator-description')?.value || 'Description';
            const keywords = document.getElementById('meta-tag-generator-keywords')?.value || 'keyword1, keyword2';
            const result = `<title>${title}</title>\n<meta name="description" content="${description}" />\n<meta name="keywords" content="${keywords}" />`;
            setResult('#meta-tag-generator-result', result);
          }),
        );
        break;
      case 'keyword-density-analyzer':
        addCleanup(
          bindAction('keyword-density-analyzer-action', () => {
            const text = textFrom('#keyword-density-analyzer-input');
            const words = text.toLowerCase().match(/\b[a-z0-9-]+\b/g) || [];
            const freq = {};
            words.forEach((word) => {
              freq[word] = (freq[word] || 0) + 1;
            });
            const entries = Object.entries(freq).slice(0, 10).map(([word, count]) => `${word}: ${count}`).join('\n');
            setResult('#keyword-density-analyzer-result', entries || 'No keywords found');
          }),
        );
        break;
      case 'canonical-url-builder':
        addCleanup(
          bindAction('canonical-url-builder-action', () => {
            const host = document.getElementById('canonical-url-builder-host')?.value || 'https://www.ai90s.site';
            const path = document.getElementById('canonical-url-builder-path')?.value || '/';
            setResult('#canonical-url-builder-result', `${host.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`);
          }),
        );
        break;
      case 'robots-txt-generator':
        addCleanup(
          bindAction('robots-txt-generator-action', () => {
            const sitemap = document.getElementById('robots-txt-generator-sitemap')?.value || 'https://www.ai90s.site/sitemap.xml';
            const result = `User-agent: *\nAllow: /\nSitemap: ${sitemap}`;
            setResult('#robots-txt-generator-result', result);
          }),
        );
        break;
      case 'open-graph-generator':
        addCleanup(
          bindAction('open-graph-generator-action', () => {
            const title = document.getElementById('open-graph-generator-title')?.value || 'AI90s';
            const description = document.getElementById('open-graph-generator-description')?.value || 'Product details';
            const image = document.getElementById('open-graph-generator-image')?.value || 'https://www.ai90s.site/og-image.png';
            const result = `<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${description}" />\n<meta property="og:image" content="${image}" />`;
            setResult('#open-graph-generator-result', result);
          }),
        );
        break;
      case 'schema-markup-generator':
        addCleanup(
          bindAction('schema-markup-generator-action', () => {
            const name = document.getElementById('schema-markup-generator-name')?.value || 'Example Business';
            const type = document.getElementById('schema-markup-generator-type')?.value || 'Organization';
            const result = `{"@context": "https://schema.org", "@type": "${type}", "name": "${name}"}`;
            setResult('#schema-markup-generator-result', result);
          }),
        );
        break;
      case 'title-length-checker':
        addCleanup(
          bindAction('title-length-checker-action', () => {
            const title = textFrom('#title-length-checker-input');
            const length = title.length;
            const status = length <= 60 ? 'Good length' : length <= 70 ? 'Borderline' : 'Too long';
            setResult('#title-length-checker-result', `${length} chars — ${status}`);
          }),
        );
        break;
      case 'description-length-checker':
        addCleanup(
          bindAction('description-length-checker-action', () => {
            const description = textFrom('#description-length-checker-input');
            const length = description.length;
            const status = length <= 160 ? 'Good length' : 'Consider shortening';
            setResult('#description-length-checker-result', `${length} chars — ${status}`);
          }),
        );
        break;
      case 'sitemap-url-generator':
        addCleanup(
          bindAction('sitemap-url-generator-action', () => {
            const lines = (textFrom('#sitemap-url-generator-input') || '').split(/\n+/).filter(Boolean);
            const urls = lines.map((line) => `https://www.ai90s.site${line.startsWith('/') ? line : `/${line}`}`);
            setResult('#sitemap-url-generator-result', urls.join('\n') || 'Add page paths to generate URLs');
          }),
        );
        break;
      case 'keyword-planner':
        addCleanup(
          bindAction('keyword-planner-action', () => {
            const words = (textFrom('#keyword-planner-input') || '').split(/\n+/).filter(Boolean);
            const clusters = words.map((word) => word.trim().replace(/\s+/g, ' '));
            setResult('#keyword-planner-result', clusters.join('\n'));
          }),
        );
        break;
      default:
        break;
    }

    return () => {
      cleanup.forEach((fn) => fn());
    };
  }, [slug, html]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />;
}
