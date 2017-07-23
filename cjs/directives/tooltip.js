'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _popperUtils = require('popper.js/dist/popper-utils');

var _popperUtils2 = _interopRequireDefault(_popperUtils);

var _popper = require('popper.js');

var _popper2 = _interopRequireDefault(_popper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BASE_CLASS = 'vue-tooltip';
var PLACEMENT = ['top', 'left', 'right', 'bottom', 'auto'];

var DEFAULT_OPTIONS = {
    container: false,
    delay: 0,
    instance: null, // the popper.js instance
    eventsEnabled: true,
    html: false,
    modifiers: {
        arrow: {
            element: '.tooltip-arrow'
        }
    },
    placement: 'auto',
    placementPostfix: null, // start | end
    removeOnDestroy: true,
    title: '',
    class: '', // ex: 'tooltip-custom tooltip-other-custom'
    triggers: ['hover', 'focus'],
    offset: 100
};

var Tootlip = function () {
    function Tootlip(el) {
        var _this = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Tootlip);

        this._options = _extends({}, DEFAULT_OPTIONS, {
            onCreate: function onCreate() {
                _this.content(_this.tooltip.options.title);
                _this._$tt.update();
            },
            onUpdate: function onUpdate() {
                _this.content(_this.tooltip.options.title);
                _this._$tt.update();
            }
        }, Tootlip.filterOptions(options));

        var $tpl = this._createTooltipElement(this.options);
        document.querySelector('body').appendChild($tpl);

        this._$el = el;
        this._$tt = new _popper2.default(el, $tpl, this._options);
        this._$tpl = $tpl;
        this._visible = false;
        this._setEvents();
    }

    Tootlip.prototype.destroy = function destroy() {
        this._setEvents('remove');
        document.querySelector('body').removeChild(this._$tpl);
    };

    Tootlip.prototype._createTooltipElement = function _createTooltipElement(options) {
        // wrapper
        var $popper = document.createElement('div');
        $popper.setAttribute('id', 'tooltip-' + randomId());
        $popper.setAttribute('class', BASE_CLASS + ' ' + this._options.class);
        _popperUtils2.default.setStyles($popper, { display: 'none' });

        // make arrow
        var $arrow = document.createElement('div');
        $arrow.setAttribute('class', 'tooltip-arrow');
        $popper.appendChild($arrow);

        // make content container
        var $content = document.createElement('div');
        $content.setAttribute('class', 'tooltip-content');
        $popper.appendChild($content);

        return $popper;
    };

    Tootlip.prototype._setEvents = function _setEvents() {
        var _this2 = this;

        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'add';

        if (!Array.isArray(this.options.triggers)) {
            console.error('trigger should be an array', this.options.triggers);
            return;
        }
        var lis = null;
        if (state === 'add') {
            lis = function lis() {
                var _$el;

                return (_$el = _this2._$el).addEventListener.apply(_$el, arguments);
            };
        } else {
            lis = function lis() {
                var _$el2;

                return (_$el2 = _this2._$el).removeEventListener.apply(_$el2, arguments);
            };
        }

        if (this.options.triggers.includes('manual')) {
            lis('click', this._onToggle.bind(this), false);
        } else {
            this.options.triggers.map(function (evt) {
                switch (evt) {
                    case 'click':
                        lis('click', _this2._onToggle.bind(_this2), false);
                        if (state === 'add') {
                            document.addEventListener('click', _this2._onDeactivate.bind(_this2), false);
                        } else {
                            document.removeEventListener('click', _this2._onDeactivate.bind(_this2), false);
                        }
                        break;
                    case 'hover':
                        lis('mouseenter', _this2._onActivate.bind(_this2), false);
                        lis('mouseleave', _this2._onDeactivate.bind(_this2), true);
                        break;
                    case 'focus':
                        lis('focus', _this2._onActivate.bind(_this2), false);
                        lis('blur', _this2._onDeactivate.bind(_this2), true);
                        break;
                }
            });
        }
    };

    Tootlip.prototype._cleanEvents = function _cleanEvents() {
        var _this3 = this;

        var eal = function eal() {
            var _$el3;

            return (_$el3 = _this3._$el).removeEventListener.apply(_$el3, arguments);
        };

        if (this.options.triggers.includes('manual')) {
            eal('click', this._onToggle.bind(this), false);
        } else {
            this.options.triggers.map(function (evt) {
                switch (evt) {
                    case 'click':
                        eal('click', _this3._onToggle.bind(_this3), false);
                        document.addEventListener('click', _this3._onDeactivate.bind(_this3), false);
                        break;
                    case 'hover':
                        eal('mouseenter', _this3._onActivate.bind(_this3), false);
                        eal('mouseleave', _this3._onDeactivate.bind(_this3), true);
                        break;
                    case 'focus':
                        eal('focus', _this3._onActivate.bind(_this3), false);
                        eal('blur', _this3._onDeactivate.bind(_this3), true);
                        break;
                }
            });
        }
    };

    Tootlip.prototype._onActivate = function _onActivate(e) {
        this.show();
    };

    Tootlip.prototype._onDeactivate = function _onDeactivate(e) {
        this.hide();
    };

    Tootlip.prototype._onToggle = function _onToggle(e) {
        e.stopPropagation();
        e.preventDefault();
        this.toggle();
    };

    Tootlip.prototype.content = function content(_content) {
        var wrapper = this.tooltip.popper.querySelector('.tooltip-content');
        if (typeof _content === 'string') {
            this.tooltip.options.title = _content;
            wrapper.textContent = _content;
        } else if (isElement(_content)) {
            wrapper.innerHTML = '';
            this.tooltip.options.title = _content;
            wrapper.appendChild(_content);
        } else {
            console.error('unsupported content type', _content);
        }
    };

    Tootlip.filterOptions = function filterOptions(options) {
        var opt = _extends({}, options);

        opt.placement = PLACEMENT.includes(options.placement) ? options.placement : 'auto';
        // if (!opt.modifiers) {
        //     opt.modifiers = { offset: null };
        // }
        // if (opt.offset) {
        //     opt.modifiers.offset = { offset: opt.offset };
        // }

        return opt;
    };

    Tootlip.prototype.show = function show() {
        this.toggle(true);
    };

    Tootlip.prototype.hide = function hide() {
        this.toggle(false);
    };

    Tootlip.prototype.toggle = function toggle(val) {
        if (typeof val !== 'boolean') {
            val = !this._visible;
        }
        this._visible = val;
        this._$tt.popper.style.display = this._visible === true ? 'inline-block' : 'none';
        this._$tt.update();
    };

    _createClass(Tootlip, [{
        key: 'options',
        get: function get() {
            return _extends({}, this._options);
        }
    }, {
        key: 'tooltip',
        get: function get() {
            return this._$tt;
        }
    }]);

    return Tootlip;
}();

exports.default = Tootlip;


function randomId() {
    return Date.now() + '-' + Math.round(Math.random() * 100000000);
}

/**
 * Check if the variable is an html element
 * @param {*} value
 * @return Boolean
 */
function isElement(value) {
    return value instanceof window.Element;
}
module.exports = exports['default'];