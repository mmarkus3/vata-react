import * as sendGrid from '@sendgrid/mail';

export const sender = {
  email: 'tilaukset@finnut.fi',
  name: 'Finnut Tilaukset',
};

export function sendEmail(to: string, subject: string, html: string, from: { email: string; name: string }, replyToEmail?: string) {
  const apiKey = process.env.SENDGRID_KEY;
  if (apiKey) {
    sendGrid.setApiKey(apiKey);
    const replyTo = replyToEmail ? { email: replyToEmail, name: 'Finnut Tilaukset' } : undefined;
    const msg: sendGrid.MailDataRequired = {
      to,
      replyTo,
      from: {
        email: from != null && (from.name.endsWith('@finnut.fi') || from.name.endsWith('@scandium.online')) ? from?.email : sender.email,
        name: from?.name ?? sender.name,
      },
      subject,
      html,
    };
    return sendGrid
      .send(msg)
      .then(() => ({}), (error) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      });
  } else {
    throw Error('No api key set');
  }
}
