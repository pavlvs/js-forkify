import icons from 'url:../../img/icons.svg'

export default class View {
    _data


    /**
     * Render the received object to the DOM
     * @param  {Object | Object[]} data The data to be rendered (e.g. a recipe)
     * @param  {boolean} [render=true] If false, create markup string instead of rendering to the DOM
     * @returns {undefined | string} Returns a markup string if render is false
     * @this {Object} View instance
     * @author pavlvs - paul@canarius.co.uk
     * @todo Finish implementation
     */
    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError()

        this._data = data
        const markup = this._generateMarkup()

        if (!render) return markup

        this._clear()
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }

    update(data) {
        this._data = data
        const newMarkup = this._generateMarkup()

        const newDOM = document.createRange().createContextualFragment(newMarkup)
        const newElements = Array.from(newDOM.querySelectorAll('*'))
        const currentElements = Array.from(this._parentElement.querySelectorAll('*'))

        newElements.forEach((newElement, i) => {
            const currentElement = currentElements[i]

            // updates changed text
            if (!newElement.isEqualNode(currentElement) &&
                newElement.firstChild?.nodeValue.trim() != ''
            ) {
                currentElement.textContent = newElement.textContent
            }

            // updates changed data attributes
            if (!newElement.isEqualNode(currentElement)) {
                Array.from(newElement.attributes)
                    .forEach(
                        attribute => currentElement.setAttribute(attribute.name, attribute.value)
                    )
            }
        })
    }

    _clear() {
        this._parentElement.innerHTML = ''
    }


    renderSpinner() {
        const markup = /*html*/`
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
  `
        this._clear()
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }

    renderError(message = this._errorMessage) {
        const markup = /*html*/`
           <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `
        this._clear()
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }

    renderMessage(message = this._message) {
        const markup = /*html*/`
           <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `
        this._clear()
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }
}