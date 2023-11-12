import SQLib from "../../SQLib.js";
import FakerService from "../../services/faker.service.js";
import Config from "../../Config.js";

const sql = new SQLib(); // Singleton

class AdminController {

	/**
	 * Populate the database with fake data users
	 * @param { params: { adminkey, number } }
	 */
	static async populate(req, res) {
		const { adminkey, number } = req.params;
	
		if (adminkey !== Config.adminKey)
			return res.status(401).json({ error: "Unauthorized" });

		if (!number || isNaN(number))
			return res.status(400).json({ error: "Invalid number" });

		if (number < 1 || number > 1000)
			return res.status(400).json({ error: "Invalid must be within 1 and 1000" });
		
		// Generate fake users
		const users = [];
		for (let i = 0; i < number; i++) {
			const user = await FakerService.generatefakeUser(users, users);
			users.push(user);
		}
		
		return res.status(200).json({ users });
	}

	/**
	 * Truncate all generated fake users
	 * @param { params: { adminkey } }
	 */
	static async truncate(req, res) {
		const { adminkey } = req.params;
	
		if (adminkey !== Config.adminKey)
			return res.status(401).json({ error: "Unauthorized" });

		try { await sql.delete("USER", { isFake: 1 }); }
		catch (e) {
			return res.status(500).json({ error: "Internal server error" });
		}

		return res.status(200).json({ message: "All fake users have been deleted" });
	}
}

export default AdminController;