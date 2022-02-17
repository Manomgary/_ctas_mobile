import { Activite, Fonction, 
        Participe_proj_activ, Participe_proj_volet, Fonkotany,
        Projet, Region, Utilisateurs, Volet, District, Commune } from "./interface-bd";

export const createSchema: string = `
CREATE TABLE IF NOT EXISTS  projet (
    code_proj TEXT PRIMARY KEY NOT NULL, 
    nom TEXT NOT NULL, 
    description TEXT,
    logo BLOB,  
    statuts TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS  equipe (
    code_equipe INTEGER PRIMARY KEY NOT NULL, 
    img BLOB, 
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
CREATE TABLE IF NOT EXISTS projet_equipe (
    code INTEGER PRIMARY KEY NOT NULL,
    id_projet TEXT NOT NULL,
    id_equipe INTEGER NOT NULL,
    id_volet INTEGER NOT NULL,
    status_pe TEXT NOT NULL,
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
    code_bloc INTEGER PRIMARY KEY NOT NULL, 
    nom TEXT NOT NULL, 
    id_prjt TEXT NOT NULL, 
    status TEXT NOT NULL,
    FOREIGN KEY (id_prjt) REFERENCES projet(code_proj) ON DELETE SET DEFAULT
);

CREATE TABLE IF NOT EXISTS collaborateur (
    code_col INTEGER PRIMARY KEY NOT NULL, 
    nom TEXT NOT NULL, 
    description TEXT
);

CREATE TABLE IF NOT EXISTS utilisateurs (
    code_util INTEGER PRIMARY KEY NOT NULL, 
    id_equipe INTEGER NOT NULL,
    img Blob, 
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
    code_reg INTEGER PRIMARY KEY NOT NULL, 
    nom_reg TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS zone_district (
    code_dist INTEGER PRIMARY KEY NOT NULL, 
    nom_dist TEXT NOT NULL, 
    id_reg INTEGER
);
CREATE TABLE IF NOT EXISTS zone_commune (
    code_com INTEGER PRIMARY KEY NOT NULL, 
    nom_com TEXT NOT NULL, 
    id_dist INTEGER,
    FOREIGN KEY (id_dist) REFERENCES zone_district(code_dist) ON DELETE SET DEFAULT    
);
CREATE TABLE IF NOT EXISTS zone_fonkotany (
    code_fkt INTEGER PRIMARY KEY NOT NULL, 
    nom_fkt TEXT NOT NULL, 
    id_com INTEGER
);

CREATE TABLE IF NOT EXISTS association (
    code_ass INTEGER PRIMARY KEY NOT NULL, 
    nom TEXT NOT NULL, 
    id_prjt TEXT NOT NULL, 
    id_tech INTEGER NOT NULL, 
    id_pms TEXT, 
    id_fkt INTEGER NOT NULL, 
    status TEXT NOT NULL,
    FOREIGN KEY (id_prjt) REFERENCES projet(code_proj) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_fkt) REFERENCES zone_fonkotany(code_fkt) ON DELETE SET DEFAULT

);

CREATE TABLE IF NOT EXISTS bloc_zone (
    code INTEGER PRIMARY KEY NOT NULL,
    id_commune INTEGER NOT NULL,
    id_bloc INTEGER NOT NULL,
    FOREIGN KEY (id_commune) REFERENCES zone_commune(code_com) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_bloc) REFERENCES bloc(code_bloc) ON DELETE SET DEFAULT
);

CREATE TABLE IF NOT EXISTS collaborateur_activ (
    code INTEGER PRIMARY KEY NOT NULL, 
    id_col INTEGER NOT NULL, 
    id_activ INTEGER NOT NULL,
    FOREIGN KEY (id_col) REFERENCES collaborateur(code_col) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_activ) REFERENCES activite(code_act) ON DELETE SET DEFAULT
);

CREATE TABLE IF NOT EXISTS beneficiaire (
    code_benef TEXT PRIMARY KEY NOT NULL,
    img_benef Blob,
    nom TEXT NOT NULL,
    prenom TEXT,
    sexe TEXT NOT NULL,
    dt_nais TEXT NOT NULL,
    surnom TEXT,
    cin INTEGER NOT NULL,
    dt_delivrance TEXT NOT NULL,
    lieu_delivrance TEXT NOT NULL,
    img_cin Blob,
    contact TEXT,
    id_fkt INTEGER NOT NULL,
    dt_Insert TEXT, 
    statut TEXT NOT NULL,
    FOREIGN KEY (id_fkt) REFERENCES zone_fonkotany(code_fkt) ON DELETE SET DEFAULT
);

CREATE TABLE IF NOT EXISTS benef_activ_pms (
    code_benef_pms TEXT PRIMARY KEY NOT NULL, 
    id_proj TEXT NOT NULL, 
    id_activ INTEGER NOT NULL, 
    id_benef TEXT NOT NULL, 
    id_association INTEGER NOT NULL, 
    id_collaborateur INTEGER NOT NULL, 
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
    id_bloc INTEGER NOT NULL, 
    id_collaborateur INTEGER NOT NULL, 
    status TEXT NOT NULL,
    FOREIGN KEY (id_proj) REFERENCES projet(code_proj) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_activ) REFERENCES activite(code_act) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_benef) REFERENCES beneficiaire(code_benef) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_bloc) REFERENCES bloc(code_bloc) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_collaborateur) REFERENCES collaborateur(code_col) ON DELETE SET DEFAULT
);
PRAGMA ctas_version = 1;
`;

  export const data_projet: Array<Projet> = [
    {
        code_proj: 'P001', 
        nom: 'CTAS', 
        description: 'Projet Principale', 
        logo: null,
        statuts: 'active'
    },
    {
        code_proj: 'P002', 
        nom: 'FA2', 
        description: 'Fondation Avril Phase 2', 
        logo: null,
        statuts: 'active'
    },
    {
        code_proj: 'P003', 
        nom: 'AFAFI 1', 
        description: '', 
        logo: null,
        statuts: 'active'
    },
    {
        code_proj: 'P004', 
        nom: 'DEFIS 2', 
        description: 'DEFIS 2', 
        logo: null,
        statuts: 'active'
    },
    {
        code_proj: 'P005', 
        nom: 'AFAFI 3', 
        description: '', 
        logo: null,
        statuts: 'active'
    }
  ];
  const dataInsertProjet = [];

  data_projet.forEach((elem: Projet) => {
    dataInsertProjet.push({
        req: `INSERT INTO projet(code_proj, nom, description, logo, statuts) VALUES ("${elem.code_proj}","${elem.nom}","${elem.description}","${elem.logo}","${elem.statuts}");`
    });
  });
  export const projet: Array<any> = dataInsertProjet;

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

  /** Insert Equipe
  export const data_equipe: Array<any> = [
      {
        code_equipe: 1,
        img: null, 
        nom: 'Robert', 
        prenom: null, 
        sexe: 'L', 
        dt_nais: '1960-02-02', 
        cin: 515182015321, 
        dt_delivrance: '2000-02-02', 
        lieu_delivrance: 'Andalatanosy', 
        img_cin: null,
        email: 'damefrancis018@gmail.com', 
        num_perso: 331629821, 
        num_float: 331785232, 
        id_fonct: 2, 
        id_proj: 'P002', 
        statuts: 'En service'
      },
      {
        code_equipe: 2,
        img: null, 
        nom: 'meza', 
        prenom: 'Rabenandrasana', 
        sexe: 'L', 
        dt_nais: '1990-01-01', 
        cin: 515182015322, 
        dt_delivrance: '2021-02-12', 
        lieu_delivrance: 'Andalatanosy', 
        img_cin: null,
        email: 'mafrancis018@gmail.com', 
        num_perso: 331629825, 
        num_float: 331785235, 
        id_fonct: 2, 
        id_proj: 'P001', 
        statuts: 'En service'
      },
      {
        code_equipe: 3,
        img: null, 
        nom: 'Nomenjanahary', 
        prenom: 'Haja', 
        sexe: 'L', 
        dt_nais: '1985-01-01', 
        cin: 515182015304, 
        dt_delivrance: '2021-02-12', 
        lieu_delivrance: 'Andalatanosy', 
        img_cin: null,
        email: 'mdfrancis018@gmail.com', 
        num_perso: 331629812, 
        num_float: 331785213, 
        id_fonct: 1, 
        id_proj: 'P004', 
        statuts: 'En service'
      },
      {
        code_equipe: 4,
        img: null, 
        nom: 'Roger', 
        prenom: null, 
        sexe: 'L', 
        dt_nais: '1996-01-01', 
        cin: 515182015306, 
        dt_delivrance: '2021-02-12', 
        lieu_delivrance: 'Andalatanosy', 
        img_cin: null,
        email: 'mcfrancis018@gmail.com', 
        num_perso: 331629829, 
        num_float: 331785239, 
        id_fonct: 1, 
        id_proj: 'P003', 
        statuts: 'En service'
      }
  ];
  const dataInsertEquipe = [];
  data_equipe.forEach((elem: any) => {
    dataInsertEquipe.push({
        req: `INSERT INTO equipe(code_equipe, img, nom, prenom, sexe, dt_nais, cin, dt_delivrance, lieu_delivrance, img_cin, email, num_perso, num_float, id_fonct, id_proj, statuts) 
                VALUES (${elem.code_equipe},"${elem.img}","${elem.nom}","${elem.prenom}","${elem.sexe}", strftime('%Y-%m-%d','${elem.dt_nais}'),${elem.cin}, strftime('%Y-%m-%d','${elem.dt_delivrance}'),"${elem.lieu_delivrance}","${elem.img_cin}","${elem.email}",${elem.num_perso},${elem.num_float},${elem.id_fonct},"${elem.id_proj}","${elem.statuts}");`
    });
  });
  export const equipe:  Array<any> = dataInsertEquipe;*/

  // Insert Volet
  export const data_volet: Array<Volet> = [
      {
        code_vol: 1, 
        nom: 'RP', 
        description: 'Reseau Paysant'
      },
      {
        code_vol: 2, 
        nom: 'IDA', 
        description: 'Indifisusion'
      },
      {
        code_vol: 3, 
        nom: 'CPSA', 
        description: 'Indifisusion'
      },
      {
        code_vol: 4, 
        nom: 'MACOM', 
        description: 'MARKETING'
      }
    ];
