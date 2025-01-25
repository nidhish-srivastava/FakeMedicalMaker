import { NextResponse } from "next/server";
const wkhtmltopdf = require('wkhtmltopdf');

export async function POST(req) {
  const { disease, name, template, days, fatherName, date } = await req.json();

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
          }
          .header {
            text-align: center;
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .content {
            margin-top: 20px;
          }
        </style>
        <title>Medical Certificate</title>
      </head>
      <body>
        <div class="header">Medical Certificate</div>
        <div class="content">
          <p>
            I <strong>Yash Chaterjee</strong> hereby certify that Shri/Smt 
            <strong>${name}</strong> is/was suffering from <strong>${disease}</strong> and requires 
            <strong>${days}</strong> days off starting from <strong>${date}</strong> for treatment.
          </p>
        </div>
      </body>
      </html>
    `;

    const pdfBuffer = await new Promise((resolve, reject) => {
      wkhtmltopdf(htmlContent, { output: '-' }, (err, stream) => {
        if (err) reject(err);
        let data = [];
        stream.on('data', chunk => data.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(data)));
      });
    });

    const headers = {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=Medical_Certificate.pdf",
    };

    return new NextResponse(pdfBuffer, { headers });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
