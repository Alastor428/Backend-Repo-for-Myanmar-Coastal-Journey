console.log('Mailtrap config loaded');
import { MailtrapClient } from 'mailtrap';

const MAIL_TRAP_TOKEN = process.env.MAILTRAP_API_TOKEN; //12-hour token

if(!MAIL_TRAP_TOKEN) {
    throw new Error('MAILTRAP_TOKEN is missing');
}

console.log('MAILTRAP_TOKEN is ', MAIL_TRAP_TOKEN)

export const mailtrapClient = new MailtrapClient({
    token: MAIL_TRAP_TOKEN
});

export const mailtrapSender = {
  email: "hello@demomailtrap.co",
  name: "Myanmar_Coastal_Journey_Team",
};

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);
