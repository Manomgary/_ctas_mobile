---------Requete PR----------------
SELECT BABL.code_benef_bl, BABL.id_proj, BABL.id_activ, BABL.id_benef, BABL.id_bloc, CLB.nom, CLB.description, BABL.code_achat, BABL.id_collaborateur, BABL.status 
FROM benef_activ_bl BABL
INNER JOIN collaborateur CLB ON CLB.code_col = BABL.id_collaborateur
WHERE BABL.status = "active" AND id_collaborateur = "Col02"
--------Extension---------------------------------------
**Angular Langange Service
---------------------------Tache à faire----------------
mise à jour request synchro Volet Reseau paysan(ok)
mise à jour table beneficiaire pr après modification
mise à jour request synchro PR et ajouter synchro CEP
mise à jour année-Agricole Mep Bloc PMS et PR
Export Excel