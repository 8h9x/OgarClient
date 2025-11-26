import { ChatMessage } from "./ChatMessage.js";

export class ChatBox extends HTMLElement {
    /**
     * @type {ShadowRoot | null}
     */
    #shadowRoot = null;

    static #stylesheet = (() => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`
            :host {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: fit-content;
                color: white;
                background-color: rgba(0, 0, 0, 0);
                margin: 0;
                padding: 0;
                pointer-events: auto;
                font-size: 1.25rem;
            }

            :host .messages {
                display: flex;
                flex-direction: column;
                height: 250px;
                overflow-x: hidden;
                overflow-y: auto;
            }

            :host .messages chat-message:not(:last-of-type) {
                border-bottom: 1px solid rgba(255, 255, 255, 0.125);
            }

            :host .composer {
                display: flex;
                width: 100%;
            }

            :host .composer-textbox {
                width: 100%;
                color: white;
                border: none;
                padding: 1.00rem;
                outline: none;
                background-color: rgba(0, 0, 0, 0.5);
                transition-property: all;
                transition-duration: 150ms;
                transition-timing-function: ease-in-out;
                outline-color: rgba(142, 81, 255, 1); /* set the color here to prevent white flash during transition */
            }

            :host .composer-textbox:focus {
                outline-style: solid;
                outline-width: 1px;
                outline-offset: -5px;
                box-shadow: inset 0 0 0 2px rgba(142, 81, 255, 0.35);
            }

            .menuuu {
                display: contents;
                writing-mode: vertical-lr;
                width: min-content;
                height: auto;
                letter-spacing: -0.25rem;
            }

            :host .menu {
                display: inline-block;
                -webkit-user-select: none; /* Safari */
                -ms-user-select: none; /* IE 10 and IE 11 */
                user-select: none; /* Standard syntax */
                cursor: pointer;
                border: none;
                border-radius: 0;
                align-text: center;
                padding: 0.25rem 1.75rem;
                font-size: 1.5rem;
                color: inherit;
                background-color: rgba(142, 81, 255, 1);
                display: none;
            }

            :host .menu span {
                display: contents;
                writing-mode: vertical-lr;
                width: min-content;
                height: auto;
                letter-spacing: -0.275rem;
            }
        `);
        return sheet;
    })();

    constructor() {
        super();

        this.#shadowRoot = this.attachShadow({ mode: "closed" });
        this.#shadowRoot.adoptedStyleSheets = [ChatBox.#stylesheet];
        this.#shadowRoot.innerHTML = `
            <div class="messages"></div>
            <form class="composer">
                <button class="menu" type="button" aria-label="Open message actions" aria-expanded="false"><span>|||</span></button>
                <input class="composer-textbox" type="text" name="content" placeholder="Press 'ENTER' to chat" autocomplete="off" />
            </form>
        `;
    };

    connectedCallback() {
        this.#shadowRoot.querySelector(".composer").addEventListener("submit", this.#handleComposerSubmit.bind(this));
    };

    disconnectedCallback() {
        this.#shadowRoot.querySelector(".composer").removeEventListener("change", this.#handleComposerSubmit.bind(this));
    };

    /**
     *
     * @param {string} author
     * @param {string} content
     */
    appendMessage(author, content, color) {
        const messageEl = new ChatMessage;
        messageEl.dataset.author = author;
        messageEl.innerText = content;
        messageEl.style.setProperty("--author-color", color);
        this.#shadowRoot.querySelector(".messages").appendChild(messageEl);
    };

    /**
     *
     * @param {SubmitEvent} event
     */
    #handleComposerSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const messageContent = formData.get("content");

        if (!messageContent.trim()) return;

        this.dispatchEvent(new CustomEvent("message-submit", {
            bubbles: true,
            composed: true,
            detail: messageContent
        }));

        this.#shadowRoot.querySelector(".composer-textbox").value = "";
        this.blur();
    };

    focus() {
        this.#shadowRoot.querySelector(".composer-textbox").focus();
    };

    blur() {
        this.#shadowRoot.querySelector(".composer-textbox").blur();
    };
};

if (!window.customElements.get("chat-box")) {
    window.customElements.define("chat-box", ChatBox);
};
