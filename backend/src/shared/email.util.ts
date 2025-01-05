import { Resend } from "resend";

export function sendConfirmationEmail(email: string, token: string) {
  const html = `
    <h1>Willkommen bei Devlab!</h1>
        <p>Bitte bestätige deine Registrierung, indem du auf den folgenden Link klickst:</p>
        <a href="${process.env.BACKEND_URL}/api/auth/confirm-email/${token}">E-Mail bestätigen</a>
        <p>Danke,<br>Dein Devlab-Team</p>
    `;

  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.emails.send({
    from: "Devlab Team <no-reply@blog.giuseppe-cino.de>",
    to: email,
    subject: "Bitte bestätige deine Registrierung",
    html,
  });
}

export function sendForgotPasswordEmail(email: string, token: string) {
  const html = `
        <h1>Passwort zurücksetzen</h1>
        <p>Wir haben eine Anfrage erhalten, dein Passwort zurückzusetzen.</p>
        <p>Dazu musst du auf den folgenden Link klicken:</p>
        <a href="${
          process.env.FRONTEND_URL + "#/auth/reset-password"
        }?token=${token}">Passwort zurücksetzen</a>
        `;

  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.emails.send({
    from: "Devlab Team <no-reply@blog.giuseppe-cino.de>",
    to: email,
    subject: "Passwort zurücksetzen",
    html,
  });
}
