const Config = {
	ENV: "dev",

	/* Server */
	PORT: process.env.PORT,
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_REFRESH: process.env.JWT_REFRESH,

	/* Database */
	DB: {
		NAME: process.env.DB_NAME,
		HOST: process.env.DB_HOST,
		PORT: process.env.DB_PORT,
		USER: process.env.DB_USER,
		PASSWORD: process.env.DB_PASSWORD,
	},

	/* Mail Service */
	MAILER: {
		HOST: process.env.MAIL_HOST,
		PORT: process.env.MAIL_PORT,
		EMAIL: process.env.MAIL_EMAIL,
		PASSWORD: process.env.MAIL_PASSWORD,
	},

	/* Others */
	API_COUNTRY_KEY: process.env.API_COUNTRY_KEY
}

export default Config;