/**
 *
 * @source: https://capassumptes.com/ninots/ninots.js
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2019  Pere Ramon Erro Mas
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

/** @constructor 
* Definició de la classe Ninots. Presenta una pista en el SVG passat
* i presenta l'esquema si es passen les dades d'aquest.
* @param {svg} svg
* @param {object} data - Dades obtingudes amb el mètode @link treu_esquema
*/
var Ninots = function(svg, data) {
    /** @member */
    this.svg_ninots = svg;

    // prepara el SVG
    this.dibuixa_camp();
    this.preparaMarcaFinalFletxes();

    // si hi ha dades, inicialitza
    if (data  !== undefined)
        this.posa_esquema(data);
    else
        this.ninots = Ninots.sense_ninots(); // sense dades
    
    this.marge = 30;
    this.marge_esq = 30;
    this.despl_cist = 20;
    this.resize();
}

Ninots.ns = 'http://www.w3.org/2000/svg'; // espai de noms del SVG

/**
* Genera una estructura de dades buida.
* @return l'estructura buida generada 
*/
Ninots.sense_ninots = function() {
    // inicialitza l'estructura de dades
    return {
        llista: {},
        darrer_id: 0,
    };
}

/**
* Llista de plantilla de ninots
*/
Ninots.camins_de_ninots = [
    {
        tipus: 'defensa',
        titol: 'Defensa',
        path: 'm-26.139-12.024a27.214 28.537 0 0 0 27.208 28.348 27.214 28.537 0 0 0 27.206-28.348h-9.0625a18.143 17.387 0 0 1-13.49 16.796 6.8036 7.7485 0 0 0 2.1508-5.6456 6.8036 7.7485 0 0 0-6.8037-7.7484 6.8036 7.7485 0 0 0-6.8037 7.7484 6.8036 7.7485 0 0 0 2.142 5.6307 18.143 17.387 0 0 1-13.481-16.781z',
        es_mou: true,
        tipus_cami: 'normal',
    },{
        tipus: 'amb_pilota',
        titol: 'Amb Pilota',
        path: 'm0.59807-16.932c-8.7924-0.15223-16.958 7.1499-17.814 15.9-1.0134 7.9941 4.011 16.337 11.654 19.001 6.9951 2.6148 15.534 0.40424 20.185-5.497 4.8068-5.8288 5.4658-14.778 1.2248-21.1-3.2701-5.071-9.1801-8.4186-15.25-8.3044zm0.08356 5.2794c1.4083 0.0023 2.8166 0.23906 4.146 0.70428-1.4083 2.0164-2.8166 4.0328-4.225 6.0492-1.3946-2.0031-2.7893-4.0061-4.1839-6.0092 1.3635-0.49164 2.8136-0.74261 4.2629-0.74429zm9.554 4.3107c4.0848 4.4826 4.2049 11.998 0.199 16.582-2.0366-2.9458-4.0732-5.8915-6.1098-8.8373 1.9393-2.6192 3.7637-5.3238 5.7748-7.8898l0.12376 0.13247zm-19.392 0.45323c1.7861 2.5357 3.651 5.0153 5.4777 7.5237-1.9724 2.6572-3.8384 5.3937-5.8743 8.0038-3.408-4.4734-3.276-11.244 0.33107-15.605zm14.207 19.896c-3.0651 1.1404-6.5756 1.0166-9.5561-0.32718 1.5599-2.2495 3.1197-4.499 4.6796-6.7486 1.6255 2.3586 3.251 4.7172 4.8765 7.0757z',
        es_mou: true,
        tipus_cami: 'ondulat',
    },{
        tipus: 'sense_pilota',
        titol: 'Sense Pilota',
        path: 'm18.737 16.034h-7.6663l-10.254-11.803-10.319 11.803h-7.084l14.103-15.325-13.974-15.408h7.6663l10.189 11.611 10.222-11.611h7.1164l-14.2 15.132 14.2 15.601',
        es_mou: true,
        tipus_cami: 'normal',
    },{
        tipus: 'con',
        titol: 'Con',
        path: 'm19.387 15.102h-1.256c-0.47255-2.1779-2.3553-3.8796-4.71-4.2241l-8.9137-29.447c-0.13968-0.46094-0.58786-0.77894-1.0979-0.77894h-4.7172c-0.51 0-0.95818 0.318-1.0979 0.77894l-8.9137 29.447c-2.3547 0.34452-4.2375 2.0462-4.71 4.2241h-1.256c-0.63036 0-1.1413 0.47993-1.1413 1.0721s0.51089 1.0721 1.1413 1.0721h36.672c0.63036 0 1.1412-0.47992 1.1412-1.0721s-0.51089-1.0721-1.1412-1.0721m-26.345-10.792h16.018s1.9687 6.504 1.9687 6.504h-19.955l1.969-6.504m1.947-6.4325h12.123l1.2982 4.2883h-14.72l1.2982-4.2883m1.9473-6.4325h8.2289l1.2982 4.2883h-10.825l1.2982-4.2883m2.6177-8.6481h2.9934l1.9687 6.504h-6.9307s1.9687-6.504 1.9687-6.504m-9.9919 30.161h22.969c0.0023 0 0.0047 2.78e-4 0.0072 2.78e-4h0.0054c1.4857 0.0016 2.7521 0.89731 3.2228 2.1439h-29.433c0.47136-1.2477 1.7398-2.1442 3.2276-2.1442',
        es_mou: false,
        /* <div>Icons made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.es/" 			    title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" 			    title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div> */
    }
];

