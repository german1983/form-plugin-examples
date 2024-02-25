import { _ as _decorate, s, i, e, x, a as e$1 } from './query-assigned-elements-f8b1b870.js';

let NintexStyledInput = _decorate([e$1('form-plugin-styled-input')], function (_initialize, _LitElement) {
  class NintexStyledInput extends _LitElement {
    constructor(...args) {
      super(...args);
      _initialize(this);
    }
  }
  return {
    F: NintexStyledInput,
    d: [{
      kind: "field",
      static: true,
      key: "styles",
      value() {
        return i` 
    .form-control {
      color: var(--ntx-form-theme-color-secondary);
      background-color: var(
        --ntx-form-theme-color-input-background,
        transparent
      );
      font-size: var(--ntx-form-theme-text-input-size);
      font-family: var(--ntx-form-theme-font-family);
      border: 1px solid var(--ntx-form-theme-color-border);
      border-radius: var(--ntx-form-theme-border-radius);
    }

    .form-control:focus {
      outline: none;
      border-color: var(--ntx-form-theme-color-primary);
    }
  `;
      }
    }, {
      kind: "field",
      decorators: [e()],
      key: "value",
      value() {
        return 'hello';
      }
    }, {
      kind: "field",
      decorators: [e({
        type: Boolean
      })],
      key: "readOnly",
      value() {
        return false;
      }
    }, {
      kind: "method",
      static: true,
      key: "getMetaConfig",
      value:
      // Define scoped styles right with your component, in plain CSS.  See https://help.nintex.com/en-US/formplugins/Reference/Style.htm

      //Add a read-only mode. See https://help.nintex.com/en-US/formplugins/Reference/ReadOnly.htm

      function getMetaConfig() {
        // plugin contract information
        return {
          controlName: 'Styled Input',
          fallbackDisableSubmit: false,
          iconUrl: 'one-line-text',
          version: '1',
          properties: {
            //A custom configuration field. See https://help.nintex.com/en-US/formplugins/Reference/CustomField.htm
            value: {
              //A custom field to store the value. 
              type: 'string',
              title: 'Value',
              /* This marks the field as the value field. Should only be defined once in the list of properties. 
                 See https://help.nintex.com/en-US/formplugins/Reference/StoreValue.htm */
              isValueField: true,
              defaultValue: 'This is a text field default value'
            }
          },
          standardProperties: {
            fieldLabel: true,
            defaultValue: true,
            readOnly: true //Add a read-only mode. See https://help.nintex.com/en-US/formplugins/Reference/ReadOnly.htm
          }
        };
      }

      // Render the UI as a function of component state
    }, {
      kind: "method",
      key: "render",
      value: function render() {
        return x`<input
      class="form-control"
      class="form-control"
      ?disabled="${this.readOnly}"
      @change="${e => this.onChange(e)}"
      .value="${this.value}"
    />`;
      }
    }, {
      kind: "method",
      key: "onChange",
      value: function onChange(e) {
        var _e$target;
        const value = (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.value;
        const args = {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: value
        };
        const event = new CustomEvent('ntx-value-change', args);
        this.dispatchEvent(event);
      }
    }]
  };
}, s);

export { NintexStyledInput };
