let tab_res_n = [];
let tab_res = [];
let tab_th = [];
let ctx;

window.onload = function(){
    document.querySelector('#btn_gen').addEventListener('click',generer);
    ctx = document.querySelector('#can_graphique').getContext('2d');
}

// combinaisons
function combi(n,k){
    // C_k^n = n! / (n-k)!k!
    let res = 1;
    k = Math.min(k,n-k);
    for(i=n;i>n-k;i--){
     res *= i;
    }
    for(i=1;i<=k;i++){
     res /= i;
    }
    return res;
}

// number
function formatNum(n){
    return (n>1?n.toFixed(3):n.toPrecision(2));
}

function generer(){
    let n = parseInt(document.querySelector('#inp_n').value);
    let t = parseInt(document.querySelector('#inp_t').value);
    
    // reset résultats
    tab_res = [];
    tab_res_n = [];
    for(let i=0;i<=n;i++){
     tab_res[i]=0;
     tab_res_n[i]=0;
    }
    
    // générer lancers
    for(let l=0;l<t;l++){
     let curr_res = 0;
     for(let x=0;x<n;x++){
      if(Math.random()<.5){
       curr_res++;
      }
     }
     tab_res_n[curr_res]++;
    }
    // -> fréquences
    for(let i=0;i<=n;i++){
     tab_res[i] = tab_res_n[i]/t;
    }
    // générer résultats théoriques
    let pn = Math.pow(.5,n);
    for(let i=0;i<=n;i++){
     tab_th[i] = combi(n,i)*pn;
    }
    
    // résultats -> tableau
    let html_str = '<tr><th>k</th>';
    for(let i=0;i<=n;i++){
     html_str += '<td>'+i+'</td>';
    }
    html_str += '</tr><tr class="eff"><th>effectifs</th>';
    for(let i=0;i<=n;i++){
     html_str += '<td>'+tab_res_n[i]+'</td>';
    }
    html_str += '</tr><tr class="freq"><th>fréquences</th>';
    for(let i=0;i<=n;i++){
     html_str += '<td>'+tab_res[i]+'</td>';
    }
    html_str += '</tr><tr class="prob"><th>probabilités</th>';
    for(let i=0;i<=n;i++){
     html_str += '<td>'+formatNum(tab_th[i])+'</td>';
    }
    html_str += '</tr>';
    document.querySelector('#tab_res').innerHTML = html_str;
    
    // résultats -> canvas
    let H = 300;
    let W = 600;
    ctx.clearRect(0,0,W,H);
    let res_max = -1;
    for(let i=0;i<tab_res.length;i++){
     if(tab_res[i]>res_max){
      res_max = tab_res[i];
     }
     if(tab_th[i]>res_max){
      res_max = tab_th[i];
     }
    }
    res_max *= 1.1;
    console.log('r m:'+res_max);
    let scale_h = H/res_max;
    console.log('scale_h:'+scale_h);
    let col_w = W/(n+1);
    ctx.fillStyle = '#CCF';
    for(let i=0;i<=n;i++){
     let h = tab_res[i]*scale_h;
     //console.log(i+':'+h);
     ctx.fillRect(i*col_w,H-h,col_w,h);
    }
    // courbe théorique
    ctx.strokeStyle = '#F00';
    let col_hw = col_w/2;
    let h = tab_th[0]*scale_h;
    ctx.beginPath();
    ctx.moveTo(col_hw,H-h);
    for(let i=1;i<=n;i++){
     h = tab_th[i]*scale_h;
     ctx.lineTo(col_hw+i*col_w,H-h);
    }
    ctx.stroke();
    
   }