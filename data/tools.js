const createTextAreaTool = ({ slug, title, desc, category, actionLabel = 'Run', placeholder = 'Type or paste text here...' }) => ({
  slug,
  title,
  desc,
  category,
  html: `
    <div class="space-y-3">
      <textarea id="${slug}-input" class="w-full rounded border border-slate-200 p-3" rows="6" placeholder="${placeholder}"></textarea>
      <div class="flex flex-wrap gap-2">
        <button id="${slug}-action" class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white">${actionLabel}</button>
        <button id="${slug}-clear" class="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Clear</button>
      </div>
      <div id="${slug}-result" class="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 whitespace-pre-wrap"></div>
    </div>
  `,
});

const createNumericTool = ({ slug, title, desc, category, inputs, buttonLabel, resultLabel = 'Result', helpText = '' }) => ({
  slug,
  title,
  desc,
  category,
  html: `
    <div class="space-y-3 max-w-md">
      ${inputs
        .map(
          ({ label, id, type = 'number', placeholder = '', value = '', min, max, step }) => `
            <label class="block text-sm font-medium text-slate-700">
              ${label}
              <input id="${slug}-${id}" type="${type}" ${value ? `value="${value}"` : ''} ${placeholder ? `placeholder="${placeholder}"` : ''} ${min !== undefined ? `min="${min}"` : ''} ${max !== undefined ? `max="${max}"` : ''} ${step !== undefined ? `step="${step}"` : ''} class="mt-1 w-full rounded border border-slate-200 p-2.5" />
            </label>
          `,
        )
        .join('')}
      <button id="${slug}-action" class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white">${buttonLabel}</button>
      <div class="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <span class="font-medium">${resultLabel}:</span> <span id="${slug}-result">—</span>
      </div>
      ${helpText ? `<p class="text-xs text-slate-500">${helpText}</p>` : ''}
    </div>
  `,
});

