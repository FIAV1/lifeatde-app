const { readFile } = require('fs');
const { exec } = require('child_process');

readFile(`${__dirname}/../package.json`, (error, data) => {
	if (error) {
		return console.error(error);
	}

	const package = JSON.parse(data.toString());
	let dependencies = Object.keys(package.dependencies);
	dependencies = dependencies.join(' ');

	removeDependencies(dependencies)
		.then((m1) => {
			console.log(m1);
			installDependencies(dependencies)
				.then((m2) => {
					console.log(m2);

					if (m2.includes('npm run `npm audit fix` to fix them')) {
						fixVulnerabilities()
							.then((m3) => {
								console.log(m3);
							})
							.catch((e3) => {
								console.error(
									`fixVulnerabilities() failed with code ${e3.code}`
								);
								console.error(e3.message);
							});
					}
				})
				.catch((e2) => {
					console.error(`installDependencies() failed with code ${e2.code}`);
					console.error(e2.message);
				});
		})
		.catch((e1) => {
			console.error(`removeDependencies() failed with code ${e1.code}`);
			console.error(e1.message);
		});
});

const removeDependencies = (dependencies) =>
	new Promise((resolve, reject) => {
		exec(`npm remove ${dependencies}`, (error, stdout, stderr) => {
			if (error) {
				reject({ code: error, message: stderr });
			} else {
				resolve(stdout);
			}
		});
	});

const installDependencies = (dependencies) =>
	new Promise((resolve, reject) => {
		exec(`npm install ${dependencies}`, (error, stdout, stderr) => {
			if (error) {
				reject({ code: error, message: stderr });
			} else {
				resolve(stdout);
			}
		});
	});

const fixVulnerabilities = () =>
	new Promise((resolve, reject) => {
		exec(`npm audit fix --force`, (error, stdout, stderr) => {
			if (error) {
				reject({ code: error, message: stderr });
			} else {
				resolve(stdout);
			}
		});
	});
