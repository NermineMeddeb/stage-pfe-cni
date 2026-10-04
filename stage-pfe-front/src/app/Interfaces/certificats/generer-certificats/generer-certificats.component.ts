import { Component, OnInit } from '@angular/core';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-generer-certificats',
  templateUrl: './generer-certificats.component.html',
  styleUrls: ['./generer-certificats.component.css']
})
export class GenererCertificatsComponent implements OnInit {
  // Modèle de données du formulaire
  formData = {
    template: 'achievement',
    recipient: '',
    title: '',
    description: '',
    issuer: '',
    issuerTitle: '',
    date: '',
    certNumber: ''
  };

  constructor() { }

  ngOnInit(): void {
    // Initialiser la date avec la date du jour
    this.formData.date = new Date().toISOString().split('T')[0];
  }

  async generateCertificate() {
    // Vérification des champs obligatoires
    if (!this.formData.recipient || !this.formData.title || !this.formData.description || !this.formData.issuer) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      // Charger le modèle de certificat PDF (ajoute ton fichier dans "assets/")
      const pdfUrl = 'assets/modele-certificat.pdf'; // Change ce chemin si nécessaire
      const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());

      // Charger le document PDF existant
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      // Définir la couleur du texte (Noir)
      const textColor = rgb(0, 0, 0);

      // Définir les positions du texte sur le certificat (Ajuste selon ton modèle)
      firstPage.drawText(this.formData.recipient, { x: 400, y: 400, size: 24, color: textColor });
      firstPage.drawText(this.formData.title, { x: 400, y: 370, size: 18, color: textColor });
      firstPage.drawText(this.formData.description, { x: 400, y: 340, size: 12, color: textColor });
      firstPage.drawText(this.formData.issuer, { x: 400, y: 310, size: 12, color: textColor });
      firstPage.drawText(this.formData.issuerTitle, { x: 400, y: 290, size: 12, color: textColor });
      firstPage.drawText(this.formData.date, { x: 400, y: 260, size: 12, color: textColor });
      firstPage.drawText(this.formData.certNumber, { x: 400, y: 230, size: 12, color: textColor });

      // Générer le fichier PDF final
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      // Télécharger le fichier PDF
      saveAs(blob, `Certificat-${this.formData.recipient}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du certificat :', error);
      alert('Erreur lors de la création du certificat.');
    }
  }
}
