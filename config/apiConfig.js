function getApiConfig() {
	var apiConfig;
	switch (process.env.API_ENV) {
		case 'development':
			apiConfig = require('./apiConfig/dev.api.config')
		break;
		case 'staging':
			apiConfig = require('./apiConfig/staging.api.config')
		break;
			case 'production':
		default:
			apiConfig = require('./apiConfig/prod.api.config')
	}
	return apiConfig
}

module.exports = {
	apiConfig: getApiConfig()
}
