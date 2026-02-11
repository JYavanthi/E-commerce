const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generateInvoice(data) {
  return new Promise((resolve, reject) => {
    try {
      const invoiceDir = path.join(__dirname, "../invoices");

      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
      }

      const invoiceNo = `INV-${Date.now()}`;
      const filePath = path.join(invoiceDir, `invoice_${data.orderId}.pdf`);

      const doc = new PDFDocument({ size: "A4", margin: 30 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      /* ================= HEADER ================= */
      doc
        .rect(0, 0, 595, 70)
        .fill("#0a8f88");

      doc
        .fillColor("fffdf3")
        .fontSize(20)
        .text("INVOICE", 0, 25, { align: "center" });

      doc.fillColor("black");

      /* ================= TOP INFO ================= */
      doc.moveDown(3);

      doc.fontSize(10);
      doc.text(`Invoice No : ${invoiceNo}`, 40, 90);
      doc.text(`Date : ${new Date().toLocaleDateString()}`, 400, 90);

      /* ================= BILLING / SHIPPING ================= */
      doc
        .rect(30, 115, 535, 90)
        .stroke("#0a8f88");

      doc.fontSize(11).fillColor("#0a8f88");
      doc.text("Billing To", 40, 125);
      doc.text("Shipping To", 300, 125);

      doc.fillColor("black").fontSize(10);
      doc.text(data.billingName || "Customer", 40, 145);
      doc.text(data.billingAddress || "N/A", 40, 160);

      doc.text(data.shippingName || "Customer", 300, 145);
      doc.text(data.shippingAddress || "N/A", 300, 160);

      /* ================= TABLE HEADER ================= */
      let tableTop = 220;

      doc
        .rect(30, tableTop, 535, 25)
        .fill("#0a8f88");

      doc.fillColor("white").fontSize(10);
      doc.text("S No", 35, tableTop + 7);
      doc.text("Product", 80, tableTop + 7);
      doc.text("HSN/SAC", 240, tableTop + 7);
      doc.text("Rate", 320, tableTop + 7);
      doc.text("Qty", 380, tableTop + 7);
      doc.text("Amount", 450, tableTop + 7);

      doc.fillColor("black");

      /* ================= ITEMS ================= */
      let y = tableTop + 30;

      data.items.forEach((item, i) => {
        doc.fontSize(10);
        doc.text(i + 1, 35, y);
        doc.text(item.name, 80, y);
        doc.text(item.hsn || "-", 240, y);
        doc.text(item.unitPrice.toFixed(2), 320, y);
        doc.text(item.quantity, 380, y);
        doc.text(item.total.toFixed(2), 450, y);
        y += 22;
      });

      /* ================= TOTALS ================= */
      y += 10;

      const totalsX = 350;

      doc.fontSize(10);
      doc.text(`Sub Total :`, totalsX, y);
      doc.text(` ${data.subtotal.toFixed(2)}`, totalsX + 120, y);

      y += 15;
      doc.text(`CGST @5% :`, totalsX, y);
      doc.text(` ${(data.tax/2).toFixed(2)}`, totalsX + 120, y);

      y += 15;
      doc.text(`SGST @5% :`, totalsX, y);
      doc.text(` ${(data.tax/2).toFixed(2)}`, totalsX + 120, y);

      y += 15;
      doc.text(`Discount :`, totalsX, y);
      doc.text(` 0.00`, totalsX + 120, y);

      y += 20;
      doc
        .rect(totalsX - 10, y - 5, 210, 25)
        .fill("#0a8f88");

      doc.fillColor("white");
      doc.fontSize(11).text(`Total : ₹ ${data.totalAmount.toFixed(2)}`, totalsX, y);

      doc.fillColor("black");

      /* ================= BANK DETAILS ================= */
      y += 60;

      doc
        .rect(30, y, 250, 90)
        .stroke("#0a8f88");

      doc.fillColor("#0a8f88").fontSize(11).text("Bank Details:", 40, y + 10);
      doc.fillColor("black").fontSize(10);
      doc.text("Bank Name : IOI Bank", 40, y + 30);
      doc.text("Holder Name : Brihati Store", 40, y + 45);
      doc.text("Account No : 453445435", 40, y + 60);
      doc.text("IFSC : IOI000345", 40, y + 75);

      /* ================= UPI ================= */
      doc
        .rect(315, y, 250, 90)
        .stroke("#0a8f88");

      doc.fillColor("#0a8f88").fontSize(11).text("UPI Payment:", 325, y + 10);
      doc.fillColor("black").fontSize(10);
      doc.text("UPI App : BharatPe", 325, y + 30);
      doc.text("UPI Number : 9360172293", 325, y + 50);

      /* ================= TERMS ================= */
      y += 110;

      doc
        .rect(30, y, 535, 50)
        .stroke("#0a8f88");

      doc.fillColor("#0a8f88").fontSize(11).text("Terms & Conditions:", 40, y + 8);
      doc.fillColor("black").fontSize(9);
      doc.text(
        "Goods once sold will not be taken back. This is a system generated invoice.",
        40,
        y + 28
      );

      /* ================= FOOTER ================= */
      y += 70;
      doc.fontSize(10).text("Authorised Sign", 450, y);
      doc.moveDown();
      doc.fontSize(10).text("Thank You", 0, y + 30, { align: "center" });

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);

    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generateInvoice };
