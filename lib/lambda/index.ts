import Database = require("better-sqlite3");

const token = process.env.AUTH_TOKEN;

export const handler = async (event: any) => {
    console.log(JSON.stringify({ event }));
    if (!token || event.token !== token) {
        return {
            statusCode: 401,
        }
    }
    const db = bootstrap(event.db || "default");

    const result = await db.prepare(event.sql).run()

    return result;
};

function bootstrap(token: string) {
    console.log("Bootstrapping function");
    return setupDB(token);
}

function setupDB(token: string) {
    console.log("Setting up DB");

    // db.prepare(
    //  "CREATE TABLE IF NOT EXISTS tokens (token TEXT)"
    //).run();
    const EFS_PATH = process.env.EFS_PATH;

const db = new Database(EFS_PATH + `/${token}.db`, {});
    return db;
}
