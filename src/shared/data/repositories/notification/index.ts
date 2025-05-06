import axios from "axios";
import nodemailer, { Transporter } from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport";

class NotificationRepository {
  transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: 'you@gmail.com', pass: 'your-password' }
    });
  }

  sendMail = (from: string, to: string, message: string) => {
    const mailOptions = {
      from: from,
      to: to,
      subject: 'New BSC Transaction',
      text: message
    };
  
    this.transporter.sendMail(mailOptions, (err) => {
      if (err) console.error('Email failed :', err);
    });
  }

  queueNotification = async (URL: string, data: string) => {
    const response = await axios.post(URL, { data });
  }
}

export default NotificationRepository;