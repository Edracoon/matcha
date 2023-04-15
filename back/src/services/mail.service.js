import nodemailer from "nodemailer";
import Config from "../Config.js";

class MailService {
	constructor() {
		if (MailService.instance) return MailService.instance;
		MailService.instance = this;

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
			host: Config.mailer.HOST,
			port: Config.mailer.PORT,
			auth: {
				user: Config.mailer.EMAIL,
				pass: Config.mailer.PASSWORD,
			},
		});
	}

	async sendMail(email, subject, content) {
		await this.transporter.sendMail({
			from: Config.mailer.EMAIL,
			to: email,
			subject,
			text: content,
			html: this.template.replace("{{subject}}", subject).replace("{{content}}", content),
		});
	}
}

export default new MailService();