/**
 * @typedef PaginatedContainerDataset extends DOMStringMap
 * @property {string} page
 */

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

window.customElements.define("paginated-container", class PaginatedContainer extends HTMLElement {
    #index = 0;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = "<slot></slot>";
    };

    /**
     *
     * @param {number | HTMLElement} indexOrElement
     */
    goto(indexOrElement) {
        console.log(indexOrElement, this.children[indexOrElement - 1]);

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (i === indexOrElement) {
                child.classList.remove("hidden");
            } else {
                child.classList.add("hidden");
            };
        };

        if (indexOrElement instanceof HTMLElement) {

        } else if (typeof indexOrElement === "number") {

        } else {
            throw new Error(`Invalid type of indexOrElement: ${typeof indexOrElement}, cannot navigate to page.`);
        };
    };

    /**
     *
     * @param {number} i
     */
    #gotoIndex(i) {

    };

    prev() {

    };

    next() {

    };
});
