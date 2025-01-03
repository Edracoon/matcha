import nodemailer from "nodemailer";
import Config from "../Config.js";

class MailService {
	constructor() {
		// Singleton implementation
		if (MailService.instance)
			return MailService.instance;
		MailService.instance = this;

		// Load the template
		this.template = "";

		// In dev mode, we don't want to send real mails, so we mock the transporter
		// if (Config.env === "dev")
		// 	this.transporter = {
		// 		sendMail: (obj) => { console.log(`--- email to ${obj.to} ---\n`, obj) }
		// 	};
		// // Else we instantiate the transporter of nodemailer with the config
		// else 
			this.transporter = nodemailer.createTransport({
				service: 'gmail',
				host: 'smtp.gmail.com',
				port: 587,
				secure: false,
				auth: {
					user: Config.mailer.EMAIL,
					pass: Config.mailer.PASSWORD,
				},
			});
	}

	async sendMail(email, subject, content) {
		await this.transporter.sendMail({
			from: {
				name: "Matcha",
				address: Config.mailer.EMAIL,
			},
			to: email,
			subject: subject,
			text: content,
			// html: this.template.replace("{{subject}}", subject).replace("{{content}}", content),
		});
	}
}

export default new MailService();