'use strict';

import eclipse from 'eclipse';

var body = $('body'),
    triggerCls = 'bundle-trigger--active',
    containerCls = 'bundle-container--active',
    overlayCls = 'bundle-overlay--visible',
    bodyCls = 'body--hidden';

function findBundle (e) {
    var target = $(e.target),
        bundleEl = target.closest('[data-bundle]'),
        bundle, i;

    if (!bundleEl.length) {
        return false;
    }

    for (i = 0; i < eclipse.storage.bundles.length; i += 1) {
        if (eclipse.storage.bundles[i]._id === bundleEl.data('bundle-id')) {
            bundle = eclipse.storage.bundles[i];
            break;
        }
    }

    return bundle;
}

function switchBundle (options, action) {
    this._trigger[action + 'Class'](triggerCls);
    this._container[action + 'Class'](containerCls);

    if (this._trigger.data('body')) {
        $('html')[action + 'Class']('html--hidden');
    }
    if (this._trigger.data('overlay')) {
        this._overlay[action + 'Class'](overlayCls);
    }

    options.callback(this._trigger, this._close, this._container);
}

function hideOnOtherBundleClick (trigger, close, container, overlay) {
    eclipse.storage.bundles.forEach(function (item) {
        var options = item._defaults;
        if ((item._trigger !== trigger || item._close !== close || item._container !== container || item._overlay !== overlay) && item._trigger.hasClass(triggerCls)) {
            switchBundle.call(item, options, 'remove');
        }
    });
}

function reinit (newOptions) {
    var pos = eclipse.storage.bundles.indexOf(this);

    if (pos !== -1) {
        eclipse.storage.bundles.splice(pos, 1);
    }

    if (eclipse.helpers.getClass(newOptions) === 'Object') {
        $.extend(this._defaults, newOptions);
    }

    eclipse.storage.bundles.push(this);
}

function init () {
    eclipse.storage.bundles.push(this);  
}

// Delegation
body.on('click', function (e) {
    var bundle = findBundle(e),
        target, action;

    if (!bundle) {
        return;
    }

    target = $(e.target).closest('[data-bundle]');
    action = target.data('bundle-action');

    if (!action) {
        return;
    }

    if (bundle._defaults.shouldPreventDefault) {
        e.preventDefault();
    }

    switchBundle.call(bundle, bundle._defaults, action === 'toggle' ? 'toggle' : 'remove');
});
// Delegation (END)

function Bundle (trigger, close, options) {
    var defaults = eclipse.helpers.createMap(),
        trigger, container, overlay, close,
        id;

    defaults.shouldPreventDefault = true;
    defaults.callback = $.noop;

    if (eclipse.helpers.getClass(options) === 'Object') {
        $.extend(this._defaults, options);
    }

    Object.defineProperty(this, '_defaults', {
        get: function () {
            return defaults;
        }
    });

    trigger = $('.' + trigger);
    container = $('.' + trigger.data('container'));
    overlay = trigger.data('overlay') ? $('.' +  trigger.data('overlay')) : null;
    close = close ? $('.' + close) : null;

    id = trigger.first().data('bundle-id');

    Object.defineProperties(this, {
        _trigger: {
            get: function () {
                return trigger;
            }
        },
        _container: {
            get: function () {
                return container;
            }
        },
        _overlay: {
            get: function () {
                return overlay;
            }
        },
        _close: {
            get: function () {
                return close;
            }
        },
        _id: {
            get: function () {
                return id;
            }
        }
    });

    return this;
}

Object.defineProperty(Bundle.prototype, 'reinit', {
    value: function (newOptions) {
        reinit.call(this, newOptions);
    },
    enumerable: false
});
Object.defineProperty(Bundle.prototype, 'init', {
    value: function () {
        init.call(this);
    },
    enumerable: false
});

Bundle.hideOutside = function () {
    var isTouch;

    function hide (e) {
        if (e.type === 'touchstart') {
            isTouch = true;
        }
        if (isTouch && e.type === 'click') {
            return;
        }
        if (!$(e.target).closest('[data-bundle-outside="true"]').length) {
            eclipse.storage.bundles.forEach(function (item) {
                if (item._trigger.hasClass(triggerCls)) {
                    switchBundle.call(item, item._defaults, 'remove');
                }
            });
        }
    }
    
    body.on('touchstart click', hide);
};
Bundle.hideOutside = eclipse.decorators.once(Bundle.hideOutside, null);

export default Bundle;