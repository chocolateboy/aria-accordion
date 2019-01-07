import EventEmitter from 'little-emitter'
import nanoid from 'nanoid/non-secure'
import Item, { ItemData, IsDisabled as IsItemDisabled } from './item'
import { setAttribute } from './util'

type GetHeaders = (accordion: HTMLElement) => Iterable<HTMLElement>;

type GetButton = (
    params: { accordion: HTMLElement, header: HTMLElement }
) => HTMLElement | null;

type GetPanel = (
    params: { accordion: HTMLElement, button: HTMLElement, header: HTMLElement }
) => HTMLElement | null;

export type Options = {
    button?: string | GetButton;
    disabled?: IsItemDisabled;
    header?: string | GetHeaders;
    panel?: GetPanel;
}

type Hooks = {
    getButton: GetButton;
    getHeaders: GetHeaders;
    getPanel: GetPanel;
    isItemDisabled?: IsItemDisabled;
}

const enum Warning { NO_HEADERS, NO_BUTTON, NO_PANEL }

const OPTIONS = {
    header: '[role="heading"]',
    button: '[aria-controls]:not([aria-controls=""])',
}

const FORWARD_EVENTS = [
    'before:change',
    'before:close',
    'before:open',
    'change',
    'close',
    'open',
]

function convertToGetButton (selector: string | GetButton): GetButton {
    if (typeof selector === 'string') {
        return function ({ header }) {
            return header.querySelector(selector)
        }
    } else {
        return selector
    }
}

function convertToGetHeaders (selector: string | GetHeaders): GetHeaders {
    if (typeof selector === 'string') {
        return function (accordion) {
            return accordion.querySelectorAll(selector)
        }
    } else {
        return selector
    }
}

function defaultGetPanel ({ accordion, button }: { accordion: HTMLElement, button: HTMLElement }): HTMLElement | null {
    const id = button.getAttribute('aria-controls')

    if (id) {
        const quotedId = JSON.stringify(id)
        return accordion.querySelector(`[id=${quotedId}]`)
    } else {
        return null
    }
}

export default class BaseAccordion extends EventEmitter {
    protected _accordion: HTMLElement
    protected _items: Array<Item>

    protected static _getState(): any {
        return null
    }

    static mount(el: HTMLElement, options?: Options) {
        return new this(el, options)
    }

    // XXX hackery to work around a TypeScript bug:
    // https://github.com/Microsoft/TypeScript/issues/3841#issuecomment-337560146
    ['constructor']: typeof BaseAccordion

    constructor (accordion: HTMLElement, _options?: Options) {
        super()

        const options = Object.assign({}, OPTIONS, _options || {})
        const getHeaders = convertToGetHeaders(options.header)
        const getButton = convertToGetButton(options.button)
        const isItemDisabled = options.disabled
        const getPanel = options.panel || defaultGetPanel

        this._accordion = accordion
        this._items = []
        this._collectItems({ getButton, getHeaders, getPanel, isItemDisabled })
    }

    *[Symbol.iterator](): Iterator<ItemData> {
        for (const item of this._items) {
            yield item.data
        }
    }

    get accordion () {
        return this._accordion
    }

    close (index: number): this {
        this._get(index).close()
        return this
    }

    get (index: number): ItemData {
        return this._get(index).data
    }

    has (index: number): boolean {
        return !!this._items[index]
    }

    get length () {
        return this._items.length
    }

    open (index: number): this {
        this._get(index).open()
        return this
    }

    protected _get (index: number): Item {
        const item = this._items[index]

        if (item) {
            return item
        } else {
            throw new RangeError(`item not found: ${index}`)
        }
    }

    protected _onItem (item: Item, _state: any) {
        for (const event of FORWARD_EVENTS) {
            item.on(event, (...args) => {
                this.emit(event, ...args, this)
            })
        }
    }

    private _collectItems ({ getButton, getHeaders, getPanel, isItemDisabled }: Hooks) {
        const { accordion } = this
        const headers = getHeaders(accordion)

        if (!headers) {
            this.emit(
                'warning',
                Warning.NO_HEADERS,
                'no headers found in accordion',
                accordion
            )
            return
        }

        const state = this.constructor._getState()

        for (const header of headers) {
            const button = getButton({ accordion, header })

            if (!button) {
                this.emit(
                    'warning',
                    Warning.NO_BUTTON,
                    'no button found in header',
                    header
                )
                continue
            }

            const panel = getPanel({ accordion, button, header })

            if (!panel) {
                this.emit(
                    'warning',
                    Warning.NO_PANEL,
                    'panel not found',
                    accordion,
                    header,
                    button
                )
                continue
            }

            if (!header.id) {
                header.id = `accordion-header-${nanoid(16)}`
            }

            if (!panel.id) {
                panel.id = `accordion-panel-${nanoid(16)}`
            }

            setAttribute(header, 'role', 'heading')
            setAttribute(button, 'aria-controls', panel.id)
            setAttribute(button, 'aria-expanded', false)
            setAttribute(panel, 'role', 'region')
            setAttribute(panel, 'aria-labelledby', header.id)

            const index = this._items.length
            const item = new Item({
                accordion,
                button,
                header,
                index,
                isDisabled: isItemDisabled,
                panel
            })

            this._onItem(item, state)
            this._items.push(item)

            button.addEventListener('click', () => item.toggle())
        }

        setAttribute(accordion, 'role', 'presentation')
    }
}
