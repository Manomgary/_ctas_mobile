export interface Sync_culture_pms {
    code_culture: string,
    id_parce: string,
    id_var: string,
    id_saison: string,
    annee_du: string,
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
export interface Sync_suivi_pms {
    id: string,
    id_culture: string,
    ddp: string,
    stc: string,
    ec: string,
    pb: string,
    ex: string,
    img_cult: string,
    name: string,
    controle: string,
    etat: string
}
export interface Sync_mep_bl {
    code_culture: string, 
    id_parce: string, 
    id_espece: string, 
    id_var: string, 
    id_saison: string, 
    annee_du: string, 
    ddp: string, 
    qso: number, 
    dds: string, 
    sfce: number, 
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
export interface Sync_suivi_bl {
    code_sv: string, 
    id_culture: string, 
    ddp: string, 
    stc: string, 
    ql: number, 
    qr: number, 
    long_ligne: number, 
    nbre_ligne: number, 
    nbre_pied: number, 
    img_cult: string, 
    ex: string, 
    etat: string
}