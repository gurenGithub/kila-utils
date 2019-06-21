import ajax from './ajax';
import jsonp from './jsonp';
import query from './query';
import uid from './ids';
import {
    addScript,
    dateFormat,
    getQueryString,
    cookie
} from './utils';
import {
    hasClass,
    addClass,
    removeClass
} from './class';
import './template';
let members = {
    query: query,
    jsonp: jsonp,
    ajax: ajax,
    getUID() {

        return uid();
    },
    getTemplate(html) {

        return _.template(html);
    },
    addScript,
    dateFormat,
    getQueryString,
    removeClass,
    addClass,
    hasClass,
    cookie

}

export default members;