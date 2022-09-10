const Config = {
	/* Server */
	PORT: process.env.PORT,
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_REFRESH: process.env.JWT_REFRESH,

	/* Database */
	DB_NAME: process.env.DB_NAME,
	DB_HOST: process.env.DB_HOST,
	DB_PORT: process.env.DB_PORT,
	DB_USER: process.env.DB_USER,
	DB_PASSWORD: process.env.DB_PASSWORD,

	/* Others */
	API_COUNTRY_KEY: process.env.API_COUNTRY_KEY
}

export default Config;