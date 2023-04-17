export default class myqslHelper {

	static async resetDB(app) {
		console.log("\n------------------------\nresetDB\n------------------------\n")
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