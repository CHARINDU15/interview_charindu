import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.Mailtrap_Token;
const ENDPOINT = process.env.Mailtrap_Endpoint;

export const mailtrapclient = new MailtrapClient({
    endpoint: ENDPOINT,
  token: TOKEN,
});

export const sender = {
  email: "hello@charindugamage.me",
  name: "CLAVE MAESTRA",
};

