const tools = [
  {
    slug: 'word-counter',
    title: 'Word Counter',
    desc: 'Count words, characters, and lines from your text.',
    category: 'Text',
    html: `
      <div class="space-y-3">
        <textarea id="word-counter-input" class="w-full rounded border border-slate-200 p-3" rows="6" placeholder="Paste text here..."></textarea>
        <div class="flex gap-4 text-sm text-slate-700">
          <div>Words: <span id="word-counter-words">0</span></div>
          <div>Characters: <span id="word-counter-chars">0</span></div>
          <div>Lines: <span id="word-counter-lines">0</span></div>
        </div>
      </div>
    `,
  },
  {
    slug: 'case-converter',
    title: 'Case Converter',
    desc: 'Convert text to different cases.',
    category: 'Text',
    html: `
      <div class="space-y-3">
        <textarea id="case-converter-input" class="w-full rounded border border-slate-200 p-3" rows="5" placeholder="Type text..."></textarea>
        <div class="flex flex-wrap gap-2">
          <button id="case-upper" class="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white">UPPER</button>
          <button id="case-lower" class="rounded bg-blue-500 px-3 py-2 text-sm font-medium text-white">lower</button>
          <button id="case-title" class="rounded bg-blue-400 px-3 py-2 text-sm font-medium text-white">Title Case</button>
          <button id="case-clear" class="rounded border border-slate-300 px-3 py-2 text-sm font-medium">Clear</button>
        </div>
        <textarea id="case-converter-output" class="w-full rounded border border-slate-200 p-3" rows="5" readonly placeholder="Result..."></textarea>
      </div>
    `,
  },
  {
    slug: 'bmi-calculator',
    title: 'BMI Calculator',
    desc: 'Calculate body mass index.',
    category: 'Health',
    html: `
      <div class="space-y-3 max-w-sm">
        <div class="flex gap-2">
          <input id="bmi-weight" type="number" placeholder="Weight (kg)" class="w-1/2 rounded border border-slate-200 p-2" />
          <input id="bmi-height" type="number" placeholder="Height (cm)" class="w-1/2 rounded border border-slate-200 p-2" />
        </div>
        <button id="bmi-calc" class="rounded bg-blue-600 px-4 py-2 text-white">Calculate</button>
        <div>Result: <strong id="bmi-result">—</strong></div>
      </div>
    `,
  },
  {
    slug: 'age-calculator',
    title: 'Age Calculator',
    desc: 'Find age from date of birth.',
    category: 'Calculators',
    html: `
      <div class="space-y-3 max-w-sm">
        <input id="age-dob" type="date" class="w-full rounded border border-slate-200 p-2" />
        <button id="age-calc" class="rounded bg-blue-600 px-4 py-2 text-white">Calculate Age</button>
        <div id="age-result">Your age: —</div>
      </div>
    `,
  },
  {
    slug: 'kg-to-lbs',
    title: 'KG to LBS Converter',
    desc: 'Convert kilograms to pounds.',
    category: 'Converters',
    html: `
      <div class="space-y-3 max-w-sm">
        <input id="kg-input" type="number" placeholder="Kilograms" class="w-full rounded border border-slate-200 p-2" />
        <button id="kg-convert" class="rounded bg-blue-600 px-4 py-2 text-white">Convert to LBS</button>
        <div>Result: <span id="kg-result">—</span></div>
      </div>
    `,
  },
  {
    slug: 'password-generator',
    title: 'Password Generator',
    desc: 'Generate secure passwords.',
    category: 'Generators',
    html: `
      <div class="space-y-3 max-w-sm">
        <label class="block text-sm">Length</label>
        <input id="pwd-length" type="number" min="4" max="64" value="16" class="w-24 rounded border border-slate-200 p-2" />
        <div class="flex gap-2">
          <button id="pwd-generate" class="rounded bg-blue-600 px-4 py-2 text-white">Generate</button>
          <button id="pwd-copy" class="rounded border border-slate-300 px-4 py-2">Copy</button>
        </div>
        <input id="pwd-output" class="w-full rounded border border-slate-200 p-2" readonly />
      </div>
    `,
  },
  {
    slug: 'qr-code-generator',
    title: 'QR Code Generator',
    desc: 'Generate a QR code for any text or URL.',
    category: 'Generators',
    html: `
      <div class="space-y-3 max-w-md">
        <input id="qr-input" class="w-full rounded border border-slate-200 p-2" placeholder="Enter text or URL" />
        <div class="flex gap-2">
          <button id="qr-generate" class="rounded bg-blue-600 px-4 py-2 text-white">Generate QR</button>
          <button id="qr-clear" class="rounded border border-slate-300 px-4 py-2">Clear</button>
        </div>
        <div id="qr-output" class="mt-3"></div>
      </div>
    `,
  },
  {
    slug: 'base64',
    title: 'Base64 Encoder/Decoder',
    desc: 'Encode or decode Base64 text.',
    category: 'Developer',
    html: `
      <div class="space-y-3">
        <textarea id="b64-input" class="w-full rounded border border-slate-200 p-3" rows="4" placeholder="Text or Base64..."></textarea>
        <div class="flex gap-2">
          <button id="b64-encode" class="rounded bg-blue-600 px-4 py-2 text-white">Encode</button>
          <button id="b64-decode" class="rounded bg-blue-500 px-4 py-2 text-white">Decode</button>
        </div>
        <textarea id="b64-output" class="w-full rounded border border-slate-200 p-3" rows="4" readonly placeholder="Result..."></textarea>
      </div>
    `,
  },
  {
    slug: 'percentage-calculator',
    title: 'Percentage Calculator',
    desc: 'Calculate percentage values quickly.',
    category: 'Calculators',
    html: `
      <div class="space-y-3 max-w-sm">
        <input id="pct-base" type="number" placeholder="Base value" class="w-full rounded border border-slate-200 p-2" />
        <input id="pct-percent" type="number" placeholder="Percent (%)" class="w-full rounded border border-slate-200 p-2" />
        <button id="pct-calc" class="rounded bg-blue-600 px-4 py-2 text-white">Calculate</button>
        <div>Result: <strong id="pct-result">—</strong></div>
      </div>
    `,
  },
  {
    slug: 'lorem-ipsum',
    title: 'Lorem Ipsum Generator',
    desc: 'Generate placeholder text.',
    category: 'Generators',
    html: `
      <div class="space-y-3 max-w-md">
        <label class="text-sm">Paragraphs</label>
        <input id="lorem-count" type="number" min="1" max="10" value="3" class="w-24 rounded border border-slate-200 p-2" />
        <button id="lorem-gen" class="rounded bg-blue-600 px-4 py-2 text-white">Generate</button>
        <div id="lorem-output" class="prose"></div>
      </div>
    `,
  },
];

export default tools;
