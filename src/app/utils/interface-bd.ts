export interface Projet {
    numero: number,
    code_proj: string, 
    nom: string, 
    description: string,
    logo: Blob,
    statuts: string
}

export interface Equipe {
    code_equipe: number, 
    img: Blob, 
    matricule: string,
    nom: string, 
    prenom: string, 
    sexe: string, 
    dt_nais: string, 
    cin: string, 
    dt_delivrance: string, 
    lieu_delivrance: string, 
    img_cin: Blob, 
    email: string, 
    num_perso: string, 
    num_float: string, 
    id_fonct: number,
    intitule_fct: string,
    statuts: string
}

export interface ProjetEquipe {
    code: number,
    id_projet: string,
    id_equipe: number,
    id_volet: number,
    status_pe: string
}

export interface Volet {
    code_vol: number, 
    nom: string, 
    description: string
}
export interface Fonction {
    code_fonct: number, 
    intitule: string
}
export interface Volet {
    code_vol: number, 
    nom: string, 
    description: string
}
export interface Utilisateurs {
    code_util: number, 
    id_equipe: number,
    img: Blob, 
    nom: string, 
    prenom: string, 
    sexe: string,
    dt_nais: string,
    num_perso: number,
    id_fonct: number,
    fonction: string,
    type: string, 
    role: string, 
    nom_users: string,
    mot_passe: string, 
    situation_compte: string, 
    statuts_equipe: string,
    statuts_compte: string
}
export interface Activite {
    code_act: number,
    intitule: string,
    description: string,
    id_volet: number
}
export interface Participe_proj_activ {
    code: number, 
    id_proj: string, 
    id_activ: number,  
    statuts:string
}
export interface Participe_proj_volet {
    code: number, 
    id_projet: string, 
    id_volet: number, 
    id_chef: number,
    statuts: string
}
export interface Region {
    code_reg: string, 
    nom_reg: string
}
export interface District {
    code_dist: string, 
    nom_dist: string, 
    id_reg: string
}
export interface Commune {
    code_com: string, 
    nom_com: string, 
    id_dist: string
}
export interface Fonkotany {
    code_fkt: string, 
    nom_fkt: string, 
    id_com: string
}
export interface Collaborateur {
    code_col: string, 
    nom: string, 
    description: string
}
export interface Collaborateur_activ {
    code: number, 
    id_col: string, 
    id_activ: number
}
export interface Parcelle {
    id_association: string,
    nom: string,
    code_parce: string,
    id_benef: string,
    ref_gps: string,
    lat: number,
    log: number,
    superficie: number,
    id_fkt: string,
    status: string
}
// Non active
export interface Parcelle_bl {
    id_bloc: string,
    nom_bloc: string,
    code_parce: string,
    id_benef: string,
    ref_gps: string,
    lat: number,
    log: number,
    superficie: number,
    id_fkt: string,
    status: string
}
export interface Parcelle_Association {
    code_parce: string,
    id_assoc: string,
    nom_ass: string,
    id_benef: string,
    nom_benef: string,
    ref_gps: string,
    lat: number,
    log: number,
    superficie: number,
    id_fkt: string,
    anne_adheran: string,
    status: string
}
export interface bloc_Parcelle {
    code_parce: string,
    id_bloc: string,
    nom_bloc: string,
    id_benef: string,
    nom_benef: string,
    ref_gps: string,
    lat: number,
    log: number,
    superficie: number,
    id_fkt: string,
    anne_adheran: string,
    status: string
}
export interface Saison {
    code_saison: string,
    intitule: string,
    description: string
}
export interface Catego_espece {
    code_cat: number,
    libelle: string
}
export interface Espece {
    code_espece: string,
    nom_espece: string,
    id_categ: number
}
export interface Variette {
    code_var: string,
    nom_var: string,
    id_espece: string
}