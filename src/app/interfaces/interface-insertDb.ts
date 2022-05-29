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
export interface AddMepBloc {
    code_culture: string, 
    id_parce: string, 
    id_espece: string, 
    id_var: string, 
    id_saison: string, 
    annee_du: string, 
    ddp: string, 
    qso: string, 
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
export interface UpdateSuiviBloc {
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