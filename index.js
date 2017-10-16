$(function() {
  function rgbToHex(rgb) {
    return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
  }

  function randomMode() {
    var modes = ['rgb', 'rbg', 'grb', 'gbr', 'brg', 'bgr'];
    return modes[parseInt(Math.random()*(modes.length-1))]
  }

  function getMode() {
    var mode = window.location.hash.replace('#', '')

    if (!mode.match(/\b(([rgb])(?!.*\2))+\b/)) {
      mode = randomMode();
      window.location.hash = mode
    }
    console.log(mode)
    return mode;
  }

  function rgbMode(rgb, mode) {
    mode = mode.split('')

    return {
      r: rgb[mode[0]],
      g: rgb[mode[1]],
      b: rgb[mode[2]]
    };
  }

  function setContrast(rgb) {
    var o = Math.round(((parseInt(rgb[0]) * 299) +
                        (parseInt(rgb[1]) * 587) +
                        (parseInt(rgb[2]) * 114)) / 1000);
    var fore = (o > 125) ? '#222' : '#ddd';
    $('body').css('color', fore); 
  }

  function refresh(mode) {
    var d = new Date(),
        h = d.getHours(),
        m = d.getMinutes(),
        s = d.getSeconds(),

        rgb = {
          r: parseInt(h/24*255),
          g: parseInt(m/60*255),
          b: parseInt(s/60*255)
        },
        color = rgbMode(rgb, mode),
        hex = rgbToHex(color);

    if (h.toString().length < 2) { h = '0' + h }
    if (m.toString().length < 2) { m = '0' + m }
    if (s.toString().length < 2) { s = '0' + s }

    var time = h +":"+ m +":"+ s;
    $('#hex').html(hex.toUpperCase())
    $('#time').html(time)
    $('body').css('background-color', hex)
    setContrast(color)
  }

  function initialize() {
    refresh(getMode());
    setInterval(function(){
      refresh(getMode())
    }, 1000);
  }

  initialize();

  $('.mode-selector').on('click', function() {
    refresh(getMode())
  })

  $('#displayToggle').on('click', function() {
    $(this).html( $(this).html() == 'hex' ? 'time' : 'hex')
    $('#time').toggle();
    $('#hex').toggle();
  })
})