/**
* @static
* Dibuixa un ninot en unes coordenades dins d'un SVG
* @param coords_svg - Les coordenades en el SVG
* @param svg - El SVG on es dibuixarà
* @param {string} [tipus=defensa] - Tipus de ninot que es dibuixarà
*/
Ninots.dibuixa_ninots = function(coords_svg, svg, tipus, pixels_rect) {
    if (tipus === undefined) tipus = 'defensa';
    if (pixels_rect === undefined) pixels_rect = 20;
    classes = 'ninots_ninot ninots_'+tipus;
    var ninot = document.createElementNS(Ninots.ns, 'path');
    ninot.setAttribute('d', 'M'+coords_svg.join(',')+'\n' + Ninots.ninots_tmpl[tipus].path);
    ninot.setAttribute('class', classes);
    svg.appendChild(ninot);
    
    /*
    var bbox = ninot.getBBox();
    ninot.style.transform = Ninots.getTransform(bbox, {'x': coords_svg[0], 'y': coords_svg[1], 'width': pixels_rect, 'height': pixels_rect,});
    */
    ninot.dataset.nom_ninot = tipus;
    return ninot;
}

/**
* Objecte que afegeix funcionalitat a les plantilles de ninots.
*/
Ninots.ninots_tmpl = {};
for (var i=0; i < Ninots.camins_de_ninots.length; i++) {
    var obj = Ninots.camins_de_ninots[i];
    obj.dibuixa = function(coords_svg, svg) {
        return Ninots.dibuixa_ninots(coords_svg, svg, this.tipus);
    };
    Ninots.ninots_tmpl[obj.tipus] = obj;
}

/**
* Passa les coordenades del svg a les virtuals de pista.
* @param {array} coords - X i Y
* @return {array} X i Y
*/
Ninots.prototype.to_coords_pista = function(coords) {
    return [coords[0] / this.scalax, coords[1] / this.scalay];
}

/**
* Passa les coordenades virtual de pista a les del svg.
* @param {array} coords - X i Y
* @return {array} X i Y
*/
Ninots.prototype.to_coords_svg = function(coords) {
    return [coords[0] * this.scalax, coords[1] * this.scalay];
}

Ninots.prototype.get_terreny_dims = function() {
    return {width: this.svg_ninots.width.baseVal.value-this.marge*2-this.marge_esq, height: this.svg_ninots.height.baseVal.value-this.marge*2, x:this.marge+this.marge_esq, y:this.marge,};
}

/**
* Passa les coordenades del svg de les cistelles.
* @return {object} cistella1: coordenades , cistella2: coordenades
*/
Ninots.prototype.get_coords_cistelles = function() {
    var dims = this.get_terreny_dims();
    return {cistella1: [this.marge_esq+this.marge + this.despl_cist, dims.height / 2 + this.marge],
            cistella2: [dims.width - this.despl_cist + this.marge + this.marge_esq, dims.height / 2 + this.marge]};
}

/**
* Incorpora la marca de fi de fletxa al SVG per usar-se en les fletxes.
*/
Ninots.prototype.preparaMarcaFinalFletxes = function() {
    var fletxa = document.createElementNS(Ninots.ns, 'marker');
    Ninots.setAttributes(fletxa, {id: 'despls_ninots_fletxa', markerWidth: '13', markerHeight: "13", refX: "2", refY: "7", orient: "auto"});
    var path_fletxa = document.createElementNS(Ninots.ns, 'path');
    Ninots.setAttributes(path_fletxa, {d: "M2,2 L2,13 L8,7 L2,2", style: "fill: #000000; transform: scale(0.5) translate(0px,7px)", });
    fletxa.appendChild(path_fletxa);
    this.svg_ninots.appendChild(fletxa);    
}

