// updates text to a date passed
// requires https://github.com/phstc/jquery-dateFormat

// Example usage:
// <span class="date">
//   <span data-format="dd"></span> /
//   <span data-format="MM"></span> /
//   <span data-format="yyyy"></span> at
//   <span data-format="hh"></span
//   >:<span data-format="mm"></span
//   >:<span data-format="ss">
// </span>

// You may also use conglomerated formats:
// <span class="date" date-format="dd/MM/yyyy"></span>
// or
// <span class="date">
//   <span date-format="dd/MM/yyyy"></span><br>
//   <span date-format="hh:mm:ss"></span>
// </span>

//$('.date').css({date: new Date()});
//$('.date').animate({date: new Date(+new Date() + 1*60*60*1000 )}, 1000); // add an hour

$.cssHooks.date = {
  get: function(el) {
    var date = $.data(el, 'date');
    if(typeof date == 'number') return date;
    return +new Date();
  },
  set: function(el, val) {
    var date = typeof val == 'object' ?
      val :
      new Date(parseInt(val));
    $.data(el, 'date', +date);

    $(el).find('[data-format]').andSelf().each(function() {
      var format = $(this).data('format');
      if(!format) return;

      $(this).text( $.format.date(date, format) );
    });
  }
}
