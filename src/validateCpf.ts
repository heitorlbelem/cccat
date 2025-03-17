function clean(cpf: string) {
	return cpf.replace(/\D/g, "");
}

function allDigitsAreEqual(cpf: string) {
	return cpf.split("").every((digit) => digit === cpf[0]);
}

function calculateVerificationDigit(cpf: string, factor: number) {
	let total = 0;
	let multiplier = factor;
	for (const digit of cpf) {
		if (multiplier < 2) break;
		total += Number.parseInt(digit) * multiplier--;
	}
	const remainder = total % 11;
	return remainder < 2 ? 0 : 11 - remainder;
}

export function validateCpf(cpf: string) {
	const cleanedCpf = clean(cpf);
	if (cleanedCpf.length !== 11) return false;
	if (allDigitsAreEqual(cpf)) return false;
	const firstVerificationDigit = calculateVerificationDigit(cleanedCpf, 10);
	const secondVerificationDigit = calculateVerificationDigit(cleanedCpf, 11);
	const calculatedDigits = `${firstVerificationDigit}${secondVerificationDigit}`;
	const extractedDigits = cleanedCpf.slice(9);
	return extractedDigits === calculatedDigits;
}
