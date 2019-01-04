import BaseAccordion from './base-accordion'
import Item          from './item'

export default class MultiAccordion extends BaseAccordion {
    protected _getItems (args: Array<any>): Array<Item> {
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
        const open = item.button.getAttribute('aria-expanded') === 'true'
        item.toggle(open, { force: true }) // force: bypass the isDisabled check
    }

    close (): this
    close (index: number): this
    close (indices: Array<number>): this
    close (...args: Array<any>): this {
        for (const item of this._getItems(args)) {
            item.close()
        }

        return this
    }

    open (): this
    open (index: number): this
    open (indices: Array<number>): this
    open (...args: Array<any>): this {
        for (const item of this._getItems(args)) {
            item.open()
        }

        return this
    }

    toggle (): this
    toggle (index: number): this
    toggle (indices: Array<number>): this
    toggle (...args: Array<any>): this {
        for (const item of this._getItems(args)) {
            item.toggle()
        }

        return this
    }
}
