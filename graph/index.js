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

function getTextColor(rgb) {
  var o = Math.round(
    (parseInt(rgb.r) * 299 + parseInt(rgb.g) * 587 + parseInt(rgb.b) * 114) /
      1000
  );
  return o > 128 ? `rgb(0, 0, 0, 0.75)` : `rgb(255, 255, 255, 0.75)`;
}

function zeroPad(num) {
  return num.toString().length < 2 ? `0${num}` : num;
}

function refresh(mode) {
  const canvas = document.getElementById('canvas');

  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const height = 1800 / 24;

    for (var h = 0; h < 24; h++) {
      const y = h * height;
      for (var m = 0; m < 60; m++) {
        for (var s = 0; s < 60; s++) {
          const x = m * 60 + s;
          const timeRgb = {
            h: parseInt((h / 24) * 255),
            m: parseInt((m / 60) * 255),
            s: parseInt((s / 60) * 255),
          };
          const color = timeToRGB(timeRgb, mode);
          const hex = rgbToHex(color);

          ctx.strokeStyle = hex;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + height);
          ctx.stroke();

          if (s === 59) {
            ctx.font = '16px monospace';
            ctx.fillStyle = getTextColor(
              timeToRGB({ ...timeRgb, s: parseInt((15 / 60) * 255) }, mode)
            );
            ctx.fillText(zeroPad(h), x - 56, y + 16);
            ctx.fillText(zeroPad(m), x - 56, y + 32);
          }
        }
      }
    }
  }
}

function initialize() {
  const canvas = document.getElementById('canvas');

  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    ctx.canvas.width = 3600;
    ctx.canvas.height = 1800;
  }

  refresh(getMode());
}

initialize();
