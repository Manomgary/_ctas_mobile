import { capSQLiteSet } from '@capacitor-community/sqlite';
export const createSchema: string = `
CREATE TABLE IF NOT EXISTS  projet (
  id INTEGER PRIMARY KEY NOT NULL,
  intitule TEXT NOT NULL,
  last_modified INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY NOT NULL,
    image BLOB,
    nom TEXT NOT NULL,
    prenom TEXT,
    email TEXT UNIQUE NOT NULL,
    age INTEGER,
    id_project INTEGER NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (id_project) 
      REFERENCES projet(id) 
        ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  size INTEGER,
  img BLOB,
  last_modified INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE TABLE IF NOT EXISTS activite (
  id INTEGER PRIMARY KEY NOT NULL,
  libelle TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS quartier (
  id INTEGER PRIMARY KEY NOT NULL,
  libelle TEXT NOT NULL,
  last_modified INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE TABLE IF NOT EXISTS  beneficiaire (
  id INTEGER PRIMARY KEY NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT,
  sexe TEXT NOT NULL,
  dt_naissance TEXT NOT NULL,
  surnom TEXT NOT NULL,
  cin INTEGER NOT NULL,
  dt_delivrance TEXT NOT NULL,
  lieu_delivrance TEXT NOT NULL,
  contact INTEGER,
  statut TEXT NOT NULL,
  id_quartier INTEGER NOT NULL,
  last_modified INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (id_quartier)
    REFERENCES quartier(id)
      ON DELETE SET DEFAULT
);
CREATE INDEX IF NOT EXISTS projet_index_name ON projet (intitule);
CREATE INDEX IF NOT EXISTS projet_index_last_modified ON projet (last_modified);
CREATE INDEX IF NOT EXISTS users_index_name ON users (nom);
CREATE INDEX IF NOT EXISTS users_index_last_modified ON users (last_modified);
CREATE INDEX IF NOT EXISTS quartier_index_name ON quartier (libelle);
CREATE INDEX IF NOT EXISTS quartier_index_last_modified ON quartier (last_modified);
CREATE INDEX IF NOT EXISTS images_index_name ON images (name);
CREATE INDEX IF NOT EXISTS images_index_last_modified ON images (last_modified);
CREATE TRIGGER IF NOT EXISTS projet_trigger_last_modified
AFTER UPDATE ON projet
FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
BEGIN
    UPDATE projet SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
END;
CREATE TRIGGER IF NOT EXISTS users_trigger_last_modified
AFTER UPDATE ON users
FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
BEGIN
    UPDATE users SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
END;
CREATE TRIGGER IF NOT EXISTS quartier_trigger_last_modified
AFTER UPDATE ON quartier
FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
BEGIN
    UPDATE quartier SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
END;
CREATE TRIGGER IF NOT EXISTS beneficiaire_trigger_last_modified
AFTER UPDATE ON beneficiaire
FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
BEGIN
    UPDATE beneficiaire SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
END;
CREATE TRIGGER IF NOT EXISTS images_trigger_last_modified
AFTER UPDATE ON images
FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
BEGIN
    UPDATE images SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
END;
PRAGMA user_version = 1;
`;
// insert quartier
const row_quartier: Array<Array<any>> = [
  ['beabo'],
  ['tanambao'],
  ['anjatoka III']
];
export const quartier: string = `
  DELETE FROM quartier;
  INSERT INTO quartier(libelle) VALUES("${row_quartier[0][0]}");
  INSERT INTO quartier(libelle) VALUES("${row_quartier[1][0]}");
  INSERT INTO quartier(libelle) VALUES("${row_quartier[2][0]}");
`;

// Insert some Project
const row_projet: Array<Array<any>> = [
  ['AFAFI SUD I'],
  ['DEFIS II']
];

export const projets: string = `
  DELETE FROM projet;
  INSERT INTO projet(intitule) VALUES("${row_projet[0][0]}");
  INSERT INTO projet(intitule) VALUES("${row_projet[1][0]}");
`;
// Insert some Users
const row_users: Array<Array<any>> = [
  ['RANDRIAMANJAKA', 'Dame Francis', 'damefrancis018@gmail.com', 26, 1],
  ['Jones', '', 'Jones.com', 44, 2],
  ['Roger', 'Ferdinand', 'raketaka@gk.com', 44, 1]
];
export const twoUsers: string = `
DELETE FROM users;
INSERT INTO users(nom, prenom, email,age, id_project) VALUES("${row_users[0][0]}","${row_users[0][1]}","${row_users[0][2]}", ${row_users[0][3]}, ${row_users[0][4]});
INSERT INTO users(nom, prenom, email,age, id_project) VALUES("${row_users[1][0]}","${row_users[1][1]}","${row_users[1][2]}", ${row_users[1][3]}, ${row_users[1][4]});
INSERT INTO users(nom, prenom, email,age, id_project) VALUES("${row_users[2][0]}","${row_users[2][1]}","${row_users[2][2]}", ${row_users[2][3]}, ${row_users[2][4]});
`;