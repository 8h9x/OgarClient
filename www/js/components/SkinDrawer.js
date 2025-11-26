const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            display: inline-block;
            padding: 0.5rem;
            background-color: var(--color-zinc-950);
            color: var(--color-zinc-100);
            border-radius: 0.75rem;
        }
    </style>

    <div class="">
        <slot></slot>
    </div>
`;

window.customElements.define("skin-drawer", class extends HTMLElement {
    // #observer;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        // this.shadowRoot.adoptedStyleSheets.push(sheet.target);
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    };

    // connectedCallback() {
    //     this.#observer = createObserver(instance).observe(this.shadowRoot);
    // };

    // disconnectedCallback() {
    //     this.#observer.disconnect();
    // };
});
