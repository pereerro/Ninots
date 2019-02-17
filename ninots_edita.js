/**
 *
 * @source: https://capassumptes.com/ninots/ninots_edita.js
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

/* eslint-env browser */
/* global Ninots */

/* Afegeix un nou ninot a la llista de tipus amb un identificador no repetit */
Ninots.prototype.nouNinot = function(p_coords_svg) {

    var tipus_ninot = this.ninot_actiu.dataset.nom_ninot;
    var coords_svg = p_coords_svg;
    this.ninots.darrer_id = this.ninots.darrer_id + 1;

    var dninot = new Ninots.Ninot(this, this.ninots.darrer_id, tipus_ninot, coords_svg);

    this.ninots.llista[this.ninots.darrer_id] = dninot;
    return dninot;
}

Ninots.prototype.engega_ninot = function(nom_ninot) {
    if (this.ninot_actiu) 
        this.ninot_actiu.classList.remove('templ_selec');
    this.ninot_actiu = this.ninots_mostra[nom_ninot];
    this.ninot_actiu.classList.add('templ_selec');
}

Ninots.prototype.dibuixa_ninots_tmpl = function() {
    var x=20,y=20;
    for (var k in Ninots.ninots_tmpl) {
        var ninot_tmpl = Ninots.ninots_tmpl[k];
        var ninot = Ninots.dibuixa_ninots([x,y],this.svg_ninots,ninot_tmpl.tipus);
        ninot.style.stroke = 'rgb(0,0,0)';
        ninot.style.strokeWidth = '1';

        this.ninots_mostra[ninot_tmpl.tipus] = ninot;
        y += 40;
    }
}

Ninots.prototype.esborra_ninots_tmpl = function() {
    for (var k in this.ninots_mostra) {
        this.ninots_mostra[k].ninot_mostra.remove();
        this.ninots_mostra[k].ninot_mostra = null;
    }
}

Ninots.captured_events = ['mousedown','mousemove','mouseup','touchstart','touchmove','touchend'];

Ninots.prototype.activa_edicio_esquema = function() {
    this.ninots_mostra = {};
    if (this.pistaHandler === undefined)
        this.pistaHandler = new Ninots.PistaHandler(this);
    Ninots.captured_events.forEach(function(et) {
        this.svg_ninots.addEventListener(et, this.pistaHandler);
    }, this);
    this.dibuixa_ninots_tmpl();
    this.engega_ninot('defensa');
}

Ninots.prototype.desactiva_edicio_esquema = function() {
    Ninots.captured_events.forEach(function(et) {
        this.svg_ninots.removeEventListener(et, this.pistaHandler);
    }, this);
    this.esborra_ninots_tmpl();
}

Ninots.Ninot.prototype.esborra = function() {
    this.esborrat = true;
    this.ninot.remove();
    this.fletxa.remove();

    var llista = this.obj_ninots.ninots.llista;
    for (var k in llista) {
        if (llista[k].passi_a !== undefined && llista[k].passi_a === this) {
            llista[k].passi.remove();
            llista[k].passi_a = undefined;
        }
    }

    if (this.tira_a !== undefined) {
        this.tir.remove();
        this.tira_a = undefined;
    }

}


Ninots.PistaHandler = function(ninots) {
    this.ninots = ninots;
}

Ninots.PistaHandler.prototype.treuCoords = function(ev) {
    return [ev.clientX - Ninots.getOffset(this.ninots.svg_ninots).left, 
            ev.clientY - Ninots.getOffset(this.ninots.svg_ninots).top];
}

Ninots.PistaHandler.prototype.afegeixPunt = function (ev) {
    var ninot_self = this.ninots;

    if (ev !== undefined) {
        /*SVG positions are relative to the element but mouse 
	  positions are relative to the window, get offset*/
        ninot_self.movent_ninot_xy = this.treuCoords(ev);
    }
    if (ninot_self.movent_ninot_xy === undefined)
        return;

    this.posant_ninot.despls.push(ninot_self.to_coords_pista(ninot_self.movent_ninot_xy));
    var d = Ninots.updateSplines(this.posant_ninot.despls, ninot_self);
    this.fletxa_movent.setAttributeNS(null, "d", d);

    var llista = this.ninots.ninots.llista;
    for (var k in llista) {
        if (llista[k].passi_a === this.posant_ninot) {
            llista[k].passi.remove();
            llista[k].dibuixa_passi();
        }
    }

    if (this.posant_ninot.tira_a) {
        this.posant_ninot.dibuixa_tir();
    }
}

Ninots.PistaHandler.prototype.ninot_mes_proper = function(toc, filtre) {
    if (filtre === undefined) filtre = 'per_seleccionar';

    var ninot_selec, distc;
    if (filtre === 'poden_rebre') {
        var coords_cists = this.ninots.get_coords_cistelles();
        var distc1 = Ninots.dist_entre_punts(toc, coords_cists.cistella1);
        var distc2 = Ninots.dist_entre_punts(toc, coords_cists.cistella2);
        if (distc1 < distc2) {
            ninot_selec = 'cistella1';
            distc = distc1;
        } else {
            ninot_selec = 'cistella2';
            distc = distc2;
        }
    } else {
        distc = 10000;
    }
    
    var llista = this.ninots.ninots.llista;
    for (var k1 in llista) {
        var dninot = llista[k1];
        if (dninot.esborrat)
            continue;
        var coords_svg = dninot.get_coords_svg();
        var dist = Ninots.dist_entre_punts(toc, coords_svg);
        if (dist < distc) {
            ninot_selec = llista[k1];
            distc = dist;
        }
    }

    if (filtre === 'per_seleccionar')
        for (var k2 in this.ninots.ninots_mostra) {
            var nt = this.ninots.ninots_mostra[k2];
            var d = nt.getAttribute('d');
            var idx = d.indexOf('\n');
            var tmpl_coords = d.substring(1,idx).split(',').map(Number); // hint https://developer.mozilla.org/ca/docs/Web/JavaScript/Referencia/Objectes_globals/Array/map
            var distt = Ninots.dist_entre_punts(toc, tmpl_coords);
            if (distt < distc) {
                ninot_selec = k2;
                distc = distt;
            }
        } 
    return ninot_selec;
}

