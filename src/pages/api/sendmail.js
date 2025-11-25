import nodemailer from "nodemailer";

export const prerender = false;

export async function POST({ request }) {
  // Leer form-data
  let formData;
  try {
    formData = await request.formData();
  } catch (err) {
    console.error("FormData error:", err);
    return new Response("ERROR", { status: 400 });
  }

  const nombre = formData.get("nombre");
  const email = formData.get("email");
  const mensaje = formData.get("mensaje");
  const empresa = formData.get("empresa"); // HONEYPOT

  // 1. Honeypot antibots
  if (empresa && empresa.trim() !== "") {
    console.log("Honeypot triggered — bot blocked");
    return new Response("ERROR", { status: 400 });
  }

  // 2. Configuración Nodemailer
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: import.meta.env.EMAIL_USER,
      pass: import.meta.env.EMAIL_PASS,
    },
  });

  // 3. Cuerpo del email
  const htmlBody = `
  <div style="font-family: Arial; background:#f7f7f7; padding:30px;">
    <div style="text-align:center;">
      <img src="https://i4d-la.com/logo_orange.png" style="max-width:180px; margin-bottom:20px;" />
    </div>

    <div style="background:#fff; padding:25px; border-radius:10px;">
      <h2 style="color:#F5A623;">Nuevo mensaje desde el sitio i4D</h2>

      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong><br>${mensaje}</p>

      <hr style="margin:25px 0; border:0; border-top:1px solid #ddd;">
      <p style="color:#666; font-size:12px; text-align:center;">
        Este mensaje fue enviado automáticamente desde el formulario de contacto de i4D.
      </p>
    </div>
  </div>`;
  
  const mailOptions = {
    from: `"i4D Web" <${import.meta.env.EMAIL_USER}>`,
    to: import.meta.env.EMAIL_TO,
    subject: "Nuevo mensaje desde i4D",
    html: htmlBody,
  };

  // 4. Enviar el correo
  try {
    await transporter.sendMail(mailOptions);
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("MAIL ERROR:", err);
    return new Response("ERROR", { status: 500 });
  }
}
