class Reader {
    view;
    #offset = 0;
    #littleEndian;

    constructor(data, offset = 0, littleEndian) {
        this.view = new DataView(data);
        this.#offset = 0;
        this.#littleEndian = littleEndian;
    };

    getUint8() {
        return this.view.getUint8(this.#offset++, this.#littleEndian);
    };
    getInt8() {
        return this.view.getInt8(this.#offset++, this.#littleEndian);
    };
    getUint16() {
        return this.view.getUint16((this.#offset += 2) - 2, this.#littleEndian);
    };
    getInt16() {
        return this.view.getInt16((this.#offset += 2) - 2, this.#littleEndian);
    };
    getUint32() {
        return this.view.getUint32((this.#offset += 4) - 4, this.#littleEndian);
    };
    getInt32() {
        return this.view.getInt32((this.#offset += 4) - 4, this.#littleEndian);
    };
    getFloat32() {
        return this.view.getFloat32((this.#offset += 4) - 4, this.#littleEndian);
    };
    getFloat64() {
        return this.view.getFloat64((this.#offset += 8) - 8, this.#littleEndian);
    };
    getStringUTF8() {
        let text = "", b;
        while (b = this.view.getUint8(this.#offset++)) {
            text += String.fromCharCode(b);
        }
        return decodeURIComponent(encodeURIComponent(text));
    };
    getStringUCS() {
        let out = "", b;
        while ((b = this.view.getUint16(this.#offset, 1)) != 0) {
            this.#offset += 2;
            out += String.fromCharCode(b);
        };
        this.#offset += 2;
        return out;
    };
    getRGB() {
        return [this.getUint8(), this.getUint8(), this.getUint8()];
    };
};
// class Reader {
//     constructor(view, offset, littleEndian) {
//         this.reader = true;
//         this._e = littleEndian;
//         if (view) this.repurpose(view, offset);
//     }
//     repurpose(view, offset) {
//         this.view = view;
//         this._o = offset || 0;
//     }
//     getUint8() {
//         return this.view.getUint8(this._o++, this._e);
//     }
//     getInt8() {
//         return this.view.getInt8(this._o++, this._e);
//     }
//     getUint16() {
//         return this.view.getUint16((this._o += 2) - 2, this._e);
//     }
//     getInt16() {
//         return this.view.getInt16((this._o += 2) - 2, this._e);
//     }
//     getUint32() {
//         return this.view.getUint32((this._o += 4) - 4, this._e);
//     }
//     getInt32() {
//         return this.view.getInt32((this._o += 4) - 4, this._e);
//     }
//     getFloat32() {
//         return this.view.getFloat32((this._o += 4) - 4, this._e);
//     }
//     getFloat64() {
//         return this.view.getFloat64((this._o += 8) - 8, this._e);
//     }
//     getStringUTF8() {
//         let s = '', b;
//         while ((b = this.view.getUint8(this._o++)) !== 0) s += String.fromCharCode(b);
//         return decodeURIComponent(encodeURIComponent(s));
//     }
//     getStringUCS() {
//         let out = '', b;
//         while ((b = this.view.getUint16(this._o, 1)) != 0) {
//             this._o += 2;
//             out += String.fromCharCode(b);
//         }
//         this._o += 2;
//         return out;
//     }
// }
// function Reader(view, offset, littleEndian) {
//     this.view = view;
//     this._e = littleEndian;
//     this._o = 0;
// }
// Reader.prototype = {
//     reader: true,
//     getUint8: function() {
//         return this.view.getUint8(this._o++, this._e);
//     },
//     getInt8: function() {
//         return this.view.getInt8(this._o++, this._e);
//     },
//     getUint16: function() {
//         return this.view.getUint16((this._o += 2) - 2, this._e);
//     },
//     getInt16: function() {
//         return this.view.getInt16((this._o += 2) - 2, this._e);
//     },
//     getUint32: function() {
//         return this.view.getUint32((this._o += 4) - 4, this._e);
//     },
//     getInt32: function() {
//         return this.view.getInt32((this._o += 4) - 4, this._e);
//     },
//     getFloat32: function() {
//         return this.view.getFloat32((this._o += 4) - 4, this._e);
//     },
//     getFloat64: function() {
//         return this.view.getFloat64((this._o += 8) - 8, this._e);
//     },
//     getStringUTF8: function() {
//         var bytes = [], b;
//         while ((b = this.view.getUint8(this._o++)) !== 0) bytes.push(b);
//         var out, i, len, c;
//         var char2, char3;

//         out = "";
//         len = bytes.length;
//         i = 0;
//         for ( ; i < len; ) {
//             c = bytes[i++];
//             switch(c >> 4)
//             {
//                 case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
//                     // 0xxxxxxx
//                     out += String.fromCharCode(c);
//                     break;
//                 case 12: case 13:
//                     // 110x xxxx   10xx xxxx
//                     char2 = bytes[i++];
//                     out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
//                     break;
//                 case 14:
//                     // 1110 xxxx  10xx xxxx  10xx xxxx
//                     char2 = bytes[i++];
//                     char3 = bytes[i++];
//                     out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
//                 break;
//             }
//         }
//         return out;
//     },
//     getStringUCS: function() {
//         var out = '', b;
//         while ((b = this.view.getUint16(this._o,1)) != 0) {
//             this._o += 2;
//             out += String.fromCharCode(b);
//         }
//         this._o += 2;
//         return out;
//     }
// };
