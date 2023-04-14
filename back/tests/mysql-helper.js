export default class myqslHelper {

	static app = null;

	static async initMysqlConnection(app) {
		this.app = app;
	}

	static async closeMysqlConnection() {
		if (!this.app)
			throw new Error("Mysql connection not initialized");
		// Drop all tables using app.db object
		await app.db.delete('USER', { "1": 1 });
		await app.db.delete('LIKES', { "1": 1 });
		await app.db.delete('TAG', { "1": 1 });
		await app.db.delete('TAG_USER', { "1": 1 });
		await app.db.delete('NOTIF', { "1": 1 });
		await app.db.delete('BLOCKLIST', { "1": 1 });
		await app.db.delete('ROOM', { "1": 1 });
		await app.db.delete('MESSAGE', { "1": 1 });
	}
}