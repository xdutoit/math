function getAncestorByTag(e, tag) {
    // renvoie le premier ancêtre de type tag
    tag = tag.toLowerCase();
    let curr = e.parentNode;
    while (curr.parentNode) {
      if (curr.tagName.toLowerCase() == tag) {
        return curr;
      }
      curr = curr.parentNode;
    }
    return false;
}

/* *******************
  Diagrammes de Venn
******************* */
const RAYON = 50;
const DISTANCE = 30;

// 2-Venn
const LARGEUR2 = 200;
const HAUTEUR2 = 120;

let centre2 = [LARGEUR2/2, HAUTEUR2/2];

const Centres2 = [
    [centre2[0]-DISTANCE, centre2[1]],
    [centre2[0]+DISTANCE, centre2[1]]
];

const Labels2 = [
    [centre2[0]-(DISTANCE+RAYON), centre2[1]-.3*HAUTEUR2,'A'],
    [centre2[0]+(DISTANCE+RAYON), centre2[1]-.3*HAUTEUR2,'B']
];

// 3-Venn
const LARGEUR3 = 200;
const HAUTEUR3 = 200;

let centre3 = [LARGEUR3/2, HAUTEUR3/2+HAUTEUR3*.05];

const Centres3 = [
    [centre3[0], centre3[1]-DISTANCE],
    [centre3[0]-Math.sqrt(3)*DISTANCE/2, centre3[1]+DISTANCE/2],
    [centre3[0]+Math.sqrt(3)*DISTANCE/2, centre3[1]+DISTANCE/2]
];

const Labels3 = [
    [centre3[0], centre3[1]-(DISTANCE+RAYON+5),'A'],
    [centre3[0]-Math.sqrt(3)*(DISTANCE+RAYON)/2, centre3[1]+(DISTANCE+RAYON),'B'],
    [centre3[0]+Math.sqrt(3)*(DISTANCE+RAYON)/2, centre3[1]+(DISTANCE+RAYON),'C']
];

// couverture
const LARGEUR_MAX = 500;
const HAUTEUR_MAX = 500;

function VennDessinerBordsLabels(ctx, listeCentres, listeLabels){
    /* dessine les cercles et les lettres pour les diagrammes de Venn (2 et 3) */
    listeCentres.forEach(function(c){
        ctx.beginPath();
        ctx.arc(c[0],c[1],RAYON, 0, Math.PI*2);
        ctx.stroke();
    });
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    listeLabels.forEach(function(c){
        ctx.fillText(c[2],c[0],c[1]);
    });
}

function VennHachurer(ctx, chemins, couleur, sens=true){
    /* hachure un ensemble de Venn */
    ctx.save();
    chemins.forEach(function (c){
        ctx.clip(c);
    });
    ctx.strokeStyle = couleur;
    if (sens){
        for(let i = HAUTEUR_MAX;i > -HAUTEUR_MAX-LARGEUR_MAX; i-=8){
            ctx.moveTo(0,i);
            ctx.lineTo(HAUTEUR_MAX,i+HAUTEUR_MAX);
            ctx.stroke();
        }
    }
    else{
        for(let i = HAUTEUR_MAX;i > -HAUTEUR_MAX-LARGEUR_MAX; i-=8){
            ctx.moveTo(HAUTEUR_MAX,i);
            ctx.lineTo(0,i+HAUTEUR_MAX);
            ctx.stroke();
        }
    }
    ctx.restore();
}

function VennRendreInVisible(e){
    /* rend (in)visible le canvas correspondant au checkbox (le checkbox 'xx' rend (in)visible le canvas 'cnv_xx') */
    let id = e.target.id;
    let checked = e.target.checked;
    if(checked){
        document.getElementById('cnv_'+id).style.visibility = 'visible';
    }
    else{
        document.getElementById('cnv_'+id).style.visibility = 'hidden';
    }
}

function VennCreerFormesCompl(ctx1, ctx2){
    /* dessine les différents ensembles pour le complément (A et non A) */

    // A (bleu)
    let cheminA = new Path2D();
    cheminA.arc(Centres2[0][0],Centres2[0][1],RAYON,0,Math.PI*2);
    let couleurA = '#6C6';
    VennHachurer(ctx1,[cheminA], couleurA);

    // not A (rouge)
    let couleurnA = 'rgba(255,0,0,.75)';
    VennRemplirCompl(ctx2,[cheminA], couleurnA, [LARGEUR2, HAUTEUR2]);
}

function VennCreerFormesInter(ctx1, ctx2, ctx3){
    /* dessine les différents ensembles pour l'intersection (A, B, A et B) */
    // A (vert)
    let cheminA = new Path2D();
    cheminA.arc(Centres2[0][0],Centres2[0][1],RAYON,0,Math.PI*2);
    let couleurA = '#6C6';
    VennHachurer(ctx1,[cheminA], couleurA);

    // B (bleu)
    let cheminB = new Path2D();
    cheminB.arc(Centres2[1][0],Centres2[1][1],RAYON,0,Math.PI*2);
    let couleurB = '#66F';
    VennHachurer(ctx2,[cheminB], couleurB, false);

    // A inter B (rouge)
    let couleurAiB = 'rgba(255,0,0,.75)';
    VennRemplirInter(ctx3,[cheminA, cheminB], couleurAiB);
}

