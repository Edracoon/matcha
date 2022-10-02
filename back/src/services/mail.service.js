import nodemailer from "nodemailer";
import Config from "../Config.js";

export default class MailService {
	constructor() {
		if (Config.env === "dev") {
			this.transporter = {
				sendMail: (obj) => {
					console.log(obj);
				},
			};
			this.template = "";
			return;
		}
		this.transporter = nodemailer.createTransport({
			host: Config.MAILER.HOST,
			port: Config.MAILER.PORT,
			auth: {
				user: Config.MAILER.EMAIL,
				pass: Config.MAILER.PASSWORD,
			},
		});
	}

	async sendMail(email, subject, content) {
		await this.transporter.sendMail({
			from: Config.MAILER.EMAIL,
			to: email,
			subject,
			text: content,
			html: this.template.replace("{{subject}}", subject).replace("{{content}}", content),
		});
	}
}