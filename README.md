# HTML5ColorPicker4EpiserverCMS
This is Dojo widget for Episerver CMS providing the option to pick a color using HTML5 input element of type color and option to refine the luminosity of color.

You can find basic version without refinement at [HTML5EpiserverCMSColorPicker](https://github.com/JiriCepelkaFirstLineSoftware/HTML5EpiserverCMSColorPicker).

### License
MIT

### Reference
Construed from [knowit/ColorPickerEditor](https://github.com/knowit/ColorPickerEditor).

### How to

1. Place the editor files in your solution. Best fits in ~/ClientResources/Scripts/Editors. Otherwise you have to change paths.
2. Edit the HTML5ColorPicker2.js and change prefix path in declaration to your site prefix. That you can found in root folder module.config.

    ##### Script

    ``` javascript
    return declare("YOUR_SITE_PREFIX/Editors/HTML5ColorPicker2", [_Widget, _TemplatedMixin, _CssStateMixin],
     ```
    ##### Config

    ```xml
    <dojo>    
      <paths>
        <add name="YOUR_SITE_PREFIX" path="Scripts" />
      </paths>
        …
    ```
    
3. Decorate and setup the property.
    ```c#
    [ClientEditor(ClientEditingClass = "YOUR_SITE_PREFIX/Editors/HTML5ColorPicker2/HTML5ColorPicker2")]
    public virtual string Color
    {
      get => this.GetPropertyValue(t => t.Color)?.Split(',')[0];
      set => this.SetPropertyValue(t => t.Color, value);
    }
    ```
### Encouragement

Since MIT licensed you are encouraged to alter the files to meet your needs. Especially the styles must not suit everyone and MS Edge is not to able to open its picker on JS click so it is treated differently.

### Browser support

Works with:
* Firefox
* Chrome
* Edge

### Features

* Edge is provided only with HTML5 input of type color.
    ```HTML
    <input type="color …>
    ```
* Chrome and Firefox:    
    * Luminosity change by drag or mouse wheel.    
    * Full state persistance (reloading, switching between view modes [edit, preview, all-props]) of color lumininosity refinement.
    * Luminosity change does not trigger model change unless it is comfirmed by losing control focus, e.g. by click in document body.
    * Double click resets the control to initial color luminosity value.
