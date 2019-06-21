function addEvent(element, type, fn) {
    //判断浏览器是否支持这个方法
    if (element.addEventListener) {
        element.addEventListener(type, fn, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + type, fn);
    } else {
        element["on" + type] = fn;
    }
}

function removeEvent(element, type, fnName) {
    //判断浏览器是否支持这个方法
    if (element.removeEventListener) {
        element.removeEventListener(type, fnName);
    } else if (element.detachEvent) {
        element.detachEvent("on" + type, fnName);
    } else {
        element["on" + click] = null;
    }
}

function Query(id) {


    if (typeof id === 'string') {
        this.$selector = document.getElementById(id);
    } else {

        this.$selector = id;
    }


    return this;
}
Query.prototype = {
    $selector: null,
    hide() {

        this.$selector.style.display = "none";
        return this;

    },
    show() {

        this.$selector.style.display = "block";
        return this;
    },
    append(html) {

        this.$selector.innerHTML += html;
    },
    empty() {

        this.$selector.innerHTML = "";

        return this;
    },
    html(html) {

        if (html) {
            this.$selector.innerHTML = html;
        }
        return this.$selector.innerHTML;
    },
    length() {

        return this.text().length;
    },
    text(text) {

        if (text) {
            this.$selector.innerText = text;
        }
        return this.$selector.innerText;
    },

    getDom() {

        return this.$selector;
    },
    on(type, fn) {

        addEvent(this.$selector, type, fn);

        return this;
    },
    die(type, fnName) {

        removeEvent(this.$selector, type, fnName);
        return this;
    }
}

const myQuery = function (selector) {

    return new Query(selector);
};
export default myQuery;