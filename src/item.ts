import EventEmitter     from 'little-emitter'
import { setAttribute } from './util'

export type ItemData = {
    accordion: HTMLElement;
    button: HTMLElement;
    header: HTMLElement;
    index: number;
    isOpen: boolean;
    panel: HTMLElement;
}

export type IsDisabled = (data: ItemData, next: () => boolean) => boolean

type ActionOptions = {
    force: boolean;
}

// constructor options
type Options = {
    accordion: HTMLElement;
    button: HTMLElement;
    header: HTMLElement;
    index: number;
    panel: HTMLElement;
    isDisabled?: IsDisabled;
}

const ACTION_OPTIONS = { force: false }

function ariaIsDisabled ({ button }: ItemData): boolean {
    return button.getAttribute('aria-disabled') === 'true'
}

function defaultIsDisabled (this: Item): boolean {
    return ariaIsDisabled(this.data)
}

export default class Item extends EventEmitter {
    accordion: Options['accordion']
    button: Options['button']
    header: Options['header']
    index: Options['index']
    panel: Options['panel']
    isOpen = false

    private isDisabled: () => boolean

    constructor (options: Options) {
        super()

        this.accordion = options.accordion
        this.button = options.button
        this.header = options.header
        this.index = options.index
        this.panel = options.panel

        const isDisabled = options.isDisabled

        if (isDisabled) {
            this.isDisabled = function () {
                const data = this.data
                const next = () => ariaIsDisabled(data)
                return isDisabled(data, next)
            }
        } else {
            this.isDisabled = defaultIsDisabled
        }
    }

    get data (): ItemData {
        return {
            accordion: this.accordion,
            button: this.button,
            header: this.header,
            index: this.index,
            isOpen: this.isOpen,
            panel: this.panel,
        }
    }

    close (options: ActionOptions = ACTION_OPTIONS) {
        if (!options.force && this.isDisabled()) {
            return
        }

        this.emit('before:change', 'close', this)
        this.emit('before:close', this)

        setAttribute(this.button, 'aria-expanded', false, { replace: true })
        setAttribute(this.panel, 'aria-hidden', true, { replace: true })

        this.isOpen = false
        this.emit('close', this)
        this.emit('change', 'close', this)
    }

    open (options: ActionOptions = ACTION_OPTIONS) {
        if (!options.force && this.isDisabled()) {
            return
        }

        this.emit('before:change', 'open', this)
        this.emit('before:open', this)

        setAttribute(this.button, 'aria-expanded', true, { replace: true })
        setAttribute(this.panel, 'aria-hidden', false, { replace: true })

        this.isOpen = true
        this.emit('open', this)
        this.emit('change', 'open', this)
    }

    toggle (open: boolean = !this.isOpen, options: ActionOptions = ACTION_OPTIONS) {
        if (open) {
            this.open(options)
        } else {
            this.close(options)
        }
    }
}