function VennCreerFormesUnion(ctx1, ctx2, ctx3){
    /* dessine les différents ensembles pour l'union (A, B, A ou B) */

    // A (vert)
    let cheminA = new Path2D();
    cheminA.arc(Centres2[0][0],Centres2[0][1],RAYON,0,Math.PI*2);
    let couleurA = '#6C6';
    VennHachurer(ctx1,[cheminA], couleurA);

    // B (bleu)
    let cheminB = new Path2D();
    cheminB.arc(Centres2[1][0],Centres2[1][1],RAYON,0,Math.PI*2);
    let couleurB = '#66F';
    VennHachurer(ctx2,[cheminB], couleurB, false);

    // A union B (rouge)
    let couleurAuB = 'rgba(255,0,0,.75)';
    VennRemplirUnion(ctx3,[cheminA, cheminB], couleurAuB);
}

function VennRemplirCompl(ctx, listeClips, couleur, dims){
    /* remplit le complément de listeClips */
    ctx.save();
    ctx.fillStyle = couleur;
    ctx.fillRect(0,0,dims[0],dims[1]);
    listeClips.forEach(function(c){
        ctx.save();
        ctx.clip(c);
        ctx.clearRect(-LARGEUR_MAX,-HAUTEUR_MAX,LARGEUR_MAX*2,HAUTEUR_MAX*2);
        ctx.restore();
    });
    ctx.restore();
}

function VennRemplirInter(ctx, listeClips, couleur){
    /* remplit l'intersection de listeClips */
    ctx.save();
    listeClips.forEach(function(c){
        ctx.clip(c);
    });
    ctx.fillStyle = couleur;
    ctx.fillRect(-LARGEUR_MAX,-HAUTEUR_MAX,LARGEUR_MAX*2,HAUTEUR_MAX*2);
    ctx.restore();
}

function VennRemplirUnion(ctx, listeFormes, couleur){
    ctx.save();
    ctx.fillStyle = couleur;
    listeFormes.forEach(function(c){
        ctx.save();
        ctx.clip(c);
        ctx.clearRect(-LARGEUR_MAX,-HAUTEUR_MAX,LARGEUR_MAX*2,HAUTEUR_MAX*2);
        ctx.fillRect(-LARGEUR_MAX,-HAUTEUR_MAX,LARGEUR_MAX*2,HAUTEUR_MAX*2);
        ctx.restore();
    });
    ctx.restore();
}

/* *******************
  Ensembles en extension
******************* */
function EnsExtSwitchCell(e){
    /* fait passer une td d'active à inactive (et vice-versa) */
    let tdAnc;
    if(e.target.tagName == 'TD'){
        tdAnc = e.target;
    }
    else{
        tdAnc = getAncestorByTag(e.target,'td');
    }
    if(tdAnc.classList.contains('td_active')){
        tdAnc.classList.remove('td_active');
    }
    else{
        tdAnc.classList.add('td_active');
    }
    EnsExtUpdate();
}

function EnsExtUpdate(){
    /* met à jour les cellules pour les ensembles en extension et vérifie les ensembles vides */
    // complément
    for(let i=0;i<10;i++){
        if(!document.getElementById('ens_compl_a'+i).classList.contains('td_active')){
            document.getElementById('ens_compl_res'+i).classList.add('td_active');
        }
        else{
            document.getElementById('ens_compl_res'+i).classList.remove('td_active');
        }
    }

    // intersection
    for(let i=0;i<10;i++){
        if(document.getElementById('ens_inter_a'+i).classList.contains('td_active') && document.getElementById('ens_inter_b'+i).classList.contains('td_active')){
            document.getElementById('ens_inter_res'+i).classList.add('td_active');
        }
        else{
            document.getElementById('ens_inter_res'+i).classList.remove('td_active');
        }
    }

    // union
    for(let i=0;i<10;i++){
        if(document.getElementById('ens_union_a'+i).classList.contains('td_active') || document.getElementById('ens_union_b'+i).classList.contains('td_active')){
            document.getElementById('ens_union_res'+i).classList.add('td_active');
        }
        else{
            document.getElementById('ens_union_res'+i).classList.remove('td_active');
        }
    }

    // vérifier les ensembles vides
    document.querySelectorAll('table.tab_ens tr').forEach(function(tr){
        let id = tr.id;
        let empty = true;
        for(let i=0;i<10 && empty; i++){
            if(document.getElementById(id+i).classList.contains('td_active')){
                empty = false;
            }
        }
        if(empty){
            document.querySelector('#'+id+' .td_empty').innerHTML = '$=\\emptyset$';
        }
        else{
            document.querySelector('#'+id+' .td_empty').innerHTML = '';
        }
    });

    MathJax.typeset();
}


