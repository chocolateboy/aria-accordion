// TODO add to little-emitter
declare module 'little-emitter' {
    type Listener = (...args: Array<any>) => void;

    interface Emitter {
        addEventListener(event: string | symbol, listener: Listener): this;
        on(event: string | symbol, listener: Listener): this;

        emit(event: string | symbol, ...args: Array<any>): boolean;
        trigger(event: string | symbol, ...args: Array<any>): boolean;

        getListeners(event?: string | symbol): Array<Listener>;
        listeners(event?: string | symbol): Array<Listener>;

        off(event?: string | symbol, listener?: Listener): this;
        removeEventListener(event?: string | symbol, listener?: Listener): this;
        removeEventListeners(event?: string | symbol, listener?: Listener): this;

        once(event: string | symbol, listener: Listener): this;
        one(event: string | symbol, listener: Listener): this;
    }

    interface EmitterStatic {
        <T extends Object>(target: T): T & Emitter;
        new(): Emitter;
    }

    const Emitter: EmitterStatic;

    export = Emitter;
}

// XXX there is a definition file for this [1], but it's out-of-date and doesn't
// include this export
//
// [1] https://www.npmjs.com/package/@types/nanoid
//
// TODO add to DefinitelyTyped or nanoid
declare module 'nanoid/non-secure' {
    function nanoid (size?: number): string;
    export = nanoid;
}
