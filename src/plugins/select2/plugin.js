/**
 * @class Select2
 * @memberof module:plugins
 * @description Applies Select2 on filters and operators combo-boxes.
 * @param {object} [options]
 * @param {string} [options.container='body']
 * @param {string} [options.style='btn-inverse btn-xs']
 * @param {int|string} [options.width='auto']
 * @param {boolean} [options.showIcon=false]
 * @throws MissingLibraryError
 */
QueryBuilder.define('select2', function(options) {
    if (!$.fn.select2) {
        Utils.error('MissingLibrary', 'Select2 is required to use "select2" plugin.');
    }

    var Selectors = QueryBuilder.selectors;

    var applySelect2Options = function(rule, builder) {
        if (rule.filter.input === undefined || rule.filter.input !== 'select') {
            return;
        }
        var rule_options = Object.assign({}, options);
        if (rule && rule.filter && rule.filter.data && rule.filter.data.select2) {
            rule_options = Object.assign(rule.filter.data.select2, rule_options);
        }

        if (options && options.dropdownParentSelector) {
            rule_options.dropdownParent = rule.$el.find(Selectors.rule_value).parents(options.dropdownParentSelector).first();
        }

        if (rule && rule.data && rule.data.valueLabel) {
            var option = $('<option></option>').val(rule.data.valueId).text(rule.data.valueLabel);
            rule.$el.find(Selectors.rule_value).append(option);
            rule.data.valueLabel = undefined;
            rule.data.valueId = undefined;
        }

        rule.$el.find(Selectors.rule_value).removeClass('form-control').select2(rule_options);
        rule.$el.on('select2:close', function(e) {
            var evt = "scroll.select2"
            $(e.target).parents().off(evt)
            $(window).off(evt)
        });
    };

    // init selectpicker
    this.on('afterCreateRuleFilters', function(e, rule) {
        setTimeout(function() {
            if (options.dropdownParentSelector) {
                options.dropdownParent = e.builder.$el.parents(options.dropdownParentSelector).first();
            }
            rule.$el.find(Selectors.rule_filter).removeClass('form-control').select2(options);
            /*rule.$el.on('select2:close', function(e) {
                var evt = "scroll.select2"
                $(e.target).parents().off(evt)
                $(window).off(evt)
            });*/
        }, 1);

    });
    this.on('afterCreateRuleOperators', function(e, rule) {
        setTimeout(function() {
            if (options.dropdownParentSelector) {
                options.dropdownParent = e.builder.$el.parents(options.dropdownParentSelector).first();
            }
            rule.$el.find(Selectors.rule_operator).removeClass('form-control').select2(options);
            /*rule.$el.on('select2:close', function (e) {
                var evt = "scroll.select2"
                $(e.target).parents().off(evt)
                $(window).off(evt)
            });*/
        }, 1);
    });
    this.on('afterCreateRuleInput', function(e, rule) {
        applySelect2Options(rule, e.builder);
    });

    // update selectpicker on change
    this.on('afterUpdateRuleFilter', function(e, rule) {
        setTimeout(function() {
            if (options.dropdownParentSelector) {
                options.dropdownParent = e.builder.$el.parents(options.dropdownParentSelector).first();
            }
            rule.$el.find(Selectors.rule_filter).select2(options);
            /*rule.$el.on('select2:close', function (e) {
                var evt = "scroll.select2"
                $(e.target).parents().off(evt)
                $(window).off(evt)
            });*/
        }, 1);
    });

    this.on('afterUpdateRuleOperator', function(e, rule) {
        if (options.dropdownParentSelector) {
            options.dropdownParent = e.builder.$el.parents(options.dropdownParentSelector).first();
        }
        rule.$el.find(Selectors.rule_operator).select2(options);
        /*rule.$el.on('select2:close', function(e) {
            var evt = "scroll.select2"
            $(e.target).parents().off(evt)
            $(window).off(evt)
        });*/
    });

    this.on('afterUpdateRuleInput', function(e, rule) {
        applySelect2Options(rule, e.builder);
    });

}, {});
