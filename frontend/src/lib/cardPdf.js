import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function generateCardPdf(cardElement) {
  if (!cardElement) return;

  const canvas = await html2canvas(cardElement, {
    scale: 3,
    backgroundColor: null,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const widthMm = 90;
  const heightMm = (canvas.height / canvas.width) * widthMm;

  const doc = new jsPDF({
    orientation: widthMm >= heightMm ? "landscape" : "portrait",
    unit: "mm",
    format: [widthMm, heightMm],
  });

  doc.addImage(imgData, "PNG", 0, 0, widthMm, heightMm);
  doc.save("cartao-vale-mais-sao-jose.pdf");
}
