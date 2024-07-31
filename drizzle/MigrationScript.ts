import { SQLiteDatabase } from 'expo-sqlite';

async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1;

    let { user_version: currentDbVersion } = await db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version'
    ) as { user_version: number };

    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    };

    if (currentDbVersion === 0) {
        await db.execAsync(`
            PRAGMA journal_mode = 'wal';
            CREATE TABLE todos (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, description TEXT, complete INTEGER, priority INTEGER, label TEXT, schedule TEXT, created_at TEXT NOT NULL, updated_at TEXT);
        `);

        await db.execAsync(`
            PRAGMA journal_mode = 'wal';
            CREATE TABLE priorities (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, color TEXT);
        `);

        await db.execAsync(`
            PRAGMA journal_mode = 'wal';
            CREATE TABLE labels (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, color TEXT);
        `);

        currentDbVersion = 1;
    }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export default migrateDbIfNeeded;