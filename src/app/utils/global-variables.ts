// variable globale
export const DB_NAME_KEY = 'db_name';
export const DB_NAME = 'ctas-db';
export const FIRST_CONNECT_KEY = 'first_connection';
//export const BASE_PATH = 'http://192.168.1.163:8080/api/';
export const BASE_PATH = 'http://192.168.1.120:8080/api/';
//export const BASE_PATH = 'http://192.168.43.115:8080/api/';192.168.1.132
// FOLDER IMAGE
export const IMAGE_DIR = 'stored-images';
// Bloc Suivi
export const SG = 'sg';
export const PA = 'pa';
export const MV = 'mv';
// Etat rows table
export const SYNC = 'ToSync';
export const ISSYNC = 'isSync';
export const UPDATE = "ToUpdate";
export const ISUPDATE = "isUpdate";
//Statut MEP
export const ACTIVE = 'active';
export const EC = "EC"; // En Cours
export const RC = "RC"; // Récolter
export const CL = "CL"; // Cloturer

// data
export const SC =  [
    {value: 'C.Pure', description: 'Culture Pure'}, 
    {value: 'C.associé', description: 'Culture associé'}, 
    {value: 'C.bande', description: 'Culture bande'}
  ];
export const STC = [
    {value: 'LEV', intitule: 'Levée'},
    {value: 'FEU', intitule: 'Feuilles'},
    {value: 'RAM', intitule: 'Ramification'},
    {value: 'MON', intitule: 'Montaison'},
    {value: 'TAL', intitule: 'Tallage'},
    {value: 'FLO', intitule: 'Florison'},
    {value: 'DM', intitule: 'Début Matiration'},
    {value: 'MAT', intitule: 'Maturation'},
    {value: 'REC', intitule: 'Récolté'},
    {value: 'PREC', intitule: 'Post Récolte'},
    {value: 'ECHEC', intitule: 'Echec'}
  ];
export const EC_CULTURAL = [
  {value: 'TMV', intitule: 'Mauvais état'},
  {value: 'MM', intitule: 'Moyen'},
  {value: 'BON', intitule: 'Bon état'},
  {value: 'TBE', intitule: 'Trés bon état'},
  {value: 'ECHEC', intitule: 'Echec'},
];
export const CONTROLE_MEP = [
  {
    value: 'oui'
  },
  {
    value: 'non'
  }
]
export const DECLARATION_MEP = [
  {value: 'accepte', description: 'accepté'},
  {value: 'refuse', description: 'refusé'}
]
export const ROLE_CACT_INERME  = [
  'Plein champ',
  'forage',
  'Brise vent'
]
export const SEXE = [
  {value: 'H', description: 'Homme'},
  {value: 'F', description: 'Femme'}
]