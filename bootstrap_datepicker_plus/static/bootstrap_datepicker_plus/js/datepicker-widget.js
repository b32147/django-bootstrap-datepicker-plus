jQuery(function ($) {
    var datepickerDict = {};
    var isBootstrap4 = $.fn.collapse.Constructor.VERSION.split('.').shift() == "4";
    function fixMonthEndDate(e, picker, format = 'YYYY-MM-DD') {
        e.date && picker.val().length && picker.val(e.date.endOf('month').format(format));
    }
    $("[dp_config]:not([disabled])").each(function (i, element) {
        var $element = $(element), data = {};
        try {
            data = JSON.parse($element.attr('dp_config'));
        }
        catch (x) { }
        if (data.id && data.options) {
            data.$element = $element.datetimepicker(data.options);
            data.datepickerdata = $element.data("DateTimePicker");
            datepickerDict[data.id] = data;
            data.$element.next('.input-group-addon').on('click', function(){
                data.datepickerdata.show();
            });
            if(isBootstrap4){
                data.$element.on("dp.show", function (e) {
                    $('.collapse.in').addClass('show');
                });
            }
        }
    });
    $.each(datepickerDict, function (id, to_picker) {
        if (to_picker.linked_to) {
            var from_picker = datepickerDict[to_picker.linked_to];
            from_picker.datepickerdata.maxDate(
                to_picker.datepickerdata.date()
                || (to_picker.options.maxDate ? new Date(to_picker.options.maxDate) : false)
                || (from_picker.options.maxDate ? new Date(from_picker.options.maxDate) : false)
                || false
            );
            to_picker.datepickerdata.minDate(
                from_picker.datepickerdata.date()
                || (from_picker.options.minDate ? new Date(from_picker.options.minDate)  : false)
                || (to_picker.options.minDate ? new Date(to_picker.options.minDate) : false)
                || false
            );
            from_picker.$element.on("dp.change", function (e) {
                to_picker.datepickerdata.minDate(
                    from_picker.datepickerdata.date()
                    || (from_picker.options.minDate ? new Date(from_picker.options.minDate)  : false)
                    || (to_picker.options.minDate ? new Date(to_picker.options.minDate) : false)
                    || false
                );
            });
            to_picker.$element.on("dp.change", function (e) {
                if (to_picker.picker_type == 'MONTH') fixMonthEndDate(e, to_picker.$element, to_picker.options.format || undefined);
                from_picker.datepickerdata.maxDate(
                    to_picker.datepickerdata.date()
                    || (to_picker.options.maxDate ? new Date(to_picker.options.maxDate) : false)
                    || (from_picker.options.maxDate ? new Date(from_picker.options.maxDate) : false)
                    || false
                );
            });
            if (to_picker.picker_type == 'MONTH') {
                to_picker.$element.on("dp.hide", function (e) {
                    fixMonthEndDate(e, to_picker.$element, to_picker.options.format || undefined);
                });
                fixMonthEndDate({ date: to_picker.datepickerdata.date() }, to_picker.$element, to_picker.options.format || undefined);
            }
        }
    });
    if(isBootstrap4) {
        $('body').on('show.bs.collapse','.bootstrap-datetimepicker-widget .collapse',function(e){
            $(e.target).addClass('in');
        });
        $('body').on('hidden.bs.collapse','.bootstrap-datetimepicker-widget .collapse',function(e){
            $(e.target).removeClass('in');
        });
    }
});
