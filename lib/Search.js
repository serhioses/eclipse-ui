'use strict';

import eclipse from 'eclipse';

var body = $('body');

function findSearch (e) {
    var target = $(e.target),
        searchContainer = target.closest('[data-search]'),
        search, i;

    if (!searchContainer.length) {
        return false;
    }

    for (i = 0; i < eclipse.storage.searches.length; i += 1) {
        if (eclipse.storage.searches[i]._container[0] === searchContainer[0]) {
            search = eclipse.storage.searches[i];
            break;
        }
    }

    return search;
}

function reinit (newOptions) {
    var pos = eclipse.storage.searches.indexOf(this);

    if (pos !== -1) {
        eclipse.storage.searches.splice(pos, 1);
    }

    if (eclipse.helpers.getClass(newOptions) === 'Object') {
        $.extend(this._defaults, newOptions);
    }

    eclipse.storage.searches.push(this);
}

function init () {
    eclipse.storage.searches.push(this);
}

// Delegation
body.on('input', function (e) {
    var search = findSearch(e),
        reg;

    if (!search) {
        return;
    }

    reg = new RegExp('(' + search._field.val() + ')', 'gi');

    search._boxes.each(function () {
        var that = $(this);
        
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
// Delegation (END)

function Search (container, options) {
    var defaults = eclipse.helpers.createMap(),
        container, field, boxes;

    defaults.shouldPreventDefault = true;
    defaults.invokeCallback = false;
    defaults.callback = $.noop;

    container = $('#' + container);
    field = container.find('.s-field');
    boxes = container.find('[data-q="true"]');

    Object.defineProperties(this, {
        _container: {
            get: function () {
                return container;
            }
        },
        _field: {
            get: function () {
                return field;
            }
        },
        _boxes: {
            get: function () {
                return boxes;
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
}

Object.defineProperty(Search.prototype, 'reinit', {
    value: function (newOptions) {
        reinit.call(this, newOptions);
    },
    enumerable: false
});
Object.defineProperty(Search.prototype, 'init', {
    value: function () {
        init.call(this);
    },
    enumerable: false
});

export default Search;