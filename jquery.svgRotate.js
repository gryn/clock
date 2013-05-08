// updates the rotate transform value of an SVG element,
// preserves other transformations that may be present.
// (only affects first rotate found).

// Example usage:
// <svg width=300 height=300 viewbox="0 0 100 100">
//   <path d="M 50 5 v -1" transform="rotate(0, 50, 50)" class="tick"/>
//   <path d="M 50 5 v -1" transform="rotate(30, 50, 50)" class="tick"/>
//   <path d="M 50 5 v -1" transform="rotate(60, 50, 50)" class="tick"/>
//   <path d="M 50 5 v -1" transform="rotate(90, 50, 50)" class="tick"/>
//   <path d="M 50 5 v -1" transform="rotate(120, 50, 50)" class="tick"/>
//   <path d="M 50 5 v -1" transform="rotate(150, 50, 50)" class="tick"/>
//   <path d="M 50 5 v -1" transform="rotate(180, 50, 50)" class="tick"/>
//   <path d="M 50 5 v -1" transform="rotate(210, 50, 50)" class="tick"/>
//   <path d="M 50 5 v -1" transform="rotate(240, 50, 50)" class="tick"/>
//   <path d="M 50 5 v -1" transform="rotate(270, 50, 50)" class="tick"/>
//   <path d="M 50 5 v -1" transform="rotate(300, 50, 50)" class="tick"/>
//   <path d="M 50 5 v -1" transform="rotate(330, 50, 50)" class="tick"/>
//   <path d="M 50 50 v -25" transform="rotate(0, 50, 50)" class="hour"/>
//   <path d="M 50 50 v -45" transform="rotate(0, 50, 50)" class="minute"/>
// </svg>

// svg * {
//     stroke: #000;
//     stroke-width: 1;
//     stroke-linecap: round;
// }

//$('.hour').css({svgRotate: {angle: 0, centerX: 50, centerY: 50}});
//$('.minute').css({svgRotate: {angle: 0, centerX: 50, centerY: 50}});
//$('.hour').animate({svgRotate: 360}, 100);
//$('.minute').animate({svgRotate: 360*12}, 10000);

$.cssHooks.svgRotate = {
  get: function(el) {
    var raw = el.getAttribute('transform');
    var val = /rotate\((\d+)/.exec(raw);
    return val ?
      val[1] :
      0;
  },
  set: function(el, val) {
    var raw = el.getAttribute('transform');
    var parts = /rotate\(([\s]*[^,\s]+)[,\s]*([^,\s]+)?[,\s]*([^,\s]+)?[,\s]*\)/.exec(raw) || {};
    var angle = parts[1],
      centerX = parts[2],
      centerY = parts[3];
    var pre = "",
      post = "";
    if(typeof parts.index != 'undefined') {
      pre = raw.substring(0, parts.index);
      post = raw.substring(parts.index + parts[0].length);
    }
    if(typeof val == 'object') {
      if(typeof val.angle == 'number')
        angle = val.angle;
      if(typeof val.centerX == 'number')
        centerX = val.centerX;
      if(typeof val.centerY == 'number')
        centerY = val.centerY;
    } else {
      angle = parseFloat(val);
    }
    angle = angle || 0;
    centerX = centerX || 0;
    centerY = centerY || 0;
    el.setAttribute('transform',
      pre +
      'rotate('+angle+', '+centerX+', '+centerY+')' +
      post);
  }
}
