/**************************
 * 
 *************************************/
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
    img_fact: string,
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
    id: string,
    code_culture: string, 
    ddp: string, 
    stc: string, 
    ec: string, 
    ex: string, 
    pb: string,
    img_cult: string, 
    name: string,
    path: string,
    controle: string,
    etat: string
}