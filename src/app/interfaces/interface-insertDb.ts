export interface Db_Culture_pms {
    code_culture: string, 
    id_parce: string, 
    id_var: string,
    id_saison: string,
    annee_du: string,
    ddp: string,
    dt_creation: string,
    dt_modification: string,
    qsa : number,
    img_fact: Blob,
    dds: string,
    sfce: number,
    objectif: number,
    sc: string,
    ea_id_variette: string,
    ea_autres: string,
    statuts: string,
    Etat: string
}
export interface Db_suivi_pms {
    code_culture: string, 
    ddp: string, 
    stc: string, 
    ec: string, 
    ex: string, 
    img_cult: string, 
    controle: string
}