const config = {
    apiPortNumber: Number(process.env.API_PORT_NUMBER),
    databaseName: process.env.DATABASE_NAME,
    mongoUser: process.env.MONGO_USER,
    mongoPass: process.env.MONGO_PASS,
    mongoServer: process.env.MONGO_SERVER,
    mongoPort: Number(process.env.MONGO_PORT),
    jwt_secret: process.env.JWT_SECRET,
    adminSecret: process.env.ADMIN_SECRET
};

module.exports = {
    get: () => config,
    getMongoConnectionUrl: () =>
        `mongodb://${config.mongoUser}:${config.mongoPass}@${config.mongoServer}:${config.mongoPort}/${config.databaseName}?authSource=admin`
}
