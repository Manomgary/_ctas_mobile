export interface Projet {
    code_proj: string, 
    nom: string, 
    description: string,
    logo: Blob,
    statuts: string
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
    id_proj: string,
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
    code_reg: number, 
    nom_reg: string
}
export interface District {
    code_dist: number, 
    nom_dist: string, 
    id_reg: number
}
export interface Commune {
    code_com: number, 
    nom_com: string, 
    id_dist: number
}
export interface Fonkotany {
    code_fkt: number, 
    nom_fkt: string, 
    id_com: number
}
export interface Collaborateur {
    code_col: number, 
    nom: string, 
    description: string
}
export interface Collaborateur_activ {
    code: number, 
    id_col: number, 
    id_activ: number
}