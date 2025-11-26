const prefix = "settings:";

const prefixed = k => `${prefix}${encodeURIComponent(k)}`;
const unprefixed = k => decodeURIComponent(k.slice(prefix.length));

const deleteRaw = k => window.localStorage.removeItem(k);
const getRaw = k => JSON.parse(window.localStorage.getItem(k) ?? "null");
const has = k => window.localStorage.getItem(prefixed(k)) !== null;
const set = (k, v) => window.localStorage.setItem(prefixed(k), JSON.stringify(v));

function* entries() {
    for (const key in window.localStorage) {
        if (key.startsWith(prefix)) yield [unprefixed(key), getRaw(key)];
    };
};

export const settings = {
    clear: () => {
        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (key.startsWith(prefix)) deleteRaw(key);
        };
    },
    delete: k => deleteRaw(prefixed(k)),
    get: k => getRaw(prefixed(k)),
    has,
    set,
    entries,
    *keys() {
        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (key.startsWith(prefix)) yield unprefixed(key);
        };
    },
    valueOf: () => new Map(entries()),
    *values() {
        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (key.startsWith(prefix)) yield getRaw(key);
        };
    },
};

window.settings = settings;