/* *******************
  Intervalles
******************* */
function IntervUpdate(){
    // mettre à jour les éléments du tableau
    ['interv_comp_a', 'interv_inter_a', 'interv_inter_b', 'interv_union_a', 'interv_union_b'].forEach(function(id){IntervUpdateElement(id);});

    // mettre à jour les canvas
    // complément
    IntervDessinerComp();

    // intersection
    IntervDessinerInter();

    // union
    IntervDessinerUnion();
}

function IntervUpdateElement(id){
    // met à jour les bornes dans le tableau

    let ens = IntervCalculerEns(id);

    // description textuelle de l'intervalle
    document.getElementById('sp_'+id+'_str').innerHTML = IntervStr(ens);

    // màj champs
    if(ens['from_inf']){
        document.getElementById('inp_'+id+'_from_inf_1').checked = 'checked'; 
    }
    else{
        document.getElementById('inp_'+id+'_from_inf_0').checked = 'checked';
        document.getElementById('inp_'+id+'_from_val').value = ens['from'];
        document.getElementById('inp_'+id+'_from_inclus').checked = (ens['from_incl']?'checked':'');
    }
    if(ens['to_inf']){
        document.getElementById('inp_'+id+'_to_inf_1').checked = 'checked'; 
    }
    else{
        document.getElementById('inp_'+id+'_to_inf_0').checked = 'checked';
        document.getElementById('inp_'+id+'_to_val').value = ens['to'];
        document.getElementById('inp_'+id+'_to_inclus').checked = (ens['to_incl']?'checked':'');
    }

    MathJax.typeset();
}

function IntervStr(ens){
    // crée une description textuelle de ens
    if(!ens['from_inf'] && ens['to']==ens['from']){
        return '$\\{'+ens['to']+'\\}$';
    }
    let str1, str2;
    if(ens['from_inf']){
        str1 = ']-\\infty';
    }
    else{
        if(ens['from_incl']){
            str1 = '[';
        }
        else{
            str1 = ']';
        }
        str1 += ens['from'];
    }
    if(ens['to_inf']){
        str2 = '+\\infty[';
    }
    else{
        str2 = ens['to'];
        if(ens['to_incl']){
            str2 += ']';
        }
        else{
            str2 += '[';
        }
    }
    return '$'+str1+';'+str2+'$';
}

function IntervCalculerEns(id){
    // calcule les bornes de l'ensemble

    // borne inférieure
    let from, from_inf, from_incl;
    from_inf = document.getElementById('inp_'+id+'_from_inf_1').checked;
    if(!from_inf){
        from = parseFloat(document.getElementById('inp_'+id+'_from_val').value);
        if(isNaN(from)){
            from = 0;
        }
        from_incl = document.getElementById('inp_'+id+'_from_inclus').checked;
    }

    // borne supérieure
    let to, to_inf, to_incl;
    //to_inf = parseInt(document.querySelector('#inp_'+id+'_to_inf:checked').value);
    to_inf = document.getElementById('inp_'+id+'_to_inf_1').checked;
    if(!to_inf){
        to = parseFloat(document.getElementById('inp_'+id+'_to_val').value);
        if(isNaN(to)){
            to = 0;
        }
        to_incl = document.getElementById('inp_'+id+'_to_inclus').checked;
    }

    // vérifier bornes
    if(from>to){
        from = to;
        from_incl = true;
        to_incl = true;
    }
    else if(from==to){
        from_incl = true;
        to_incl = true;
    }

    return {'from':from, 'from_inf':from_inf, 'from_incl':from_incl, 'to':to, 'to_inf':to_inf, 'to_incl':to_incl};

}

// dimensions pour les intervalles
const INTERV_H_LAB = 30; // hauteur des étiquettes de nombre
const INTERV_H_ELEM = 30; // hauteur de chaque intervalle
const INTERV_W_LAB = 70; // largeur des étiquettes des ensembles
const INTERV_W_GRAD = 20; // largeur des dégradés aux extrémités des intervalles
const INTERV_W_MARGIN = 20; // marge entre les dégradés et les points des intervalles
const INTERV_W_UTIL = 200; // largeur utile pour représenter les intervalle

