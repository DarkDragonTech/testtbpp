const mariadb = require("mariadb");

class BanManager {
  constructor(config) {
    this.database = null;
    this.config = config;
  }

  async init() {
    this.database = await mariadb.createConnection({
      host: this.config.host,
      username: this.config.username,
      password: this.config.password,
      database: this.config.database
    });
  }
}

module.exports = BanManager;
