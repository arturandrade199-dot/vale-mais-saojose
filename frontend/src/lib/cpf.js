export function formatCPF(value) {
  const digits = (value || "").replace(/\D/g, "").slice(0, 11);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6, 9);
  const part4 = digits.slice(9, 11);
  let out = part1;
  if (part2) out += "." + part2;
  if (part3) out += "." + part3;
  if (part4) out += "-" + part4;
  return out;
}

export function isValidCPF(value) {
  const digits = (value || "").replace(/\D/g, "");
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  const checkDigit = (base) => {
    let sum = 0;
    let weight = base.length + 1;
    for (const d of base) {
      sum += Number(d) * weight;
      weight -= 1;
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const base = digits.slice(0, 9);
  const d1 = checkDigit(base);
  const d2 = checkDigit(base + String(d1));
  return digits === base + String(d1) + String(d2);
}
