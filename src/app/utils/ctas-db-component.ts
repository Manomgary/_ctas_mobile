import { Activite, Fonction, 
        Participe_proj_activ, Participe_proj_volet, Fonkotany,
        Projet, Region, Utilisateurs, Volet, District, Commune } from "./interface-bd";

export const createSchema: string = `
CREATE TABLE IF NOT EXISTS  projet (
    code_proj TEXT PRIMARY KEY NOT NULL, 
    nom TEXT NOT NULL, 
    description TEXT,
    ancronyme TEXT NOT NULL,
    logo BLOB,  
    statuts TEXT NOT NULL,
    numero INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS  equipe (
    code_equipe INTEGER PRIMARY KEY NOT NULL, 
    img BLOB, 
    matricule TEXT,
    nom TEXT NOT NULL, 
    prenom TEXT, 
    sexe TEXT NOT NULL, 
    dt_nais TEXT NOT NULL, 
    cin TEXT NOT NULL, 
    dt_delivrance TEXT NOT NULL, 
    lieu_delivrance TEXT NOT NULL, 
    img_cin BLOB, 
    email TEXT, 
    num_perso TEXT, 
    num_float TEXT, 
    id_fonct INTEGER NOT NULL,
    intitule_fct TEXT NOT NULL,
    statuts TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS volet (
    code_vol INTEGER PRIMARY KEY NOT NULL, 
    nom TEXT NOT NULL, 
    description TEXT
    );
CREATE TABLE IF NOT EXISTS  annee_agricole (
    code INTEGER PRIMARY KEY NOT NULL, 
    annee_du INTEGER, 
    annee_au INTEGER, 
    statut INTEGER
    );
CREATE TABLE IF NOT EXISTS participe_proj_volet(
    code INTEGER PRIMARY KEY NOT NULL, 
    id_projet TEXT NOT NULL, 
    id_volet INTEGER NOT NULL, 
    id_chef INTEGER, 
    annee_integr TEXT, 
    statuts TEXT NOT NULL
    );
CREATE TABLE IF NOT EXISTS projet_equipe (
    code INTEGER PRIMARY KEY NOT NULL,
    id_projet TEXT NOT NULL,
    id_equipe INTEGER NOT NULL,
    status_pe TEXT NOT NULL,
    FOREIGN KEY (id_projet) REFERENCES projet(code_proj) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_equipe) REFERENCES equipe(code_equipe) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS projet_equipe_volet (
    code INTEGER PRIMARY KEY NOT NULL,
    id_projet TEXT NOT NULL,
    id_equipe INTEGER NOT NULL,
    id_volet INTEGER NOT NULL,
    status_pev TEXT NOT NULL,
    FOREIGN KEY (id_projet) REFERENCES projet(code_proj) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_equipe) REFERENCES equipe(code_equipe) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_volet) REFERENCES volet(code_vol) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS activite (
    code_act INTEGER PRIMARY KEY NOT NULL, 
    intitule TEXT NOT NULL, 
    description TEXT NOT NULL,
    id_volet INTEGER NOT NULL,
    FOREIGN KEY (id_volet) REFERENCES volet(code_vol) ON DELETE SET DEFAULT
);

CREATE TABLE IF NOT EXISTS bloc (
    ordre INTEGER NOT NULL,
    code_bloc TEXT PRIMARY KEY NOT NULL, 
    nom TEXT NOT NULL, 
    ancronyme TEXT NOT NULL,
    id_prjt TEXT NOT NULL, 
    id_tech INTEGER,
    status TEXT NOT NULL,
    FOREIGN KEY (id_prjt) REFERENCES projet(code_proj) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_tech) REFERENCES equipe(code_equipe) ON DELETE SET DEFAULT
);

CREATE TABLE IF NOT EXISTS collaborateur (
    code_col TEXT PRIMARY KEY NOT NULL, 
    nom TEXT NOT NULL, 
    description TEXT,
    ancronyme TEXT
);

CREATE TABLE IF NOT EXISTS utilisateurs (
    code_util INTEGER PRIMARY KEY NOT NULL, 
    id_equipe INTEGER NOT NULL,
    img Blob, 
    matricule TEXT,
    nom TEXT NOT NULL, 
    prenom TEXT, 
    sexe TEXT NOT NULL,
    dt_nais TEXT NOT NULL,
    num_perso TEXT NOT NULL,
    id_fonct INTEGER NOT NULL,
    fonction TEXT NOT NULL,
    type TEXT NOT NULL, 
    role TEXT NOT NULL, 
    nom_users TEXT,
    mot_passe TEXT NOT NULL, 
    situation_compte TEXT NOT NULL, 
    statuts_equipe TEXT NOT NULL,
    statuts_compte TEXT NOT NULL,
    FOREIGN KEY (id_equipe) REFERENCES equipe(code_equipe) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS participe_proj_activ (
    code INTEGER PRIMARY KEY NOT NULL, 
    id_proj TEXT NOT NULL, 
    id_activ INTEGER NOT NULL,  
    statuts TEXT NOT NULL,
    FOREIGN KEY (id_proj) REFERENCES projet(code_proj) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_activ) REFERENCES activite(code_act) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS zone_region (
    code_reg TEXT PRIMARY KEY NOT NULL, 
    nom_reg TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS zone_district (
    code_dist TEXT PRIMARY KEY NOT NULL, 
    nom_dist TEXT NOT NULL, 
    id_reg TEXT
);
CREATE TABLE IF NOT EXISTS zone_commune (
    code_com TEXT PRIMARY KEY NOT NULL, 
    nom_com TEXT NOT NULL, 
    id_dist TEXT,
    FOREIGN KEY (id_dist) REFERENCES zone_district(code_dist) ON DELETE SET DEFAULT    
);
CREATE TABLE IF NOT EXISTS zone_fonkotany (
    code_fkt TEXT PRIMARY KEY NOT NULL, 
    nom_fkt TEXT NOT NULL, 
    id_com TEXT,
    FOREIGN KEY (id_com) REFERENCES zone_commune(code_com) ON DELETE SET DEFAULT
);

CREATE TABLE IF NOT EXISTS association (
    numero INTEGER NOT NULL,
    code_ass TEXT PRIMARY KEY NOT NULL, 
    nom TEXT NOT NULL, 
    ancronyme TEXT NOT NULL,
    id_prjt TEXT NOT NULL, 
    id_tech INTEGER NOT NULL,
    id_fkt TEXT NOT NULL, 
    status TEXT NOT NULL,
    FOREIGN KEY (id_prjt) REFERENCES projet(code_proj) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_fkt) REFERENCES zone_fonkotany(code_fkt) ON DELETE SET DEFAULT

);

CREATE TABLE IF NOT EXISTS bloc_zone (
    code INTEGER PRIMARY KEY NOT NULL,
    id_fkt TEXT NOT NULL,
    id_bloc TEXT NOT NULL,
    id_km TEXT,
    FOREIGN KEY (id_fkt) REFERENCES zone_fonkotany(code_fkt) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_bloc) REFERENCES bloc(code_bloc) ON DELETE SET DEFAULT
);

CREATE TABLE IF NOT EXISTS collaborateur_activ (
    code INTEGER PRIMARY KEY NOT NULL, 
    id_col TEXT NOT NULL, 
    id_activ INTEGER NOT NULL,
    FOREIGN KEY (id_col) REFERENCES collaborateur(code_col) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_activ) REFERENCES activite(code_act) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS beneficiaire (
    code_benef TEXT PRIMARY KEY NOT NULL,
    img_benef TEXT,
    nom TEXT NOT NULL,
    prenom TEXT,
    sexe TEXT NOT NULL,
    dt_nais TEXT,
    dt_nais_vers TEXT,
    surnom TEXT,
    cin INTEGER,
    dt_delivrance TEXT,
    lieu_delivrance TEXT,
    img_cin TEXT,
    contact TEXT,
    id_fkt TEXT,
    id_commune TEXT,
    village TEXT,
    dt_Insert TEXT, 
    etat TEXT,
    statut TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS benef_activ_pms (
    code_benef_pms TEXT PRIMARY KEY NOT NULL, 
    code_achat TEXT,
    id_proj TEXT NOT NULL, 
    id_activ INTEGER NOT NULL, 
    id_benef TEXT NOT NULL, 
    id_association TEXT NOT NULL, 
    id_collaborateur TEXT NOT NULL,
    etat TEXT,
    status TEXT NOT NULL,
    FOREIGN KEY (id_proj) REFERENCES projet(code_proj) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_activ) REFERENCES activite(code_act) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_benef) REFERENCES beneficiaire(code_benef) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_association) REFERENCES association(code_ass) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_collaborateur) REFERENCES collaborateur(code_col) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS benef_activ_bl (
    code_benef_bl TEXT PRIMARY KEY NOT NULL, 
    id_proj TEXT NOT NULL, 
    id_activ INTEGER NOT NULL, 
    id_benef TEXT NOT NULL, 
    code_achat TEXT,
    id_bloc TEXT NOT NULL, 
    id_collaborateur INTEGER NOT NULL, 
    status TEXT NOT NULL,
    FOREIGN KEY (id_proj) REFERENCES projet(code_proj) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_activ) REFERENCES activite(code_act) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_benef) REFERENCES beneficiaire(code_benef) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_bloc) REFERENCES bloc(code_bloc) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_collaborateur) REFERENCES collaborateur(code_col) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS benef_activ_pr (
    code_pr TEXT PRIMARY KEY NOT NULL, 
    id_proj TEXT NOT NULL, 
    id_activ INTEGER NOT NULL, 
    id_benef TEXT NOT NULL, 
    id_bloc TEXT, 
    code_achat TEXT, 
    id_collaborateur INTEGER NOT NULL, 
    id_tech INTEGER NOT NULL, 
    etat TEXT NOT NULL, 
    status TEXT NOT NULL,
    FOREIGN KEY (id_proj) REFERENCES projet(code_proj) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_activ) REFERENCES activite(code_act) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_benef) REFERENCES beneficiaire(code_benef) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_tech) REFERENCES equipe(code_equipe) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_collaborateur) REFERENCES collaborateur(code_col) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_bloc) REFERENCES bloc(code_bloc) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS parcelle (
    code_parce TEXT PRIMARY KEY NOT NULL, 
    id_benef TEXT NOT NULL, 
    ref_gps INTEGER, 
    lat DOUBLE, 
    log DOUBLE, 
    superficie INTEGER, 
    id_fkt TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (id_fkt) REFERENCES zone_fonkotany(code_fkt) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_benef) REFERENCES beneficiaire(code_benef) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS assoc_parce (
    code_parce TEXT PRIMARY KEY NOT NULL, 
    id_assoc TEXT NOT NULL, 
    id_benef TEXT NOT NULL, 
    ref_gps TEXT, 
    lat DOUBLE, 
    log DOUBLE, 
    superficie INTEGER, 
    id_fkt TEXT NOT NULL, 
    anne_adheran INTEGER, 
    status TEXT NOT NULL,
    FOREIGN KEY (id_assoc) REFERENCES association(code_ass) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_fkt) REFERENCES zone_fonkotany(code_fkt) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_benef) REFERENCES beneficiaire(code_benef) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS assoc_parce_saison (
    code INTEGER PRIMARY KEY AUTOINCREMENT, 
    id_annee INTEGER, 
    id_saison TEXT NOT NULL, 
    id_parce TEXT, 
    id_var TEXT NOT NULL, 
    objectif INTEGER, 
    etat TEXT NOT NULL, 
    commentaire TEXT,
    FOREIGN KEY (id_annee) REFERENCES annee_agricole(code) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_saison) REFERENCES saison(code_saison) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_parce) REFERENCES assoc_parce(code_parce) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_var) REFERENCES variette(code_var) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS bloc_parce (
    code_parce TEXT PRIMARY KEY NOT NULL, 
    id_bloc TEXT NOT NULL, 
    id_benef TEXT NOT NULL, 
    ref_gps TEXT, 
    lat DOUBLE, 
    log DOUBLE, 
    superficie INTEGER, 
    id_fkt TEXT NOT NULL, 
    anne_adheran INTEGER, 
    status TEXT NOT NULL,
    FOREIGN KEY (id_bloc) REFERENCES bloc(code_bloc) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_fkt) REFERENCES zone_fonkotany(code_fkt) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_benef) REFERENCES beneficiaire(code_benef) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS cep_parce (
    code_parce TEXT PRIMARY KEY NOT NULL, 
    id_bloc TEXT,
    id_benef TEXT NOT NULL, 
    ref_gps TEXT,
    lat DOUBLE, 
    log DOUBLE, 
    superficie INTEGER, 
    id_commune TEXT, 
    id_fkt TEXT, 
    village TEXT, 
    anne_adheran INTEGER,
    dt_creation  TEXT,
    etat TEXT NOT NULL, 
    status TEXT NOT NULL,
    FOREIGN KEY (id_benef) REFERENCES beneficiaire(code_benef) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS saison (
    code_saison TEXT PRIMARY KEY NOT NULL, 
    intitule TEXT NOT NULL, 
    description TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS categorie_espece (
    code_cat INTEGER PRIMARY KEY NOT NULL, 
    libelle TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS espece (
    code_espece TEXT PRIMARY KEY NOT NULL, 
    nom_espece TEXT NOT NULL, 
    id_categ INTEGER NOT NULL,
    saisonnier INTEGER NOT NULL,
    unite TEXT,
    FOREIGN KEY (id_categ) REFERENCES categorie_espece(code_cat) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS variette (
    code_var TEXT PRIMARY KEY NOT NULL, 
    nom_var TEXT NOT NULL, 
    id_espece TEXT NOT NULL,
    FOREIGN KEY (id_espece) REFERENCES espece(code_espece) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS cultures_pms (
    code_culture TEXT PRIMARY KEY NOT NULL, 
    id_parce TEXT NOT NULL, 
    id_var TEXT NOT NULL,
    id_saison TEXT NOT NULL,
    annee_du TEXT NOT NULL,
    ddp TEXT NOT NULL,
    qsa INTEGER NOT NULL,
    img_fact Blob,
    dds TEXT,
    sfce INTEGER,
    sc TEXT NOT NULL,
    ea_id_variette TEXT,
    ea_autres TEXT,
    dt_creation TEXT NOT NULL,
    dt_modification TEXT NOT NULL,
    statuts TEXT NOT NULL,
    Etat TEXT NOT NULL,
    FOREIGN KEY(id_parce) REFERENCES assoc_parce(code_parce) ON DELETE SET DEFAULT,
    FOREIGN KEY(id_saison) REFERENCES saison(code_saison) ON DELETE SET DEFAULT,
    FOREIGN KEY(id_var) REFERENCES variette(code_var) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS suivi_pms (
    id TEXT PRIMARY KEY, 
    id_culture TEXT NOT NULL, 
    ddp TEXT NOT NULL,
    stc TEXT NOT NULL,
    ec TEXT NOT NULL,
    pb TEXT,
    ex INTEGER,
    img_cult TEXT,
    name TEXT,
    path TEXT,
    controle TEXT,
    declaration TEXT,
    etat TEXT NOT NULL,
    FOREIGN KEY (id_culture) REFERENCES cultures_pms(code_culture) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS culture_bl(
    code_culture TEXT PRIMARY KEY, 
    id_parce TEXT NOT NULL, 
    id_espece TEXT, 
    id_var TEXT, 
    id_saison TEXT, 
    annee_du TEXT NOT NULL, 
    ddp TEXT NOT NULL, 
    qso INTEGER, 
    dt_distribution TEXT,
    dds TEXT, 
    sfce INTEGER, 
    nbre_ligne INTEGER,
    long_ligne INTEGER,
    usage TEXT,
    sc TEXT, 
    ea_autres TEXT, 
    ea_id_variette TEXT, 
    dt_creation TEXT NOT NULL, 
    dt_modification TEXT NOT NULL, 
    status TEXT NOT NULL, 
    etat TEXT NOT NULL, 
    id_equipe INTEGER NOT NULL,
    type TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS suivi_bl(
    code_sv TEXT PRIMARY KEY, 
    id_culture TEXT NOT NULL, 
    ddp TEXT NOT NULL,
    stc TEXT,
    ec TEXT,
    ql INTEGER, 
    qr INTEGER, 
    long_ligne INTEGER, 
    nbre_ligne INTEGER, 
    nbre_pied INTEGER, 
    hauteur INTEGER,
    img_cult TEXT, 
    dt_capture TEXT,
    ex INTEGER,
    dt_creation TEXT,
    dt_modification TEXT,
    etat TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS suivi_bl(
    code_sv TEXT PRIMARY KEY, 
    id_culture TEXT NOT NULL, 
    ddp TEXT NOT NULL,
    stc TEXT,
    ec TEXT,
    ql INTEGER, 
    qr INTEGER, 
    long_ligne INTEGER, 
    nbre_ligne INTEGER, 
    nbre_pied INTEGER, 
    hauteur INTEGER,
    img_cult TEXT, 
    dt_capture TEXT,
    ex INTEGER,
    dt_creation TEXT,
    dt_modification TEXT,
    etat TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS animation_ve(
    code TEXT PRIMARY KEY, 
    id_pr TEXT NOT NULL, 
    id_fkt TEXT, 
    id_commune TEXT, 
    village TEXT, 
    date_anim TEXT NOT NULL, 
    nb_participant INTEGER NOT NULL, 
    nb_h INTEGER NOT NULL, 
    nb_f INTEGER NOT NULL, 
    nb_inf_25 INTEGER NOT NULL, 
    type TEXT NOT NULL, 
    img_piece TEXT, 
    img_group_particip TEXT, 
    id_tech_recenseur TEXT, 
    etat TEXT NOT NULL, 
    status TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS animation_ve_specu(
    code_specu INTEGER PRIMARY KEY AUTOINCREMENT,
    id_anime_ve TEXT NOT NULL,
    id_var TEXT,
    id_espece TEXT,
    quantite INTEGER NOT NULL,
    etat TEXT NOT NULL, 
    status TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS culture_pr(
    code_culture TEXT PRIMARY KEY, 
    id_parce TEXT NOT NULL, 
    id_espece TEXT, 
    id_var TEXT, 
    id_saison TEXT, 
    annee_du TEXT NOT NULL, 
    ddp TEXT NOT NULL, 
    qso TEXT, 
    dt_distribution TEXT, 
    dds TEXT, 
    sfce INTEGER, 
    nbre_ligne INTEGER, 
    long_ligne INTEGER, 
    usage TEXT, 
    sc TEXT, 
    ea_autres TEXT, 
    ea_id_variette TEXT, 
    dt_creation TEXT, 
    dt_modification TEXT, 
    status TEXT NOT NULL, 
    etat TEXT NOT NULL, 
    id_equipe INTEGER, 
    type TEXT,
    FOREIGN KEY(id_parce) REFERENCES cep_parce(code_parce) ON DELETE SET DEFAULT,
    FOREIGN KEY(id_espece) REFERENCES espece(code_espece) ON DELETE SET DEFAULT,
    FOREIGN KEY(id_var) REFERENCES variette(code_var) ON DELETE SET DEFAULT,
    FOREIGN KEY(id_saison) REFERENCES saison(code_saison) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS suivi_pr(
    code_sv TEXT PRIMARY KEY, 
    id_culture TEXT NOT NULL, 
    ddp TEXT NOT NULL, 
    stc TEXT, 
    ql TEXT, 
    qr TEXT, 
    long_ligne TEXT, 
    nbre_ligne TEXT, 
    nbre_pied TEXT, 
    hauteur TEXT, 
    ec TEXT, 
    img_cult TEXT, 
    dt_capture TEXT, 
    ex number, 
    dt_creation TEXT, 
    dt_modification TEXT, 
    etat TEXT NOT NULL,
    FOREIGN KEY(id_culture) REFERENCES culture_pr(code_culture) ON DELETE SET DEFAULT
);
PRAGMA ctas_version = 1;
`;

  // Insert fonction
  export const data_fonct: Array<Fonction> = [
    {
        code_fonct: 1,
        intitule: 'Chef de volet'
    },
    {
        code_fonct: 2,
        intitule: 'Tehnicien'
    }  
  ];

  const dataInsertFonction = [];
  data_fonct.forEach((elem: Fonction) => {
    dataInsertFonction.push({
        req: `INSERT INTO fonction(code_fonct, intitule) VALUES ("${elem.code_fonct}","${elem.intitule}");`
    });
  });
  export const fonction: Array<any> = dataInsertFonction;