function IntervDessinerComp(){
    // remplit le canvas du complément

    let ens = IntervCalculerEns('interv_comp_a');

    let ctx_interv_comp = document.getElementById('cnv_interv_comp').getContext('2d');

    // reset
    ctx_interv_comp.clearRect(0,0,350,90);
    for(let i=0;i<2;i++){
        document.getElementById('sp_interv_comp_lab'+i).innerHTML = '';
    }


    // position étiquettes des ensembles
    let spA = document.getElementById('sp_interv_comp_A');
    let spAres = document.getElementById('sp_interv_comp_res');
    spA.style.top = Math.round(INTERV_H_LAB + INTERV_H_ELEM/2 - spA.clientHeight/2)+'px';
    spAres.style.top = Math.round(INTERV_H_LAB + 3/2*INTERV_H_ELEM - spAres.clientHeight/2)+'px';

    // dégradés début et fin des traits
    IntervDessinerTraitsNoirs(ctx_interv_comp, 2);

    // traits rouges verticaux + étiquettes
    let bornes = IntervCalculerBornes([ens]);
    IntervDessinerTraitsRouges(ctx_interv_comp, 'interv_comp', [ens], bornes, 2);
   

    // intervalles
    IntervDessinerIntervalle(ctx_interv_comp, [ens], bornes, ['green'], [0]);

    // calculer + dessiner complément
    let AcompStr = '';
    let sep = '';
    // partie inférieure
    if(!ens['from_inf']){
        AcompStr = ']-\\infty;'+ens['from']+(ens['from_incl']?'[':']');
        sep = '\\; \\cup \\;';
        IntervDessinerIntervalle(ctx_interv_comp, [{'from':NaN, 'from_inf': true, 'from_incl':false, 'to':ens['from'], 'to_inf': false, 'to_incl':!ens['from_incl']}], bornes, ['red'], [1]);
    }
    // partie supérieure
    if(!ens['to_inf']){
        AcompStr += sep + (ens['to_incl']?']':'[')+ens['to']+';+\\infty[';
        IntervDessinerIntervalle(ctx_interv_comp, [{'from':ens['to'], 'from_inf': false, 'from_incl':!ens['to_incl'], 'to': NaN, 'to_inf': true, 'to_incl': false}], bornes, ['red'], [1]);
    }
    // ensemble vide ?
    if(!AcompStr.length){
        AcompStr = '\\emptyset';
    }

    // écrire complément
    document.getElementById('sp_interv_comp_resStr').innerHTML = '$\\overline{A}='+AcompStr+'$';

    MathJax.typeset();
    
}

function IntervDessinerInter(){
    // remplit le canvas de l'intersection

    let ens_liste = [IntervCalculerEns('interv_inter_a'), IntervCalculerEns('interv_inter_b')];

    let ctx_interv_inter = document.getElementById('cnv_interv_inter').getContext('2d');

    // reset
    ctx_interv_inter.clearRect(0,0,350,120);
    for(let i=0;i<4;i++){
        document.getElementById('sp_interv_inter_lab'+i).innerHTML = '';
    }


    // position étiquettes des ensembles
    let spA = document.getElementById('sp_interv_inter_A');
    let spB = document.getElementById('sp_interv_inter_B');
    let spRes = document.getElementById('sp_interv_inter_res');
    spA.style.top = Math.round(INTERV_H_LAB + INTERV_H_ELEM/2 - spA.clientHeight/2)+'px';
    spB.style.top = Math.round(INTERV_H_LAB + 3/2*INTERV_H_ELEM - spB.clientHeight/2)+'px';
    spRes.style.top = Math.round(INTERV_H_LAB + 5/2*INTERV_H_ELEM - spRes.clientHeight/2)+'px';

    // dégradés début et fin des traits
    IntervDessinerTraitsNoirs(ctx_interv_inter, 3);

    // traits rouges verticaux + étiquettes
    let bornes = IntervCalculerBornes(ens_liste);
    IntervDessinerTraitsRouges(ctx_interv_inter, 'interv_inter', ens_liste, bornes, 3);

    // intervalles
    IntervDessinerIntervalle(ctx_interv_inter, ens_liste, bornes, ['green', 'blue'], [0,1]);

    let res = IntervCalculerResultatOperation(ens_liste, AND);
    let ens_liste_res = res[0];
    let AInterStr = res[1];

    // écrire intervalle
    document.getElementById('sp_interv_inter_resStr').innerHTML = '$A \\cap B='+AInterStr+'$';

    // dessiner intervalle
    let coord_y = [];
    let couleurs = [];
    for(let i=0;i<ens_liste_res.length;i++){
        coord_y.push(2);
        couleurs.push('red');
    }
    IntervDessinerIntervalle(ctx_interv_inter, ens_liste_res, bornes, couleurs, coord_y);

    MathJax.typeset();
    
}

function IntervDessinerUnion(){
    // remplit le canvas de l'union

    let ens_liste = [IntervCalculerEns('interv_union_a'), IntervCalculerEns('interv_union_b')];

    let ctx_interv_union = document.getElementById('cnv_interv_union').getContext('2d');

    // reset
    ctx_interv_union.clearRect(0,0,350,120);
    for(let i=0;i<4;i++){
        document.getElementById('sp_interv_union_lab'+i).innerHTML = '';
    }


    // position étiquettes des ensembles
    let spA = document.getElementById('sp_interv_union_A');
    let spB = document.getElementById('sp_interv_union_B');
    let spRes = document.getElementById('sp_interv_union_res');
    spA.style.top = Math.round(INTERV_H_LAB + INTERV_H_ELEM/2 - spA.clientHeight/2)+'px';
    spB.style.top = Math.round(INTERV_H_LAB + 3/2*INTERV_H_ELEM - spB.clientHeight/2)+'px';
    spRes.style.top = Math.round(INTERV_H_LAB + 5/2*INTERV_H_ELEM - spRes.clientHeight/2)+'px';

    // dégradés début et fin des traits
    IntervDessinerTraitsNoirs(ctx_interv_union, 3);

    // traits rouges verticaux + étiquettes
    let bornes = IntervCalculerBornes(ens_liste);
    IntervDessinerTraitsRouges(ctx_interv_union, 'interv_union', ens_liste, bornes, 3);

    // intervalles
    IntervDessinerIntervalle(ctx_interv_union, ens_liste, bornes, ['green', 'blue'], [0,1]);

    let res = IntervCalculerResultatOperation(ens_liste, OR);
    let ens_liste_res = res[0];
    let AUnionStr = res[1];

    // écrire intervalle
    document.getElementById('sp_interv_union_resStr').innerHTML = '$A \\cup B='+AUnionStr+'$';

    // dessiner intervalle
    let coord_y = [];
    let couleurs = [];
    for(let i=0;i<ens_liste_res.length;i++){
        coord_y.push(2);
        couleurs.push('red');
    }
    IntervDessinerIntervalle(ctx_interv_union, ens_liste_res, bornes, couleurs, coord_y);

    MathJax.typeset();

}

