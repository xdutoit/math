/* script pour la page sur les fonctions (chargement) */
function triggerFonctionsOnload(){

    // mettre à jour les valeurs des sliders/inputs
    document.querySelectorAll('.inpsli_actualiser').forEach(function(e){
        e.addEventListener('input',actualiserInpSli);
    });
    document.querySelectorAll('.inpval_actualiser').forEach(function(e){
        e.addEventListener('input',actualiserInpVal);
    });

    // mettre à jour les graphes
    document.querySelectorAll('.lin_actualiser').forEach(function(e){
        e.addEventListener('input',actualiserLin);
    });
    document.querySelectorAll('.aff_actualiser').forEach(function(e){
        e.addEventListener('input',actualiserAff);
    });
    document.querySelectorAll('.quad_actualiser').forEach(function(e){
        e.addEventListener('input',actualiserQuad);
    });
};

