const curseur_limites = [-1e4,1e4];

function actualiserInpSli(e){
    // met à jour la valeur de l'input de type nombre pour refléter celle du slider
    let nom_arr = e.target.id.split("X");
    nom_arr[1] = 'val';
    let value = e.target.value;
    document.querySelector('#'+nom_arr.join('X')).value = value;
}

function actualiserInpVal(e){
    // met à jour la valeur du slider pour refléter celle de l'input
    let nom_arr = e.target.id.split("X");
    nom_arr[1] = 'sli';
    let value = e.target.value;
    document.querySelector('#'+nom_arr.join('X')).value = value;
}

function getValue(id){
    // renvoie la valeur actuelle de l'input/range dont l'id est id

    let val = parseFloat(document.querySelector('#'+id+'Xval').value);
    if (val<curseur_limites[0] || val>curseur_limites[1]){
        alert(`Les nombres entrés doivent être compris entre ${curseur_limites[0]} et ${curseur_limites[1]}`);
        if(val<curseur_limites[0]){
            val=curseur_limites[0];
        }
        else if (val>curseur_limites[1]){
            val = curseur_limites[1];
        }
        document.querySelector('#'+id+'Xval').value = val;
        document.querySelector('#'+id+'Xsli').value = val;
    }
    return val;

}

function actualiserLin(){
    // actualise la fonction linéaire
    let m = getValue('inp_lin_m');//parseFloat(document.querySelector('#inp_lin_mXval').value);

    // graphe
    ggbApplet_lin.setValue('m', m);

    // équation
    let mStr = m+'';
    if (m==1){
        mStr = '';
    }
    else if(m==-1){
        mStr = '-';
    }
    let xStr = 'x';
    if(m==0){
        xStr = '';
    }
    document.querySelector('#sp_lin_fct').innerHTML = `$f(x)=${mStr}${xStr}$`;

    // val part
    let zeroStr = '$z=0$';
    if(m==0){
        zeroStr = '$z\\in \\mathbb{R}$';
    }
    document.querySelector('#sp_lin_valpart_zero').innerHTML = zeroStr;

    MathJax.typeset();
}

function actualiserAff(){
    // actualise la fonction affine
    let m = getValue('inp_aff_m');//parseFloat(document.querySelector('#inp_aff_mXval').value);
    let h = getValue('inp_aff_h');//parseFloat(document.querySelector('#inp_aff_hXval').value);

    // graphe
    ggbApplet_aff.setValue('m', m);
    ggbApplet_aff.setValue('h', h);

    // équation
    let eqStr = poly2tex([m,h]);
    document.querySelector('#sp_aff_fct').innerHTML = `$f(x)=${eqStr}$`;

    // val part
    let zeroStr = '$z=0$';
    if(m==0){
        if(h==0){
            hStr = '0';
            zeroStr = '$z\\in \\mathbb{R}$';
        }
        else{
            hStr = h+'';
            zeroStr = 'pas de zéro';
        }
    }
    else{
        zeroStr = `$${num2tex(-h/m)}$`;
    }
    document.querySelector('#sp_aff_valpart_zero').innerHTML = zeroStr;

    MathJax.typeset();
}

function actualiserQuad(){
    // actualise la fonction quadratique
    let a = getValue('inp_quad_a');//parseFloat(document.querySelector('#inp_quad_aXval').value);
    let b = getValue('inp_quad_b');//parseFloat(document.querySelector('#inp_quad_bXval').value);
    let c = getValue('inp_quad_c');//parseFloat(document.querySelector('#inp_quad_cXval').value);

    //console.log(`actu para: ${a}; ${b}; ${c}.`)

    // graphe
    ggbApplet_quad.setValue('a', a);
    ggbApplet_quad.setValue('b', b);
    ggbApplet_quad.setValue('c', c);

    // équation
    let eqStr = poly2tex([a,b,c]);
    document.querySelector('#sp_quad_fct').innerHTML = `$f(x)=${eqStr}$`;
    if(a==0){
        document.querySelector('#sp_quad_fct').innerHTML += ' <strong>(fonction affine)</strong>';
    }
    
    // Delta
    let Delta = b*b-4*a*c;
    //console.log(`Delta: ${Delta}`)

    // val part / pt part
    let zeroStr = '';
    let sommetStr = '';
    if(a!=0){
        if(Delta>0){
            let z1 = (-b+Math.sqrt(Delta))/(2*a);
            let z2 = (-b-Math.sqrt(Delta))/(2*a);
            zeroStr = `$z_1=${num2tex(z1)}$; $z_2=${num2tex(z2)}$ (deux zéros distincts)`;
        }
        else if(Delta==0){
            let z = -b/(2*a);
            zeroStr = `$z=${num2tex(z)}$ (zéro double)`; 
        }
        else{
            zeroStr = 'pas de zéro';
        }
        let Sx = -b/(2*a);
        let Sy = a*Sx*Sx+b*Sx+c;
        sommetStr = `$(${num2tex(Sx)};${num2tex(Sy)})$`;
    }
    document.querySelector('#sp_quad_valpart_zero').innerHTML = zeroStr;
    document.querySelector('#sp_quad_valpart_ordorig').innerHTML = `$c=${c}$`;
    document.querySelector('#sp_quad_ptpart_sommet').innerHTML = sommetStr;

    MathJax.typeset();
}

function num2tex(n){
    let limite = 2; //nombre de décimales après la virgule
    let nStr = n+'';
    let nArr = nStr.split('.');
    if(nArr.length>1 && nArr[1].length>limite){
        nArr[1] = nArr[1].substring(0,limite);
    }
    return nArr.join('.');
}

function poly2tex(coeffs){
    // convertit un polynôme en chaîne de caractères latex
    // coeffs est la liste des coefficients par degré décroissant

    let first_term = true; //premier terme non-nul du polynôme
    let degre = coeffs.length-1; // degré du polynôme

    let tex_str = '';

    for(let i=0;i<degre+1;i++){
        // i: position (indice) correspondant au degré d dans coeffs
        let d = degre-i;
        let curr_coeff = coeffs[i];
        let curr_str = '';
        if(curr_coeff!=0){
            let fac = ''; // facteur de degré d
            if(!first_term){
                // toujours afficher le signe (+ ou -)
                if(curr_coeff>0){
                    fac = '+';
                }
                else{
                    fac = '-';
                }
            }
            else{
                // afficher uniquement -
                if(curr_coeff<0){
                    fac = '-';
                }
            }

            if(Math.abs(curr_coeff)!=1 || d==0){
                // afficher valeur numérique
                fac += Math.abs(curr_coeff);
    
    
            }
            let x_str = ''; // x de degré d
            if(d==1){
                x_str = 'x';
            }
            else if(d>1){
                x_str = `x^{${d}}`;
            }

            curr_str = fac+x_str;
            first_term = false;
        }
        tex_str += curr_str;
    }

    // polynôme nul ?
    if(tex_str.length==0 || (degre==0 && coeffs[0]==0)){
        tex_str = '0';
    }

    return tex_str;
}