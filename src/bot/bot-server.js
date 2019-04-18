const express = require('express');
const helper = require('./helper');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');

class BotServer {
    constructor(config) {
        this.config = config;
        this.server = express();
        this.server.use(bodyParser.json())
        this.setupRoutes();
    }

    setupRoutes() {
        this.server.post('/update', async (req, res) => {
            const app = this.config.applications.find(x => x.id == req.body.id);
            let success = false;

            if (app) {
                const guid = uuidv4();
                const zipPath = `temp/${guid}.zip`;
                const backupPath = `temp/bkp_${guid}.zip`;

                try {
                    await helper.downloadZip(req.body.url, zipPath, this.config.token);
                } catch (e) {
                    console.error(e);
                }

                try {
                    await helper.backup(app.path, backupPath);
                } catch (e) {
                    console.error(e);
                }

                try {
                    await helper.stepsBefore(app.stepsBefore);
                } catch (e) {
                    console.error(e);
                }

                try {
                    await helper.update(app, zipPath);
                    success = true;
                }
                catch (e) {
                    console.error(e);
                    helper.rollback(app.path, backupPath);
                }

                try {
                    await helper.stepsAfter(app.stepsAfter);
                } catch (e) {
                    console.error(e);
                }

                res.send({ message: `Result: ${success}` });
            } else {
                res.status(400).send({ message: 'App not found' });
            }
        });
    }

    init() {
        this.server.listen(this.config.port, () => {
            console.log(`Server listening on ${this.config.port}`);
        });
    }
}

module.exports = BotServer;