Ninots.PistaHandler.prototype.selecciona_ninot = function(dninot) {
    if (this.ninot_selec) {
        this.ninot_selec.ninot.classList.remove('ninot_selec_class');
    }
    this.ninot_selec = dninot;

    this.ninot_selec.ninot.classList.add('ninot_selec_class');
    this.ninot_selec_stop = true;
    console.log('Inicia timer de seleccio');
    if (this.ninot_selec_timer) {
        clearInterval(this.ninot_selec_timer);
    }
    this.ninot_selec_timer = setInterval(Ninots.PistaHandler.acabaSeleccio,800,this);
}

Ninots.PistaHandler.acabaSeleccio = function(ph) {
    if ( ph.ninot_selec && ph.ninot_selec_stop ) {
        ph.ninot_selec.ninot.classList.remove('ninot_selec_class');
        console.log('Acaba timer de seleccio'); 
        clearInterval(ph.ninot_selec_timer);
        ph.ninot_selec = undefined;    
        ph.toc = ph.toc2 = undefined;
    }
}

Ninots.PistaHandler.iniciaNinot = function(ph) {
    console.log('Entrem a inicia ninot!');
    var coords_svg = ph.toc;
    ph.toc = ph.toc2 = undefined;
    var ninot_self = ph.ninots;
    var dninot;
    if ( ph.ninot_selec !== undefined ) {
        ninot_self.movent_ninot_xy = ph.ninot_selec.coords_svg;
        ph.ninot_selec.despls = [];
        dninot = ph.ninot_selec;        
    } else {
        dninot = ninot_self.nouNinot(coords_svg);
        ninot_self.movent_ninot_xy = coords_svg;
    }
    ph.posant_ninot = dninot;
    if (dninot.es_mou) {
        ph.fletxa_movent = dninot.fletxa;     
        ph.afegeixPunt();
        ph.posant_ninot_timer = setInterval(function(ph) {
            ph.afegeixPunt();
        }, 400, ph);
    }
}

Ninots.PistaHandler.prototype.handleEvent = function(ev) {
    ev.preventDefault();
    var ninot_self = this.ninots;

    switch (ev.type) {
        case "touchstart":
        case "mousedown":
            var coords = this.treuCoords(ev.type === 'touchstart' ? ev.touches[0] : ev);
            if (this.ninot_selec !== undefined) {
                // hi ha ninot seleccionat . Si mantenim pressionat, durant 200 ms, el movem
                this.toc2 = coords;
                this.toc_timer = setTimeout(Ninots.PistaHandler.iniciaNinot,200,this);
            } else {
                // guarda punt on es pressiona a la pista i engega timer per si es continua presionant, dibuixar ninot i el movem
                // en cas que aixequem abans que comenci iniciaNinot, anul·larem el toc_timer 
                this.toc = coords;
                this.toc_timer = setTimeout(Ninots.PistaHandler.iniciaNinot,200,this);
            }
            break;
        case "touchmove":
        case "mousemove":
            var event = ( ev.type === "touchmove" ? ev.touches[0] : ev );
            ninot_self.movent_ninot_xy = this.treuCoords(event);
            break;
        case "touchend":
        case "mouseup":
            if (this.toc2 !== undefined) {
                clearTimeout(this.toc_timer);
                var altre = this.ninot_mes_proper(this.toc2, 'poden_rebre');
                if (altre instanceof Ninots.Ninot) {
                    if (altre !== this.ninot_selec) {
                        console.log("Dibuixant passi de "+this.ninot_selec.id_ninot+" a "+altre.id_ninot);
                        this.ninot_selec.passi_a = altre;
                        this.ninot_selec.dibuixa_passi();
                    } else {
                        if (this.ninot_selec.passi_a !== undefined) {
                            console.log("Esborra passi de "+this.ninot_selec.id_ninot+" a "+this.ninot_selec.passi_a.id_ninot);
                            this.ninot_selec.passi.remove();
                            this.ninot_selec.passi = undefined;
                            this.ninot_selec.passi_a = undefined;
                        } else if (this.ninot_selec.tira_a !== undefined) {
                            console.log("Esborra tir de "+this.ninot_selec.id_ninot+" a "+this.ninot_selec.tira_a);
                            this.ninot_selec.tir.remove();
                            this.ninot_selec.tir = undefined;
                            this.ninot_selec.tira_a = undefined;
                        } else {
                            this.ninot_selec.esborra();
                        }
                    }
                } else {
                    // tir
                    this.ninot_selec.tira_a = altre;
                    this.ninot_selec.dibuixa_tir();
                }
                Ninots.PistaHandler.acabaSeleccio(this);
            } else if (this.toc !== undefined) { // s'ha aixecat la pressió abans de començar ninot
                clearTimeout(this.toc_timer);
                var mes_proper = this.ninot_mes_proper(this.toc);
                if (mes_proper instanceof Ninots.Ninot) {
                    this.selecciona_ninot(mes_proper);
                } else if (typeof mes_proper === 'string') {
                    this.ninots.engega_ninot(mes_proper);
                }
                this.toc = undefined;
            } else {
                if (this.posant_ninot.es_mou)
                    this.afegeixPunt();
                clearInterval(this.posant_ninot_timer);
                this.posant_ninot = null;
            }
            break;
    }
}
