import Database = require("better-sqlite3");
const EFS_PATH = process.env.EFS_PATH;

const db = new Database(EFS_PATH + "/lambda-efs.db", {});

export const handler = async (event: any) => {
    console.log(JSON.stringify({ event }));

    bootstrap();

    createUser(event.name, event.age);

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
        "CREATE TABLE IF NOT EXISTS users (name TEXT, age INTEGER)"
    ).run();
}

function createUser(name: string, age: number) {
    db.prepare(`INSERT into users (name, age) VALUES ('${name}', ${age})`).run();
}

function getUsers() {
    return db.prepare("SELECT * FROM users").all();
}
