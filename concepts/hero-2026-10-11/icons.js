(function(){var S={
db:'<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
sheet:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M4 15h16M10 4v16"/>',
file:'<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
check:'<path d="m5 12 4.5 4.5L19 7"/>',
clock:'<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
search:'<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.5 0 4.5 1.8 4.5 4.5"/>',
school:'<path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6"/>',
factory:'<path d="M3 21V11l6 4v-4l6 4V5h6v16z"/>',
landmark:'<path d="M3 21h18M5 10h14M12 3 3 9h18zM7 10v8M12 10v8M17 10v8"/>',
home:'<path d="M4 11 12 4l8 7v9H4z"/><path d="M10 20v-6h4v6"/>',
heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>',
bag:'<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
bell:'<path d="M6 17V11a6 6 0 0 1 12 0v6l1.500 2h-15z"/><path d="M10 21h4"/>',
spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.500 2.500M15.500 15.500 18 18M18 6l-2.500 2.500M8.500 15.500 6 18"/>',
link:'<path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1"/><path d="M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1"/>',
chev:'<path d="m9 6 6 6-6 6"/>',
layers:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
chart:'<path d="M4 20V5M4 20h16M8 16v-4M12 16V8M16 16v-6"/>',
bookmark:'<path d="M7 4h10v16l-5-4-5 4z"/>',
send:'<path d="M4 12 20 4l-4 16-4-6z"/>',
box:'<path d="m3 7.500 9-4.500 9 4.500v9L12 21l-9-4.500z"/><path d="m3 7.500 9 4.500 9-4.500M12 12v9"/>',
inbox:'<path d="M4 13h4l1 3h6l1-3h4"/><path d="M5 5h14l2 8v6H3v-6z"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.600 5.600 7 7M17 17l1.400 1.400M18.400 5.600 17 7M7 17l-1.400 1.400"/>'
};
var h='<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">';
for(var k in S)h+='<symbol id="i-'+k+'" viewBox="0 0 24 24">'+S[k]+'</symbol>';
h+='</svg>';
document.body.insertAdjacentHTML('afterbegin',h);
window.ico=function(n,c){return '<svg class="ic '+(c||'')+'" aria-hidden="true"><use href="#i-'+n+'"/></svg>'};
})();
