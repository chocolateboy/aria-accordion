export function setAttribute (element: HTMLElement, name: string, value, _options?: { replace: boolean }) {
    const options = _options || { replace: false }
    const $value = String(value)

    if (!element.hasAttribute(name) || ((element.getAttribute(name) !== $value) && options.replace)) {
        element.setAttribute(name, $value)
    }
}
