import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function generateCardPdf(cardElement) {
  if (!cardElement) return;

  // Espera as fontes carregarem — sem isso o html2canvas às vezes mede a
  // altura da linha com a fonte de fallback e corta o texto na captura.
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

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
