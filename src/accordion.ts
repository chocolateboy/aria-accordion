import BaseAccordion from './base-accordion'
import Item from './item'

type State = {
    seenOpen: boolean;
}

export default class Accordion extends BaseAccordion {
    private _selectedIndex = -1

    protected static _getState (): State {
        return { seenOpen: false }
    }

    get selectedIndex () {
        return this._selectedIndex
    }

    close (): this
    close (index: number): this
    close (...args: Array<any>): this {
        return super.close(args.length === 0 ? this._selectedIndex : args[0])
    }

    protected _onItem (item: Item, state: State) {
        super._onItem(item, state) // set up the default event handlers

        let open = false

        if (!state.seenOpen && item.button.getAttribute('aria-expanded') === 'true') {
            state.seenOpen = true
            open = true
        }

        // 1) keep track of the index of the selected item
        item.on('open', opened => {
            this._selectedIndex = opened.index
        })

        // force: bypass the isDisabled check
        item.toggle(open, { force: true })

        item.on('close', closed => {
            if (closed.index === this._selectedIndex) {
                this._selectedIndex = -1
            }
        })

        // 2) enforce the invariant: no more than one panel can be open at a time
        item.on('before:open', opening => {
            for (const other of this._items) {
                if (other !== opening) {
                    other.close()
                }
            }
        })
    }
}