/**
* Redimensiona els elements del SVG controlats per Ninots
*/
Ninots.prototype.resize = function() {
    var bb = this.camp.getBBox();
    var dims = this.get_terreny_dims()
    var ample_svg = dims.width;
    var alt_svg = dims.height;
    this.scalax = (ample_svg/bb.width);
    this.scalay = (alt_svg/bb.height);
    this.camp.style.transform = 'scale('+this.scalax+','+this.scalay+') translate('+(-bb.x + dims.x / this.scalax)+'px,'+(-bb.y + dims.y / this.scalay)+'px)';
    var ccist = this.get_coords_cistelles();
    this.cistella1.style.transform = 'translate('+ccist.cistella1[0]+'px,'+ccist.cistella1[1]+'px)';
    this.cistella2.style.transform = 'translate('+ccist.cistella2[0]+'px,'+ccist.cistella2[1]+'px)';
    for (var k in this.ninots.llista) {
        var dninot = this.ninots.llista[k];
        dninot.resize();
    }
}

/**
* Deixa l'objecte buit.
*/
Ninots.prototype.empty = function() {
    for (var k in this.ninots.llista) {
        this.ninots.llista[k].esborra();
    }
    this.ninots = Ninots.sense_ninots();
}

/**
* Dibuixa el camp en el SVG.
*/
Ninots.prototype.dibuixa_camp = function() {
    // TODO: revisar mesures https://respuestas.tips/medidas-cancha-basquet/
    var camp = document.createElementNS(Ninots.ns, 'path');
    camp.setAttributeNS(null, 'd', 'm57.273 191.64h-57.273v53.571h57.273zm-21.724 26.661a22.273 26.786 0 0 0 22.273 26.786 22.273 26.786 0 0 0 22.273-26.786 22.273 26.786 0 0 0-22.273-26.786 22.273 26.786 0 0 0-22.273 26.786zm52.53 3.0887c0 35.446-25.795 64.714-57.614 64.806l-30.465 0.0877v-128.57l30.465-0.5027c31.816-0.52498 57.614 28.735 57.614 64.181zm134.65-27.964h57.273v53.571h-57.273zm21.724 26.661a22.273 26.786 0 0 1-22.273 26.786 22.273 26.786 0 0 1-22.273-26.786 22.273 26.786 0 0 1 22.273-26.786 22.273 26.786 0 0 1 22.273 26.786zm-52.53 1.303c0 35.446 25.795 64.714 57.614 64.806l30.465 0.0877v-128.57l-30.465-0.5027c-31.816-0.52498-57.614 28.735-57.614 64.181zm-51.921-74.392h140v150h-140zm22.469 72.032a22.273 26.786 0 0 1-22.273 26.786 22.273 26.786 0 0 1-22.273-26.786 22.273 26.786 0 0 1 22.273-26.786 22.273 26.786 0 0 1 22.273 26.786zm-162.47-72.032h140v150h-140z');
    camp.setAttribute('class', 'ninots_camp');
    camp.setAttribute('fill-rule', "evenodd");
    this.svg_ninots.appendChild(camp);
    this.camp = camp;
    
    
    // cistelles
    var d_cistella = 'm23.108-17.514c0-0.55185-0.4704-0.99937-1.0505-0.99937h-39.918c-0.58007 0-1.0505 0.44752-1.0505 0.99937v3.9975c0 0.55185 0.4704 0.99937 1.0505 0.99937h3.2676l4.0926 33.096c0.14644 1.344 2.2719 1.1061 2.0866-0.23345l-0.39266-3.1762s0.04265 0.04637 0.04265 0.04637l4.6212-3.86s5.4677 5.7764 5.4677 5.7764c0.38825 0.41014 1.0526 0.44332 1.4837 0.07395 0.02731-0.02339 0.05315-0.04797 0.07774-0.07395 0 0 5.4572-5.7718 5.4572-5.7718l4.6168 3.8558 0.04223-0.04577-0.39266 3.1754c-0.1853 1.3396 1.9402 1.5774 2.0866 0.23345l4.0926-33.096h3.0959c0.33258 0.05217 0.67104-0.05037 0.91054-0.27603 0.0088-0.0078 0.01744-0.01579 0.02584-0.02379 0.2332-0.22686 0.3393-0.54566 0.28594-0.85886l-6e-6 -3.8384m-39.918 0.99937h37.817v1.9987h-37.817v-1.9987m6.6845 3.9975h8.8382l0.91138 0.40674-5.2901 2.3603-4.4594-2.7671m15.609 0h8.8374l-4.4592 2.7667-5.2897-2.3599 0.91159-0.40674m-17.837 1.0036 4.4506 2.7611-3.8941 1.7375-0.55654-4.4986m28.903 0-0.55633 4.4984-3.8937-1.7371 4.45-2.7613m-14.451 0.50688 5.6944 2.5406-5.6946 3.533-5.6944-3.5334 5.6946-2.5406v4e-4m-7.9314 3.5388 6.0087 3.7277-5.233 3.2468-5.7133-4.7716 4.9376-2.2028m15.862 0 4.9376 2.2028-5.7131 4.772-5.233-3.2468 6.0085-3.7281m-21.337 4.4148 4.4227 3.6937-3.6831 2.285-0.73953-5.9786m26.811 0-0.73953 5.9786-3.6831-2.285 4.4227-3.6937m-13.405 0.50628 5.5166 3.4228-5.5166 4.6077-5.5166-4.6077 5.5166-3.4228m-7.3438 4.5565 5.7513 4.8036-4.4756 3.7382-5.5658-5.8803 4.2901-2.6615m14.688 0 4.2905 2.6619s-5.5626 5.8835-5.5626 5.8835l-4.4796-3.7414 5.7517-4.804m-19.492 5.1054s4.5015 4.7552 4.5015 4.7552l-3.547 2.9625-0.95445-7.7177m24.295 0.0026-0.95403 7.7147-3.5424-2.9587s4.4964-4.756 4.4964-4.756m-12.147 1.0256 4.6668 3.8979-4.6599 4.9285s-4.6689-4.9329-4.6689-4.9329l4.662-3.8935';

    this.cistella1 = document.createElementNS(Ninots.ns, 'path');
    this.cistella1.setAttributeNS(null, 'd', d_cistella);
    this.cistella1.setAttribute('class', 'cistella_camp');
    this.svg_ninots.appendChild(this.cistella1);
    
    this.cistella2 = document.createElementNS(Ninots.ns, 'path');
    this.cistella2.setAttributeNS(null, 'd', d_cistella);
    this.cistella2.setAttribute('class', 'cistella_camp');
    this.svg_ninots.appendChild(this.cistella2);
    
    
    
}