function IntervCalculerResultatOperation(ens_liste, operateur){
    // calcule la chaîne de caractère et l'ensemble correspondant à l'opération 'operateur' sur les ensembles de 'ens_liste'

    let nombresPertinents = IntervCalculerNombresPertinents(ens_liste);
    let AStr = '';
    let ens_liste_res = [];
    let ens_courant = {};
    if(!nombresPertinents.length){
        if(isIncludedMult(0,ens_liste,operateur)){
            // pas de bornes, 0 inclus => AuB = R
            AStr = ']-\\infty;+\\infty[';
            ens_liste_res.push({'from':NaN, 'from_inf': true, 'from_incl':false, 'to':NaN, 'to_inf': true, 'to_incl': false});
        }
        else{
            // pas de bornes, 0 pas inclus => AuB = vide
            AStr = '\\emptyset';
            // cas impossible (les ensembles A et B ne peuvent pas être vide)
        }
    }
    else{
        // début (-inf)
        let incl = false;
        let sep = '';
        if(isIncludedMult(nombresPertinents[0]-1,ens_liste,operateur)){
            // -inf
            AStr = ']-\\infty;';
            incl = true;
            ens_courant['from'] = NaN;
            ens_courant['from_incl'] = false;
            ens_courant['from_inf'] = true;
        }
        // milieu
        for(let n=0;n<nombresPertinents.length-1;n++){
            let nbCourant = nombresPertinents[n];
            let nbSuivant = (nombresPertinents[n]+nombresPertinents[n+1])/2;
            if(isIncludedMult(nbCourant,ens_liste,operateur)){
                if(!incl){
                    // nbCourant est une borne inf
                    if(!isIncludedMult(nbSuivant,ens_liste,operateur)){
                        // nbCourant est une borne inf et sup
                        AStr += sep + '\\{'+nbCourant+'\\}';
                        sep = '\\;\\cup\\;';
                        incl = false;
                        ens_courant = {};
                        ens_liste_res.push({'from':nbCourant, 'from_incl': true, 'from_inf': false, 'to': nbCourant, 'to_incl': true, 'to_inf': false});
                    }
                    else{
                        // nbCourant est une borne inf mais pas sup
                        AStr += sep + '['+nbCourant+';';
                        sep = '\\;\\cup\\;';
                        incl = true;
                        ens_courant['from'] = nbCourant;
                        ens_courant['from_incl'] = true;
                        ens_courant['from_inf'] = false;
                    }
                }
                else{
                    if(!isIncludedMult(nbSuivant,ens_liste,operateur)){
                        // nbCourant est une borne sup
                        AStr += nbCourant+']';
                        sep = '\\;\\cup\\;';
                        incl = false;
                        ens_courant['to'] = nbCourant;
                        ens_courant['to_incl'] = true;
                        ens_courant['to_inf'] = false;
                        ens_liste_res.push(ens_courant);
                        ens_courant = {};
                    }
                }
            
            }
            else{
                if(incl){
                    if(isIncludedMult(nbSuivant,ens_liste,operateur)){
                        // nbCourant est un trou
                        sep = '\\;\\cup\\;';
                        AStr += nbCourant + '[' + sep + ']' + nbCourant +';';
                        ens_courant['to'] = nbCourant;
                        ens_courant['to_incl'] = false;
                        ens_courant['to_inf'] = false;
                        ens_liste_res.push(ens_courant);
                        ens_courant = {'from':nbCourant, 'from_incl': false, 'from_inf': false};
                    }
                    else{
                        // nbCourant est une borne sup
                        AStr += nbCourant + '[';
                        sep = '\\;\\cup\\;';
                        incl = false;
                        ens_courant['to'] = nbCourant;
                        ens_courant['to_incl'] = false;
                        ens_courant['to_inf'] = false;
                        ens_liste_res.push(ens_courant);
                        ens_courant = {};
                    }
                }
                else{
                    if(isIncludedMult(nbSuivant,ens_liste,operateur)){
                        // nbCourant est une borne inf
                        AStr += sep + ']' + nbCourant + ';';
                        sep = '\\;\\cup\\;';
                        incl = true;
                        ens_courant['from'] = nbCourant;
                        ens_courant['from_incl'] = false;
                        ens_courant['from_inf'] = false;
                    }
                }
            }
        }
        // fin (+ inf)
        let nbDernier = nombresPertinents[nombresPertinents.length-1];
        let posInf = nbDernier+1;
        if(isIncludedMult(nbDernier,ens_liste,operateur)){
            if(incl){
                if(isIncludedMult(posInf,ens_liste,operateur)){
                    AStr += '+\\infty[';
                    ens_courant['to'] = NaN;
                    ens_courant['to_incl'] = false;
                    ens_courant['to_inf'] = true;
                    ens_liste_res.push(ens_courant);
                    ens_courant = {};
                }
                else{
                    // nbDernier est une borne sup
                    AStr += nbDernier +']';
                    ens_courant['to'] = nbDernier;
                    ens_courant['to_incl'] = true;
                    ens_courant['to_inf'] = false;
                    ens_liste_res.push(ens_courant);
                    ens_courant = {};
                }
            }
            else{
                if(isIncludedMult(posInf,ens_liste,operateur)){
                    AStr += sep+'['+nbDernier+';+\\infty[';
                    ens_liste_res.push({'from':nbDernier, 'from_incl': true, 'from_inf': false, 'to': NaN, 'to_incl': false, 'to_inf': true});
                }
                else{
                    // nbDernier est une borne inf et sup
                    AStr += sep + '\\{'+nbDernier +'\\}';
                    ens_liste_res.push({'from':nbDernier, 'from_incl': true, 'from_inf': false, 'to': nbDernier, 'to_incl': true, 'to_inf': false});
                }
            }
        }
        else{
            if(incl){
                // nbDernier est une borne sup
                AStr += nbDernier + '[';
                ens_courant['to'] = nbDernier;
                ens_courant['to_incl'] = false;
                ens_courant['to_inf'] = false;
                ens_liste_res.push(ens_courant);
                ens_courant = {};
                // suite incluse ?
                if(isIncludedMult(posInf,ens_liste,operateur)){
                    AStr += sep+']'+nbDernier+';+\\infty[';
                    ens_liste_res.push({'from':nbDernier, 'from_incl': false, 'from_inf': false, 'to': NaN, 'to_incl': false, 'to_inf': true});
                }
            }
            else{
                if(isIncludedMult(posInf,ens_liste,operateur)){
                    AStr += sep+']'+nbDernier+';+\\infty[';
                    ens_liste_res.push({'from':nbDernier, 'from_incl': false, 'from_inf': false, 'to': NaN, 'to_incl': false, 'to_inf': true});
                }
            }
        }
    }
    if(AStr==''){
        AStr = '\\emptyset';
    }

    return [ens_liste_res, AStr];

}

