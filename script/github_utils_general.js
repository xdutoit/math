function create_links(selecteur){
    // TODO: trouver une manière efficace de copier le lien !
    
    // crée des liens pour tous les éléments sélectionnés
    document.querySelectorAll(selecteur).forEach(function(e){

        // trouver ou créer un id pour l'élément
        let id = e.getAttribute('id');
        if(!id){
            id = encodeURIComponent(e.innerHTML);
            if(document.getElementById(id)){
                // id déjà existant
                let i = 0;
                while(document.getElementById(id+'_'+i)){
                    i++;
                }
                id = id+'_'+i;
            }
            e.setAttribute('id',id);
        }

        // créer le lien
        let lien = window.location.href + '#' + id;
        console.log(lien);

        // ajouter le lien
        e.style.cursor = 'pointer';
        e.setAttribute('title','Copier le lien');
        e.addEventListener('click',function(el){
            console.log(el.target);
            console.log(lien);
        });
    });

}