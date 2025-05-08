import axios from "axios";
import nodemailer, { Transporter } from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { EmailGenerator, IEmailTem } from "./template";

class EmailRepository {
  from: string;
  template: EmailGenerator;
  transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>

  constructor() {
    this.from = "";
    this.template = new EmailGenerator()
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: 'you@gmail.com', pass: 'your-password' }
    });
  }

  sendEmail = async (to: string, template: IEmailTem) => {
    const mailOptions = {
      from: this.from,
      to: to,
      subject: template.subject,
      html: template.html,
    };
  
    this.transporter.sendMail(mailOptions, (err) => {
      if (err) console.error('Email failed :', err);
    });
  }
}

export default EmailRepository;