const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const BotServer = require('./bot-server');

(async () => {
    try {
        const file = fs.readFileSync(path.join(__dirname, 'config.yaml'), 'utf8');
        const config = yaml.safeLoad(file);
        const serverUrl = config.settings.server.host;
        const botSettings = { ...config.settings.bot };

        botSettings.applications = config.applications //.map((app) => {
        //     return {
        //         id: app.id,
        //         version: app.version
        //     }
        // });

        try {
            const res = await axios.post(`${serverUrl}/register`, botSettings);
        } catch (e) {
            console.log('Could not register bot');
        }

        // Initialize server
        const server = new BotServer(botSettings);
        server.init();

    } catch (e) {
        console.log('Unknown error');
        console.error(e);
    }
})();