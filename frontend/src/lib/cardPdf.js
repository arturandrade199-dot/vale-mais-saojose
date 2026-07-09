import { jsPDF } from "jspdf";
import { formatCPF } from "./cpf";

const NAVY = [11, 37, 69];
const GREEN = [59, 168, 74];
const SLATE = [100, 116, 139];
const LIGHT_TEXT = [203, 213, 225];

function formatBirthDate(value) {
  if (!value) return "-";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function memberNumber(userId) {
  return userId ? userId.replace(/-/g, "").slice(0, 8).toUpperCase() : "-";
}

export function generateCardPdf(profile, userId, isActive) {
  const width = 85.6;
  const height = 54;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [width, height] });

  doc.setFillColor(...NAVY);
  doc.roundedRect(0, 0, width, height, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("Vale Mais São José", 5, 9);

  doc.setFillColor(...(isActive ? GREEN : SLATE));
  doc.roundedRect(58, 4.5, 23, 6, 2, 2, "F");
  doc.setFontSize(7);
  doc.text(isActive ? "ATIVO" : "INATIVO", 69.5, 8.7, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...LIGHT_TEXT);
  doc.text("TITULAR", 5, 22);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(profile.full_name || "", 5, 28);

  const columns = [
    { label: "CPF", value: formatCPF(profile.cpf), x: 5 },
    { label: "NASCIMENTO", x: 34, value: formatBirthDate(profile.birth_date) },
    { label: "Nº ASSOCIADO", x: 63, value: memberNumber(userId) },
  ];

  columns.forEach(({ label, value, x }) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...LIGHT_TEXT);
    doc.text(label, x, 40);

    doc.setFont("courier", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    doc.text(value, x, 46);
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(...LIGHT_TEXT);
  doc.text("Apresente este cartão nos estabelecimentos parceiros para garantir o desconto.", 5, 51);

  doc.save("cartao-vale-mais-sao-jose.pdf");
}