function IntervDessinerTraitsNoirs(ctx, nb){
    let gradientBlackStart = ctx.createLinearGradient(INTERV_W_LAB,0,INTERV_W_LAB + INTERV_W_GRAD,0);
    gradientBlackStart.addColorStop(0,'white');
    gradientBlackStart.addColorStop(1,'black');
    let gradientBlackEnd = ctx.createLinearGradient(INTERV_W_LAB + INTERV_W_GRAD + 2*INTERV_W_MARGIN + INTERV_W_UTIL, 0, INTERV_W_LAB + 2*INTERV_W_GRAD + 2*INTERV_W_MARGIN + INTERV_W_UTIL,0);
    gradientBlackEnd.addColorStop(0,'black');
    gradientBlackEnd.addColorStop(1,'white');
    
    // traits noirs horizontaux
    ctx.lineWidth = 1;
    for(let h=0;h<nb;h++){
        let coord_y = INTERV_H_LAB + h*INTERV_H_ELEM + INTERV_H_ELEM/2;
        // gradient début
        ctx.strokeStyle = gradientBlackStart;
        ctx.beginPath();
        ctx.moveTo(INTERV_W_LAB, coord_y);
        ctx.lineTo(INTERV_W_LAB + INTERV_W_GRAD, coord_y);
        ctx.stroke();
        
        // trait
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(INTERV_W_LAB + INTERV_W_GRAD, coord_y);
        ctx.lineTo(INTERV_W_LAB + INTERV_W_GRAD + 2*INTERV_W_MARGIN + INTERV_W_UTIL, coord_y);
        ctx.stroke();

        // gradient fin
        ctx.strokeStyle = gradientBlackEnd;
        ctx.beginPath();
        ctx.moveTo(INTERV_W_LAB + INTERV_W_GRAD + 2*INTERV_W_MARGIN + INTERV_W_UTIL, coord_y);
        ctx.lineTo(INTERV_W_LAB + 2*INTERV_W_GRAD + 2*INTERV_W_MARGIN + INTERV_W_UTIL, coord_y);
        ctx.stroke();
    }
}

