import { createElement, LightningElement } from 'lwc';

describe('Basic DOM manipulation cases', () => {
    let context;
    let elm;
    class Test extends LightningElement {
        constructor() {
            super();
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            context = this;
        }
    }
    beforeEach(() => {
        elm = createElement('x-test', { is: Test });
    });
    afterEach(() => {
        context = undefined;
        elm = undefined;
    });

    it('should return false for uninitilized host', () => {
        expect(context.isConnected).toBe(false);
    });
    it('should return true for connected host', () => {
        document.body.appendChild(elm);
        expect(context.isConnected).toBe(true);
    });
    it('should return false for disconnected host', () => {
        document.body.appendChild(elm);
        document.body.removeChild(elm);
        expect(context.isConnected).toBe(false);
    });
    it('should return true for reconnected host', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        document.body.appendChild(elm);
        container.appendChild(elm);
        expect(context.isConnected).toBe(true);
    });
    it('should return false for host connected to detached fragment', () => {
        const frag = document.createDocumentFragment();
        const callback = () => frag.appendChild(elm);
        if (lwcRuntimeFlags.DISABLE_NATIVE_CUSTOM_ELEMENT_LIFECYCLE) {
            // Expected warning, since we are working with disconnected nodes,
            // and the Test element is manually constructed, so it will always run in synthetic lifecycle mode
            expect(callback).toLogWarningDev(
                /fired a `connectedCallback` and rendered, but was not connected to the DOM/
            );
        } else {
            callback(); // no warning
        }

        expect(context.isConnected).toBe(false);
    });
});

describe('isConnected in life cycle callbacks', () => {
    it('should return false in the constructor', () => {
        let actual;
        class Test extends LightningElement {
            constructor() {
                super();
                actual = this.isConnected;
            }
        }
        createElement('x-test', { is: Test });
        expect(actual).toBe(false);
    });
    it('should return true in the connectedCallback', () => {
        let actual;
        class Test extends LightningElement {
            connectedCallback() {
                actual = this.isConnected;
            }
        }
        const elm = createElement('x-test', { is: Test });
        document.body.appendChild(elm);
        expect(actual).toBe(true);
    });
    it('should return true in renderedCallback after the initial insertion', () => {
        let actual;

        class Test extends LightningElement {
            renderedCallback() {
                actual = this.isConnected;
            }
        }
        const elm = createElement('x-test', { is: Test });
        document.body.appendChild(elm);
        expect(actual).toBe(true);
    });
    it('isConnected in disconnectedCallback should return false', () => {
        let actual;
        class Test extends LightningElement {
            disconnectedCallback() {
                actual = this.isConnected;
            }
        }
        const elm = createElement('x-test', { is: Test });
        document.body.appendChild(elm);
        document.body.removeChild(elm);
        expect(actual).toBe(false);
    });
});
