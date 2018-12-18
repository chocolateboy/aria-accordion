import Item from './item'
import { ItemData } from './item'
import { setAttribute } from './util'

const Emitter = require('little-emitter')
const nanoid  = require('nanoid/non-secure')

type GetHeaders = (accordion: HTMLElement) => Iterable<HTMLElement>;
type GetButton = (accordion: HTMLElement, header: HTMLElement) => HTMLElement;
type GetPanel = (accordion: HTMLElement, header: HTMLElement, button: HTMLElement) => HTMLElement;

export type Options = {
    header?: string | GetHeaders;
    button?: string | GetButton;
    panel?: GetPanel;
}

const enum Warning { NO_HEADERS, NO_BUTTON, NO_PANEL }

const OPTIONS = {
    header: '[role="heading"]',
    button: '[aria-controls]:not([aria-controls=""])',
    panel: getPanel,
}

const FORWARD_EVENTS = [
    'before:change',
    'before:close',
    'before:open',
    'change',
    'close',
    'open',
]

function getPanel (accordion: HTMLElement, _header: HTMLElement, button: HTMLElement): HTMLElement | null {
    const id = button.getAttribute('aria-controls')

    if (id) {
        const $id = JSON.stringify(id)
        return accordion.querySelector(`[id=${$id}]`)
    } else {
        return null
    }
}

function convertToGetHeaders (_selector: string | GetHeaders): GetHeaders {
    return function (accordion: HTMLElement) {
        const selector = (typeof _selector === 'string')
            ? accordion => accordion.querySelectorAll(_selector)
            : _selector
        return selector(accordion)
    }
}

function convertToGetButton (_selector: string | GetButton): GetButton {
    return function (accordion: HTMLElement, header: HTMLElement) {
        const selector = (typeof _selector === 'string')
            ? (_accordion, header) => header.querySelector(_selector)
            : _selector
        return selector(accordion, header)
    }
}

export default class BaseAccordion extends Emitter {
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
        const getPanel = options.panel

        this._accordion = accordion
        this._items = []
        this._collectItems(getHeaders, getButton, getPanel)
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

    private _collectItems (getHeaders: GetHeaders, getButton: GetButton, getPanel: GetPanel) {
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
            const button = getButton(accordion, header)

            if (!button) {
                this.emit(
                    'warning',
                    Warning.NO_BUTTON,
                    'no button found in header',
                    header
                )
                continue
            }

            const panel = getPanel(accordion, header, button)

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
            const item = new Item({ button, header, index, panel })

            this._onItem(item, state)
            this._items.push(item)

            button.addEventListener('click', () => item.toggle())
        }

        setAttribute(accordion, 'role', 'presentation')
    }
}