const dataInsertVolet = [];
data_volet.forEach((elem: Volet) => {
    dataInsertVolet.push({
        req: `INSERT INTO volet(code_vol, nom, description) 
            VALUES (${elem.code_vol},"${elem.nom}","${elem.description}");`
    });
});
export const volet:  Array<any> = dataInsertVolet;

// Insert activite projet
export const data_activ_projet: Array<Participe_proj_activ> = [
    {
        code: 1, 
        id_proj: 'P003', 
        id_activ: 1,  
        statuts: 'active'
    },
    {
        code: 2, 
        id_proj: 'P003', 
        id_activ: 2,  
        statuts: 'active'
    },
    {
        code: 3, 
        id_proj: 'P004', 
        id_activ: 1,  
        statuts: 'active'
    },
    {
        code: 4, 
        id_proj: 'P004', 
        id_activ: 2,  
        statuts: 'active'
    }
];
const dataInsertActivitePr = [];
data_activ_projet.forEach((elem: Participe_proj_activ) => {
    dataInsertActivitePr.push({
        req: `INSERT INTO participe_proj_activ(code, id_proj, id_activ, statuts) 
            VALUES (${elem.code},"${elem.id_proj}", ${elem.id_activ}, "${elem.statuts}");`
    });
});
export const activite_projet: Array<any> = dataInsertActivitePr;