const createDualInputTool = ({ slug, title, desc, category, labelA, labelB, placeholderA, placeholderB, buttonLabel = 'Calculate' }) => ({
  slug,
  title,
  desc,
  category,
  html: `
    <div class="space-y-3 max-w-md">
      <label class="block text-sm font-medium text-slate-700">
        ${labelA}
        <input id="${slug}-input-a" type="number" placeholder="${placeholderA}" class="mt-1 w-full rounded border border-slate-200 p-2.5" />
      </label>
      <label class="block text-sm font-medium text-slate-700">
        ${labelB}
        <input id="${slug}-input-b" type="number" placeholder="${placeholderB}" class="mt-1 w-full rounded border border-slate-200 p-2.5" />
      </label>
      <button id="${slug}-action" class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white">${buttonLabel}</button>
      <div class="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <span id="${slug}-result">—</span>
      </div>
    </div>
  `,
});

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
  ...[
    createTextAreaTool({ slug: 'text-summary', title: 'Text Summary', desc: 'Summarize and review text structure in one click.', category: 'Text', actionLabel: 'Summarize', placeholder: 'Paste a paragraph or article here...' }),
    createTextAreaTool({ slug: 'character-counter', title: 'Character Counter', desc: 'Measure characters, spaces, and words in text.', category: 'Text', actionLabel: 'Count', placeholder: 'Type text here...' }),
    createTextAreaTool({ slug: 'reverse-text', title: 'Reverse Text', desc: 'Reverse the order of characters in your text.', category: 'Text', actionLabel: 'Reverse', placeholder: 'Enter some text...' }),
    createTextAreaTool({ slug: 'duplicate-line-remover', title: 'Duplicate Line Remover', desc: 'Remove repeated lines while preserving the original order.', category: 'Text', actionLabel: 'Remove Duplicates', placeholder: 'One line per entry...' }),
    createTextAreaTool({ slug: 'find-and-replace', title: 'Find and Replace', desc: 'Replace a target phrase with a new value in text.', category: 'Text', actionLabel: 'Replace', placeholder: 'Paste text to transform...' }),
    createTextAreaTool({ slug: 'text-to-slug', title: 'Text to Slug', desc: 'Convert headings or titles into clean URL-friendly slugs.', category: 'Text', actionLabel: 'Create Slug', placeholder: 'Write a page title or phrase...' }),
    createTextAreaTool({ slug: 'email-extractor', title: 'Email Extractor', desc: 'Extract email addresses from bulk text quickly.', category: 'Text', actionLabel: 'Extract Emails', placeholder: 'Paste text containing addresses...' }),
    createTextAreaTool({ slug: 'random-text-sample', title: 'Random Text Sample', desc: 'Generate a random snippet of sample text.', category: 'Text', actionLabel: 'Generate Sample', placeholder: 'Optional seed text...' }),
    createTextAreaTool({ slug: 'readability-score', title: 'Readability Score', desc: 'Estimate how readable a piece of text is.', category: 'Text', actionLabel: 'Score It', placeholder: 'Paste a paragraph...' }),
    createTextAreaTool({ slug: 'sentence-counter', title: 'Sentence Counter', desc: 'Count sentences and measure text length.', category: 'Text', actionLabel: 'Count Sentences', placeholder: 'Paste text to analyze...' }),

    createTextAreaTool({ slug: 'json-formatter', title: 'JSON Formatter', desc: 'Pretty-print JSON and highlight structure.', category: 'Developer', actionLabel: 'Format JSON', placeholder: 'Paste JSON here...' }),
    createTextAreaTool({ slug: 'json-validator', title: 'JSON Validator', desc: 'Validate whether the provided JSON is valid.', category: 'Developer', actionLabel: 'Validate', placeholder: 'Paste JSON here...' }),
    createTextAreaTool({ slug: 'url-parser', title: 'URL Parser', desc: 'Break a URL into protocol, host, params, and path.', category: 'Developer', actionLabel: 'Parse URL', placeholder: 'https://example.com/path?foo=bar' }),
    createTextAreaTool({ slug: 'hex-color-tool', title: 'Hex Color Converter', desc: 'Convert hex colors to RGB and preview the color.', category: 'Developer', actionLabel: 'Convert', placeholder: '#2563eb' }),
    createTextAreaTool({ slug: 'css-beautifier', title: 'CSS Beautifier', desc: 'Format minified CSS into readable styles.', category: 'Developer', actionLabel: 'Beautify CSS', placeholder: 'body{color:red;font-size:14px}' }),
    createTextAreaTool({ slug: 'base-converter', title: 'Base Converter', desc: 'Convert a number between decimal, binary, and hexadecimal.', category: 'Developer', actionLabel: 'Convert Base', placeholder: 'Enter a number or value...' }),
    createTextAreaTool({ slug: 'uuid-generator', title: 'UUID Generator', desc: 'Create one or several valid UUIDs instantly.', category: 'Developer', actionLabel: 'Generate UUID', placeholder: 'Optional label...' }),
    createTextAreaTool({ slug: 'sha256-hash', title: 'SHA-256 Hash', desc: 'Generate a SHA-256 digest for any text input.', category: 'Developer', actionLabel: 'Hash It', placeholder: 'Type text to hash...' }),
    createTextAreaTool({ slug: 'regex-tester', title: 'Regex Tester', desc: 'Test a pattern against sample input quickly.', category: 'Developer', actionLabel: 'Test Regex', placeholder: 'Paste text to match...' }),
    createTextAreaTool({ slug: 'markdown-preview', title: 'Markdown Preview', desc: 'Render markdown into a quick preview panel.', category: 'Developer', actionLabel: 'Preview', placeholder: '# Title\n\nWrite markdown here...' }),

    createNumericTool({ slug: 'average-calculator', title: 'Average Calculator', desc: 'Calculate the mean of a set of numbers.', category: 'Math', inputs: [{ label: 'Numbers (comma separated)', id: 'values', placeholder: '10, 20, 30', type: 'text' }], buttonLabel: 'Calculate Average' }),
    createNumericTool({ slug: 'percentage-difference', title: 'Percentage Difference', desc: 'Measure the relative difference between two numbers.', category: 'Math', inputs: [{ label: 'Original value', id: 'a' }, { label: 'New value', id: 'b' }], buttonLabel: 'Find Difference' }),
    createNumericTool({ slug: 'compound-interest', title: 'Compound Interest', desc: 'Estimate the future value of an investment.', category: 'Math', inputs: [{ label: 'Principal', id: 'principal' }, { label: 'Annual rate (%)', id: 'rate' }, { label: 'Years', id: 'years' }, { label: 'Compounds per year', id: 'periods', value: '12' }], buttonLabel: 'Calculate' }),
    createNumericTool({ slug: 'loan-calculator', title: 'Loan Calculator', desc: 'Estimate monthly loan payments and total cost.', category: 'Math', inputs: [{ label: 'Loan amount', id: 'amount' }, { label: 'Annual rate (%)', id: 'rate' }, { label: 'Months', id: 'months' }], buttonLabel: 'Calculate Loan' }),
    createNumericTool({ slug: 'fraction-simplifier', title: 'Fraction Simplifier', desc: 'Reduce a fraction to its simplest form.', category: 'Math', inputs: [{ label: 'Numerator', id: 'numerator' }, { label: 'Denominator', id: 'denominator' }], buttonLabel: 'Simplify' }),
    createNumericTool({ slug: 'quadratic-solver', title: 'Quadratic Solver', desc: 'Solve ax² + bx + c = 0 for real roots.', category: 'Math', inputs: [{ label: 'a', id: 'a' }, { label: 'b', id: 'b' }, { label: 'c', id: 'c' }], buttonLabel: 'Solve' }),
    createNumericTool({ slug: 'prime-checker', title: 'Prime Checker', desc: 'Check whether a number is prime or composite.', category: 'Math', inputs: [{ label: 'Number', id: 'value' }], buttonLabel: 'Check' }),
    createNumericTool({ slug: 'factorial-calculator', title: 'Factorial Calculator', desc: 'Calculate the factorial of a whole number.', category: 'Math', inputs: [{ label: 'Number', id: 'value' }], buttonLabel: 'Calculate Factorial' }),
    createNumericTool({ slug: 'random-number-generator', title: 'Random Number Generator', desc: 'Generate a number between minimum and maximum values.', category: 'Math', inputs: [{ label: 'Minimum', id: 'min', value: '1' }, { label: 'Maximum', id: 'max', value: '100' }], buttonLabel: 'Generate' }),
    createNumericTool({ slug: 'arithmetic-sequence', title: 'Arithmetic Sequence', desc: 'Generate the next numbers in an arithmetic sequence.', category: 'Math', inputs: [{ label: 'Start value', id: 'start' }, { label: 'Difference', id: 'diff' }, { label: 'Terms', id: 'terms', value: '5' }], buttonLabel: 'Generate Sequence' }),

    createNumericTool({ slug: 'roi-calculator', title: 'ROI Calculator', desc: 'Estimate return on investment for a project or asset.', category: 'Finance', inputs: [{ label: 'Initial investment', id: 'investment' }, { label: 'Final value', id: 'final' }], buttonLabel: 'Calculate ROI' }),
    createNumericTool({ slug: 'discount-calculator', title: 'Discount Calculator', desc: 'Calculate sale price after a discount.', category: 'Finance', inputs: [{ label: 'Price', id: 'price' }, { label: 'Discount (%)', id: 'discount' }], buttonLabel: 'Calculate Discount' }),
    createNumericTool({ slug: 'emi-calculator', title: 'EMI Calculator', desc: 'Estimate the monthly EMI on a loan.', category: 'Finance', inputs: [{ label: 'Loan amount', id: 'amount' }, { label: 'Annual rate (%)', id: 'rate' }, { label: 'Months', id: 'months' }], buttonLabel: 'Calculate EMI' }),
    createNumericTool({ slug: 'tax-estimator', title: 'Tax Estimator', desc: 'Estimate taxes on annual income or sales.', category: 'Finance', inputs: [{ label: 'Amount', id: 'amount' }, { label: 'Tax rate (%)', id: 'rate' }], buttonLabel: 'Estimate Tax' }),
    createNumericTool({ slug: 'currency-converter', title: 'Currency Converter', desc: 'Convert between common currencies using fixed rates.', category: 'Finance', inputs: [{ label: 'Amount', id: 'amount', value: '100' }, { label: 'Rate (USD to target currency)', id: 'rate', value: '1.25' }], buttonLabel: 'Convert' }),
    createNumericTool({ slug: 'net-salary-calculator', title: 'Net Salary Calculator', desc: 'Estimate take-home pay after tax deductions.', category: 'Finance', inputs: [{ label: 'Gross salary', id: 'gross' }, { label: 'Tax rate (%)', id: 'tax' }, { label: 'Other deductions', id: 'deductions', value: '0' }], buttonLabel: 'Calculate Net Pay' }),
    createNumericTool({ slug: 'future-value-calculator', title: 'Future Value Calculator', desc: 'Estimate how much an investment grows over time.', category: 'Finance', inputs: [{ label: 'Present value', id: 'present' }, { label: 'Annual rate (%)', id: 'rate' }, { label: 'Years', id: 'years' }], buttonLabel: 'Calculate Future Value' }),
    createNumericTool({ slug: 'break-even-calculator', title: 'Break-Even Calculator', desc: 'Find the sales needed to cover fixed and variable costs.', category: 'Finance', inputs: [{ label: 'Fixed costs', id: 'fixed' }, { label: 'Variable cost per unit', id: 'variable' }, { label: 'Selling price per unit', id: 'price' }], buttonLabel: 'Calculate Break-Even' }),
    createNumericTool({ slug: 'inflation-adjuster', title: 'Inflation Adjuster', desc: 'Adjust an amount for inflation over time.', category: 'Finance', inputs: [{ label: 'Amount', id: 'amount' }, { label: 'Inflation rate (%)', id: 'rate' }, { label: 'Years', id: 'years' }], buttonLabel: 'Adjust Amount' }),
    createNumericTool({ slug: 'monthly-budget-planner', title: 'Monthly Budget Planner', desc: 'Split a monthly income into essentials and savings.', category: 'Finance', inputs: [{ label: 'Monthly income', id: 'income' }, { label: 'Essential expenses', id: 'essentials' }, { label: 'Savings goal', id: 'savings' }], buttonLabel: 'Plan Budget' }),

    createNumericTool({ slug: 'days-between-dates', title: 'Days Between Dates', desc: 'Find the difference between two dates in days.', category: 'Date & Time', inputs: [{ label: 'Start date', id: 'start', type: 'date' }, { label: 'End date', id: 'end', type: 'date' }], buttonLabel: 'Calculate Days' }),
    createNumericTool({ slug: 'add-days', title: 'Add Days to Date', desc: 'Add or subtract days from a date.', category: 'Date & Time', inputs: [{ label: 'Start date', id: 'date', type: 'date' }, { label: 'Days to add', id: 'days' }], buttonLabel: 'Add Days' }),
    createNumericTool({ slug: 'timezone-converter', title: 'Timezone Converter', desc: 'Convert a scheduled time between UTC and local timezones.', category: 'Date & Time', inputs: [{ label: 'Time', id: 'time', type: 'time' }, { label: 'Offset (hours)', id: 'offset', value: '0' }], buttonLabel: 'Convert Time' }),
    createNumericTool({ slug: 'countdown-timer', title: 'Countdown Timer', desc: 'Create a quick countdown to a target end date.', category: 'Date & Time', inputs: [{ label: 'Target date', id: 'date', type: 'date' }, { label: 'Target time', id: 'time', type: 'time' }], buttonLabel: 'Start Countdown' }),
    createNumericTool({ slug: 'day-of-year', title: 'Day of Year', desc: 'Find the day number for a specific date.', category: 'Date & Time', inputs: [{ label: 'Date', id: 'date', type: 'date' }], buttonLabel: 'Find Day' }),
    createNumericTool({ slug: 'weekday-finder', title: 'Weekday Finder', desc: 'Check the weekday for any date.', category: 'Date & Time', inputs: [{ label: 'Date', id: 'date', type: 'date' }], buttonLabel: 'Find Weekday' }),
    createNumericTool({ slug: 'next-birthday', title: 'Next Birthday', desc: 'Calculate the next birthday date from a birthdate.', category: 'Date & Time', inputs: [{ label: 'Birth date', id: 'date', type: 'date' }], buttonLabel: 'Find Next Birthday' }),
    createNumericTool({ slug: 'business-days', title: 'Business Days', desc: 'Count weekdays between two dates.', category: 'Date & Time', inputs: [{ label: 'Start date', id: 'start', type: 'date' }, { label: 'End date', id: 'end', type: 'date' }], buttonLabel: 'Count Business Days' }),
    createNumericTool({ slug: 'time-ago', title: 'Time Ago', desc: 'Convert a date into a relative time phrase.', category: 'Date & Time', inputs: [{ label: 'Date', id: 'date', type: 'date' }], buttonLabel: 'Describe Time' }),
    createNumericTool({ slug: 'age-in-days', title: 'Age in Days', desc: 'Estimate the total number of days lived.', category: 'Date & Time', inputs: [{ label: 'Birth date', id: 'date', type: 'date' }], buttonLabel: 'Calculate Age in Days' }),

    createNumericTool({ slug: 'celsius-to-fahrenheit', title: 'Celsius to Fahrenheit', desc: 'Convert Celsius to Fahrenheit.', category: 'Converters', inputs: [{ label: 'Celsius', id: 'celsius' }], buttonLabel: 'Convert' }),
    createNumericTool({ slug: 'fahrenheit-to-celsius', title: 'Fahrenheit to Celsius', desc: 'Convert Fahrenheit to Celsius.', category: 'Converters', inputs: [{ label: 'Fahrenheit', id: 'fahrenheit' }], buttonLabel: 'Convert' }),
    createNumericTool({ slug: 'cm-to-inches', title: 'CM to Inches', desc: 'Convert centimeters to inches.', category: 'Converters', inputs: [{ label: 'Centimeters', id: 'value' }], buttonLabel: 'Convert' }),
    createNumericTool({ slug: 'inch-to-cm', title: 'Inches to CM', desc: 'Convert inches to centimeters.', category: 'Converters', inputs: [{ label: 'Inches', id: 'value' }], buttonLabel: 'Convert' }),
    createNumericTool({ slug: 'miles-to-km', title: 'Miles to KM', desc: 'Convert miles to kilometers.', category: 'Converters', inputs: [{ label: 'Miles', id: 'value' }], buttonLabel: 'Convert' }),
    createNumericTool({ slug: 'km-to-miles', title: 'KM to Miles', desc: 'Convert kilometers to miles.', category: 'Converters', inputs: [{ label: 'Kilometers', id: 'value' }], buttonLabel: 'Convert' }),
    createNumericTool({ slug: 'bytes-to-mb', title: 'Bytes to MB', desc: 'Convert bytes into megabytes.', category: 'Converters', inputs: [{ label: 'Bytes', id: 'value' }], buttonLabel: 'Convert' }),
    createNumericTool({ slug: 'mb-to-bytes', title: 'MB to Bytes', desc: 'Convert megabytes into bytes.', category: 'Converters', inputs: [{ label: 'Megabytes', id: 'value' }], buttonLabel: 'Convert' }),
    createNumericTool({ slug: 'minutes-to-hours', title: 'Minutes to Hours', desc: 'Convert minutes into hours.', category: 'Converters', inputs: [{ label: 'Minutes', id: 'value' }], buttonLabel: 'Convert' }),
    createNumericTool({ slug: 'hours-to-minutes', title: 'Hours to Minutes', desc: 'Convert hours into minutes.', category: 'Converters', inputs: [{ label: 'Hours', id: 'value' }], buttonLabel: 'Convert' }),

    createTextAreaTool({ slug: 'random-name-generator', title: 'Random Name Generator', desc: 'Generate a realistic random person name.', category: 'Generators', actionLabel: 'Generate Name', placeholder: 'Optional name style...' }),
    createTextAreaTool({ slug: 'business-name-generator', title: 'Business Name Generator', desc: 'Create a memorable startup or company concept name.', category: 'Generators', actionLabel: 'Generate Name', placeholder: 'Optional industry...' }),
    createTextAreaTool({ slug: 'color-palette-generator', title: 'Color Palette Generator', desc: 'Generate a harmonious palette of colors.', category: 'Generators', actionLabel: 'Generate Palette', placeholder: 'Optional mood or theme...' }),
    createTextAreaTool({ slug: 'dummy-text-generator', title: 'Dummy Text Generator', desc: 'Generate lorem-like placeholder text for prototypes.', category: 'Generators', actionLabel: 'Generate Text', placeholder: 'Optional topic...' }),
    createTextAreaTool({ slug: 'passphrase-generator', title: 'Passphrase Generator', desc: 'Create secure, memorable passphrases.', category: 'Generators', actionLabel: 'Generate Passphrase', placeholder: 'Optional theme or keyword...' }),
    createTextAreaTool({ slug: 'quote-generator', title: 'Quote Generator', desc: 'Generate an original motivational quote.', category: 'Generators', actionLabel: 'Generate Quote', placeholder: 'Optional topic...' }),
    createTextAreaTool({ slug: 'emoji-picker', title: 'Emoji Picker', desc: 'Generate a random emoji set or category selection.', category: 'Generators', actionLabel: 'Show Emojis', placeholder: 'Optional mood...' }),
    createTextAreaTool({ slug: 'slug-generator', title: 'Slug Generator', desc: 'Turn a sentence or title into a URL-safe slug.', category: 'Generators', actionLabel: 'Create Slug', placeholder: 'Type a sentence...' }),
    createTextAreaTool({ slug: 'tag-generator', title: 'Tag Generator', desc: 'Generate relevant tags for posts or products.', category: 'Generators', actionLabel: 'Generate Tags', placeholder: 'Write a topic or keyword...' }),
    createTextAreaTool({ slug: 'idea-generator', title: 'Idea Generator', desc: 'Generate startup, content, or product ideas.', category: 'Generators', actionLabel: 'Generate Ideas', placeholder: 'Optional niche...' }),

    createTextAreaTool({ slug: 'password-strength-checker', title: 'Password Strength Checker', desc: 'Score a password and suggest improvements.', category: 'Security', actionLabel: 'Check Strength', placeholder: 'Type a password...' }),
    createTextAreaTool({ slug: 'xor-cipher', title: 'XOR Cipher', desc: 'Encrypt or decrypt text using a simple XOR key.', category: 'Security', actionLabel: 'Apply XOR', placeholder: 'Type text to encrypt or decrypt...' }),
    createTextAreaTool({ slug: 'rot13-converter', title: 'ROT13 Converter', desc: 'Encode or decode text using the ROT13 cipher.', category: 'Security', actionLabel: 'Convert', placeholder: 'Type text...' }),
    createTextAreaTool({ slug: 'md5-hash', title: 'MD5 Hash', desc: 'Generate an MD5 hash for any string.', category: 'Security', actionLabel: 'Hash', placeholder: 'Type a message to hash...' }),
    createTextAreaTool({ slug: 'sha1-hash', title: 'SHA-1 Hash', desc: 'Generate a SHA-1 digest for any string.', category: 'Security', actionLabel: 'Hash', placeholder: 'Type a message to hash...' }),
    createTextAreaTool({ slug: 'token-generator', title: 'Token Generator', desc: 'Generate secure random tokens for apps and processes.', category: 'Security', actionLabel: 'Generate Token', placeholder: 'Optional prefix...' }),
    createTextAreaTool({ slug: 'jwt-decoder', title: 'JWT Decoder', desc: 'Decode and inspect JWT payloads without verification.', category: 'Security', actionLabel: 'Decode JWT', placeholder: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0...' }),
    createTextAreaTool({ slug: 'hmac-demo', title: 'HMAC Demo', desc: 'Generate a simple HMAC-like signature for testing values.', category: 'Security', actionLabel: 'Generate HMAC', placeholder: 'Type message to sign...' }),
    createTextAreaTool({ slug: 'api-key-generator', title: 'API Key Generator', desc: 'Create safe API keys for development and testing.', category: 'Security', actionLabel: 'Generate API Key', placeholder: 'Optional service name...' }),
    createTextAreaTool({ slug: 'credit-card-luhn-check', title: 'Credit Card Luhn Check', desc: 'Validate card number format using the Luhn algorithm.', category: 'Security', actionLabel: 'Validate Number', placeholder: '4111111111111111' }),

    createTextAreaTool({ slug: 'meta-tag-generator', title: 'Meta Tag Generator', desc: 'Create title, description, and keyword meta tags.', category: 'SEO', actionLabel: 'Generate Tags', placeholder: 'Write page data here...' }),
    createTextAreaTool({ slug: 'keyword-density-analyzer', title: 'Keyword Density Analyzer', desc: 'Measure keyword frequency within a passage of text.', category: 'SEO', actionLabel: 'Analyze', placeholder: 'Paste text content here...' }),
    createTextAreaTool({ slug: 'canonical-url-builder', title: 'Canonical URL Builder', desc: 'Build canonical URLs for page optimization.', category: 'SEO', actionLabel: 'Build URL', placeholder: 'https://example.com/page' }),
    createTextAreaTool({ slug: 'robots-txt-generator', title: 'Robots.txt Generator', desc: 'Generate a robots.txt file for crawl rules.', category: 'SEO', actionLabel: 'Generate', placeholder: 'example.com or path rules...' }),
    createTextAreaTool({ slug: 'open-graph-generator', title: 'Open Graph Generator', desc: 'Build Open Graph metadata for social sharing.', category: 'SEO', actionLabel: 'Generate OG Tags', placeholder: 'Describe your page...' }),
    createTextAreaTool({ slug: 'schema-markup-generator', title: 'Schema Markup Generator', desc: 'Create JSON-LD structured data snippets.', category: 'SEO', actionLabel: 'Generate Schema', placeholder: 'Describe your business or page...' }),
    createTextAreaTool({ slug: 'title-length-checker', title: 'Title Length Checker', desc: 'Check whether a page title fits SEO best practices.', category: 'SEO', actionLabel: 'Check Title', placeholder: 'Enter a post or page title...' }),
    createTextAreaTool({ slug: 'description-length-checker', title: 'Description Length Checker', desc: 'Review meta description length and quality.', category: 'SEO', actionLabel: 'Check Description', placeholder: 'Write a meta description here...' }),
    createTextAreaTool({ slug: 'sitemap-url-generator', title: 'Sitemap URL Generator', desc: 'Generate a list of sitemap URLs for a site.', category: 'SEO', actionLabel: 'Generate URLs', placeholder: 'List pages or sections...' }),
    createTextAreaTool({ slug: 'keyword-planner', title: 'Keyword Planner', desc: 'Group keywords by intent and cluster them by topic.', category: 'SEO', actionLabel: 'Plan Keywords', placeholder: 'List keywords, one per line...' }),
  ],
];

export default tools;
