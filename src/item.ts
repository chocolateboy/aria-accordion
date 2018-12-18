const Emitter = require('little-emitter')

import { setAttribute } from './util'

export type ItemData = {
    button: HTMLElement;
    header: HTMLElement;
    index: number;
    isOpen: boolean;
    panel: HTMLElement;
}

export default class Item extends Emitter {
    button: HTMLElement
    header: HTMLElement
    index: number
    isOpen = false
    panel: HTMLElement

    constructor ({ button, header, index, panel }) {
        super()

        this.button = button
        this.header = header
        this.index = index
        this.panel = panel
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

    close () {
        this.emit('before:change', 'close', this)
        this.emit('before:close', this)

        setAttribute(this.button, 'aria-expanded', false, { replace: true })
        setAttribute(this.panel, 'aria-hidden', true, { replace: true })

        this.isOpen = false
        this.emit('close', this)
        this.emit('change', 'close', this)
    }

    open () {
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
