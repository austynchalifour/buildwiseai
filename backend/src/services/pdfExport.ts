import PDFDocument from 'pdfkit';
import { IProject } from '../models/Project';

export function generateProjectPdf(project: IProject): PDFKit.PDFDocument {
  const doc = new PDFDocument({ margin: 50, size: 'LETTER' });
  const analysis = project.analysis;

  doc.fontSize(22).font('Helvetica-Bold').text('BuildWise AI — Project Plan', { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).font('Helvetica').fillColor('#666').text(`Generated ${new Date().toLocaleDateString()}`, { align: 'center' });
  doc.moveDown(1.5);
  doc.fillColor('#000');

  doc.fontSize(16).font('Helvetica-Bold').text(analysis?.title || project.title);
  doc.moveDown(0.5);
  doc.fontSize(11).font('Helvetica').text(analysis?.summary || project.description);
  doc.moveDown();

  if (analysis) {
    doc.fontSize(13).font('Helvetica-Bold').text('Project Overview');
    doc.fontSize(11).font('Helvetica');
    doc.text(`Type: ${analysis.projectType}`);
    doc.text(`Dimensions: ${analysis.dimensions.description}`);
    doc.text(`Difficulty: ${analysis.complexity}`);
    doc.text(`Time Estimate: ${analysis.timeEstimate}`);
    doc.moveDown();

    doc.fontSize(13).font('Helvetica-Bold').text('Cost Estimate');
    doc.fontSize(11).font('Helvetica');
    doc.text(`Materials: $${analysis.costs.materials.toLocaleString()}`);
    doc.text(`Labor: $${analysis.costs.labor.toLocaleString()}`);
    doc.text(`Permits: $${analysis.costs.permits.toLocaleString()}`);
    doc.font('Helvetica-Bold').text(`Total: $${analysis.costs.total.toLocaleString()}`);
    doc.moveDown();

    doc.fontSize(13).font('Helvetica-Bold').text('Shopping List');
    doc.fontSize(11).font('Helvetica');
    for (const mat of analysis.materials) {
      doc.text(`• ${mat.name} — ${mat.quantity} ${mat.unit} (+${Math.round(mat.wasteFactor * 100)}% waste)`);
    }
    doc.moveDown();

    doc.fontSize(13).font('Helvetica-Bold').text('Product Matches');
    doc.fontSize(11).font('Helvetica');
    for (const prod of analysis.products) {
      const retailer = prod.retailer === 'home_depot' ? "Home Depot" : "Lowe's";
      doc.text(`• ${prod.materialName} → ${prod.productName} (${retailer}) — $${prod.price}`);
    }
    doc.moveDown();

    doc.fontSize(13).font('Helvetica-Bold').text('Tools Required');
    doc.fontSize(11).font('Helvetica').text(analysis.toolsRequired.join(', '));
    doc.moveDown();

    doc.fontSize(13).font('Helvetica-Bold').text('Safety Considerations');
    doc.fontSize(11).font('Helvetica');
    for (const note of analysis.safetyConsiderations) {
      doc.text(`• ${note}`);
    }
    doc.moveDown();

    for (const phase of analysis.phases) {
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text(`Phase ${phase.phase}: ${phase.title}`);
      doc.fontSize(11).font('Helvetica').text(`Estimated time: ${phase.estimatedHours} hours`);
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Steps:');
      doc.font('Helvetica');
      phase.steps.forEach((step, i) => doc.text(`${i + 1}. ${step}`));
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Tools:');
      doc.font('Helvetica').text(phase.tools.join(', '));
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Safety:');
      doc.font('Helvetica');
      phase.safetyNotes.forEach((note) => doc.text(`• ${note}`));
    }
  }

  doc.end();
  return doc;
}
