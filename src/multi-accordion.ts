import BaseAccordion from './base-accordion'
import Item from './item'

export default class MultiAccordion extends BaseAccordion {
    protected _getItems (args): Array<Item> {
        if (args.length === 0) {
            return this._items
        }

        const arg = args[0]

        if (Array.isArray(arg)) {
            return arg.map(index => this._get(index))
        } else {
            return [this._get(arg)]
        }
    }

    protected _onItem (item: Item, state: any) {
        super._onItem(item, state) // set up the default event handlers
        item.toggle(item.button.getAttribute('aria-expanded') === 'true')
    }

    close (): this
    close (index: number): this
    close (indices: Array<number>): this
    close (...args): this {
        for (const item of this._getItems(args)) {
            item.close()
        }

        return this
    }

    open (): this
    open (index: number): this
    open (indices: Array<number>): this
    open (...args): this {
        for (const item of this._getItems(args)) {
            item.open()
        }

        return this
    }

    toggle (): this
    toggle (index: number): this
    toggle (indices: Array<number>): this
    toggle (...args): this {
        for (const item of this._getItems(args)) {
            item.toggle()
        }

        return this
    }
}
