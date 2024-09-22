import nodeMailer from "nodemailer";

export const sendEmail = async (email, subject, message) => {
    const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: subject,
    text: message,
  };
  await transporter.sendMail(mailOptions);
};

export const sendInvoice = async (userEmail, subject, invoice) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: userEmail,
    subject: subject,
    html: `
      <h2>Invoice Details</h2>
      <p>Merchant: ${invoice.merchant_info.business_name}</p>
      <p>Email: ${invoice.merchant_info.email}</p>
      <p>Address: ${invoice.merchant_info.address.line1}, ${invoice.merchant_info.address.city}, ${invoice.merchant_info.address.state}, ${invoice.merchant_info.address.postal_code}</p>
      <h3>Items:</h3>
      <ul>
        ${invoice.items
          .map(
            (item) => `<li>${item.name} - Quantity: ${item.quantity}, Price: ${item.unit_price.currency} ${item.unit_price.value}</li>`
          )
          .join("")}
      </ul>
      <p>Total: ${invoice.total_amount.currency} ${invoice.total_amount.value}</p>
      <p>Note: ${invoice.note}</p>
      <p>Terms: ${invoice.terms}</p>
    `,

  };
  await transporter.sendMail(mailOptions);
}