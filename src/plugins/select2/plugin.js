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

    var applySelect2Options = function(rule) {
        var rule_options = Object.assign({}, options);
        if (rule && rule.filter && rule.filter.data && rule.filter.data.select2) {
            rule_options = Object.assign(rule.filter.data.select2, rule_options);
        }
        if (rule && rule.data && rule.data.valueLabel) {
            rule_options.data = [
                {
                    id: rule.data.valueId,
                    text: rule.data.valueLabel
                }
            ];
        }
        rule.$el.find(Selectors.rule_value).removeClass('form-control').select2(rule_options)
    };

    // init selectpicker
    this.on('afterCreateRuleFilters', function(e, rule) {
        rule.$el.find(Selectors.rule_filter).removeClass('form-control').select2(options);
    });
    this.on('afterCreateRuleOperators', function(e, rule) {
        rule.$el.find(Selectors.rule_operator).removeClass('form-control').select2(options);
    });
    this.on('afterCreateRuleInput', function(e, rule) {
        applySelect2Options(rule);
    });

    // update selectpicker on change
    this.on('afterUpdateRuleFilter', function(e, rule) {
        rule.$el.find(Selectors.rule_filter).select2(options);
    });

    this.on('afterUpdateRuleOperator', function(e, rule) {
        rule.$el.find(Selectors.rule_operator).select2(options);
    });

    this.on('afterUpdateRuleInput', function(e, rule) {
        applySelect2Options(rule);
    });

}, {});
