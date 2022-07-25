---------Requete PR----------------
SELECT BABL.code_benef_bl, BABL.id_proj, BABL.id_activ, BABL.id_benef, BABL.id_bloc, CLB.nom, CLB.description, BABL.code_achat, BABL.id_collaborateur, BABL.status 
FROM benef_activ_bl BABL
INNER JOIN collaborateur CLB ON CLB.code_col = BABL.id_collaborateur
WHERE BABL.status = "active" AND id_collaborateur = "Col02"
--------Extension---------
**Angular Langange Service