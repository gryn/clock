// Set a clock.
// Options may be:
//   minute: selector, minute element
//   hour: selector, hour element
//   date: date, the time to show on the clock
//   time: string, an absolute or relative time to set the clock
//         e.g. "3:00am", "+1:15", "16:30"
// If a second set of options are passed,
// the clock is animated from it's last position to the new position.
// The second set of options are passed to the animation call.
// It's recommended to use date or relative time interfaces when animating,
// to allow for more precise control the direction of animation.
// (i.e. setting minute+hour or absolute time will always be setting within one 24 hour period).

// NOTE: Requires jquery.svgRotate.js to apply rotation,
// checks for jquery.dateAnimate.js to apply text updates as well
// (on .date elements).
// or you may supply a 'rotateProperty' option
// or a 'rotateBuilder' option to specify a different way to rotate.
// e.g. rotating DOM elements with https://github.com/louisremi/jquery.transform.js :
// $('div').clock({
//   time: '3:00PM',
//   rotateBuilder: function(a) {
//     return {transform: 'rotate('+a+'deg)'};}});

// SVG based example:
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

// $('svg').clock({date: new Date()});
// setInterval(function() {
//   $('svg').clock({time: '+0:1'}, {duration: 800});
// },1000);

$.fn.clock = function(options, animateOptions) {
  options = $.extend({}, options, $.fn.clock.defaults);
  
  this.each(function(i, el) {
    var $minute = $(el).find(options.minute);
    var $hour = $(el).find(options.hour);
    var $date = $.cssHooks.date ?
      $(el).find(options.dateEl) :
      $();
    
    var lastDate = $.data(el, 'clock');
    
    // get/parse date from options,
    // also set lastDate to default value if not set.
    var date = null;
    if(options.date) {
      date = options.date;
      lastDate = lastDate || date;
    } else {
      lastDate = lastDate || new Date();
      date = new Date(lastDate);
      date.setSeconds(0);

      var hour = options.hour || 0;
      var minute = options.minute || 0;

      if(options.time) {
        var parts = /(\+|-)? *(\d+) *: *(\d+) *(AM|PM)?/i.exec(options.time);
        if(!parts)
          throw 'Cannot parse time: "'+options.time+'"';

        hour = parseFloat(parts[2]);
        minute = parseFloat(parts[3]);

        // 12 hour time instead of 24
        if(parts[4]) {
          if(hour == 12)
            hour -= 12;

          if(parts[4].toUpperCase() == 'PM')
            hour += 12;
        }

        // relative time
        if(parts[1]) {
          if(parts[1] == '-') {
            hour = -hour;
            minute = -minute;
          }

          date = new Date(+date +
            (hour*60 + minute)*60*1000);

        // absolute time
        } else {
          date.setHours(hour);
          date.setMinutes(minute);
        }
      }
    }
    $.data(el, 'clock', date);
    
    // fix timezone
    var zoneAdjust = date.getTimezoneOffset()*60*1000;
    
    var minuteAngle = (date-zoneAdjust)/1000/60/60 * 360;
    var hourAngle = minuteAngle/12;
    var lastMinuteAngle = (lastDate-zoneAdjust)/1000/60/60 * 360;
    var lastHourAngle = lastMinuteAngle/12;

    // distance needed for animation
    var minuteDistance = minuteAngle - lastMinuteAngle;
    var hourDistance = hourAngle - lastHourAngle;

    // restrict angle to 0-360 (large numbers break svg)
    minuteAngle %= 360;
    hourAngle %= 360;
    lastMinuteAngle %= 360;
    lastHourAngle %= 360;
    
    if(animateOptions) {
      console.log('beginning', lastDate, date);
      $minute.
        css( options.rotateBuilder(lastMinuteAngle) ).
        animate(
          options.rotateBuilder(lastMinuteAngle + minuteDistance),
          animateOptions );
      $hour.
        css( options.rotateBuilder(lastHourAngle) ).
        animate(
          options.rotateBuilder(lastHourAngle + hourDistance),
          animateOptions );
      $date.
        css({ date: lastDate }).
        animate({ date: date }, animateOptions);
    } else {
      console.log('setting', date);
      $minute.css( options.rotateBuilder(minuteAngle) );
      $hour.css( options.rotateBuilder(hourAngle) );
      $date.css({ date: date });
    }

    function _rotate(angle) {
    }
  });
  return this;
}
$.fn.clock.defaults = {
  minute: '.minute',
  hour: '.hour',
  dateEl: '.date',
  rotateProperty: 'svgRotate',
  rotateBuilder: function(angle) {
    var obj = {};
    obj[this.rotateProperty] = angle;
    return obj;
  }
}


