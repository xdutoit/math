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

function actualiserDeg1(){
    // actualise le graphe et le tableau de signe de degré 1
    let m = getValue('inp_deg1_m');
    let h = getValue('inp_deg1_h');

    // graphe
    ggbApplet_deg1.setValue('m', m);
    ggbApplet_deg1.setValue('h', h);

    // équation
    let eqStr = poly2tex([m,h]);
    document.querySelector('#sp_deg1_fct').innerHTML = `$f(x)=${eqStr}$`;
    if(m==0){
        document.querySelector('#sp_deg2_fct').innerHTML += ' <strong>(degré 0)</strong>';
    }
    

    // val part
    let zeroStr = `$x_0=${num2tex(-h/m)}$`;
    let zeroValStr = `$${num2tex(-h/m)}$`;
    if(m==0){
        zeroStr = 'pas de zéro';
        zeroValStr = '';
    }
    document.querySelector('#sp_deg1_valpart_zero').innerHTML = zeroStr;
    document.querySelector('#sp_deg1_valpart_zeroVal').innerHTML = zeroValStr;

    // tab signe
    document.querySelector('#tabsigne_deg1').style.display = 'block';
    document.querySelector('#sp_tabsigne_deg1_error').style.display = 'none';
    if(m>0){
        document.querySelector('#sp_signe_deg1_minus').innerHTML = '$-$';
        document.querySelector('#sp_signe_deg1_plus').innerHTML = '$+$';
    }
    else if (m<0){
        document.querySelector('#sp_signe_deg1_minus').innerHTML = '$+$';
        document.querySelector('#sp_signe_deg1_plus').innerHTML = '$-$';
    }
    else{
        document.querySelector('#tabsigne_deg1').style.display = 'none';
        document.querySelector('#sp_tabsigne_deg1_error').style.display = 'inline';
    }

    MathJax.typeset();
}

function actualiserDeg2(){
    // actualise le graphe et le tableau de signe de degré 2
    let a = getValue('inp_deg2_a');
    let b = getValue('inp_deg2_b');
    let c = getValue('inp_deg2_c');

    //console.log(`actu para: ${a}; ${b}; ${c}.`)

    // graphe
    ggbApplet_deg2.setValue('a', a);
    ggbApplet_deg2.setValue('b', b);
    ggbApplet_deg2.setValue('c', c);

    // équation
    let eqStr = poly2tex([a,b,c]);
    document.querySelector('#sp_deg2_fct').innerHTML = `$f(x)=${eqStr}$`;
    if(a==0){
        document.querySelector('#sp_deg2_fct').innerHTML += ' <strong>(degré 1)</strong>';
    }
    
    // Delta
    let Delta = b*b-4*a*c;
    //console.log(`Delta: ${Delta}`)

    // val part / tableau de signe
    let zeroStr = '';
    document.querySelector('#tabsigne_deg2_0').style.display = 'none';
    document.querySelector('#tabsigne_deg2_1').style.display = 'none';
    document.querySelector('#tabsigne_deg2_2').style.display = 'none';
    document.querySelector('#sp_tabsigne_deg2_error').style.display = 'none';
    if(a!=0){
        if (a>0){
            document.querySelectorAll('.sp_signe_deg2_plus').forEach(sp => {sp.innerHTML = '$+$';});
            document.querySelectorAll('.sp_signe_deg2_minus').forEach(sp => {sp.innerHTML = '$-$';});
        }
        else{
            document.querySelectorAll('.sp_signe_deg2_plus').forEach(sp => {sp.innerHTML = '$-$';});
            document.querySelectorAll('.sp_signe_deg2_minus').forEach(sp => {sp.innerHTML = '$+$';});
        }



        if(Delta>0){
            let z1 = (-b-Math.sqrt(Delta))/(2*a);
            let z2 = (-b+Math.sqrt(Delta))/(2*a);
            if(z1>z2){
                let zSwap = z1;
                z1 = z2;
                z2 = zSwap;
            }
            zeroStr = `$x_1=${num2tex(z1)}$; $x_2=${num2tex(z2)}$ (deux zéros distincts)`;
            document.querySelector('#sp_deg2_valpart_zeroVal1').innerHTML = `$${num2tex(z1)}$`;
            document.querySelector('#sp_deg2_valpart_zeroVal2').innerHTML = `$${num2tex(z2)}$`;
            document.querySelector('#tabsigne_deg2_2').style.display = 'block';
        }
        else if(Delta==0){
            let z = -b/(2*a);
            zeroStr = `$x_0=${num2tex(z)}$ (zéro double)`; 
            document.querySelector('#sp_deg2_valpart_zeroValDouble').innerHTML = `$${num2tex(z)}$`;
            document.querySelector('#tabsigne_deg2_1').style.display = 'block';
        }
        else{
            zeroStr = 'pas de zéro';
            document.querySelector('#tabsigne_deg2_0').style.display = 'block';
        }
    }
    else{
        document.querySelector('#sp_tabsigne_deg2_error').style.display = 'inline';
    }
    document.querySelector('#sp_deg2_valpart_zero').innerHTML = zeroStr;



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