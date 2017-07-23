'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * @author: laurent blanes <laurent.blanes@gmail.com>
                                                                                                                                                                                                                                                                               * @tutorial: https://hekigan.github.io/vue-directive-tooltip/
                                                                                                                                                                                                                                                                               */


var _tooltip = require('./tooltip.js');

var _tooltip2 = _interopRequireDefault(_tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * usage:
 *
 * // basic usage:
 * <div v-tooltip="'my content'">
 * or
 * <div v-tooltip="{content: 'my content'}">
 *
 * // change position of tooltip
 * // options: bottom (default) | top | left | right
 * <div v-tooltip.top="{content: 'my content'}">
 *
 * // add custom class
 * <div v-tooltip="{class: 'custom-class', content: 'my content'}">
 *
 * // toggle visibility
 * <div v-tooltip="{visible: false, content: 'my content'}">
 */
exports.default = {
    name: 'tooltip',
    config: {},
    install: function install(Vue) {
        Vue.directive('tooltip', {
            bind: function bind(el, binding, vnode) {},
            inserted: function inserted(el, binding, vnode, oldVnode) {
                var options = filterBindings(binding);
                el.tooltip = new _tooltip2.default(el, options);
            },
            componentUpdated: function componentUpdated(el, binding, vnode, oldVnode) {
                update(el, binding);
            },
            unbind: function unbind(el, binding, vnode, oldVnode) {
                el.tooltip.destroy();
            }
        });
    }
};


function filterBindings(binding) {
    return {
        class: getClass(binding),
        html: binding.value.html,
        placement: getPlacement(binding),
        title: getContent(binding),
        triggers: getTriggers(binding)
    };
}

/**
 * Get placement from modifiers
 * @param {*} binding
 */
function getPlacement(_ref) {
    var modifiers = _ref.modifiers;

    var placement = 'auto';

    // Placement
    if (modifiers.left) {
        placement = 'left';
    } else if (modifiers.right) {
        placement = 'right';
    } else if (modifiers.top) {
        placement = 'top';
    } else if (modifiers.bottom) {
        placement = 'bottom';
    }

    return placement;
}

/**
 * Get trigger value from modifiers
 * @param {*} binding
 * @return String
 */
function getTriggers(_ref2) {
    var modifiers = _ref2.modifiers;

    var trigger = [];
    if (modifiers.notrigger) {
        return trigger;
    } else if (modifiers.manual) {
        trigger.push('manual');
    } else {
        if (modifiers.click) {
            trigger.push('click');
        }

        if (modifiers.hover) {
            trigger.push('hover');
        }

        if (modifiers.focus) {
            trigger.push('focus');
        }

        if (trigger.length === 0) {
            trigger.push('hover', 'focus');
        }
    }

    return trigger;
}

/**
 * Check if the variable is an object
 * @param {*} value
 * @return Boolean
 */
function isObject(value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
}

/**
 * Check if the variable is an html element
 * @param {*} value
 * @return Boolean
 */
function isElement(value) {
    return value instanceof window.Element;
}

/**
 * Get the css class
 * @param {*} binding
 * @return HTMLElement | String
 */
function getClass(_ref3) {
    var value = _ref3.value;

    if (isObject(value) && typeof value.class === 'string') {
        return 'vue-tooltip ' + value.class;
    } else {
        return 'vue-tooltip';
    }
}

/**
 * Get the content
 * @param {*} binding
 * @return HTMLElement | String
 */
function getContent(_ref4) {
    var value = _ref4.value;

    if (isObject(value)) {
        if (value.content !== undefined) {
            return '' + value.content;
        } else if (value.html && document.getElementById(value.html)) {
            return document.getElementById(value.html);
        } else if (isElement(value.html)) {
            return value.html;
        } else {
            return '';
        }
    } else {
        return '' + value;
    }
}

/**
 * Action on element update
 * @param {*} el Vue element
 * @param {*} binding
 */
function update(el, binding) {
    if (typeof binding.value === 'string') {
        el.tooltip._content = binding.value;
    } else {
        // el.tooltip._class = binding.value.class || '';
        el.tooltip.content(getContent(binding));
        if (binding.value.visible === true) {
            el.tooltip.show();
        } else {
            el.tooltip.hide();
        }
    }
}
module.exports = exports['default'];