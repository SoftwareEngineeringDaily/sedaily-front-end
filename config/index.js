function getApiConfig () {
	var apiConfig;

	switch (process.env.API_ENV) {
		case 'development':
			apiConfig = require('./apiConfig/dev.api.config')
		break;
		case 'testing':
			apiConfig = require('./apiConfig/test.api.config')
		break;
			case 'production':
		default:
			apiConfig = require('./apiConfig/prod.api.config')
	}
	return apiConfig
}

module.exports = {
	getApiConfig,
	apiConfig: getApiConfig(),
	chat: {
		websocketURL: 'wss://infinite-mesa-69601.herokuapp.com/socket'
	}
}