function IntervDessinerTraitsRouges(ctx, id, ens_liste, bornes, hauteur){
    // dessine les traits rouges verticaux et applique et place les étiquettes correspondantes
    let coord_x = [];
    let labels = [];
    for(let e=0;e<ens_liste.length;e++){
        let ens = ens_liste[e];
        if(isPoint(ens)){
            coord_x.push(Math.round(INTERV_W_LAB + INTERV_W_GRAD + INTERV_W_MARGIN + INTERV_W_UTIL*(ens['from']-bornes['inf'])/(bornes['sup']-bornes['inf'])));
            labels.push('$'+ens['from']+'$');
        }
        else{
            if(!ens['from_inf']){
                coord_x.push(Math.round(INTERV_W_LAB + INTERV_W_GRAD + INTERV_W_MARGIN + INTERV_W_UTIL*(ens['from']-bornes['inf'])/(bornes['sup']-bornes['inf'])));
                labels.push('$'+ens['from']+'$');
            }
            if(!ens['to_inf']){
                coord_x.push(Math.round(INTERV_W_LAB + INTERV_W_GRAD + INTERV_W_MARGIN + INTERV_W_UTIL*(ens['to']-bornes['inf'])/(bornes['sup']-bornes['inf'])));
                labels.push('$'+ens['to']+'$');
            }
        }
    }
    ctx.strokeStyle = 'red';
    for(let x=0;x<coord_x.length;x++){
        ctx.beginPath();
        ctx.moveTo(coord_x[x],INTERV_H_LAB);
        ctx.lineTo(coord_x[x],INTERV_H_LAB + hauteur*INTERV_H_ELEM);
        ctx.stroke();
        let spLab = document.getElementById('sp_'+id+'_lab'+x);
        spLab.innerHTML = labels[x];
        MathJax.typeset();
        let w = spLab.clientWidth;
        spLab.style.left = Math.round(coord_x[x]-w/2)+'px';
    }
}

