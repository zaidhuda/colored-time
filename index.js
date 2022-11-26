$(function () {
  function rgbToHex(rgb) {
    return (
      '#' +
      ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)
    );
  }

  function randomMode() {
    var modes = ['hms', 'hsm', 'mhs', 'msh', 'shm', 'smh'];
    return modes[parseInt(Math.random() * (modes.length - 1))];
  }

  function getMode() {
    var mode = window.location.hash.replace('#', '');

    if (!mode.match(/\b(([hms])(?!.*\2))+\b/)) {
      mode = randomMode();
      window.location.hash = mode;
    }

    return mode;
  }

  function timeToRGB(timeRgb, mode) {
    mode = mode.split('');

    return {
      r: timeRgb[mode[0]],
      g: timeRgb[mode[1]],
      b: timeRgb[mode[2]],
    };
  }

  function setContrast(rgb) {
    var o = Math.round(
      (parseInt(rgb.r) * 299 + parseInt(rgb.g) * 587 + parseInt(rgb.b) * 114) /
        1000
    );
    var fore = o > 128 ? '#222' : '#eee';
    $('body').css('color', fore);
  }

  function refresh(mode) {
    var d = new Date(),
      h = d.getHours(),
      m = d.getMinutes(),
      s = d.getSeconds(),
      timeRgb = {
        h: parseInt((h / 24) * 255),
        m: parseInt((m / 60) * 255),
        s: parseInt((s / 60) * 255),
      },
      color = timeToRGB(timeRgb, mode),
      hex = rgbToHex(color);

    if (h.toString().length < 2) {
      h = '0' + h;
    }
    if (m.toString().length < 2) {
      m = '0' + m;
    }
    if (s.toString().length < 2) {
      s = '0' + s;
    }

    var time = h + ':' + m + ':' + s;
    $('#hex').html(hex.toUpperCase());
    $('#time').html(time);
    $('body').css('background-color', hex);
    setContrast(color);
  }

  function initialize() {
    refresh(getMode());
    setInterval(function () {
      refresh(getMode());
    }, 1000);
  }

  initialize();

  $('.mode-selector').on('click', function () {
    $('.mode-selector').removeClass('active');
    $(this).addClass('active');
    refresh(getMode());
  });

  $('#displayToggle').on('click', function () {
    $(this).html($(this).html() == 'hex' ? 'time' : 'hex');
    $('#time').toggle();
    $('#hex').toggle();
  });

  $('#graphLink').on('click', function (e) {
    e.preventDefault();
    const mode = getMode();
    window.open('/graph#' + mode, mode);
  });

  $(window.location.hash).addClass('active');
});
