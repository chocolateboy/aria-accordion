/// <reference types="node" />

declare module 'little-emitter' {
    class Emitter extends NodeJS.EventEmitter { }
    export = Emitter;
}

// XXX there is a definition file for this [1], but it's out-of-date and doesn't
// include this export
//
// [1] https://www.npmjs.com/package/@types/nanoid
declare module 'nanoid/non-secure' {
    function nanoid (size?: number): string;
    export = nanoid;
}
