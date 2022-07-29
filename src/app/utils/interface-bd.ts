import { NumberFormatStyle } from "@angular/common"

/**
 * Import from the server to db local
 */
export interface Projet {
    numero: number,
    code_proj: string, 
    nom: string, 
    description: string,
    ancronyme: string,
    logo: Blob,
    statuts: string
}

export interface AnneeAgricole {
    code: number, 
    annee_du: number, 
    annee_au: number, 
    statut: number
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
    status_pe: string
}

export interface ProjetEquipeVolet {
    code: number, 
    id_projet: string, 
    id_equipe: number, 
    id_volet: number, 
    status_pev: string
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
export interface Bloc {
    ordre: number, 
    code_bloc: string, 
    nom_bloc: string, 
    ancronyme: string, 
    id_prjt: string, 
    code_proj: string, 
    nom_projet: string, 
    id_tech: number, 
    nom: string, 
    status: string
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
    description: string,
    ancronyme: string
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
    id_categ: number,
    saisonnier: string,
    unite: string
}
export interface Variette {
    code_var: string,
    nom_var: string,
    id_espece: string
}
export interface Culture_pms {
    code_culture: string,
    id_parce: string,
    id_var: string,
    id_saison: string,
    annee_du: number,
    ddp: string,
    qsa: number,
    img_fact: string,
    dds: string,
    sfce: number,
    objectif: number,
    sc: string,
    ea_id_variette: string,
    ea_autres: string,
    dt_creation: string,
    dt_modification: string,
    statuts: string,
    Etat: string
}
export interface Suivi_pms {
    id: number,
    id_culture: string,
    ddp: string,
    stc: string,
    ec: string,
    pb: string,
    ex: string,
    img_cult: string,
    name: string,
    controle: string,
    declaration: string,
    etat: string
}
export interface Mep_bloc {
    code_culture: string, 
    id_parce: string, 
    id_espece: string, 
    id_var: string, 
    id_saison: string, 
    annee_du: string, 
    ddp: string, 
    qso: number, 
    dt_distribution: string,
    dds: string, 
    sfce: number, 
    nbre_ligne: number,
    long_ligne: number,
    usage: string,
    sc: string, 
    ea_autres: string, 
    ea_id_variette: string, 
    dt_creation: string, 
    dt_modification: string, 
    status: string, 
    etat: string, 
    id_equipe: number, 
    type: string
}

export interface Suivi_bloc {
    code_sv: string, 
    id_culture: string, 
    ddp: string, 
    stc: string, 
    ql: number, 
    qr: number, 
    long_ligne: number, 
    nbre_ligne: number, 
    nbre_pied: number, 
    hauteur: string,
    ec: string,
    img_cult: string, 
    ex: string, 
    etat: string
}
export interface Benef_RP {
    code_benef_pms: string, // Beneficiaire PMS
    code_achat: string, 
    id_proj: string, 
    id_benef: string, 
    id_activ: number, 
    id_association: string, 
    id_collaborateur: string, 
    status_pms: string, //-------          
    code_benef: string, // Info beneficiaire
    img_benef: string, 
    nom: string, 
    prenom: string, 
    sexe: string, 
    dt_nais: string, 
    dt_nais_vers: string,
    surnom: string, 
    cin: number, 
    dt_delivrance: string, 
    lieu_delivrance: string, 
    img_cin: string, 
    contact: string, 
    id_fkt: string, 
    id_commune: string, 
    village: string, 
    dt_Insert: string, 
    etat_pms: string,
    etat_benef: string, 
    status_benef: string
}
export interface Benef_Bloc {
    code_benef_bl: string, 
    id_proj: string, 
    id_activ: number, 
    id_benef: string, 
    code_achat: string, 
    id_bloc: string, 
    id_collaborateur: string, 
    status_benef_bloc: string,                  
    code_benef: string, 
    img_benef: string, 
    nom: string, 
    prenom: string, 
    sexe: string, 
    dt_nais: string,
    dt_nais_vers: string, 
    surnom: string, 
    cin: number, 
    dt_delivrance: string, 
    lieu_delivrance: string, 
    img_cin: string, 
    contact: string, 
    id_fkt: string, 
    id_commune: string, 
    village: string, 
    dt_Insert: string, 
    etat_benef: string, 
    status_benef: string
}
export interface Benef_PR_Bloc {
    code_benef: string, 
    img_benef: string, 
    nom: string, 
    prenom: string, 
    sexe: string, 
    dt_nais: string, 
    dt_nais_vers: string, 
    surnom: string, 
    cin: number, 
    dt_delivrance: string, 
    lieu_delivrance: string, 
    img_cin: string, 
    contact: string, 
    id_fkt: string, 
    id_commune: string,
    village: string,
    dt_Insert: string, 
    etat_benef: string,
    statut_benef: string,
    code_pr: string, 
    id_proj: string, 
    id_activ: number, 
    id_benef: string, 
    id_bloc: string, 
    code_achat: string, 
    id_collaborateur: string, 
    id_tech: number, 
    etat_activ_pr: string, 
    status_activ_pr: string
}
export interface Cep_pr {
    code_parce: string,
    id_bloc: string,
    id_benef: string,
    ref_gps: string,
    lat: number,
    log: number,
    superficie: number,
    id_commune: string,
    id_fkt: string,
    village: string,
    anne_adheran: number,
    etat: string,
    status: string
}
export interface Animation_ve {
    code: string, 
    id_pr: string, 
    id_fkt: string, 
    id_commune: string, 
    village: string, 
    date_anim: string, 
    nb_participant: number, 
    nb_h: number, 
    nb_f: number, 
    nb_inf_25: number, 
    type: string, 
    img_piece: string, 
    img_group_particip: string, 
    id_tech_recenseur: number, 
    etat: string, 
    status: string
}
export interface Specu_anime {
    code_specu: string, 
    id_anime_ve: string, 
    id_var: string, 
    id_espece: string, 
    quantite: NumberFormatStyle, 
    etat: string, 
    status: string
}
export interface MepPR {
    code_culture: string, 
    id_parce: string, 
    id_espece: string, 
    id_var: string, 
    id_saison: string, 
    annee_du: string, 
    ddp: string, 
    qso: string, 
    dt_distribution: string, 
    dds: string, 
    sfce: number, 
    nbre_ligne: number, 
    long_ligne: number, 
    usage: string, 
    sc: string, 
    ea_autres: string, 
    ea_id_variette: string, 
    dt_creation: string, 
    dt_modification: string, 
    status: string, 
    etat: string, 
    id_equipe: number, 
    type: string
}
export interface suiviMepPR {
    code_sv: string, 
    id_culture: string, 
    ddp: string, 
    stc: string, 
    ql: number, 
    qr: number, 
    long_ligne: number, 
    nbre_ligne: number, 
    nbre_pied: number, 
    hauteur: number, 
    ec: string, 
    img_cult: string, 
    dt_capture: string, 
    ex: number, 
    dt_creation: string, 
    dt_modification: string, 
    etat: string
}
export interface AssociationParceSaison {
    code: number, 
    id_annee: number, 
    id_saison: string, 
    id_parce: string, 
    id_var: string, 
    objectif: number, 
    etat: string, 
    commentaire: string
}