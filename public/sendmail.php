<?php
header("Content-Type: text/plain; charset=UTF-8");

// 1. Honeypot
if (!empty($_POST["empresa"])) {
    echo "ERROR";
    exit;
}

// 2. reCAPTCHA v3 verification
$recaptcha_token = $_POST["recaptcha_token"] ?? "";
$secret_key = "6LcHLRgsAAAAAHTf-jmqfhe5veANl6XHa5eBFOBj"; // ← CAMBIAR

$verify = file_get_contents(
    "https://www.google.com/recaptcha/api/siteverify?secret={$secret_key}&response={$recaptcha_token}"
);

$captcha_success = json_decode($verify);

if (!$captcha_success->success || $captcha_success->score < 0.4) {
    echo "ERROR";
    exit;
}

// 3. Obtener datos
$nombre = trim($_POST["nombre"] ?? "");
$email = trim($_POST["email"] ?? "");
$mensaje = trim($_POST["mensaje"] ?? "");

if ($nombre === "" || $email === "" || $mensaje === "") {
    echo "ERROR";
    exit;
}

// 4. Correo destino
$to = "contacto@i4d-la.com";
$subject = "Nuevo mensaje desde el sitio i4D";

// 5. HTML Email con branding
$body = "
<div style='font-family: Arial, sans-serif; padding:20px; border-radius:10px; background:#f6f6f6'>
  <div style='text-align:center; margin-bottom:20px;'>
    <img src='https://i4d-la.com/logo.png' alt='i4D' style='max-width:180px;'>
  </div>

  <div style='background:#ffffff; padding:20px; border-radius:10px;'>
    <h2 style='color:#F5A623; margin-bottom:10px;'>Nuevo mensaje de contacto</h2>

    <p><strong>Nombre:</strong> {$nombre}</p>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Mensaje:</strong><br>{$mensaje}</p>

    <br>
    <hr style='border:none; border-top:1px solid #ddd;'>

    <p style='font-size:12px; color:#777; text-align:center;'>
      Este mensaje fue enviado desde el formulario de contacto del sitio i4D.
    </p>
  </div>
</div>
";

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: i4D Web <no-reply@i4d-la.com>\r\n";

// 6. Enviar correo
$sent = mail($to, $subject, $body, $headers);

echo $sent ? "OK" : "ERROR";