// Insert Projet volet
export const data_volet_projet: Array<Participe_proj_volet> = [
    {
        code: 1, 
        id_projet: 'P003', 
        id_volet: 1, 
        id_chef: 4,
        statuts: 'En cours'
    },
    {
        code: 2, 
        id_projet: 'P003', 
        id_volet: 2, 
        id_chef: 4,
        statuts: 'En cours'
    },
    {
        code: 3, 
        id_projet: 'P004', 
        id_volet: 1, 
        id_chef: 3,
        statuts: 'En cours'
    },
    {
        code: 4, 
        id_projet: 'P004', 
        id_volet: 2, 
        id_chef: 3,
        statuts: 'En cours'
    }
];
const dataInsertProjetVolet = [];
data_volet_projet.forEach((elem: Participe_proj_volet) => {
    dataInsertProjetVolet.push({
        req: `INSERT INTO participe_proj_volet(code, id_projet, id_volet, id_chef, statuts)
            VALUES (${elem.code},"${elem.id_projet}", ${elem.id_volet}, ${elem.id_chef}, "${elem.statuts}");`
    });
});
export const volet_projet: Array<any> = dataInsertProjetVolet;

/**
 * Insert Zone
 */
// Insert region
export const data_region: Array<Region> = [
    {
        code_reg: 1, 
        nom_reg: 'ANDROY'
    },
    {
        code_reg: 2, 
        nom_reg: 'ANOSY'
    }
];
const dataInsertRegion = [];
data_region.forEach((elem: Region) => {
    dataInsertRegion.push({
        req: `INSERT INTO zone_region(code_reg, nom_reg)
            VALUES (${elem.code_reg},"${elem.nom_reg}");`
    });
});
export const region: Array<any> = dataInsertRegion;

