import Database = require("better-sqlite3");
const EFS_PATH = process.env.EFS_PATH;

const db = new Database(EFS_PATH + "/lambda-efs.db", {});

export const handler = async (event: any) => {
    console.log(JSON.stringify({ event }));

    bootstrap();

    const users = getUsers();

    console.log(JSON.stringify({ users }));
};

function bootstrap() {
    console.log("Bootstrapping function");
    setupDB();
}

function setupDB() {
    console.log("Setting up DB");

    db.prepare(
        "create table if not exists users (name TEXT, age INTEGER)"
    ).run();

    db.exec("INSERT into users (name, age) VALUES ('Estian Yssel', 27)");
}

function getUsers() {
    return db.prepare("SELECT * FROM users").get();
}
