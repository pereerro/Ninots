/**
 *
 * @source: https://capassumptes.com/ninots/ninots_fantasmes.js
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

ninots_abans_phantom = Ninots;

Ninots = function(svg, data) {
    ninots_abans_phantom.prototype.constructor(svg, data);
    for (k in ninots_abans_phantom.prototype) {
        if (ninots_abans_phantom.prototype.hasOwnProperty(k))
            this[k] = ninots_abans_phantom.prototype[k];
    }    
    this.mouNinots = setInterval(Ninots.mouPhantoms, 40, this);
}

for (k in ninots_abans_phantom) {
    if (ninots_abans_phantom.hasOwnProperty(k))
        Ninots[k] = ninots_abans_phantom[k];
}

Ninots.prototype.startPhantoms = function() {
    this.stopPhantoms();
    this.mouNinots = setInterval(Ninots.mouPhantoms, 40, this);
}

Ninots.prototype.stopPhantoms = function() {
    if (this.mouNinots !== undefined)
        clearInterval(this.mouNinots);
    for (var k in this.ninots.llista) {
        var ninot = this.ninots.llista[k];
        if (ninot.phantom !== undefined) {
            ninot.phantom.remove();
            ninot.phantom = undefined;
        }
    }
}

Ninots.mouPhantoms = function(self_ninots, anim) {
    // TODO: revisar millora amb https://bl.ocks.org/mbostock/1705868 o https://css-tricks.com/svg-line-animation-works/
    if (anim !== undefined)
        self_ninots.anim = anim;
    if (self_ninots.anim === undefined)
        self_ninots.anim = 0;
    for (var k in self_ninots.ninots.llista) {
        var ninot = self_ninots.ninots.llista[k];
        if (ninot.es_mou)
            ninot.posaPhantom(self_ninots.anim);
    }
    self_ninots.anim ++;
    if (self_ninots.anim >= 100)
        self_ninots.anim = 0;
}    

Ninots.Ninot.prototype.ninots_ninot_resize_abans_phantom = Ninots.Ninot.prototype.resize;

Ninots.Ninot.prototype.resize = function() {
    this.ninots_ninot_resize_abans_phantom();
    var d = this.ninot.getAttributeNS(null, 'd');
    if (this.phantom !== undefined)
        this.phantom.setAttributeNS(null, 'd', d);    
}

Ninots.Ninot.prototype.ninots_ninot_esborra_abans_phantom = Ninots.Ninot.prototype.esborra;

Ninots.Ninot.prototype.esborra = function() {
    this.ninots_ninot_esborra_abans_phantom();
    if (this.phantom instanceof SVGPathElement)
        this.phantom.remove();    
}


Ninots.Ninot.prototype.posaPhantom = function(percentatge) {
    if (isNaN(this.x) || isNaN(this.y)) return;
    var coords_svg = this.obj_ninots.to_coords_svg([this.x, this.y]);
    if ( this.phantom === undefined || this.phantom.tagName !== 'path' ) {
        this.phantom = this.tmpl.dibuixa(coords_svg, this.obj_ninots.svg_ninots, 'ninots_phantom');            
    }
    var tl = this.fletxa.getTotalLength();
    var l = tl * percentatge / 100;

    var p = this.fletxa.getPointAtLength(l);
    var [dx, dy] = [p.x - coords_svg[0], p.y - coords_svg[1]];

    // calcula rotacio i guarda rotacio inicial
    var rot = 0;
    if (percentatge == 0) {
        if (this.phantom_rotini !== undefined) {
            rot = this.phantom_rotini;
        }
    } else {
        if (! ( isNaN(this.phantom_x) || isNaN(this.phantom_y)) )
            rot = Ninots.angle_entre_punts([this.phantom_x, this.phantom_y], [dx, dy]) * Math.PI / 180 + Math.PI / 2;
        if (percentatge == 1) {
            this.phantom_rotini = rot;
        }
    }
    [this.phantom_x, this.phantom_y] = [dx, dy]; // guarda per calcular següent rotació

    if (! isNaN(this.phantom_rotini)) {
        this.ninot.setAttribute('transform', 'rotate('+(this.phantom_rotini * 180 / Math.PI)+','+coords_svg[0]+','+coords_svg[1]+')');
    }
    if (! isNaN(rot)) 
        this.phantom.setAttribute('transform', 'rotate('+(rot * 180 / Math.PI)+','+p.x+','+p.y+') translate('+dx+','+dy+')');
    else
        this.phantom.setAttribute('transform', 'translate('+dx+','+dy+')');
    if ( ! (this.phantom.parentElement instanceof SVGElement))
        this.obj_ninots.svg_ninots.appendChild(this.phantom);
}
