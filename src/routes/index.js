import fs from 'fs';

const Router = {
	build(app) {
		const routes = fs
			.readdirSync(__dirname)
			.filter((file) => file !== 'index.js')
			.filter((file) => file.match(/^(?!.*\.test\.js$).*\.js$/))
			.map((file) => file.split('.')[0]);

		routes.forEach((route) => {
			app.use(`/${route}`, this.importRouter(`./${route}.js`));
		});
	},
	importRouter(routeFilePath) {
		return require(routeFilePath);
	}
};

module.exports = Router;
