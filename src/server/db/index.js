const loki = require('lokijs');

class Database {
    constructor() {
        this.db = new loki('loki.json');
        this.bots = this.db.addCollection('bots');
    }

    addBot(bot) {
        this.bots.insert(bot);
    }

    getBots() {
        return this.bots.find();
    }

    getBotById(id) {
        return this.bots.findOne({ id });
    }
}

module.exports = Database;