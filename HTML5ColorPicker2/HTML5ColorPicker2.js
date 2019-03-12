define([
  "dojo/on",
  "dojo/_base/declare",
  "dojo/aspect",

  "epi/dependency",

  "dijit/focus",

  "dijit/_Widget",
  "dijit/_TemplatedMixin",  
],
  function (
    on,
    declare,
    aspect,

    dependency,

    focus,

    _Widget,
    _TemplatedMixin,    
  ) {
    return declare("alloy/Editors/HTML5ColorPicker2", [_Widget, _TemplatedMixin],
      {
        _slideCoefficient: 0,
        _x: 0,
        _y: 0,
        _moveSlideHandler: null,
        _finishMoveSlideHandler: null,

        templateString:
          "<div class=\"HTML5ColorPicker dijitInline\">\
             <div class=\"Control\" data-dojo-attach-point=\"HTML5ColorPickerControl\">\
               <div class=\"Needle\"></div>\
             </div>\
             <input type=\"color\" title=\"Color picker\" class=\"Picker\" data-dojo-attach-point=\"HTML5ColorPicker\">\
           </div>",

        postCreate: function () {

          this._loadCssFile();
          this._loadConverter();

          this._bindEvents(this);
        },

        _changed: function () {

          let vals = this._getVals();

          this.HTML5ColorPicker.value = vals[0];
          this.HTML5ColorPickerControl.style.backgroundColor = vals[0];
          this.HTML5ColorPickerControl.style.transform = "rotate(" + vals[2] + "deg)";
        },

        // Common setters

        _setValueAttr: function (value) {

          if (!value) { // Prop first init.

            value = "#888888,#888888,0,0";
          }

          this._set("value", value);
          this._changed();            
        },

        _setReadOnlyAttr: function (value) {
          this._set("readOnly", value);
        },

        _setValue: function (frontColor, backColor, angle, reportChange) {

          let newValue = frontColor;

          newValue += ",";                    
          newValue += backColor;
          
          newValue += ",";
          newValue += angle;

          this._set("value", newValue);
          this._changed();

          if (this._started && reportChange) {
            this.onChange(newValue);
          }
        },

        // Init functions

        _bindEvents: function (self) {

          if (!this._isEdgeRequest()) {

            // Control registrations
            on(this.HTML5ColorPickerControl, "click", function (e) {                          

              if (typeof HTML5ColorPicker_DoubleClickTimeOut === "undefined") {
                HTML5ColorPicker_DoubleClickTimeOut = setTimeout(function () {
                  self.HTML5ColorPicker.click();
                  delete HTML5ColorPicker_DoubleClickTimeOut;
                }, 350);
              }
              else {
                clearTimeout(HTML5ColorPicker_DoubleClickTimeOut);
                delete HTML5ColorPicker_DoubleClickTimeOut;
              }
            });

            on(this.HTML5ColorPickerControl, this._isFirefoxRequest() ? "wheel" : "mousewheel", function (e) {
              self._wheelSlide(e);
            });

            on(this.HTML5ColorPickerControl, "mousedown", function (e) {
              self._prepareMoveSlide(e, self);
            });

            on(this.HTML5ColorPickerControl, "dblclick", function (e) {
              self._resetSlider();
            });
          }

          // Picker registrations
          on(this.HTML5ColorPicker, "change", function (e) {

            if (self._getVals()[0] === e.currentTarget.value) {
              return;
            }

            self._setValue(e.currentTarget.value, e.currentTarget.value, 0, true);
          });
        },

        _loadCssFile: function () {

          let script;
          if (this._isEdgeRequest()) {
            script = 'HTML5ColorPicker2_Edge';
          }
          else {
            script = 'HTML5ColorPicker2';
          }

          let id = 'HTML5ColorPicker2Css';
          if (!document.getElementById(id)) {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = '/ClientResources/Scripts/Editors/HTML5ColorPicker2/' + script + '.css';
            link.media = 'all';
            head.appendChild(link);
          }
        },

        _loadConverter: function () {
          if (this._isEdgeRequest()) {
            return;
          }

          let id = "HTML5ColorPicker2ColorConverter";
          if (!document.getElementById(id)) {
            let head = document.getElementsByTagName('head')[0];
            let script = document.createElement('script');
            script.id = id;
            script.type = "application/javascript";
            script.src = "/ClientResources/Scripts/Editors/HTML5ColorPicker2/HTML5ColorPicker2ColorConverter.js";
            head.appendChild(script);
          }
        },

        // Aux functions

        _isEdgeRequest: function () {
          return navigator.userAgent.toLowerCase().indexOf('edge') > -1;
        },

        _isFirefoxRequest: function () {
          return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        },

        _getVals: function () {
          return this.value.split(",");
        },

        // Handler functions

        _prepareMoveSlide: function (e, self) {

          e.preventDefault();

          this._x = e.clientX;
          this._y = e.clientY;

          this._moveSlideHandler = function (e) { self._moveSlide(e, self); }
          this._finishMoveSlideHandler = function () { self._finishMoveSlide(self) };

          document.body.addEventListener("mousemove", this._moveSlideHandler);
          document.body.addEventListener("mouseup", this._finishMoveSlideHandler);
        },

        _finishMoveSlide: function (self) {

          document.body.removeEventListener("mousemove", self._moveSlideHandler);
          document.body.removeEventListener("mouseup", self._finishMoveSlideHandler);

          self._slideCoefficient = 0;
          self._moveSlideHandler = null;
          self._finishMoveSlideHandler = null;
        },

        _moveSlide: function (e, self) {
          
          self._slide(
            Math.round((Math.sqrt((e.clientX - self._x) * (e.clientX - self._x) + (e.clientY - self._y) * (e.clientY - self._y)))
              + self._slideCoefficient)
            * (e.clientX < self._x || e.clientY < self._y ? 1 : -1));

          self._slideCoefficient = self._slideCoefficient < 15 ? self._slideCoefficient + 0.5 : self._slideCoefficient;

          self._x = e.clientX;
          self._y = e.clientY;
        },

        _wheelSlide: function (e) {

          e.preventDefault();

          if (focus.curNode !== this.HTML5ColorPickerControl) {
            focus.focus(this.HTML5ColorPickerControl);
          }
          
          this._slide(3 * (e.deltaY < 0 ? 1 : -1)); // Change the coeff to alter mouse scroll precision.          
        },

        _resetSlider: function () {
          let vals = this._getVals();
          this._setValue(vals[1], vals[1], 0, false);
        },
        
        // Worker functions

        _slide: function (step) {

          let vals = this._getVals();
          let angle = parseInt(vals[2]);

          angle = angle + step;

          if (angle > 180) {
            angle = 180;
          }
          if (angle < - 180) {
            angle = -180;
          }
                    
          let hsl = HTML5ColorPicker2ColorConverter.getHslFromRgb(...
            ([1, 3, 5]
              .map(function (index) { return vals[1].slice(index, index + 2) })
              .map(function (value) { return parseInt(value, 16); })));
          
          hsl[2] = hsl[2] + 50 / 360 * angle; // 360 – ¹/₂, 270 – ³/₄, 180 – ¹/₁ of light scale; 50 light per cent, 180 degree max. per control side.
          
          if (hsl[2] < 0) {
            hsl[2] = 0;
          }
          else if (hsl[2] > 100) {
            hsl[2] = 100;
          }

          this._setValue(
            "#" + HTML5ColorPicker2ColorConverter.getRgbFromHsl(hsl[0] / 360, hsl[1] / 100, hsl[2] / 100)
              .map(function (num) { let hexStrNum = num.toString(16); return hexStrNum.length === 1 ? "0" + hexStrNum : hexStrNum; })
              .join(""),
            vals[1],
            angle,
            false);
        },
      })
  });