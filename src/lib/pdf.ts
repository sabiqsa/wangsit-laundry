import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function generateReceiptPDF(element: HTMLElement, orderNumber: string): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");

  // Convert element px → mm at 96dpi
  const pxToMm = 25.4 / 96;
  const pdfWidth = element.offsetWidth * pxToMm;
  const pdfHeight = element.offsetHeight * pxToMm;

  const doc = new jsPDF({ unit: "mm", format: [pdfWidth, pdfHeight] });
  doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  doc.save(`struk-${orderNumber}.pdf`);
}
