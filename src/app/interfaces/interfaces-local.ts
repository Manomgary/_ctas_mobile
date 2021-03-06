export interface LocalFile {
    name: string;
    date: string;
    data: string;
  }
export interface Loc_export_excel {
    data: any[],
    name_feuille: string,
    name_file: string
}
export interface Loc_projet {
    numero: number, 
    code_proj: string, 
    nom: string, 
    description: string, 
    ancronyme: string,
    logo: string, 
    statuts: string
}
export interface Loc_collaborateur {
    code_col: string, 
    nom: string, 
    description: string, 
    ancronyme: string
}
export interface Loc_activ_projet {
    code: number, 
    id_proj: string, 
    nom: string,
    id_equipe: number, 
    id_volet: number, 
    id_activ: number, 
    intitule: string, 
    description: string, 
    statuts: string
}
export interface Loc_association {
    numero: number,
    id_prjt: string,
    code_proj: string, 
    nom_pr: string, 
    id_fkt:  string, 
    nom_fkt: string,
    code_ass: string, 
    nom_ass: string,
    ancronyme: string,
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
    code_achat: string,
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
    code_achat: string,
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

export interface Loc_Bloc {
    ordre: number,
    code_bloc: string,
    nom_bloc: string,
    ancronyme: string,
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
    code_achat: string,
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
    libelle: string,
    saisonnier: number,
    unite: string
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
    code_achat: string,
    nom: string,
    prenom: string,
    code_espece: string, 
    nom_espece: string,
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
    sc: string,
    ea_id_espece: string,
    ea_id_variette: string,
    ea_autres: string,
    ea: string,
    dt_creation: string,
    dt_modification: string,
    statuts: string,
    Etat: string
}
// interface suivi culture
export interface Loc_suivi_mep {
    id: string,
    id_culture: string,
    ddp: string,
    stc: string,
    ec: string,
    pb: string,
    ex: number,
    img_cult: string,
    name: string,
    path: string,
    controle: string,
    declaration: string
}
export interface Loc_all_suivi_mep {
    id: string,
    id_culture: string,
    code_ass: string,
    association: string,
    code_pms: string,
    code_achat: string,
    nom: string,
    prenom: string,
    id_parce: string,
    superficie_reel: number,
    id_var: string,
    nom_var: string,
    id_saison: string,
    saison: string,
    desc_saison: string,
    annee_du: string,
    qsa: number,
    dds: string,
    sfce: number,
    sc: string,
    ddp: string,
    stc: string,
    ec: string,
    pb: string,
    ex: number,
    img_cult: string,
    name: string,
    controle: string,
    declaration: string
}
export interface Loc_mep_bloc {
    code_culture: string,
    code_bloc: string,
    nom_bl: string, 
    code_benef_bl: string, 
    nom: string, 
    prenom: string, 
    id_parce: string, 
    sfce_reel: string,
    id_espece: string, 
    id_var: string, 
    id_saison: string,
    intitule: string, 
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
    type: string, 
    code_espece: string,
    nom_var: string, 
    code_espece_ea: string,
    nom_espece: string,
    ea: string
}
export interface Loc_sv_bloc {
    code_sv: string, 
    id_culture: string, 
    ddp: string,
    sc: string, 
    ea_autre: string, 
    ea_id_var: string, 
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
    ex: string,
    etat: string
}
export interface Loc_all_suivi_bloc {
    code_sv: string, 
    bloc: string, 
    id_culture: string, 
    id_parce: string, 
    sfce_reel: number,
    code_benef_bl: string,
    nom: string,
    prenom: string,
    id_espece: string, 
    id_var: string, 
    id_saison: string,
    saison: string,
    annee_du: string, 
    qso: number, 
    dds: string, 
    sfce: number, 
    mep_sc: string, 
    ea_autres: string,
    ea_id_variette: string, 
    ddp: string, 
    stc: string,
    ec: string,
    ql: number, 
    qr: number, 
    long_ligne: number, 
    nbre_ligne: number, 
    nbre_pied: number, 
    hauteur: number,
    img_cult: string, 
    ex: string, 
    etat: string,
    espece: string,
    variette: string,
    type: string
}
export interface Loc_PR {
    img_benef: string, 
    nom: string, 
    prenom: string, 
    sexe: string, 
    dt_nais: string, 
    dt_nais_vers: string, 
    date_naissance: string,
    surnom: string, 
    cin: number, 
    dt_delivrance: string,
    lieu_delivrance: string,
    img_cin: string, 
    contact: string, 
    id_fkt: string, 
    village: string, 
    code_region: string,
    nom_region: string,
    code_dist: string,
    nom_dist: string,
    code_commune: string,
    commune: string,
    fokontany: string,
    code_pr: string, 
    id_proj: string, 
    id_activ: number, 
    id_benef: string, 
    id_bloc: string, 
    bloc: string,
    code_achat: string, 
    id_collaborateur: string, 
    id_tech: number, 
    etat: string, 
    status: string,
    cep_pr: any[], // parcelle champs ecole des paysants relais
    isExpanded: boolean // si la ligne est expendable
}
export interface Loc_cep_PR {
    code_pr: string, 
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
    anne_adheran: string,
    dt_creation: string,
    etat: string,
    status: string,
    bloc_cep: string,
    code_region: string,
    nom_region: string,
    code_district: string,
    district: string,
    code_commune: string,
    commune: string,
    fokontany: string
}
export interface Loc_region {
    code_reg: string, 
    nom_reg: string
}
export interface Loc_district {
    code_dist: string, 
    nom_dist: string, 
    id_reg: string
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
export interface AnimationVe {
    code_benef: string,
    nom: string, 
    prenom: string, 
    code_pr: string, 
    code_achat: string, 
    code_anime: string, 
    id_pr: string, 
    id_fkt: string, 
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
    status: string,
    nb_specu: number,
    somme_specu: number,
    code_reg: string,
    code_dist: string, 
    nom_dist: string, 
    code_commune: string, 
    commune: string, 
    fokontany: string,
    specu_animation: any[],
    isExpanded: boolean
}
export interface AnimationSpecu {
    code_specu: string, 
    id_anime_ve: string, 
    id_var: string, 
    id_espece: string, 
    quantite: number, 
    etat: string, 
    status: string,
    speculation: string
}