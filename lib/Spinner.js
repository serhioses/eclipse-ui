'use strict';

import eclipse from 'eclipse';

var body = $('body'),
    currentSpinner;

function update (action) {
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

function inc () {
    var amount = parseFloat(this._field.val()),
        max = parseFloat(this._defaults.max),
        step = parseFloat(this._defaults.step),
        precision = parseInt(this._defaults.precision, 10) || 0;

    if (!isNaN(max) && amount < max) {
        if ((max - amount) < step) {
            amount += (max - amount);
        } else {
            amount += step;
        }

        this._field.val(amount.toFixed(precision));
    } else if (isNaN(max)) {
        amount += step;

        this._field.val(amount.toFixed(precision));
    }
}

function dec () {
    var amount = parseFloat(this._field.val()),
        min = parseFloat(this._defaults.min),
        step = parseFloat(this._defaults.step),
        precision = parseInt(this._defaults.precision, 10) || 0;

    if (!isNaN(min) && amount > min) {
        if ((amount - step) < min) {
            amount -=  (amount - min);
        } else {
            amount -= step;
        }

        this._field.val(amount.toFixed(precision));
    } else if (isNaN(min)) {
        amount -= step;
        
        this._field.val(amount.toFixed(precision));
    }
}

function reinit (newOptions) {
    var pos = eclipse.storage.spinners.indexOf(this);

    if (pos !== -1) {
        eclipse.storage.spinners.splice(pos, 1);
    }

    if (eclipse.helpers.getClass(newOptions) === 'Object') {
        $.extend(this._defaults, newOptions);
    }

    eclipse.storage.spinners.push(this);
}

function init () {
    eclipse.storage.spinners.push(this);
}

// Delegation
function findSpinner (e) {
    var target = $(e.target),
        spinnerContainer = target.closest('[data-spinner]'),
        spinner, i;

    if (!spinnerContainer.length) {
        return false;
    }

    for (i = 0; i < eclipse.storage.spinners.length; i += 1) {
        if (eclipse.storage.spinners[i]._container[0] === spinnerContainer[0]) {
            spinner = eclipse.storage.spinners[i];
            break;
        }
    }

    return spinner;
}
body.on('click', function (e) {
    var spinner, target, control;

    target = $(e.target);
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
    var spinner, target, field,
        val, min, max;

    target = $(e.target);
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
    } else if (!eclipse.helpers.isNumeric(val)) {
        field.val(spinner._defaults.initial);
    }
    field.val(parseFloat(field.val()).toFixed(parseInt(spinner._defaults.precision, 10) || 0));
});
body.on('keydown', function (e) {
    var spinner, target, field;

    target = $(e.target);
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
    var spinner, target, field,
        min, max;

    target = $(e.target);
    field = target.closest('.sp-field');

    if (!field.length) {
        return;
    }

    spinner = findSpinner(e);

    if (!spinner) {
        return;
    }

    min = parseFloat(spinner._defaults.min),
    max = parseFloat(spinner._defaults.max);

    if (!eclipse.helpers.isNumeric(field.val()) && field.val() !== '') {
        if (field.val() === '-' && (min < 0 || max < 0)) {
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

        target = $(e.target);
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
        var spinner, touch, target,
            x, y, elUnderFinger;

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
            elUnderFinger = $(document.elementFromPoint(x, y));


            if (elUnderFinger.closest('[data-spinner]')[0] === currentSpinner._container[0]) {
                return;
            }

            clearTimeout(currentSpinner._timerID);
            clearInterval(currentSpinner._intervalID);
            currentSpinner = null;
        } else {
            target = $(e.relatedTarget).closest('[data-spinner]');

            if (target[0] === currentSpinner._container[0]) {
                return;
            }

            clearTimeout(currentSpinner._timerID);
            clearInterval(currentSpinner._intervalID);
            currentSpinner = null;
        }
    };
}());
// Delegation (END)

function Spinner (root, options) {
    var defaults,
        container,
        controls, plus, minus, field,
        timerID, intervalID;

    defaults = eclipse.helpers.createMap();
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

    container = $('#' + root);
    controls = container.find('.sp-control');
    plus = container.find('.sp-control--plus');
    minus = container.find('.sp-control--minus');
    field = container.find('.sp-field');

    Object.defineProperties(this, {
        _timerID: {
            get: function () {
                return timerID;
            },
            set: function (value) {
                if (typeof value === 'number') {
                    timerID = value;
                } else {
                    throw new Error('<timerID> can only be <number>');
                }
            }
        },
        _intervalID: {
            get: function () {
                return intervalID;
            },
            set: function (value) {
                if (typeof value === 'number') {
                    intervalID = value;
                } else {
                    throw new Error('<intervalID> can only be <number>');
                }
            }
        },
        _container: {
            get: function () {
                return container;
            }
        },
        _controls: {
            get: function () {
                return  controls;
            }
        },
        _plus: {
            get: function () {
                return plus;
            }
        },
        _minus: {
            get: function () {
                return minus;
            }
        },
        _field: {
            get: function () {
                return field;
            }
        }
    });

    if (eclipse.helpers.getClass(options) === 'Object') {
        $.extend(defaults, options);
    }

    Object.defineProperty(this, '_defaults', {
        get: function () {
            return defaults;
        }
    });

    return this;
};

Object.defineProperty(Spinner.prototype, 'reinit', {
    value: function (newOptions) {
        reinit.call(this, newOptions);
    },
    enumerable: false
});
Object.defineProperty(Spinner.prototype, 'init', {
    value: function () {
        init.call(this);
    },
    enumerable: false
});

export default Spinner;