/**
 *
 * @source: https://capassumptes.com/ninots/ninots_utilitats.js
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

Ninots.setAttributes = function(el, attrs) {
    for(var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

Ninots.get_segment = function(inici, fi, punts_abans) {
    var x = fi[0] - inici[0];
    var y = fi[1] - inici[1];
    var h = punts_abans / Math.pow(Math.pow(x,2) + Math.pow(y,2), 1/2);
    var p1 = [inici[0] + x*h, inici[1] + y*h];
    var p2 = [fi[0] - x*h, fi[1] - y*h];
    return [p1, p2]; // TODO
}

Ninots.getOffset = function( el ) {
    var b = el.getBoundingClientRect();
    return { top: b.y, left: b.x, };
}

Ninots.dist_entre_punts = function(p1, p2) {
    return Math.pow(Math.pow(p1[0] - p2[0],2) + Math.pow(p1[1] - p2[1], 2), 1/2);
}

Ninots.angle_entre_punts = function(p1,p2) {
    var c_contigu = p2[0] - p1[0];
    var c_oposat = p2[1] - p1[1];
    var ret = Math.atan(c_oposat / c_contigu) * 180 / Math.PI;
    if ( p2[0] - p1[0] < 0 )
        ret = ret +180;
    return ret
}

Ninots.getTransform = function(bbox1, bbox2) {
    var scaleW = bbox2.width / bbox1.width;
    var scaleH = bbox2.height / bbox1.height;
    var transX = (bbox2.x - bbox1.x) * scaleW;
    var transY = (bbox2.y - bbox1.y) * scaleH;
    return "translate(" + transX + "px," + transY + "px) scale(" + scaleW + "," + scaleH + ")";    
}

/*creates and adds an SVG path without defining the nodes*/
Ninots.createPath = function(svg, color,width)
{	
    color = (color === undefined ? "black" : color);
    width = (typeof width == 'undefined' ? "4px" : width);

    var P=document.createElementNS('http://www.w3.org/2000/svg',"path");
    P.setAttributeNS(null,"fill","none");
    P.setAttributeNS(null,"stroke",color);
    P.setAttributeNS(null,"stroke-width",width);
    P.setAttributeNS(null,'marker-end', 'url(#despls_ninots_fletxa)');
    svg.appendChild(P)
    return P
}

/*computes spline control points*/
Ninots.updateSplines = function(despls, obj_with_to_coords_svg_funct)
{	
    var obj = obj_with_to_coords_svg_funct;
    var cad = '';

    if (despls.length === 2) {
        var p1 = obj.to_coords_svg(despls[0]);
        var p2 = obj.to_coords_svg(despls[1]);
        cad = "M "+p1[0]+" "+p1[1]+" "+p2[0]+" "+p2[1];
    } else {

        /*grab (x,y) coordinates of the control points*/
        var x=new Array();
        var y=new Array();
        var i;

        for (i=0;i<despls.length;i++)
        {
            var p = obj.to_coords_svg(despls[i]);
            /*use parseInt to convert string to int*/
            x[i]=p[0];
            y[i]=p[1];
        }

        /*computes control points p1 and p2 for x and y direction*/
        var px = computeControlPoints(x);
        var py = computeControlPoints(y);

        for (i=0;i<despls.length-1;i++) {
            cad += path(x[i],y[i],px.p1[i],py.p1[i],px.p2[i],py.p2[i],x[i+1],y[i+1]) + '\n';
        }
    }
    return cad;
}

/*creates formated path string for SVG cubic path element*/
function path(x1,y1,px1,py1,px2,py2,x2,y2)
{
    return "M "+x1+" "+y1+" C "+Math.round(px1)+" "+Math.round(py1)+" "+Math.round(px2)+" "+Math.round(py2)+" "+x2+" "+y2;
}

/*computes control points given knots K, this is the brain of the operation*/
function computeControlPoints(K)
{
    var p1 = new Array();
    var p2 = new Array();
    var n = K.length-1;

    /*rhs vector*/
    var a = new Array();
    var b = new Array();
    var c = new Array();
    var r = new Array();

    /*left most segment*/
    a[0]=0;
    b[0]=2;
    c[0]=1;
    r[0] = K[0]+2*K[1];

    var i; // contador
    /*internal segments*/
    for (i = 1; i < n - 1; i++)
    {
        a[i]=1;
        b[i]=4;
        c[i]=1;
        r[i] = 4 * K[i] + 2 * K[i+1];
    }

    /*right segment*/
    a[n-1]=2;
    b[n-1]=7;
    c[n-1]=0;
    r[n-1] = 8*K[n-1]+K[n];

    /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
    for (i = 1; i < n; i++)
    {
        var m = a[i]/b[i-1];
        b[i] = b[i] - m * c[i - 1];
        r[i] = r[i] - m*r[i-1];
    }

    p1[n-1] = r[n-1]/b[n-1];
    for (i = n - 2; i >= 0; --i)
        p1[i] = (r[i] - c[i] * p1[i+1]) / b[i];

    /*we have p1, now compute p2*/
    for (i=0;i<n-1;i++)
        p2[i]=2*K[i+1]-p1[i+1];

    p2[n-1]=0.5*(K[n]+p1[n-1]);

    return {p1:p1, p2:p2};
}