/**
* Posa l'esquema en la pista.
* @param ninots - Dades amb la informació de l'esquema.
*/
Ninots.prototype.posa_esquema = function(ninots) {
    this.empty();
    var max_id = 0;
    for (var k in ninots.llista) {
        var dn = ninots.llista[k];
        var coords_svg = this.to_coords_svg([dn.x, dn.y]);      
        this.ninots.llista[k] = new Ninots.Ninot(this, k, dn.tipus, coords_svg, dn.despls);
        if (k > max_id)
            max_id = dn.id_ninot;
    }
    for (var k in ninots.llista) {
        var dn = ninots.llista[k];
        if (dn.passi_a) {
            var dninot = this.ninots.llista[k];
            var dnd = this.ninots.llista[dn.passi_a];
            dninot.passi_a = dnd;
            dninot.dibuixa_passi();
        }
        if (dn.tira_a) {
            var dninot = this.ninots.llista[k];
            dninot.tira_a = dn.tira_a;
            dninot.dibuixa_tir();
        }
    }
    this.ninots.darrer_id = max_id;
}

/**
* Retorna les dades que conté l'esquema.
* @return Les dades de l'esquema.
*/
Ninots.prototype.treu_esquema = function() {
    var ret = {
        llista: {},
    };
    for (k in this.ninots.llista) {
        var dninot = this.ninots.llista[k];
        ret.llista[k] = {
            x: dninot.x, y: dninot.y,
            despls: dninot.despls,
            tipus: dninot.tipus,
        };
        if (dninot.passi_a) {
            ret.llista[k].passi_a = dninot.passi_a.id_ninot;
        }
        if (dninot.tira_a) {
            ret.llista[k].tira_a = dninot.tira_a;
        }
    }
    return ret;
}