// Insert district
export const data_district: Array<District> = [
    {
        code_dist: 1, 
        nom_dist: 'AMBOVOMBE', 
        id_reg: 1
    },
    {
        code_dist: 2, 
        nom_dist: 'TSIHOMBE', 
        id_reg: 1
    },
    {
        code_dist: 3, 
        nom_dist: 'BELOHA', 
        id_reg: 1
    },
    {
        code_dist: 4, 
        nom_dist: 'AMBOASARY-SUD', 
        id_reg: 2
    }
];
const dataInsertDistrict = [];
data_district.forEach((elem: District) => {
    dataInsertDistrict.push({
        req: `INSERT INTO zone_district(code_dist, nom_dist, id_reg)
            VALUES (${elem.code_dist},"${elem.nom_dist}", ${elem.id_reg});`
    });
});
export const district: Array<any> = dataInsertDistrict;

// Insert Commune
export const data_commune: Array<Commune> = [
    {
        code_com: 1, 
        nom_com: 'Maroalo-Mainty', 
        id_dist: 1
    },
    {
        code_com: 2, 
        nom_com: 'Ambondro', 
        id_dist: 1
    },
    {
        code_com: 3, 
        nom_com: 'Erada', 
        id_dist: 1
    },
    {
        code_com: 4, 
        nom_com: 'Ambazoa', 
        id_dist: 1
    },
    {
        code_com: 5, 
        nom_com: 'Antaritarike', 
        id_dist: 2
    },
    {
        code_com: 6, 
        nom_com: 'Ankilivalo', 
        id_dist: 2
    },
    {
        code_com: 7, 
        nom_com: 'Behara', 
        id_dist: 4
    },
    {
        code_com: 8, 
        nom_com: 'Antragnomaro', 
        id_dist: 4
    },
    {
        code_com: 9, 
        nom_com: 'Sampona', 
        id_dist: 4
    },
    {
        code_com: 10, 
        nom_com: 'Andalatanosy', 
        id_dist: 1
    },
    {
        code_com: 11, 
        nom_com: 'Antanimora', 
        id_dist: 1
    }
];
const dataInsertCommune = [];
data_commune.forEach((elem: Commune) => {
    dataInsertCommune.push({
        req: `INSERT INTO zone_commune(code_com, nom_com, id_dist)
            VALUES (${elem.code_com},"${elem.nom_com}", ${elem.id_dist});`
    });
});
export const commune: Array<any> = dataInsertCommune;