function IntervDessinerIntervalle(ctx, ens_liste, bornes, couleurs_liste, hauteurs_liste){
    ctx.lineWidth = 3;

    for(let e=0;e<ens_liste.length;e++){
        let ens = ens_liste[e];
        let couleur = couleurs_liste[e];
        let coord_y = INTERV_H_LAB + hauteurs_liste[e]*INTERV_H_ELEM + INTERV_H_ELEM/2;

        let coord_x_from = NaN;
        let coord_x_to = NaN;

        // - infini ?
        if(ens['from_inf']){
            let gradientStart = ctx.createLinearGradient(INTERV_W_LAB,0,INTERV_W_LAB + INTERV_W_GRAD,0);
            gradientStart.addColorStop(0,'white');
            gradientStart.addColorStop(1,couleur);
            ctx.strokeStyle = gradientStart;
            ctx.beginPath();
            ctx.moveTo(INTERV_W_LAB, coord_y);
            ctx.lineTo(INTERV_W_LAB + INTERV_W_GRAD, coord_y);
            ctx.stroke();
            coord_x_from = INTERV_W_LAB + INTERV_W_GRAD;
        }
        else{
            coord_x_from = Math.round(INTERV_W_LAB + INTERV_W_GRAD + INTERV_W_MARGIN + INTERV_W_UTIL*(ens['from']-bornes['inf'])/(bornes['sup']-bornes['inf']));
        }

        // + infini ?
        if(ens['to_inf']){
            let gradientEnd = ctx.createLinearGradient(INTERV_W_LAB + INTERV_W_GRAD + 2*INTERV_W_MARGIN + INTERV_W_UTIL, 0, INTERV_W_LAB + 2*INTERV_W_GRAD + 2*INTERV_W_MARGIN + INTERV_W_UTIL,0);
            gradientEnd.addColorStop(0,couleur);
            gradientEnd.addColorStop(1,'white');
            ctx.strokeStyle = gradientEnd;
            ctx.beginPath();
            ctx.moveTo(INTERV_W_LAB + INTERV_W_GRAD + 2*INTERV_W_MARGIN + INTERV_W_UTIL, coord_y);
            ctx.lineTo(INTERV_W_LAB + 2*INTERV_W_GRAD + 2*INTERV_W_MARGIN + INTERV_W_UTIL, coord_y);
            ctx.stroke();
            coord_x_to = INTERV_W_LAB + INTERV_W_GRAD + 2*INTERV_W_MARGIN + INTERV_W_UTIL;
        }
        else{
            coord_x_to = Math.round(INTERV_W_LAB + INTERV_W_GRAD + INTERV_W_MARGIN + INTERV_W_UTIL*(ens['to']-bornes['inf'])/(bornes['sup']-bornes['inf']));
        }

        // trait
        if(!isPoint(ens)){
            // trait
            ctx.strokeStyle = couleur;
            ctx.beginPath();
            ctx.moveTo(coord_x_from, coord_y);
            ctx.lineTo(coord_x_to, coord_y);
            ctx.stroke();
        }

        // point inf
        if(!ens['from_inf']){
            ctx.beginPath();
            ctx.arc(coord_x_from, coord_y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = couleur;
            ctx.fill();
            if(!ens['from_incl']){
                ctx.beginPath();
                ctx.arc(coord_x_from, coord_y, 3, 0, 2 * Math.PI);
                ctx.fillStyle = 'white';
                ctx.fill();
            }
        }

        // point sup
        if(!ens['to_inf']){
            ctx.beginPath();
            ctx.arc(coord_x_to, coord_y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = couleur;
            ctx.fill();
            if(!ens['to_incl']){
                ctx.beginPath();
                ctx.arc(coord_x_to, coord_y, 3, 0, 2 * Math.PI);
                ctx.fillStyle = 'white';
                ctx.fill();
            }
        }
    }
}

function IntervCalculerBornes(ens_liste){
    // calcule les bornes inf et sup qui définissent l'axe y du canvas
    let nbs = IntervCalculerNombresPertinents(ens_liste);
    if(!nbs.length){
        return {'inf':0, 'sup': 1};
    }
    let borneInf = nbs[0];
    let borneSup = nbs[nbs.length-1];

    let infiniInf = false;
    let infiniSup = false;

    for(let e=0;e<ens_liste.length;e++){
        let ens = ens_liste[e];

        if(ens['from_inf']){
            infiniInf = true;
        }
        if(ens['to_inf']){
            infiniSup = true;
        }
    }
    /*
    if(infiniInf){
        borneInf -= 1;
    }
    if(infiniSup){
        borneSup += 1;
    }*/

    if(borneInf==borneSup){
        borneInf -= 1;
        borneSup += 1;
    }

    return {'inf':borneInf, 'sup': borneSup};
    

    /*
    let infInfFound = false; // y a-t-il un ensemble avec borne inf = -infini ?
    let supInfFound = false; // y a-t-il un ensemble avec borne sup = infini ?
    let infFound = false; // y a-t-il un ensemble avec une borne inférieure définie ?
    let supFound = false; // y a-t-il un ensemble avec une borne supérieure définie ?
    let borneInf = NaN;
    let borneSup = NaN;
    for(let e=0;e<ens_liste.length;e++){
        let ens = ens_liste[e];

        if(!ens['from_inf']){
            if (isNaN(borneInf) || borneInf > ens['from']){
                borneInf = ens['from'];
                infFound = true;
            }
        }
        else{
            infInfFound = true;
        }

        if(!ens['to_inf']){
            if (isNaN(borneSup) || borneSup < ens['to']){
                borneSup = ens['to'];
                supFound = true;
            }
        }
        else{
            supInfFound = true;
        }
    }

    if(!infFound && !supFound){
        console.log('A');
        borneInf = 0;
        borneSup = 1;
    }
    else if(infFound && !supFound){
        console.log('B');
        borneSup = borneInf + 1;
    }
    else if(!infFound && supFound){
        console.log('C');
        borneInf = borneSup - 1;
    }
    else if(infFound && supFound){
        console.log('D');
        if(borneInf==borneSup){
            console.log('E');
            borneInf -= 1;
            borneSup += 1;
        }
    }
    if(infInfFound){
        console.log('F');
        borneInf -= 1;
    }
    if(supInfFound){
        console.log('G');
        borneSup += 1;
    }

    console.log('inf'+borneInf +' / sup'+ borneSup);

    return {'inf':borneInf, 'sup': borneSup};
    */
}

function IntervCalculerNombresPertinents(ens_liste){
    // calcule toutes les bornes de tous les ensembles et renvoie un tableau trié sans doublon
    let nombresListe = [];
    for(let e=0;e<ens_liste.length;e++){
        if(!ens_liste[e]['from_inf']){
            nombresListe.push(ens_liste[e]['from']);
        }
        if(!ens_liste[e]['to_inf']){
            nombresListe.push(ens_liste[e]['to']);
        }
    }

    nombresListe.sort(function(a,b){return a-b;});

    // enlever doublons
    let nombresListeUnique = [];
    for(let n=0;n<nombresListe.length;n++){
        if(!nombresListeUnique.includes(nombresListe[n])){
            nombresListeUnique.push(nombresListe[n]);
        }
    }
    return nombresListeUnique;
}

function isPoint(ens){
    // renvoie 'true' si l'ensemble est un point unique
    return (ens['from']==ens['to']) && !ens['from_inf'] && !ens['to_inf'];
}

function isIncluded(nb, ens){
    // renvoie vrai si nb est dans ens
    // borne inf ?
    return (ens['from_inf'] || ens['from']<nb || (ens['from']==nb && ens['from_incl'])) && (ens['to_inf'] || ens['to']>nb || (ens['to']==nb && ens['to_incl']))
}

// opérateurs
const NOT = 0;
const AND = 1;
const OR = 2;

function isIncludedMult(nb, ens_liste, operateur){
    switch(operateur){
        case NOT:
            return !isIncluded(nb, ens_liste[0]);
        case AND:
            return isIncluded(nb, ens_liste[0]) && isIncluded(nb, ens_liste[1]);
        case OR:
            return isIncluded(nb, ens_liste[0]) || isIncluded(nb, ens_liste[1]);
    }
    console.log('ERROR: isIncludedMult - opérateur inconnu:'+operateur);
}