/**
* @constructor
* Ninot es la classe dels objectes que hi ha en l'esquema dels Ninots.
*/
Ninots.Ninot = function(obj_ninots, p_id, tipus, coords_svg, despls, passi_a) {
    this.obj_ninots = obj_ninots; // Objecte Ninots on quedarà lligat aquest ninot
    this.id_ninot = p_id; // enter identificador de ninots
    this.tipus = (tipus === undefined ? 'defensa' : tipus); //tipus de ninot
    this.despls = (despls === undefined ? [] : despls); // desplaçaments que fa el ninot
    this.passi_a = passi_a;
    [this.x, this.y] = this.obj_ninots.to_coords_pista(coords_svg); // guardem les coordenades de pista
    this.coords_svg = coords_svg;
    this.fletxa_scala = [this.obj_ninots.scalax, this.obj_ninots.scalay]; // guardem l'escala actual
    
    var tmpl = Ninots.ninots_tmpl[this.tipus];
    this.es_mou = tmpl.es_mou;
    this.tipus_cami = tmpl.tipus_cami;
    
    this.dibuixa_fletxa();
    if (this.passi_a !== undefined)
        this.dibuixa_passi();    
}

Ninots.Ninot.prototype.get_coords_svg = function() {
    return this.obj_ninots.to_coords_svg([this.x, this.y]);
}

Ninots.Ninot.prototype.dibuixa_fletxa = function() {
    var svg = this.obj_ninots.svg_ninots;
    var coords_svg = this.get_coords_svg();
    this.ninot = Ninots.ninots_tmpl[this.tipus].dibuixa(coords_svg, svg);
    this.ninot.dataset.id_ninot = this.id_ninot;
    this.fletxa = Ninots.createPath(svg, 'black','2px');
    this.fletxa.setAttributeNS(null, "d", Ninots.updateSplines(this.despls, this.obj_ninots));
    svg.appendChild(this.fletxa);
}

Ninots.Ninot.prototype.dibuixa_tir = function() {
    var svg = this.obj_ninots.svg_ninots;
    var inici_tir;
    var coords_cist = this.obj_ninots.get_coords_cistelles()[this.tira_a];
    var d_tir = "m4.9337-13.646v4.6246l6.2149 2.6977h-25.844v4.1108h30.471v-2.1016l12.538 5.4416-12.538 5.4416v-2.1016h-30.471v4.1108h25.844l-6.2149 2.6977v4.6246l29.649-13.18v-3.1858l-29.649-13.18";
    if (this.despls instanceof Array && this.despls.length > 0) {
        inici_tir = this.obj_ninots.to_coords_svg(this.despls[this.despls.length - 1]);
    } else {
        inici_tir = this.get_coords_svg();
    }        
    if (this.tir !== undefined)
        this.tir.remove();
    this.tir = Ninots.createPath(svg, 'black', '2px');
    this.tir.setAttributeNS(null, 'd', "M "+inici_tir[0]+","+inici_tir[1]+" "+d_tir);
    this.tir.setAttribute('transform', 'rotate('+Ninots.angle_entre_punts(inici_tir, coords_cist)+','+inici_tir[0]+","+inici_tir[1]+')');
    svg.appendChild(this.tir);
}
Ninots.Ninot.prototype.dibuixa_passi = function() {
    var svg = this.obj_ninots.svg_ninots;
    var inici_passi = this.get_coords_svg();
    var passi_a = this.obj_ninots.ninots.llista[this.passi_a.id_ninot];
    var fi_passi;
    if (passi_a.despls instanceof Array && passi_a.despls.length > 0) {
        fi_passi = this.obj_ninots.to_coords_svg(passi_a.despls[passi_a.despls.length - 1]);
    } else {
        fi_passi = this.obj_ninots.ninots.llista[this.passi_a.id_ninot].get_coords_svg();
    }    
    fi_passi = Ninots.trobar_punt_anterior_fi(inici_passi, fi_passi, 10);
    if (this.passi) {
        this.passi.remove();
    }
    this.passi = Ninots.createPath(svg, 'black', '2px');
    this.passi.setAttributeNS(null, 'stroke-dasharray', '4');
    this.passi.setAttributeNS(null, 'd', "M "+inici_passi[0]+","+inici_passi[1]+" "+fi_passi[0]+","+fi_passi[1]);
    svg.appendChild(this.passi);
}
/**
* Redimensiona el ninot i la seva acció.
*/
Ninots.Ninot.prototype.resize = function() {
    var d = this.ninot.getAttributeNS(null, 'd');
    var p = this.get_coords_svg();
    d = 'M'+p[0]+','+p[1]+'\n'+d.split('\n')[1];
    this.ninot.setAttributeNS(null, 'd', d);
    var fsx = this.obj_ninots.scalax / this.fletxa_scala[0];
    var fsy = this.obj_ninots.scalay / this.fletxa_scala[1];
    this.fletxa.style.transform = 'scale('+fsx+','+fsy+')';
    
    if (this.passi_a) {
        this.dibuixa_passi();
    }
    if (this.tira_a) {
        this.dibuixa_tir();
    }
}


