import SQLite, {
  SQLiteDatabase,
  ResultSet,
  Transaction,
} from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DATABASE_NAME = 'biocol.db';
const DATABASE_VERSION = 1;
const DATABASE_DISPLAYNAME = 'Biocol Local DB';
const DATABASE_SIZE = 200000;

let db: SQLiteDatabase | null = null;

const v0Schema = `
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    quantity INTEGER,
    description TEXT DEFAULT ''
  );
`;

const migrationScripts: Record<number, string> = {
  0: `
    ALTER TABLE items ADD COLUMN description TEXT DEFAULT '';
  `,
};

export const initDatabase = async (): Promise<void> => {
  db = await SQLite.openDatabase({
    name: DATABASE_NAME,
    location: 'default',
  });

  await db.transaction(async (tx: Transaction) => {
    await tx.executeSql(`
      CREATE TABLE IF NOT EXISTS _migrations (
        version INTEGER PRIMARY KEY,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    let currentVersion = 0;

    await new Promise<void>((resolve) => {
      tx.executeSql(
        `SELECT version FROM _migrations ORDER BY version DESC LIMIT 1;`,
        [],
        (_tx, result: ResultSet) => {
          if (result.rows.length > 0) {
            currentVersion = result.rows.item(0).version;
          }
          resolve();
        },
        () => {
          // Table _migrations inexistante (DB neuve)
          resolve();
          return true;
        }
      );
    });

    if (currentVersion === 0) {
      const statements = v0Schema.split(';').filter((s) => s.trim());
      for (const sql of statements) {
        await tx.executeSql(sql);
      }
      await tx.executeSql(`INSERT INTO _migrations (version) VALUES (0);`);
    }

    let version = currentVersion;
    while (version < DATABASE_VERSION) {
      const nextVersion = version + 1;
      const migration = migrationScripts[version];
      if (!migration) break;

      const statements = migration.split(';').filter((s) => s.trim());
      for (const sql of statements) {
        await tx.executeSql(sql);
      }

      await tx.executeSql(
        `INSERT INTO _migrations (version) VALUES (?);`,
        [nextVersion]
      );
      version = nextVersion;
    }
  });
};

export const getDb = (): SQLiteDatabase | null => db;

export const addDataItem = async (
  name: string,
  quantity: number,
  description = ''
): Promise<void> => {
  if (!db) return;
  await db.executeSql(
    `INSERT INTO items (name, quantity, description) VALUES (?, ?, ?);`,
    [name, quantity, description]
  );
};

type Item = {
  id: number;
  name: string;
  quantity: number;
  description: string;
};

export const getItems = async (): Promise<Item[]> => {
  if (!db) return [];

  const results = await db.executeSql(`SELECT * FROM items ORDER BY id DESC;`);
  const result = results[0];
  const items: Item[] = [];

  for (let i = 0; i < result.rows.length; i++) {
    items.push(result.rows.item(i));
  }

  return items;
};

export const deleteItem = async (id: number): Promise<void> => {
  if (!db) return;
  await db.executeSql(`DELETE FROM items WHERE id = ?;`, [id]);
};

export const clearAllItems = async (): Promise<void> => {
  if (!db) return;
  await db.executeSql(`DELETE FROM items;`);
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.close();
    db = null;
  }
};
