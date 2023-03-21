const Config = {
	env: "dev",

	/* Server */
	port: process.env.PORT,
	jwtSecret: process.env.JWT_SECRET,

	/* Database */
	db: {
		NAME: process.env.DB_NAME,
		HOST: process.env.DB_HOST,
		PORT: process.env.DB_PORT,
		USER: process.env.DB_USER,
		PASSWORD: process.env.DB_PASSWORD,
	},

	/* Mail Service */
	mailer: {
		HOST: process.env.MAIL_HOST,
		PORT: process.env.MAIL_PORT,
		EMAIL: process.env.MAIL_EMAIL,
		PASSWORD: process.env.MAIL_PASSWORD,
	},

	/* Others */
	API_COUNTRY_KEY: process.env.API_COUNTRY_KEY
}

export default Config;