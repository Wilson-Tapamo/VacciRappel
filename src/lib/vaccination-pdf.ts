import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

export type VaccinationPdfData = {
  child: {
    id: string;
    name: string;
    birthDate: Date;
    gender: string;
    bloodGroup: string | null;
    allergies: string | null;
  };
  records: Array<{
    status: string;
    date: Date;
    completedAt: Date | null;
    vaccine: { name: string; doseNumber: number; protection: string | null };
  }>;
  verificationUrl: string;
  logo?: Uint8Array;
};

export async function createVaccinationPdf(data: VaccinationPdfData) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pageSize: [number, number] = [595.28, 841.89];
  let page = pdf.addPage(pageSize);
  let y = 790;

  const drawHeader = async () => {
    page.drawRectangle({ x: 0, y: 745, width: 595.28, height: 96.89, color: rgb(0.02, 0.05, 0.16) });
    if (data.logo) {
      const logo = await pdf.embedPng(data.logo);
      page.drawImage(logo, { x: 38, y: 764, width: 58, height: 58 });
    }
    page.drawText("VacciRappel", { x: 112, y: 798, size: 22, font: bold, color: rgb(0.15, 0.68, 0.95) });
    page.drawText("Carnet vaccinal familial", { x: 112, y: 776, size: 12, font: regular, color: rgb(0.88, 0.91, 0.98) });
    y = 718;
  };
  await drawHeader();

  page.drawText(data.child.name, { x: 38, y, size: 24, font: bold, color: rgb(0.08, 0.12, 0.2) });
  y -= 25;
  page.drawText(`Né(e) le ${data.child.birthDate.toLocaleDateString("fr-FR")}  |  Groupe sanguin : ${data.child.bloodGroup || "Non renseigné"}`, {
    x: 38, y, size: 10, font: regular, color: rgb(0.35, 0.4, 0.48),
  });
  y -= 18;
  page.drawText(`Allergies : ${data.child.allergies || "Aucune déclarée"}`, { x: 38, y, size: 10, font: regular, color: rgb(0.35, 0.4, 0.48) });
  y -= 34;

  const columns = [38, 248, 320, 420];
  const drawTableHeader = () => {
    page.drawRectangle({ x: 34, y: y - 8, width: 527, height: 26, color: rgb(0.91, 0.96, 0.99) });
    ["Vaccin / dose", "Statut", "Date prévue", "Date réalisée"].forEach((label, index) => {
      page.drawText(label, { x: columns[index], y, size: 9, font: bold, color: rgb(0.05, 0.35, 0.55) });
    });
    y -= 28;
  };
  drawTableHeader();

  for (const record of data.records) {
    if (y < 92) {
      page = pdf.addPage(pageSize);
      y = 790;
      await drawHeader();
      drawTableHeader();
    }
    const status = record.status === "DONE" ? "Effectué" : record.status === "OVERDUE" ? "En retard" : "À venir";
    const values = [
      `${record.vaccine.name} - dose ${record.vaccine.doseNumber}`,
      status,
      record.date.toLocaleDateString("fr-FR"),
      record.completedAt?.toLocaleDateString("fr-FR") || "-",
    ];
    values.forEach((value, index) => {
      const clipped = value.length > 34 && index === 0 ? `${value.slice(0, 31)}...` : value;
      page.drawText(clipped, { x: columns[index], y, size: 8.5, font: index === 0 ? bold : regular, color: rgb(0.18, 0.22, 0.29) });
    });
    page.drawLine({ start: { x: 34, y: y - 8 }, end: { x: 561, y: y - 8 }, thickness: 0.5, color: rgb(0.88, 0.9, 0.93) });
    y -= 24;
  }

  const qr = await QRCode.toBuffer(data.verificationUrl, { width: 220, margin: 1, errorCorrectionLevel: "M" });
  const qrImage = await pdf.embedPng(qr);
  page.drawImage(qrImage, { x: 38, y: 25, width: 54, height: 54 });
  page.drawText("Accès sécurisé au carnet", { x: 103, y: 60, size: 9, font: bold, color: rgb(0.12, 0.16, 0.24) });
  page.drawText("Le QR code ouvre VacciRappel et exige une connexion autorisée.", { x: 103, y: 44, size: 8, font: regular, color: rgb(0.4, 0.44, 0.5) });
  page.drawText(`Document généré le ${new Date().toLocaleString("fr-FR")}`, { x: 390, y: 30, size: 7, font: regular, color: rgb(0.5, 0.53, 0.58) });
  return pdf.save();
}
