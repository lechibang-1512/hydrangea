const { spawnSync } = require("node:child_process");

function isMdmMacOS() {
	let enrolled = true; // let's assume we're managed and correct ourselves if we prove we're not

	try {
		const result = spawnSync("/usr/bin/profiles", [
			"status",
			"-type",
			"enrollment",
		]);

		if (!result.stdout) return false;

		const command = result.stdout.toString();

		if (
			command.includes("Enrolled via DEP: No") &&
			command.includes("MDM enrollment: No")
		) {
			enrolled = false;
		}
	} catch (e) {
		enrolled = false;
	}

	return enrolled;
}

function isMdmWindows() {
	let enrolled = true; // let's assume we're managed and correct ourselves if we prove we're not

	try {
		const result = spawnSync("dsregcmd", ["/status"]);

		if (!result.stdout) return false;

		const command = result.stdout.toString();

		if (!command.includes("MdmUrl")) {
			enrolled = false;
		}
	} catch (e) {
		enrolled = false;
	}

	return enrolled;
}

function isMdm() {
	if (process.platform === "darwin") {
		return isMdmMacOS();
	}

	if (process.platform === "win32") {
		return isMdmWindows();
	}

	return false;
}

module.exports = isMdm;
