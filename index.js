const form = document.getElementById('password-form');
const lengthInput = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const uppercaseInput = document.getElementById('uppercase');
const lowercaseInput = document.getElementById('lowercase');
const numbersInput = document.getElementById('numbers');
const symbolsInput = document.getElementById('symbols');
const excludeAmbiguousInput = document.getElementById('exclude-ambiguous');
const noRepeatingInput = document.getElementById('no-repeating');
const passwordOne = document.getElementById('password-1');
const passwordTwo = document.getElementById('password-2');
const copyAllButton = document.getElementById('copy-all');
const toast = document.getElementById('toast');
const feedback = document.getElementById('feedback');
const strengthLabel = document.getElementById('strength-label');
const entropyValue = document.getElementById('entropy-value');
const generatedCount = document.getElementById('generated-count');
const meterFill = document.getElementById('meter-fill');
const presetButtons = document.querySelectorAll('.preset');

const groups = {
	uppercase: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
	lowercase: 'abcdefghijkmnopqrstuvwxyz',
	numbers: '23456789',
	symbols: '!@#$%^&*()-_=+[]{};:,.?/<>~'
};

const ambiguousChars = 'Il1O0o|`"\'{}[]()<>/\\';

const randomInt = (max) => crypto.getRandomValues(new Uint32Array(1))[0] % max;

function updateLengthLabel() {
	lengthValue.textContent = lengthInput.value;
}

function buildPool() {
	const activePool = [];

	if (uppercaseInput.checked) activePool.push(...groups.uppercase);
	if (lowercaseInput.checked) activePool.push(...groups.lowercase);
	if (numbersInput.checked) activePool.push(...groups.numbers);
	if (symbolsInput.checked) activePool.push(...groups.symbols);

	let pool = [...new Set(activePool)];

	if (excludeAmbiguousInput.checked) {
		pool = pool.filter((character) => !ambiguousChars.includes(character));
	}

	return pool;
}

function getPoolSize() {
	return buildPool().length;
}

function shuffle(items) {
	const array = [...items];

	for (let index = array.length - 1; index > 0; index -= 1) {
		const swapIndex = randomInt(index + 1);
		[array[index], array[swapIndex]] = [array[swapIndex], array[index]];
	}

	return array;
}

function generatePassword() {
	const length = Number(lengthInput.value);
	const pool = buildPool();

	if (!pool.length) {
		return '';
	}

	const requiredSets = [];
	if (uppercaseInput.checked) requiredSets.push(groups.uppercase);
	if (lowercaseInput.checked) requiredSets.push(groups.lowercase);
	if (numbersInput.checked) requiredSets.push(groups.numbers);
	if (symbolsInput.checked) requiredSets.push(groups.symbols);

	const chars = [];

	requiredSets.forEach((set) => {
		const source = excludeAmbiguousInput.checked
			? [...new Set(set.split('').filter((character) => !ambiguousChars.includes(character)))]
			: [...set];

		if (source.length) {
			chars.push(source[randomInt(source.length)]);
		}
	});

	while (chars.length < length) {
		const nextChar = pool[randomInt(pool.length)];

		if (noRepeatingInput.checked && chars.includes(nextChar)) {
			continue;
		}

		chars.push(nextChar);
	}

	return shuffle(chars).join('').slice(0, length);
}

function calculateEntropy(password) {
	const poolSize = getPoolSize();

	if (!password || !poolSize) {
		return 0;
	}

	return Math.round(password.length * Math.log2(poolSize));
}

function getStrength(entropy) {
	if (entropy >= 120) return { label: 'Extreme', percent: 100 };
	if (entropy >= 96) return { label: 'Very strong', percent: 84 };
	if (entropy >= 72) return { label: 'Strong', percent: 68 };
	if (entropy >= 56) return { label: 'Good', percent: 50 };
	return { label: 'Needs more length', percent: 28 };
}

async function copyText(text) {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}

function showToast(message) {
	toast.textContent = message;
	toast.classList.add('show');
	window.clearTimeout(showToast.hideTimer);
	showToast.hideTimer = window.setTimeout(() => {
		toast.classList.remove('show');
	}, 1700);
}

function updateOutput(passwordOneValue, passwordTwoValue) {
	passwordOne.textContent = passwordOneValue || 'Unable to generate';
	passwordTwo.textContent = passwordTwoValue || 'Unable to generate';

	const entropy = calculateEntropy(passwordOneValue);
	const strength = getStrength(entropy);

	strengthLabel.textContent = strength.label;
	entropyValue.textContent = `${entropy} bits`;
	generatedCount.textContent = '2 passwords';
	meterFill.style.width = `${strength.percent}%`;

	feedback.textContent = passwordOneValue
		? 'Passwords are generated locally in your browser.'
		: 'Turn on at least one character set to generate passwords.';
}

function generateAndRender() {
	updateLengthLabel();

	const passwordA = generatePassword();
	const passwordB = generatePassword();

	updateOutput(passwordA, passwordB);

	if (!passwordA) {
		showToast('Choose at least one character group');
	}
}

function syncPresetState(button) {
	presetButtons.forEach((item) => item.classList.remove('active'));
	button.classList.add('active');

	lengthInput.value = button.dataset.length || lengthInput.value;
	numbersInput.checked = button.dataset.numbers === 'true';
	symbolsInput.checked = button.dataset.symbols === 'true';
	uppercaseInput.checked = true;
	lowercaseInput.checked = true;

	generateAndRender();
}

form.addEventListener('submit', (event) => {
	event.preventDefault();
	generateAndRender();
	showToast('Fresh passwords generated');
});

lengthInput.addEventListener('input', generateAndRender);
[uppercaseInput, lowercaseInput, numbersInput, symbolsInput, excludeAmbiguousInput, noRepeatingInput].forEach((control) => {
	control.addEventListener('change', generateAndRender);
});

presetButtons.forEach((button) => {
	button.addEventListener('click', () => syncPresetState(button));
});

document.querySelectorAll('[data-copy-target]').forEach((button) => {
	button.addEventListener('click', async () => {
		const target = document.getElementById(button.dataset.copyTarget);
		const copied = await copyText(target.textContent);
		showToast(copied ? 'Copied to clipboard' : 'Clipboard access unavailable');
	});
});

copyAllButton.addEventListener('click', async () => {
	const combined = `${passwordOne.textContent}\n${passwordTwo.textContent}`;
	const copied = await copyText(combined);
	showToast(copied ? 'Both passwords copied' : 'Clipboard access unavailable');
});

updateLengthLabel();
generateAndRender();
