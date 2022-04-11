export interface Loc_association {
    numero: number,
    id_prjt: string,
    code_proj: string, 
    nom_pr: string, 
    id_fkt:  string, 
    nom_fkt: string,
    code_ass: string, 
    nom_ass: string,
    id_tech: number, 
    technicien: string,
    nb_benef: number, 
    nom_pa: string,
    prenom: string,
    sexe: string,
    cin: number,
    dt_delivrance: string,
    lieu_delivrance: string,
    img_benef: Blob,
    surnom: string,
    status: string
}
export interface Benef_activ_pms {
    id_activ: number,
    intitule: string,
    id_proj: string,
    nom_pr: string,
    fkt_association: string,
    id_association: string,
    nom_ass: string,
    code_benef_pms: string,
    code_parce: string,
    nb_parcelle: number,
    sum_superf: number,
    id_benef: string,
    code_benef: string,
    img_benef: string,
    nom_benef: string,
    prenom: string,
    sexe: string,
    dt_nais: string,
    surnom: string,
    cin: number,
    dt_delivrance: string,
    lieu_delivrance: string,
    img_cin: Blob,
    contact: string,
    id_fkt: string,
    adress: string,
    id_collaborateur: string,
    nom_collab: string,
    statut: string
}
export interface Local_Parcelle {
    fkt_association: string,
    id_association: string,
    nom_ass: string,
    code_benef_pms: string,
    nom: string,
    prenom: string,
    code_parce: string,
    id_benef: string,
    ref_gps: string,
    lat: string,
    log: string,
    superficie: string,
    id_fkt: string,
    status: string
}
export interface Loc_Commune {
    nom_reg: string,
    id_dist: string, 
    nom_dist: string,  
    code_com: string, 
    nom_com: string
}

export interface Loc_Fokontany {
    id_reg: string,
    nom_reg: string,
    id_dist: string,
    nom_dist: string,
    id_com: string,
    nom_com: string,
    code_fkt: string,
    nom_fkt: string
}

export interface Loc_Bloc {
    code_bloc: string,
    nom_bloc: string,
    id_prjt: string,
    id_tech: string,
    status: string,
    id_fkt: string,
    nom_fkt: string,
    code_com: string,
    nom_com: string,
    nb_fkt: string
}
export interface Local_benef_activ_bl {
    code_benef_bl: string,
    nom: string,
    prenom: string,
    sexe: string,
    dt_nais: string,
    surnom: string,
    cin: string,
    dt_delivrance: string,
    lieu_delivrance: string,
    img_cin: string,
    contact: string,
    nom_com: string,
    id_fkt: string,
    nom_fkt: string,
    statut_benef: string,
    id_proj: string,
    id_activ: number,
    id_benef: string,
    id_bloc: string,
    nom_bloc: string,
    id_collaborateur: string,
    nom_collab: string,
    status: string,
    nb_parce: number,
    sum_superficie: number
}
export interface Local_bloc_zone {
    code: number,
    id_bloc: string,
    nom_bloc: string,
    nom_com: string,
    id_fkt: string,
    nom_fkt: string,
    id_km: string,
    nom: string,
    prenom: string
}
export interface Local_bloc_parce {
    id_bloc: string,
    nom_bloc: string,
    code_benef_bl: string,
    nom: string,
    prenom: string,
    code_parce: string,
    ref_gps: string,
    lat: number,
    log: number,
    superficie: number,
    anne_adheran: string,
    status: string
}
export interface Loc_saison {
    code_saison: string,
    intitule: string,
    description: string
}
export interface Loc_categEspece {
    code_cat: number,
    libelle: string
}
export interface Loc_Espece {
    code_espece: string,
    nom_espece: string,
    id_categ: number,
    libelle: string
}
export interface Loc_variette {
    code_var: string,
    nom_var: string,
    id_espece: string,
    nom_espece: string
}
export interface Loc_culture_Pms {
    code_culture: string,
    id_parce: string,
    superficie: number,
    code_benef_pms: string,
    nom: string,
    prenom: string,
    id_var: string,
    nom_var: string,
    id_saison: string,
    saison: string,
    code_ass: string,
    association: string,
    annee_du: string,
    ddp: string,
    qsa: number,
    img_fact: Blob,
    dds: string,
    sfce: number,
    objectif: number,
    sc: string,
    ea_id_variette: string,
    ea_autres: string,
    ea: string,
    dt_creation: string,
    dt_modification: string,
    statuts: string,
    Etat: string
}