// Insert Fokontany
export const data_fkt: Array<Fonkotany> = [
    {
        code_fkt: 1, 
        nom_fkt: 'Bekopiky', 
        id_com: 10
    },
    {
        code_fkt: 2, 
        nom_fkt: 'Antsaha', 
        id_com: 10
    },
    {
        code_fkt: 3, 
        nom_fkt: 'Antafianampela', 
        id_com: 10
    },
    {
        code_fkt: 4, 
        nom_fkt: 'Anivorano', 
        id_com: 11
    },
    {
        code_fkt: 5, 
        nom_fkt: 'Behara Ambony', 
        id_com: 7
    }
];
const dataInsertFkt = [];
data_fkt.forEach((elem: Fonkotany) => {
    dataInsertFkt.push({
        req: `INSERT INTO zone_fonkotany(code_fkt, nom_fkt, id_com)
            VALUES (${elem.code_fkt},"${elem.nom_fkt}", ${elem.id_com});`
    });
});
export const fokontany: Array<any> = dataInsertFkt;

/**
export const createSchema: string = `
CREATE TABLE IF NOT EXISTS  projet (
    code_proj TEXT PRIMARY KEY NOT NULL, 
    nom TEXT NOT NULL, 
    description TEXT,
    logo BLOB,  
    statuts TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS volet (
    code_vol INTEGER PRIMARY KEY NOT NULL, 
    nom TEXT NOT NULL, 
    description TEXT
    );
CREATE TABLE IF NOT EXISTS activite (
    code_act INTEGER PRIMARY KEY NOT NULL, 
    intitule TEXT NOT NULL, 
    id_volet INTEGER NOT NULL,
    FOREIGN KEY (id_volet) REFERENCES volet(code_vol) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS fonction (
    code_fonct INTEGER PRIMARY KEY NOT NULL, 
    intitule TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS equipe (
    code_equipe INTEGER PRIMARY KEY NOT NULL, 
    img BLOB, 
    nom TEXT NOT NULL, 
    prenom TEXT, 
    sexe TEXT NOT NULL, 
    dt_nais int NOT NULL, 
    cin INTEGER KEY NOT NULL UNIQUE, 
    dt_delivrance int KEY NOT NULL, 
    lieu_delivrance TEXT NOT NULL, 
    img_cin BLOB,
    email TEXT NOT NULL UNIQUE, 
    num_perso INTEGER UNIQUE, 
    num_float INTEGER UNIQUE, 
    id_fonct INTEGER NOT NULL, 
    id_proj TEXT NOT NULL, 
    statuts TEXT NOT NULL,
    FOREIGN KEY (id_fonct) REFERENCES fonction(code_fonct) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_proj) REFERENCES projet(code_proj) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS utilisateurs (
    code_util INTEGER PRIMARY KEY NOT NULL, 
    id_equipe INTEGER NOT NULL, 
    type TEXT NOT NULL, 
    role TEXT NOT NULL, 
    mot_passe TEXT NOT NULL, 
    situation TEXT NOT NULL, 
    statuts TEXT NOT NULL,
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
CREATE TABLE IF NOT EXISTS participe_proj_volet (
    code INTEGER PRIMARY KEY NOT NULL, 
    id_projet TEXT NOT NULL, 
    id_volet INTEGER NOT NULL, 
    id_chef INTEGER NOT NULL,
    statuts TEXT NOT NULL,
    FOREIGN KEY (id_projet) REFERENCES projet(code_proj) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_volet) REFERENCES volet(code_vol) ON DELETE SET DEFAULT,
    FOREIGN KEY (id_chef) REFERENCES equipe(code_equipe) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS zone_region (
    code_reg INTEGER PRIMARY KEY NOT NULL, 
    nom_reg TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS zone_district (
    code_dist INTEGER PRIMARY KEY NOT NULL, 
    nom_dist TEXT NOT NULL, 
    id_reg INTEGER
);
CREATE TABLE IF NOT EXISTS zone_commune (
    code_com INTEGER PRIMARY KEY NOT NULL, 
    nom_com TEXT NOT NULL, 
    id_dist INTEGER
);
CREATE TABLE IF NOT EXISTS zone_fonkotany (
    code_fkt INTEGER PRIMARY KEY NOT NULL, 
    nom_fkt TEXT NOT NULL, 
    id_com INTEGER
);
PRAGMA ctas_version = 1;
`;*/