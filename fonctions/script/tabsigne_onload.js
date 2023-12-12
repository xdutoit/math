/* script pour la page sur les fonctions (chargement) */
function triggerTabsigneOnload(){

    // mettre à jour les valeurs des sliders/inputs
    document.querySelectorAll('.inpsli_actualiser').forEach(function(e){
        e.addEventListener('input',actualiserInpSli);
    });
    document.querySelectorAll('.inpval_actualiser').forEach(function(e){
        e.addEventListener('input',actualiserInpVal);
    });

    // mettre à jour les graphes
    document.querySelectorAll('.deg1_actualiser').forEach(function(e){
        e.addEventListener('input',actualiserDeg1);
    });
    document.querySelectorAll('.deg2_actualiser').forEach(function(e){
        e.addEventListener('input',actualiserDeg2);
    });
};

