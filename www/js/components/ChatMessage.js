/**
 * @typedef ChatMessageDataset extends DOMStringMap
 * @property {"true" | "false"} hidden
 * @property {string} author
 */

export class ChatMessage extends HTMLElement {
    /**
     * @type {ShadowRoot | null}
     */
    #shadowRoot = null;

    static #stylesheet = (() => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`
            :host {
                --author-color: rgb(0, 0, 0);

                display: flex;
                flex-direction: row;
                width: 100%;
                height: auto;
                align-items: center;
                justify-content: space-between;
                padding: 0;
                margin: 0;
                font-size: inherit;
                color: inherit;
                position: relative;
            }

            :host .author {
                color: var(--author-color);
            }

            :host .content {
                padding: 0.50rem;
                word-break: break-all;
            }

            :host([data-hidden="true"]) .content {
                filter: blur(8px);
                pointer-events: none;
                -webkit-user-select: none; /* Safari */
                -ms-user-select: none; /* IE 10 and IE 11 */
                user-select: none; /* Standard syntax */
            }

            :host .expand {
                display: inline-block;
                -webkit-user-select: none; /* Safari */
                -ms-user-select: none; /* IE 10 and IE 11 */
                user-select: none; /* Standard syntax */
                cursor: pointer;
                border: none;
                border-radius: 0;
                align-text: center;
                padding: 0.25rem 1rem;
                font-size: 2.5rem;
                color: inherit;
                background-color: transparent;
            }

            :host .expand span {
                display: contents;
                writing-mode: vertical-lr;
                width: min-content;
                height: auto;
            }

            :host .actions {
                position: absolute;
                background-color: rgba(0, 0, 0, 1);
                top: 100%;
                right: -100%;
                z-index: 1;
                pointer-events: auto;
                transition-property: right;
                transition-duration: 150ms;
                transition-timing-function: ease-in-out;
                display: flex;
                flex-direction: column;
            }

            :host .expand[aria-expanded="true"] + .actions {
                right: 0;
            }

            :host .actions button {
                background-color: transparent;
                border: none;
                color: inherit;
                padding: 0.50rem 0.75rem;
                pointer-events: auto;
                cursor: pointer;
                transition-property: background-color;
                transition-duration: 150ms;
                transition-timing-function: ease-in-out;
                text-align: left;
            }

            :host .actions button:hover {
                background-color: rgba(255, 255, 255, 0.15);
            }

            :host .actions .hide::before {
                content: "Hide ";
            }

            :host([data-hidden="true"]) .actions .hide::before {
                content: "Show ";
            }
        `);
        return sheet;
    })();

    /**
     * @returns {ChatMessageDataset}
     */
    get dataset() {
        return super.dataset;
    };

    static get observedAttributes() {
        return [
            "data-hidden",
            "data-author"
        ];
    };

    constructor() {
        super();

        this.#shadowRoot = this.attachShadow({ mode: "closed" });
        this.#shadowRoot.adoptedStyleSheets = [ChatMessage.#stylesheet];
        this.#shadowRoot.innerHTML = `
            <div class="content">
                <span class="author"></span>
                <span><slot></slot></span>
            </div>
            <button class="expand" type="button" aria-label="Open message actions" aria-expanded="false"><span>...</span></button>
            <div class="actions" role="dialog" inert>
                <button type="button" class="hide">Message</button>
                <button type="button" class="copy">Copy Text</button>
            </div>
        `;
    };

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data-author") {
            this.#shadowRoot.querySelector(".author").innerText = newValue;
        } else if (name === "data-hidden") {

        };
    };

    connectedCallback() {
        this.#shadowRoot.querySelector(".expand").addEventListener("click", this.#handleExpandClick.bind(this));
        this.#shadowRoot.querySelector(".hide").addEventListener("click", this.#handleHideClick.bind(this));
        this.#shadowRoot.querySelector(".copy").addEventListener("click", this.#handleCopyClick.bind(this));
    };

    disconnectedCallback() {
        this.#shadowRoot.querySelector(".expand").removeEventListener("click", this.#handleExpandClick);
        this.#shadowRoot.querySelector(".hide").removeEventListener("click", this.#handleHideClick);
        this.#shadowRoot.querySelector(".copy").removeEventListener("click", this.#handleCopyClick);
    };

    hide() {
        this.dataset.hidden = "true";
    };

    show() {
        this.dataset.hidden = "false";
    };

    /**
     *
     * @param {Event} event
     */
    #handleExpandClick(event) {
        const expandEl = this.#shadowRoot.querySelector(".expand");
        const isExpanded = expandEl.getAttribute("aria-expanded") === "true";
        expandEl.setAttribute("aria-expanded", !isExpanded);

        const actions = this.#shadowRoot.querySelector(".actions");
        actions.setAttribute("aria-hidden", isExpanded);
        if (isExpanded) {
            actions.setAttribute("inert", "");
        } else {
            actions.removeAttribute("inert");
        };
    };

    /**
     *
     * @param {Event} event
     */
    #handleHideClick(event) {
        const isHidden = this.dataset.hidden === "true";
        this.setAttribute("data-hidden", !isHidden);

        this.#handleExpandClick();
    };

    /**
     *
     * @param {Event} event
     */
    #handleCopyClick(event) {
        // TODO: copy confirm animation

        navigator.clipboard.writeText(this.textContent);

        this.#handleExpandClick();
    };
};

if (!window.customElements.get("chat-message")) {
    window.customElements.define("chat-message", ChatMessage);
};
