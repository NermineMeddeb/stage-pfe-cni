import { Component, OnInit } from '@angular/core';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-generer-certificats',
  templateUrl: './generer-certificats.component.html',
  styleUrls: ['./generer-certificats.component.css'],
})
export class GenererCertificatsComponent implements OnInit {
  // Modèle de données du formulaire
  formData = {
    recipient: '',
    title: '',
    dateDebut: '',
    dateFin: '',
    dateEmission: '',
  };

  constructor() {}

  ngOnInit(): void {
    // Initialiser la date d'émission avec la date du jour
    this.formData.dateEmission = new Date().toISOString().split('T')[0];
  }
  private readonly PDF_TEMPLATE_PATH = 'assets/certifications/ATTESTATION.pdf';

  // Génération du PDF avec pdf-lib
  private async generatePdfCertificate(data: {
    recipient: string;
    title: string;
    dateDebut: string;
    dateFin: string;
    dateEmission: string;
  }): Promise<Uint8Array> {
    try {
      // Chargement du modèle de certificat
      const existingPdfBytes = await fetch(this.PDF_TEMPLATE_PATH).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      // Police pour le texte
      const helvetica = await pdfDoc.embedFont('Helvetica');
      const helveticaBold = await pdfDoc.embedFont('Helvetica-Bold');
      const helveticaOblique = await pdfDoc.embedFont('Helvetica-Oblique');

      // Ajout du nom du destinataire
      firstPage.drawText(data.recipient, {
        x:
          width / 2 -
          this.calculateCenteredTextPosition(data.recipient, 24, helveticaBold),
        y: height / 2 - 10,
        size: 24,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      // Ajout du titre de la formation
      firstPage.drawText(data.title, {
        x:
          width / 2 -
          this.calculateCenteredTextPosition(data.title, 24, helveticaBold),
        y: height / 2 - 140, // Déplacer un peu plus bas (ici on décale de 30 pixels)
        size: 18,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      // Ajout des dates de formation
      const dateText = `Du ${data.dateDebut} au ${data.dateFin}`;
      firstPage.drawText(dateText, {
        x:
          width / 2 -
          this.calculateCenteredTextPosition(dateText, 24, helveticaBold),
        y: height / 2 - 60,
        size: 12,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      // Ajout de la date d'émission
      const emissionText = `Délivré le ${data.dateEmission}`;
      firstPage.drawText(emissionText, {
        x:
          width / 2 -
          this.calculateCenteredTextPosition(
            emissionText,
            10,
            helveticaOblique
          ),
        y: height / 2 - 120,
        size: 10,
        font: helveticaOblique,
        color: rgb(0, 0, 0),
      });

      // Signature
      firstPage.drawText('Signature du responsable', {
        x: width - 150,
        y: 100,
        size: 10,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      return await pdfDoc.save();
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      throw error;
    }
  }

  // Calcul de la position pour centrer le texte
  private calculateCenteredTextPosition(
    text: string,
    fontSize: number,
    font: any
  ): number {
    // Estimation simple - à ajuster selon la police
    return (text.length * fontSize * 0.5) / 2;
  }

  generateCertificate(): void {
    this.generatePdfCertificate(this.formData)
      .then((pdfBytes) => {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        saveAs(blob, `Certificat-${this.formData.recipient}.pdf`);
      })
      .catch((error) => {
        console.error('Erreur lors de la génération du certificat :', error);
        alert("Une erreur s'est produite lors de la génération du certificat.");
      });
  }
}
