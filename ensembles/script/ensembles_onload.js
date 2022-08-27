/* script pour la page sur la théorie des ensembles */
window.onload = function(){


  /* *******************
    Général
  ******************* */
  // créer liens
  //create_links('h1, h2');

  /* *******************
    Diagrammes de Venn
  ******************* */
  // checkboxes
  document.querySelectorAll('.div_Venn_cbs input').forEach(function(e){
    e.addEventListener('click', VennRendreInVisible);
  });

  // complément
  let ctx_compl_av = document.getElementById('cnv_compl_av').getContext('2d');
  let ctx_compl_A = document.getElementById('cnv_compl_A').getContext('2d');
  let ctx_compl_nA = document.getElementById('cnv_compl_nA').getContext('2d');

  VennCreerFormesCompl(ctx_compl_A, ctx_compl_nA);

  VennDessinerBordsLabels(ctx_compl_av,Centres2, Labels2);
  
  // intersection
  let ctx_inter_av = document.getElementById('cnv_inter_av').getContext('2d');
  let ctx_inter_A = document.getElementById('cnv_inter_A').getContext('2d');
  let ctx_inter_B = document.getElementById('cnv_inter_B').getContext('2d');
  let ctx_inter_AiB = document.getElementById('cnv_inter_AiB').getContext('2d');

  VennCreerFormesInter(ctx_inter_A, ctx_inter_B, ctx_inter_AiB);

  VennDessinerBordsLabels(ctx_inter_av,Centres2, Labels2);
  
  // union
  let ctx_union_av = document.getElementById('cnv_union_av').getContext('2d');
  let ctx_union_A = document.getElementById('cnv_union_A').getContext('2d');
  let ctx_union_B = document.getElementById('cnv_union_B').getContext('2d');
  let ctx_union_AuB = document.getElementById('cnv_union_AuB').getContext('2d');

  VennCreerFormesUnion(ctx_union_A, ctx_union_B, ctx_union_AuB);

  VennDessinerBordsLabels(ctx_union_av,Centres2, Labels2);

  /* *******************
    Ensembles en extension
  ******************* */
  
  document.querySelectorAll('.td_ens_interactive').forEach(function(e){e.addEventListener('click', EnsExtSwitchCell);});

  /* *******************
    Intervalles
  ******************* */
  document.querySelectorAll('.inp_interv').forEach(function(e){e.addEventListener('change', IntervUpdate)});
  IntervUpdate();

}