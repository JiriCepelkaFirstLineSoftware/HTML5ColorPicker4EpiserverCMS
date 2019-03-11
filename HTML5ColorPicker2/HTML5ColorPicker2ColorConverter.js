let HTML5ColorPicker2ColorConverter = {  

  // See also http://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/.
  // Returns [h,s,l].
  getHslFromRgb: function (r, g, b) {
    let normR = r / 255;
    let normG = g / 255;
    let normB = b / 255;
    let minValue = Math.min(normR, normG, normB);
    let maxValue = Math.max(normR, normG, normB);
    let light = (minValue + maxValue) / 2;
    let saturation = 0;
    let hue = 0;

    if (minValue !== maxValue) {
      saturation = light < 0.5 ? (maxValue - minValue) / (maxValue + minValue) : (maxValue - minValue) / (2 - maxValue - minValue);

      if (maxValue === normR) { hue = (normG - normB) / (maxValue - minValue); }
      if (maxValue === normG) { hue = 2 + (normB - normR) / (maxValue - minValue); }
      if (maxValue === normB) { hue = 4 + (normR - normG) / (maxValue - minValue); }
    }

    return [(hue = hue * 60) < 0 ? hue + 360 : hue, saturation * 100, light * 100];
  },

   // See also https://www.w3.org/TR/2011/REC-css3-color-20110607/#hsl-color.
  // Returns [r,g,b].
  getRgbFromHsl: function (h, s, l) {
    let m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
    let m1 = l * 2 - m2;

    let r = hue2Rgb(m1, m2, h + 1 / 3) * 255;
    let g = hue2Rgb(m1, m2, h) * 255;
    let b = hue2Rgb(m1, m2, h - 1 / 3) * 255;

    return [Math.ceil(r), Math.ceil(g), Math.ceil(b)];

    function hue2Rgb(m1, m2, h) {
      if (h < 0) { h = h + 1; }
      if (h > 1) { h = h - 1; }
      if (h * 6 < 1) { return m1 + (m2 - m1) * h * 6; }
      if (h * 2 < 1) { return m2; }
      if (h * 3 < 2) { return m1 + (m2 - m1) * (2 / 3 - h) * 6; }

      return m1;
    }
  },
}