(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("eclipse"), require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["eclipse", "jquery"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("eclipse"), require("jquery")) : factory(root["eclipse"], root["jQuery"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _eclipse = __webpack_require__(1);

	var _eclipse2 = _interopRequireDefault(_eclipse);

	var _Dropdown = __webpack_require__(2);

	var _Dropdown2 = _interopRequireDefault(_Dropdown);

	var _Spinner = __webpack_require__(4);

	var _Spinner2 = _interopRequireDefault(_Spinner);

	var _Tabs = __webpack_require__(5);

	var _Bundle = __webpack_require__(6);

	var _Bundle2 = _interopRequireDefault(_Bundle);

	var _Search = __webpack_require__(7);

	var _Search2 = _interopRequireDefault(_Search);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_eclipse2.default.namespace('UI');

	_eclipse2.default.UI.Dropdown = _Dropdown2.default;
	_eclipse2.default.UI.Spinner = _Spinner2.default;
	_eclipse2.default.UI.StaticTabs = _Tabs.staticTabs;
	_eclipse2.default.UI.AdaptiveTabs = _Tabs.adaptiveTabs;
	_eclipse2.default.UI.Bundle = _Bundle2.default;
	_eclipse2.default.UI.Search = _Search2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _eclipse = __webpack_require__(1);

	var _eclipse2 = _interopRequireDefault(_eclipse);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var body = (0, _jquery2.default)('body'),
	    resetCSS = {
	    'display': '',
	    'height': '',
	    'overflow': '',
	    'opacity': ''
	},
	    effects = {
	    toggle: ['show', 'hide'],
	    slide: ['slideDown', 'slideUp'],
	    fade: ['fadeIn', 'fadeOut']
	},
	    customEffects = {},
	    COOLDOWN = 1,
	    hasDropdownInstances = false;

	function animate(effect, currentItem, hide) {
	    var self = this,
	        hasClass = currentItem.dropdown.hasClass('dd-dropdown--opened');

	    if (hasClass || hide) {
	        if (hasClass) {
	            self._defaults.beforeClose(self, currentItem);
	        }

	        currentItem.dropdown.removeClass('dd-dropdown--pressed');
	        currentItem.trigger.removeClass('dd-trigger--active');

	        currentItem.drop[effects[effect][1]]({
	            duration: parseInt(self._defaults.animationDuration, 10) || 0,
	            done: function done() {
	                var hasClass = currentItem.dropdown.hasClass('dd-dropdown--opened');

	                currentItem.dropdown.removeClass('dd-dropdown--opened');
	                currentItem.drop.css(resetCSS);

	                if (hasClass) {
	                    self._defaults.afterClose(self, currentItem);
	                }
	            }
	        });
	    } else {
	        self._defaults.beforeOpen(self, currentItem);
	        currentItem.dropdown.addClass('dd-dropdown--pressed');
	        currentItem.trigger.addClass('dd-trigger--active');

	        currentItem.drop[effects[effect][0]]({
	            duration: parseInt(self._defaults.animationDuration, 10) || 0,
	            done: function done() {
	                currentItem.dropdown.addClass('dd-dropdown--opened');
	                currentItem.drop.css(resetCSS);
	                self._defaults.afterOpen(self, currentItem);
	            }
	        });
	    }
	}

	function createDropdownsArray(arr, id) {
	    var tmp = arr.slice(0),
	        drop,
	        trigger,
	        innerID,
	        parentID,
	        next,
	        self,
	        that = this;

	    tmp.each(function () {
	        self = (0, _jquery2.default)(this);
	        drop = self.children('.dd-drop');
	        trigger = that._isEqual ? self : self.find('.' + that._defaults.trigger).first();
	        innerID = Math.random();
	        parentID = +self.data('level') > 1 ? id : null;
	        next = drop.first().find('.dd-dropdown:first');

	        if (next.length) {
	            next = next.add(next.siblings('.dd-dropdown'));
	            createDropdownsArray.call(that, next, innerID);
	        }

	        that._dropdowns.push({
	            dropdown: self,
	            drop: drop.first(),
	            level: self.data('level'),
	            trigger: trigger,
	            id: innerID,
	            parentID: parentID
	        });
	    });
	}

	function getEffect(dropdown) {
	    var effect, isCustom;

	    if (this._defaults.effect === null && dropdown.data('effect') && (effects[dropdown.data('effect')] || customEffects[dropdown.data('effect')])) {
	        effect = dropdown.data('effect');
	    } else if (effects[this._defaults.effect] || customEffects[this._defaults.effect]) {
	        effect = this._defaults.effect;
	    } else {
	        effect = 'toggle';
	    }

	    isCustom = Object.prototype.hasOwnProperty.call(customEffects, effect);

	    return {
	        effect: effect,
	        isCustom: isCustom
	    };
	}

	function hideNested(id) {
	    var next = [],
	        self = this,
	        effectObj;

	    self._dropdowns.forEach(function (item) {
	        if (item.parentID === id) {
	            effectObj = getEffect.call(self, item.dropdown);
	            effectObj.isCustom ? customEffects[effectObj.effect].call(self, item, true) : animate.call(self, effectObj.effect, item, true);

	            next.push(item);
	        }
	    });

	    if (next.length) {
	        next.forEach(function (item) {
	            hideNested.call(self, item.id);
	        });
	    }
	}

	function hideSiblings(currentItem, level) {
	    var self = this,
	        effectObj;

	    self._dropdowns.forEach(function (item) {
	        if (item !== currentItem && item.level === level && item.dropdown.hasClass('dd-dropdown--opened')) {
	            effectObj = getEffect.call(self, item.dropdown);
	            effectObj.isCustom ? customEffects[effectObj.effect].call(self, item, true) : animate.call(self, effectObj.effect, item, true);

	            if (self._defaults.hideNested) {
	                hideNested.call(self, item.id);
	            }
	        }
	    });
	}

	function hideOnOtherDropdownsClick(container) {
	    _eclipse2.default.storage.dropdowns.forEach(function (item) {
	        if (item._container.data('other-dropdowns') && item._container !== container && item._container.find('.dd-dropdown--opened').length) {
	            item._defaults.beforeClose(item._container);

	            item._container.find('.dd-dropdown').removeClass('dd-dropdown--opened dd-dropdown--active dd-dropdown--pressed dd-trigger--active');
	            item._container.find('.dd-drop').css(resetCSS);
	            item._container.find('.dd-trigger').removeClass('dd-trigger--active');

	            item._defaults.afterClose(item._container);
	        }
	    });
	}

	function reinit(newOptions) {
	    var pos = _eclipse2.default.storage.dropdowns.indexOf(this);

	    if (pos !== -1) {
	        _eclipse2.default.storage.dropdowns.splice(pos, 1);
	    }
	    this._dropdowns.length = 0;

	    if (_eclipse2.default.helpers.getClass(newOptions) === 'Object') {
	        _jquery2.default.extend(this._defaults, newOptions);
	    }
	    createDropdownsArray.call(this, this._rootDD);
	    _eclipse2.default.storage.dropdowns.push(this);
	}

	function init() {
	    createDropdownsArray.call(this, this._rootDD);
	    _eclipse2.default.storage.dropdowns.push(this);

	    if (!hasDropdownInstances) {
	        hasDropdownInstances = true;
	        delegate();
	    }
	}
	// Delegation
	function delegate() {
	    body.on('click', function (e) {
	        var target = (0, _jquery2.default)(e.target),
	            dropdownContainer = target.closest('[data-dropdown]'),
	            dropdown,
	            i,
	            currentItem,
	            effectObj,
	            pos,
	            request,
	            launch;

	        if (!dropdownContainer.length) {
	            return;
	        }

	        for (i = 0; i < _eclipse2.default.storage.dropdowns.length; i += 1) {
	            if (_eclipse2.default.storage.dropdowns[i]._container[0] === dropdownContainer[0]) {
	                dropdown = _eclipse2.default.storage.dropdowns[i];
	                break;
	            }
	        }

	        if (!dropdown) {
	            return;
	        }

	        target = (0, _jquery2.default)(e.target).closest('.' + dropdown._defaults.trigger);

	        if (!target.length) {
	            return;
	        }

	        if (dropdown._defaults.shouldPreventDefault) {
	            e.preventDefault();
	        }

	        if (dropdown._state) {
	            return;
	        }

	        launch = function launch() {
	            effectObj.isCustom ? customEffects[effectObj.effect].call(dropdown, currentItem, false) : animate.call(dropdown, effectObj.effect, currentItem, false);

	            if (dropdown._defaults.hideSiblings) {
	                hideSiblings.call(dropdown, currentItem, currentItem.level);
	            }
	            if (dropdown._defaults.hideNested && !currentItem.dropdown.hasClass('dd-dropdown--pressed')) {
	                hideNested.call(dropdown, currentItem.id);
	            }

	            setTimeout(function () {
	                dropdown._state = null;
	            }, parseInt(dropdown._defaults.animationDuration, 10) || 0);
	        };

	        hideOnOtherDropdownsClick.call(dropdown, dropdown._container);

	        dropdown._state = COOLDOWN;
	        currentItem = target.closest('.dd-dropdown');

	        for (i = 0; i < dropdown._dropdowns.length; i++) {
	            if (dropdown._dropdowns[i].dropdown[0] === currentItem[0]) {
	                currentItem = dropdown._dropdowns[i];
	                break;
	            }
	        }

	        effectObj = getEffect.call(dropdown, currentItem.dropdown);

	        if (typeof dropdown._defaults.wait === 'function') {
	            request = dropdown._defaults.wait(currentItem);

	            if (_eclipse2.default.helpers.getClass(request) === 'Object' && request.then) {
	                pos = _eclipse2.default.storage.dropdowns.indexOf(dropdown);

	                if (pos !== -1) {
	                    _eclipse2.default.storage.dropdowns.splice(pos, 1);
	                }
	                dropdown._dropdowns.length = 0;

	                _jquery2.default.when(request).then(function (a, b) {
	                    createDropdownsArray.call(dropdown, dropdown._rootDD);
	                    _eclipse2.default.storage.dropdowns.push(dropdown);
	                    launch();
	                });
	            } else {
	                launch();
	            }
	        } else {
	            launch();
	        }
	    });
	}

	// Delegation (END)

	function Dropdown(root, options) {
	    var self = this,
	        defaults,
	        dropdowns,
	        container,
	        state,
	        firstDD,
	        siblings,
	        rootDD;

	    defaults = _eclipse2.default.helpers.createMap();

	    defaults.hideSiblings = true;
	    defaults.hideNested = true;
	    defaults.trigger = 'dd-dropdown';
	    defaults.effect = 'toggle';
	    defaults.shouldPreventDefault = true;
	    defaults.animationDuration = 0;
	    defaults.beforeOpen = _jquery2.default.noop;
	    defaults.afterOpen = _jquery2.default.noop;
	    defaults.beforeClose = _jquery2.default.noop;
	    defaults.afterClose = _jquery2.default.noop;
	    defaults.wait = null;

	    dropdowns = [];

	    Object.defineProperty(this, '_dropdowns', {
	        get: function get() {
	            return dropdowns;
	        }
	    });

	    if (_eclipse2.default.helpers.getClass(options) === 'Object') {
	        _jquery2.default.extend(defaults, options);
	    }

	    defaults.animationDuration = parseInt(defaults.animationDuration, 10) || 0;

	    Object.defineProperty(this, '_defaults', {
	        get: function get() {
	            return defaults;
	        }
	    });

	    container = (0, _jquery2.default)('#' + root);
	    if (!container.length) {
	        throw new Error('The container is not found!');
	    }

	    Object.defineProperty(this, '_container', {
	        get: function get() {
	            return container;
	        }
	    });

	    Object.defineProperty(this, '_isEqual', {
	        get: function get() {
	            return this._defaults.trigger === 'dd-dropdown';
	        }
	    });

	    state = null;
	    Object.defineProperty(this, '_state', {
	        get: function get() {
	            return state;
	        },
	        set: function set(value) {
	            if (value === COOLDOWN || value === null) {
	                state = value;
	            } else {
	                throw new Error('<state> cannot be anything except for <null> or <1>');
	            }
	        }
	    });

	    // Find the first dropdown
	    firstDD = this._container.find('.dd-dropdown:first');
	    // Find ajacent dropdowns
	    siblings = firstDD.siblings('.dd-dropdown');
	    // Join the first dropdown with the ajacent dropdowns so we get the root (parent) dropdowns
	    rootDD = firstDD.add(siblings);

	    Object.defineProperty(this, '_rootDD', {
	        get: function get() {
	            return rootDD;
	        }
	    });

	    return this;
	};

	Dropdown.hideOutside = function () {
	    var self = this,
	        isTouch;

	    function hide(e) {
	        if (e.type === 'touchstart') {
	            isTouch = true;
	        }
	        if (isTouch && e.type === 'click') {
	            return;
	        }
	        if (!(0, _jquery2.default)(e.target).closest('[data-outside="true"]').length && !(0, _jquery2.default)(e.target).closest('.dd-dropdown').length) {
	            _eclipse2.default.storage.dropdowns.forEach(function (item) {
	                var container = item._container;

	                if (container.data('outside') && container.find('.dd-dropdown--opened').length) {
	                    item._defaults.beforeClose(container);

	                    container.find('.dd-dropdown').removeClass('dd-dropdown--opened dd-dropdown--active dd-dropdown--pressed');
	                    container.find('.dd-drop').css(resetCSS);
	                    container.find('.dd-trigger').removeClass('dd-trigger--active');

	                    item._defaults.afterClose(container);
	                }
	            });
	        }
	    }

	    body.on('touchstart click', hide);
	};
	Dropdown.hideOutside = _eclipse2.default.decorators.once(Dropdown.hideOutside, null);

	Dropdown.addEffect = function (name, handler) {
	    if (!Object.prototype.hasOwnProperty.call(customEffects, name)) {
	        customEffects[name] = handler;
	    }
	};

	Object.defineProperty(Dropdown.prototype, 'init', {
	    value: function value() {
	        init.call(this);
	    },
	    enumerable: false
	});
	Object.defineProperty(Dropdown.prototype, 'reinit', {
	    value: function value(newOptions) {
	        reinit.call(this, newOptions);
	    },
	    enumerable: false
	});
	Object.defineProperty(Dropdown.prototype, 'close', {
	    value: function value(effect, currentItem, hide) {
	        animate.call(this, effect, currentItem, hide);
	    },
	    enumerable: false
	});

	exports.default = Dropdown;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _eclipse = __webpack_require__(1);

	var _eclipse2 = _interopRequireDefault(_eclipse);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var body = (0, _jquery2.default)('body'),
	    currentSpinner,
	    hasSpinnerInstances;

	function update(action) {
	    var self = this;

	    this._timerID = setTimeout(function () {
	        if (action === 'inc') {
	            inc.call(self);
	        } else {
	            dec.call(self);
	        }

	        self._intervalID = setInterval(function () {
	            if (action === 'inc') {
	                inc.call(self);
	            } else {
	                dec.call(self);
	            }
	        }, self._defaults.speed);
	    }, self._defaults.delay);
	}

	function inc() {
	    var amount = parseFloat(this._field.val()),
	        max = parseFloat(this._defaults.max),
	        step = parseFloat(this._defaults.step),
	        precision = parseInt(this._defaults.precision, 10) || 0;

	    if (!isNaN(max) && amount < max) {
	        if (max - amount < step) {
	            amount += max - amount;
	        } else {
	            amount += step;
	        }

	        this._field.val(amount.toFixed(precision) + (this._field.data('addition') || ''));
	    } else if (isNaN(max)) {
	        amount += step;

	        this._field.val(amount.toFixed(precision) + (this._field.data('addition') || ''));
	    }
	}

	function dec() {
	    var amount = parseFloat(this._field.val()),
	        min = parseFloat(this._defaults.min),
	        step = parseFloat(this._defaults.step),
	        precision = parseInt(this._defaults.precision, 10) || 0;

	    if (!isNaN(min) && amount > min) {
	        if (amount - step < min) {
	            amount -= amount - min;
	        } else {
	            amount -= step;
	        }

	        this._field.val(amount.toFixed(precision) + (this._field.data('addition') || ''));
	    } else if (isNaN(min)) {
	        amount -= step;

	        this._field.val(amount.toFixed(precision) + (this._field.data('addition') || ''));
	    }
	}

	function reinit(newOptions) {
	    var pos = _eclipse2.default.storage.spinners.indexOf(this);

	    if (pos !== -1) {
	        _eclipse2.default.storage.spinners.splice(pos, 1);
	    }

	    if (_eclipse2.default.helpers.getClass(newOptions) === 'Object') {
	        _jquery2.default.extend(this._defaults, newOptions);
	    }

	    _eclipse2.default.storage.spinners.push(this);
	}

	function init() {
	    _eclipse2.default.storage.spinners.push(this);

	    if (!hasSpinnerInstances) {
	        hasSpinnerInstances = true;
	        delegate();
	    }
	}

	// Delegation
	function findSpinner(e) {
	    var target = (0, _jquery2.default)(e.target),
	        spinnerContainer = target.closest('[data-spinner]'),
	        spinner,
	        i;

	    if (!spinnerContainer.length) {
	        return false;
	    }

	    for (i = 0; i < _eclipse2.default.storage.spinners.length; i += 1) {
	        if (_eclipse2.default.storage.spinners[i]._container[0] === spinnerContainer[0]) {
	            spinner = _eclipse2.default.storage.spinners[i];
	            break;
	        }
	    }

	    return spinner;
	}

	function delegate() {
	    body.on('click', function (e) {
	        var spinner, target, control;

	        target = (0, _jquery2.default)(e.target);
	        control = target.closest('.sp-control');

	        if (!control.length) {
	            return;
	        }

	        spinner = findSpinner(e);

	        if (!spinner) {
	            return;
	        }

	        if (spinner._defaults.shouldPreventDefault) {
	            e.preventDefault();
	        }

	        if (control.hasClass('sp-control--plus')) {
	            inc.call(spinner);
	        } else if (control.hasClass('sp-control--minus')) {
	            dec.call(spinner);
	        }
	    });
	    body.on('change blur', function (e) {
	        var spinner, target, field, val, min, max;

	        target = (0, _jquery2.default)(e.target);
	        field = target.closest('.sp-field');

	        if (!field.length) {
	            return;
	        }

	        spinner = findSpinner(e);

	        if (!spinner) {
	            return;
	        }

	        val = field.val();
	        min = parseFloat(spinner._defaults.min);
	        max = parseFloat(spinner._defaults.max);

	        if (parseFloat(val) > max && !isNaN(max)) {
	            field.val(max);
	        } else if (parseFloat(val) < min && !isNaN(min)) {
	            field.val(min);
	        } else if (!_eclipse2.default.helpers.isNumeric(val)) {
	            field.val(spinner._defaults.initial + (field.data('addition') || ''));
	        }

	        field.val(parseFloat(field.val()).toFixed(parseInt(spinner._defaults.precision, 10) || 0) + (field.data('addition') || ''));
	    });
	    body.on('keydown', function (e) {
	        var spinner, target, field;

	        target = (0, _jquery2.default)(e.target);
	        field = target.closest('.sp-field');

	        if (!field.length) {
	            return;
	        }

	        spinner = findSpinner(e);

	        if (!spinner) {
	            return;
	        }
	        spinner.previousValue = field.val();
	    });
	    body.on('input', function (e) {
	        var spinner, target, field, min, max, val;

	        target = (0, _jquery2.default)(e.target);
	        field = target.closest('.sp-field');

	        if (!field.length) {
	            return;
	        }

	        spinner = findSpinner(e);

	        if (!spinner) {
	            return;
	        }

	        min = parseFloat(spinner._defaults.min), max = parseFloat(spinner._defaults.max);
	        val = field.val().replace(new RegExp(field.data('addition'), 'g'), '');

	        if (!_eclipse2.default.helpers.isNumeric(val) && val !== '') {
	            if (val === '-' && (min < 0 || max < 0)) {
	                return;
	            }
	            field.val(spinner.previousValue);
	        }
	    });
	    body.on('touchstart mousedown', function (e) {
	        var isTouch = false;

	        return function (e) {
	            var spinner, target, control;

	            if (e.type === 'touchstart') {
	                isTouch = true;
	            }
	            if (e.type === 'mousedown' && isTouch) {
	                return;
	            }

	            target = (0, _jquery2.default)(e.target);
	            control = target.closest('.sp-control');

	            if (!control.length) {
	                return;
	            }

	            spinner = findSpinner(e);

	            if (!spinner || !spinner._defaults.launchOnClamp) {
	                return;
	            }

	            currentSpinner = spinner;

	            if (control.hasClass('sp-control--plus')) {
	                update.call(spinner, 'inc');
	            } else if (control.hasClass('sp-control--minus')) {
	                update.call(spinner, 'dec');
	            }
	        };
	    }());
	    body.on('touchend mouseup', function () {
	        var isTouch = false;

	        return function (e) {
	            var spinner;

	            if (e.type === 'touchend') {
	                isTouch = true;
	            }
	            if (e.type === 'mouseup' && isTouch) {
	                return;
	            }

	            spinner = findSpinner(e);

	            if (!spinner || !spinner._defaults.launchOnClamp) {
	                return;
	            }

	            currentSpinner = null;
	            clearTimeout(spinner._timerID);
	            clearInterval(spinner._intervalID);
	        };
	    }());
	    body.on('touchmove mouseout', function () {
	        var isTouch = false;

	        return function (e) {
	            var spinner, touch, target, x, y, elUnderFinger;

	            if (e.type === 'touchmove') {
	                isTouch = true;
	            }
	            if (e.type === 'mouseout' && isTouch) {
	                return;
	            }

	            if (!currentSpinner || !currentSpinner._defaults.launchOnClamp) {
	                return;
	            }

	            if (e.type === 'touchmove') {
	                touch = e.touches[0];
	                x = touch.clientX;
	                y = touch.clientY;
	                elUnderFinger = (0, _jquery2.default)(document.elementFromPoint(x, y));

	                if (elUnderFinger.closest('[data-spinner]')[0] === currentSpinner._container[0]) {
	                    return;
	                }

	                clearTimeout(currentSpinner._timerID);
	                clearInterval(currentSpinner._intervalID);
	                currentSpinner = null;
	            } else {
	                target = (0, _jquery2.default)(e.relatedTarget).closest('[data-spinner]');

	                if (target[0] === currentSpinner._container[0]) {
	                    return;
	                }

	                clearTimeout(currentSpinner._timerID);
	                clearInterval(currentSpinner._intervalID);
	                currentSpinner = null;
	            }
	        };
	    }());
	}
	// Delegation (END)

	function Spinner(root, options) {
	    var defaults, container, controls, plus, minus, field, timerID, intervalID;

	    defaults = _eclipse2.default.helpers.createMap();
	    defaults.min = null;
	    defaults.max = null;
	    defaults.initial = 0;
	    defaults.precision = 0;
	    defaults.step = 1;
	    defaults.delay = 200;
	    defaults.speed = 100;
	    defaults.shouldPreventDefault = true;
	    defaults.launchOnClamp = true;

	    timerID = null;
	    intervalID = null;

	    this.previousValue = null;

	    container = (0, _jquery2.default)('#' + root);
	    controls = container.find('.sp-control');
	    plus = container.find('.sp-control--plus');
	    minus = container.find('.sp-control--minus');
	    field = container.find('.sp-field');

	    Object.defineProperties(this, {
	        _timerID: {
	            get: function get() {
	                return timerID;
	            },
	            set: function set(value) {
	                if (typeof value === 'number') {
	                    timerID = value;
	                } else {
	                    throw new Error('<timerID> can only be <number>');
	                }
	            }
	        },
	        _intervalID: {
	            get: function get() {
	                return intervalID;
	            },
	            set: function set(value) {
	                if (typeof value === 'number') {
	                    intervalID = value;
	                } else {
	                    throw new Error('<intervalID> can only be <number>');
	                }
	            }
	        },
	        _container: {
	            get: function get() {
	                return container;
	            }
	        },
	        _controls: {
	            get: function get() {
	                return controls;
	            }
	        },
	        _plus: {
	            get: function get() {
	                return plus;
	            }
	        },
	        _minus: {
	            get: function get() {
	                return minus;
	            }
	        },
	        _field: {
	            get: function get() {
	                return field;
	            }
	        }
	    });

	    if (_eclipse2.default.helpers.getClass(options) === 'Object') {
	        _jquery2.default.extend(defaults, options);
	    }

	    Object.defineProperty(this, '_defaults', {
	        get: function get() {
	            return defaults;
	        }
	    });

	    return this;
	};

	Object.defineProperty(Spinner.prototype, 'reinit', {
	    value: function value(newOptions) {
	        reinit.call(this, newOptions);
	    },
	    enumerable: false
	});
	Object.defineProperty(Spinner.prototype, 'init', {
	    value: function value() {
	        init.call(this);
	    },
	    enumerable: false
	});

	exports.default = Spinner;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.adaptiveTabs = exports.staticTabs = undefined;

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _eclipse = __webpack_require__(1);

	var _eclipse2 = _interopRequireDefault(_eclipse);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var body = (0, _jquery2.default)('body'),
	    effects = {
	    toggle: 'toggle',
	    slide: 'slideToggle',
	    fade: 'fadeToggle'
	},
	    staticTabs,
	    adaptiveTabs,
	    hasStaticTabsInstances = false,
	    hasAdaptiveTabsInstances = false;

	function findTabs(e, tabsType) {
	    var target = (0, _jquery2.default)(e.target),
	        tabsContainer = target.closest('[data-tabs]'),
	        tabs,
	        i;

	    if (!tabsContainer.length) {
	        return false;
	    }

	    for (i = 0; i < _eclipse2.default.storage[tabsType].length; i += 1) {
	        if (_eclipse2.default.storage[tabsType][i]._container[0] === tabsContainer[0]) {
	            tabs = _eclipse2.default.storage[tabsType][i];
	            break;
	        }
	    }

	    return tabs;
	}

	// Tabs (static)
	(function () {
	    function switchTab(tabs) {
	        var that = (0, _jquery2.default)(this),
	            id = that.data('tab'),
	            effect = effects[tabs._defaults.effect] ? effects[tabs._defaults.effect] : 'toggle',
	            classAction;

	        if (!tabs._isAnimationFinished || that.hasClass('t-tab-nav-item--active') && !tabs._defaults.toggleTabs) {
	            return;
	        }

	        classAction = tabs._defaults.toggleTabs ? 'toggleClass' : 'addClass';

	        tabs._defaults.beforeAnimation();
	        tabs._isAnimationFinished = false;

	        if (tabs._defaults.hideAjacentTabs) {
	            tabs._desktopTabNav.not('[data-tab="' + id + '"]').removeClass('t-tab-nav-item--active');
	            tabs._tabContent.not('[data-tab="' + id + '"]').removeClass('t-tab-item--active');
	        }

	        that[classAction]('t-tab-nav-item--active');

	        tabs._tabContent.filter('[data-tab="' + id + '"]').stop(true, true)[effect](parseInt(tabs._defaults.speed, 10) || 0, function () {
	            (0, _jquery2.default)(this)[classAction]('t-tab-item--active').removeAttr('style');

	            tabs._isAnimationFinished = true;

	            tabs._defaults.afterAnimation();

	            if (tabs._defaults.scrollToActive) {
	                _eclipse2.default.DOM.scrollBody(that, tabs._defaults.scrollCorrection);
	            }
	        });
	    }

	    function reinit(newOptions) {
	        var pos = _eclipse2.default.storage.staticTabs.indexOf(this);

	        if (pos !== -1) {
	            _eclipse2.default.storage.staticTabs.splice(pos, 1);
	        }

	        if (_eclipse2.default.helpers.getClass(newOptions) === 'Object') {
	            _jquery2.default.extend(this._defaults, newOptions);
	        }

	        _eclipse2.default.storage.staticTabs.push(this);
	    }

	    function init() {
	        _eclipse2.default.storage.staticTabs.push(this);

	        if (!hasStaticTabsInstances) {
	            hasStaticTabsInstances = true;
	            delegate();
	        }
	    }
	    // Delegation
	    function delegate() {
	        body.on('click', function (e) {
	            var tabs, target, tabNavItem;

	            target = (0, _jquery2.default)(e.target);
	            tabNavItem = target.closest('.t-tab-nav-item');

	            if (!tabNavItem.length) {
	                return;
	            }

	            tabs = findTabs(e, 'staticTabs');

	            if (!tabs) {
	                return;
	            }

	            if (tabs._defaults.shouldPreventDefault) {
	                e.preventDefault();
	            }

	            switchTab.call(tabNavItem, tabs);
	        });
	    }
	    // Delegation (END)

	    function StaticTabs(container, options) {
	        var defaults,
	            isAnimationFinished = true,
	            container,
	            desktopTabNav,
	            tabContent;

	        defaults = _eclipse2.default.helpers.createMap();

	        defaults.effect = 'toggle';
	        defaults.speed = 0;
	        defaults.shouldPreventDefault = true;
	        defaults.toggleTabs = false;
	        defaults.hideAjacentTabs = true;
	        defaults.scrollToActive = false;
	        defaults.scrollCorrection = 0;
	        defaults.beforeAnimation = _jquery2.default.noop;
	        defaults.afterAnimation = _jquery2.default.noop;

	        Object.defineProperty(this, '_isAnimationFinished', {
	            get: function get() {
	                return isAnimationFinished;
	            },
	            set: function set(value) {
	                if (typeof value === 'boolean') {
	                    isAnimationFinished = value;
	                } else {
	                    throw new Error('<isAnimationFinished> can only be <boolean>');
	                }
	            }
	        });

	        container = (0, _jquery2.default)('#' + container);
	        desktopTabNav = container.find('.t-tab-nav-item');
	        tabContent = container.find('.t-tab-item');

	        Object.defineProperties(this, {
	            _container: {
	                get: function get() {
	                    return container;
	                }
	            },
	            _desktopTabNav: {
	                get: function get() {
	                    return desktopTabNav;
	                }
	            },
	            _tabContent: {
	                get: function get() {
	                    return tabContent;
	                }
	            }
	        });

	        if (_eclipse2.default.helpers.getClass(options) === 'Object') {
	            _jquery2.default.extend(defaults, options);
	        }

	        Object.defineProperty(this, '_defaults', {
	            get: function get() {
	                return defaults;
	            }
	        });

	        return this;
	    };

	    Object.defineProperty(StaticTabs.prototype, 'reinit', {
	        value: function value(newOptions) {
	            reinit.call(this, newOptions);
	        }
	    });
	    Object.defineProperty(StaticTabs.prototype, 'init', {
	        value: function value() {
	            init.call(this);
	        }
	    });
	    exports.staticTabs = staticTabs = StaticTabs;
	})();
	// Tabs (static) (END)

	// Tabs (adaptive)
	(function () {
	    function switchTabDesktop(tabs) {
	        var that = (0, _jquery2.default)(this),
	            id = that.data('tab'),
	            effect = effects[tabs._defaults.desktopEffect] ? effects[tabs._defaults.desktopEffect] : 'toggle',
	            desktopClassAction,
	            mobileClassAction;

	        if (!tabs._isAnimationFinished || that.hasClass('t-tab-nav-item--active_desktop') && !tabs._defaults.toggleTabsDesktop) {
	            return;
	        }

	        desktopClassAction = tabs._defaults.toggleTabsDesktop ? 'toggleClass' : 'addClass';
	        mobileClassAction = tabs._defaults.toggleTabsMobile ? 'toggleClass' : 'addClass';

	        tabs._defaults.beforeAnimation();
	        tabs._isAnimationFinished = false;

	        if (tabs._defaults.hideAjacentTabsDesktop) {
	            tabs._desktopTabNav.not('[data-tab="' + id + '"]').removeClass('t-tab-nav-item--active t-tab-nav-item--active_desktop');
	            tabs._tabContent.not('[data-tab="' + id + '"]').removeClass('t-tab-item--active t-tab-item--active_desktop');
	        }

	        if (tabs._defaults.bindMobileToDesktop) {
	            tabs._mobileTabNav.not('[data-tab="' + id + '"]').removeClass('t-tab-nav-item--active t-tab-nav-item--active_mobile');
	            tabs._tabContent.not('[data-tab="' + id + '"]').removeClass('t-tab-item--active_mobile');
	            tabs._mobileTabNav.filter('[data-tab="' + id + '"]').addClass('t-tab-nav-item--active t-tab-nav-item--active_mobile');
	            tabs._tabContent.filter('[data-tab="' + id + '"]').addClass('t-tab-item--active_mobile');
	        }

	        that[desktopClassAction]('t-tab-nav-item--active t-tab-nav-item--active_desktop');

	        tabs._tabContent.filter('[data-tab="' + id + '"]').stop(true, true)[effect](parseInt(tabs._defaults.desktopSpeed, 10) || 0, function () {
	            (0, _jquery2.default)(this)[desktopClassAction]('t-tab-item--active t-tab-item--active_desktop').removeAttr('style');

	            tabs._isAnimationFinished = true;

	            tabs._defaults.afterAnimation();

	            if (tabs._defaults.scrollToActiveDesktop) {
	                _eclipse2.default.DOM.scrollBody(that, tabs._defaults.scrollCorrectionDesktop);
	            }
	        });
	    }

	    function switchTabMobile(tabs) {
	        var that = (0, _jquery2.default)(this),
	            id = (0, _jquery2.default)(this).data('tab'),
	            effect = effects[tabs._defaults.mobileEffect] ? effects[tabs._defaults.mobileEffect] : 'toggle',
	            mobileClassAction,
	            desktopClassAction;

	        if (!tabs._isAnimationFinished || that.hasClass('t-tab-nav-item--active_mobile') && !tabs._defaults.toggleTabsMobile) {
	            return;
	        }

	        mobileClassAction = tabs._defaults.toggleTabsMobile ? 'toggleClass' : 'addClass';
	        desktopClassAction = tabs._defaults.toggleTabsDesktop ? 'toggleClass' : 'addClass';

	        tabs._defaults.beforeAnimation();
	        tabs._isAnimationFinished = false;

	        if (tabs._defaults.hideAjacentTabsMobile) {
	            tabs._mobileTabNav.not('[data-tab="' + id + '"]').removeClass('t-tab-nav-item--active t-tab-nav-item--active_mobile');
	            tabs._tabContent.not('[data-tab="' + id + '"]').removeClass('t-tab-item--active t-tab-item--active_mobile');
	        }

	        if (tabs._defaults.bindDesktopToMobile) {
	            tabs._desktopTabNav.not('[data-tab="' + id + '"]').removeClass('t-tab-nav-item--active t-tab-nav-item--active_desktop');
	            tabs._tabContent.not('[data-tab="' + id + '"]').removeClass('t-tab-item--active_desktop');
	            tabs._desktopTabNav.filter('[data-tab="' + id + '"]').addClass('t-tab-nav-item--active t-tab-nav-item--active_desktop');
	            tabs._tabContent.filter('[data-tab="' + id + '"]').addClass('t-tab-item--active_desktop');
	        }

	        that[mobileClassAction]('t-tab-nav-item--active t-tab-nav-item--active_mobile');

	        tabs._tabContent.filter('[data-tab="' + id + '"]').stop(true, true)[effect](parseInt(tabs._defaults.mobileSpeed, 10) || 0, function () {
	            (0, _jquery2.default)(this)[mobileClassAction]('t-tab-item--active t-tab-item--active_mobile').removeAttr('style');

	            tabs._isAnimationFinished = true;

	            tabs._defaults.afterAnimation();

	            if (tabs._defaults.scrollToActiveMobile) {
	                _eclipse2.default.DOM.scrollBody(that, tabs._defaults.scrollCorrectionMobile);
	            }
	        });
	    }

	    function reinit(newOptions) {
	        var pos = _eclipse2.default.storage.adaptiveTabs.indexOf(this);

	        if (pos !== -1) {
	            _eclipse2.default.storage.adaptiveTabs.splice(pos, 1);
	        }

	        if (_eclipse2.default.helpers.getClass(newOptions) === 'Object') {
	            _jquery2.default.extend(this._defaults, newOptions);
	        }

	        _eclipse2.default.storage.adaptiveTabs.push(this);
	    }

	    function init() {
	        _eclipse2.default.storage.adaptiveTabs.push(this);

	        if (!hasAdaptiveTabsInstances) {
	            hasAdaptiveTabsInstances = true;
	            delegate();
	        }
	    }

	    // Delegation
	    function delegate() {
	        body.on('click', function (e) {
	            var tabs, target, tabNavItem;

	            target = (0, _jquery2.default)(e.target);
	            tabNavItem = target.closest('.t-tab-nav-item');

	            if (!tabNavItem.length) {
	                return;
	            }

	            tabs = findTabs(e, 'adaptiveTabs');

	            if (!tabs) {
	                return;
	            }

	            if (tabs._defaults.shouldPreventDefault) {
	                e.preventDefault();
	            }

	            if (tabNavItem.hasClass('t-tab-nav-item--desktop')) {
	                switchTabDesktop.call(tabNavItem, tabs);
	            } else if (tabNavItem.hasClass('t-tab-nav-item--mobile')) {
	                switchTabMobile.call(tabNavItem, tabs);
	            }
	        });
	    }
	    // Delegation (END)

	    function AdaptiveTabs(container, options) {
	        var defaults,
	            isAnimationFinished = true,
	            container,
	            desktopTabNav,
	            mobileTabNav,
	            tabContent;

	        defaults = _eclipse2.default.helpers.createMap();

	        defaults.desktopEffect = 'toggle';
	        defaults.desktopSpeed = 0;
	        defaults.shouldPreventDefault = true;
	        defaults.mobileEffect = 'slide';
	        defaults.mobileSpeed = 300;
	        defaults.hideAjacentTabsMobile = true;
	        defaults.hideAjacentTabsDesktop = true;
	        defaults.scrollToActiveMobile = true;
	        defaults.scrollCorrectionMobile = 0;
	        defaults.scrollToActiveDesktop = false;
	        defaults.scrollCorrectionDesktop = 0;
	        defaults.toggleTabsDesktop = false;
	        defaults.toggleTabsMobile = true;
	        defaults.bindMobileToDesktop = true;
	        defaults.bindDesktopToMobile = true;
	        defaults.beforeAnimation = _jquery2.default.noop;
	        defaults.afterAnimation = _jquery2.default.noop;

	        Object.defineProperty(this, '_isAnimationFinished', {
	            get: function get() {
	                return isAnimationFinished;
	            },
	            set: function set(value) {
	                if (typeof value === 'boolean') {
	                    isAnimationFinished = value;
	                } else {
	                    throw new Error('<isAnimationFinished> can only be <boolean>');
	                }
	            }
	        });

	        container = (0, _jquery2.default)('#' + container);
	        desktopTabNav = container.find('.t-tab-nav-item--desktop');
	        mobileTabNav = container.find('.t-tab-nav-item--mobile');
	        tabContent = container.find('.t-tab-item');

	        Object.defineProperties(this, {
	            _container: {
	                get: function get() {
	                    return container;
	                }
	            },
	            _desktopTabNav: {
	                get: function get() {
	                    return desktopTabNav;
	                }
	            },
	            _mobileTabNav: {
	                get: function get() {
	                    return mobileTabNav;
	                }
	            },
	            _tabContent: {
	                get: function get() {
	                    return tabContent;
	                }
	            }
	        });

	        if (_eclipse2.default.helpers.getClass(options) === 'Object') {
	            _jquery2.default.extend(defaults, options);
	        }
	        Object.defineProperty(this, '_defaults', {
	            get: function get() {
	                return defaults;
	            }
	        });

	        return this;
	    };

	    Object.defineProperty(AdaptiveTabs.prototype, 'reinit', {
	        value: function value(newOptions) {
	            reinit.call(this, newOptions);
	        }
	    });
	    Object.defineProperty(AdaptiveTabs.prototype, 'init', {
	        value: function value() {
	            init.call(this);
	        }
	    });

	    exports.adaptiveTabs = adaptiveTabs = AdaptiveTabs;
	})();

	exports.staticTabs = staticTabs;
	exports.adaptiveTabs = adaptiveTabs;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _eclipse = __webpack_require__(1);

	var _eclipse2 = _interopRequireDefault(_eclipse);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var body = (0, _jquery2.default)('body'),
	    triggerCls = 'bundle-trigger--active',
	    containerCls = 'bundle-container--active',
	    overlayCls = 'bundle-overlay--visible',
	    hasBundleInstances = false;

	function findBundle(e) {
	    var target = (0, _jquery2.default)(e.target),
	        bundleEl = target.closest('[data-bundle]'),
	        bundle,
	        i;

	    if (!bundleEl.length) {
	        return false;
	    }

	    for (i = 0; i < _eclipse2.default.storage.bundles.length; i += 1) {
	        if (_eclipse2.default.storage.bundles[i]._id === bundleEl.data('bundle-id')) {
	            bundle = _eclipse2.default.storage.bundles[i];
	            break;
	        }
	    }

	    return bundle;
	}

	function switchBundle(options, action) {
	    this._trigger[action + 'Class'](triggerCls);
	    this._container[action + 'Class'](containerCls);

	    if (this._trigger.data('body')) {
	        body[action + 'Class']('body--hidden');
	    }
	    if (this._trigger.data('overlay')) {
	        this._overlay[action + 'Class'](overlayCls);
	    }

	    options.callback(this._trigger, this._close, this._container);
	}

	function hideOnOtherBundleClick( /*trigger, close, container, overlay*/id) {
	    _eclipse2.default.storage.bundles.forEach(function (item) {
	        var options = item._defaults;
	        // if ((item._trigger !== trigger || item._close !== close || item._container !== container || item._overlay !== overlay) && item._trigger.hasClass(triggerCls)) {
	        //     switchBundle.call(item, options, 'remove');
	        // }
	        if (item._id !== id && item._trigger.hasClass(triggerCls) && item._trigger.data('other-bundles')) {
	            switchBundle.call(item, options, 'remove');
	        }
	    });
	}

	function reinit(newOptions) {
	    var pos = _eclipse2.default.storage.bundles.indexOf(this);

	    if (pos !== -1) {
	        _eclipse2.default.storage.bundles.splice(pos, 1);
	    }

	    if (_eclipse2.default.helpers.getClass(newOptions) === 'Object') {
	        _jquery2.default.extend(this._defaults, newOptions);
	    }

	    _eclipse2.default.storage.bundles.push(this);
	}

	function init() {
	    _eclipse2.default.storage.bundles.push(this);

	    if (!hasBundleInstances) {
	        hasBundleInstances = true;
	        delegate();
	    }
	}

	// Delegation
	function delegate() {
	    body.on('click', function (e) {
	        var bundle = findBundle(e),
	            target,
	            action;

	        if (!bundle) {
	            return;
	        }

	        target = (0, _jquery2.default)(e.target).closest('[data-bundle]');
	        action = target.data('bundle-action');

	        if (!action) {
	            return;
	        }

	        if (bundle._defaults.shouldPreventDefault) {
	            e.preventDefault();
	        }

	        hideOnOtherBundleClick(bundle._id);
	        switchBundle.call(bundle, bundle._defaults, action === 'toggle' ? 'toggle' : 'remove');
	    });
	}
	// Delegation (END)

	function Bundle(trigger, close, options) {
	    var defaults = _eclipse2.default.helpers.createMap(),
	        trigger,
	        container,
	        overlay,
	        close,
	        id;

	    defaults.shouldPreventDefault = true;
	    defaults.callback = _jquery2.default.noop;

	    if (_eclipse2.default.helpers.getClass(options) === 'Object') {
	        _jquery2.default.extend(defaults, options);
	    }

	    Object.defineProperty(this, '_defaults', {
	        get: function get() {
	            return defaults;
	        }
	    });

	    trigger = (0, _jquery2.default)('.' + trigger);
	    container = (0, _jquery2.default)('.' + trigger.data('container'));
	    overlay = trigger.data('overlay') ? (0, _jquery2.default)('.' + trigger.data('overlay')) : null;
	    close = close ? (0, _jquery2.default)('.' + close) : null;

	    id = trigger.first().data('bundle-id');

	    Object.defineProperties(this, {
	        _trigger: {
	            get: function get() {
	                return trigger;
	            }
	        },
	        _container: {
	            get: function get() {
	                return container;
	            }
	        },
	        _overlay: {
	            get: function get() {
	                return overlay;
	            }
	        },
	        _close: {
	            get: function get() {
	                return close;
	            }
	        },
	        _id: {
	            get: function get() {
	                return id;
	            }
	        }
	    });

	    return this;
	}

	Object.defineProperty(Bundle.prototype, 'reinit', {
	    value: function value(newOptions) {
	        reinit.call(this, newOptions);
	    },
	    enumerable: false
	});
	Object.defineProperty(Bundle.prototype, 'init', {
	    value: function value() {
	        init.call(this);
	    },
	    enumerable: false
	});

	Bundle.hideOutside = function () {
	    var isTouch;

	    function hide(e) {
	        if (e.type === 'touchstart') {
	            isTouch = true;
	        }
	        if (isTouch && e.type === 'click') {
	            return;
	        }
	        if (!(0, _jquery2.default)(e.target).closest('[data-bundle-outside="true"]').length) {
	            _eclipse2.default.storage.bundles.forEach(function (item) {
	                if (item._trigger.hasClass(triggerCls)) {
	                    switchBundle.call(item, item._defaults, 'remove');
	                }
	            });
	        }
	    }

	    body.on('touchstart click', hide);
	};
	Bundle.hideOutside = _eclipse2.default.decorators.once(Bundle.hideOutside, null);

	exports.default = Bundle;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _eclipse = __webpack_require__(1);

	var _eclipse2 = _interopRequireDefault(_eclipse);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var body = (0, _jquery2.default)('body'),
	    hasSearchInstances = false;

	function findSearch(e) {
	    var target = (0, _jquery2.default)(e.target),
	        searchContainer = target.closest('[data-search]'),
	        search,
	        i;

	    if (!searchContainer.length) {
	        return false;
	    }

	    for (i = 0; i < _eclipse2.default.storage.searches.length; i += 1) {
	        if (_eclipse2.default.storage.searches[i]._container[0] === searchContainer[0]) {
	            search = _eclipse2.default.storage.searches[i];
	            break;
	        }
	    }

	    return search;
	}

	function reinit(newOptions) {
	    var pos = _eclipse2.default.storage.searches.indexOf(this);

	    if (pos !== -1) {
	        _eclipse2.default.storage.searches.splice(pos, 1);
	    }

	    if (_eclipse2.default.helpers.getClass(newOptions) === 'Object') {
	        _jquery2.default.extend(this._defaults, newOptions);
	    }

	    _eclipse2.default.storage.searches.push(this);
	}

	function init() {
	    _eclipse2.default.storage.searches.push(this);

	    if (!hasSearchInstances) {
	        hasSearchInstances = true;
	        delegate();
	    }
	}

	// Delegation
	function delegate() {
	    body.on('input', function (e) {
	        var search = findSearch(e),
	            reg;

	        if (!search) {
	            return;
	        }

	        reg = new RegExp('(' + search._field.val() + ')', 'gi');

	        search._boxes.each(function () {
	            var that = (0, _jquery2.default)(this);

	            that.html(that.html().replace(/<\/?\w[1-6]?\w*\s*.*?>/g, ''));

	            if (that.text().search(reg) !== -1) {
	                that.html(that.html().replace(reg, '<span class="s-match">$1</span>'));
	                that.addClass('s-match--visible').removeClass('s-match--invisible');
	            } else {
	                that.addClass('s-match--invisible').removeClass('s-match--visible');
	            }
	        });

	        if (search._defaults.invokeCallback) {
	            search._defaults.callback();
	        }
	    });
	}
	// Delegation (END)

	function Search(container, options) {
	    var defaults = _eclipse2.default.helpers.createMap(),
	        container,
	        field,
	        boxes;

	    defaults.shouldPreventDefault = true;
	    defaults.invokeCallback = false;
	    defaults.callback = _jquery2.default.noop;

	    container = (0, _jquery2.default)('#' + container);
	    field = container.find('.s-field');
	    boxes = container.find('[data-q="true"]');

	    Object.defineProperties(this, {
	        _container: {
	            get: function get() {
	                return container;
	            }
	        },
	        _field: {
	            get: function get() {
	                return field;
	            }
	        },
	        _boxes: {
	            get: function get() {
	                return boxes;
	            }
	        }
	    });

	    if (_eclipse2.default.helpers.getClass(options) === 'Object') {
	        _jquery2.default.extend(defaults, options);
	    }
	    Object.defineProperty(this, '_defaults', {
	        get: function get() {
	            return defaults;
	        }
	    });

	    return this;
	}

	Object.defineProperty(Search.prototype, 'reinit', {
	    value: function value(newOptions) {
	        reinit.call(this, newOptions);
	    },
	    enumerable: false
	});
	Object.defineProperty(Search.prototype, 'init', {
	    value: function value() {
	        init.call(this);
	    },
	    enumerable: false
	});

	exports.default = Search;

/***/ }
/******/ ])
});
;