import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./test.html";
class Text extends LightningElement {
  foo = 1;
  get foo() {}
  set foo(value) {}
  /*LWC compiler vX.X.X*/
}
_registerDecorators(Text, {
  publicProps: {
    foo: {
      config: 3
    }
  },
  fields: ["foo"]
});
const __lwc_component_class_internal = _registerComponent(Text, {
  tmpl: _tmpl,
  sel: "lwc-test",
  apiVersion: 9999999
});
export default __lwc_component_class_internal;