import { setAttribute } from './util'

const EventEmitter = require('little-emitter')

export type ItemData = {
    button: HTMLElement;
    header: HTMLElement;
    index: number;
    isOpen: boolean;
    panel: HTMLElement;
}

export type IsDisabled = (data: ItemData) => boolean

export default class Item extends EventEmitter {
    button: HTMLElement
    header: HTMLElement
    index: number
    isOpen = false
    panel: HTMLElement

    private _isDisabled: IsDisabled

    constructor ({ button, header, index, isDisabled, panel }) {
        super()

        this.button = button
        this.header = header
        this.index = index
        this.panel = panel
        this._isDisabled = isDisabled
    }

    get data (): ItemData {
        return {
            button: this.button,
            header: this.header,
            index: this.index,
            isOpen: this.isOpen,
            panel: this.panel,
        }
    }

    get isDisabled () {
        return this._isDisabled(this.data)
    }

    close () {
        if (this.isDisabled) return

        this.emit('before:change', 'close', this)
        this.emit('before:close', this)

        setAttribute(this.button, 'aria-expanded', false, { replace: true })
        setAttribute(this.panel, 'aria-hidden', true, { replace: true })

        this.isOpen = false
        this.emit('close', this)
        this.emit('change', 'close', this)
    }

    open () {
        if (this.isDisabled) return

        this.emit('before:change', 'open', this)
        this.emit('before:open', this)

        setAttribute(this.button, 'aria-expanded', true, { replace: true })
        setAttribute(this.panel, 'aria-hidden', false, { replace: true })

        this.isOpen = true
        this.emit('open', this)
        this.emit('change', 'open', this)
    }

    toggle (open = !this.isOpen) {
        if (open) {
            this.open()
        } else {
            this.close()
        }
    }
}
