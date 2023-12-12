window.onload = function(){
    // boutons animation
    document.querySelectorAll('.btn_anim_start').forEach(e => e.addEventListener('click',startAnim));
    document.querySelectorAll('.btn_anim_fwd').forEach(e => e.addEventListener('click',fwdAnim));
    document.querySelectorAll('.btn_anim_bk').forEach(e => e.addEventListener('click',bkAnim));
}

let animationsState = []; // indice de chacune des animations (-1 = tout visible; 0,1,2,... = anim en cours)
let animationsSteps = [];

function startAnim(e){
    let animIndex = parseInt(e.target.getAttribute('id').split('_')[1]);
    console.log(animIndex);

    // set anim state à 0
    while(animationsState.length<animIndex){
        animationsState.push(-1);
    }
    animationsState[animIndex] = 0;

    // calculer nb steps
    let nbSteps = 1;
    while (document.querySelectorAll('.anim_'+animIndex+'_'+nbSteps).length){
        nbSteps++;
    }
    nbSteps--;
    while(animationsSteps.length<animIndex){
        animationsSteps.push(0);
    }
    animationsSteps[animIndex] = nbSteps;

    // màj anim
    updateAnim(animIndex);
}

function fwdAnim(e){
    let animIndex = parseInt(e.target.getAttribute('id').split('_')[1]);
    if(animationsState[animIndex]<animationsSteps[animIndex]){
        animationsState[animIndex]++;
    }
    updateAnim(animIndex);
}

function bkAnim(e){
    let animIndex = parseInt(e.target.getAttribute('id').split('_')[1]);
    if(animationsState[animIndex]>0){
        animationsState[animIndex]--;
    }
    updateAnim(animIndex);
}

function updateAnim(a){
    console.log('update anim '+a);
    let currentState = animationsState[a];
    console.log('current state: '+currentState);
    let nbSteps = animationsSteps[a];

    // met en couleur l'élément courant
    for(let i=0;i<=nbSteps;i++){
        if(i==currentState){
            document.querySelectorAll('.anim_'+a+'_'+i).forEach(e => e.style.color = 'red');
        }
        else{
            document.querySelectorAll('.anim_'+a+'_'+i).forEach(e => e.style.color = 'black');
        }
    }

    // rendre visible les éléments de 0 à currentState
    for(let i=0;i<=currentState;i++){
        console.log('affiche '+i);
        document.querySelectorAll('.anim_'+a+'_'+i).forEach(e => e.style.visibility = 'visible');
    }
    // rendre invisibles les éléments de currentState+1 à nbSteps
    for(let i=currentState+1;i<=nbSteps;i++){
        console.log('cache '+i);
        document.querySelectorAll('.anim_'+a+'_'+i).forEach(e => e.style.visibility = 'hidden');
    }

    // adapte les boutons
    if(currentState>0){
        document.querySelector('#bk_'+a).removeAttribute('disabled');
    }
    else{
        document.querySelector('#bk_'+a).setAttribute('disabled','disabled');
    }
    if(currentState<nbSteps){
        document.querySelector('#fwd_'+a).removeAttribute('disabled');
    }
    else{
        document.querySelector('#fwd_'+a).setAttribute('disabled','disabled');
    }

}


