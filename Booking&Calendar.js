$ = jQuery.noConflict(),
$(document).ready((function($) {
    function resize_calendar($calendars_wrapper) {
        var $months_wrapper = $calendars_wrapper.find(".wpbs-calendars-wrapper")
          , $months_wrapper_width = $calendars_wrapper.find(".wpbs-calendars")
          , calendar_min_width = $calendars_wrapper.data("min_width")
          , calendar_max_width = $calendars_wrapper.data("max_width")
          , $month_inner = $calendars_wrapper.find(".wpbs-calendar-wrapper");
        $calendars_wrapper.data("min_width") > 0 && $calendars_wrapper.find(".wpbs-calendar").css("min-width", calendar_min_width),
        $calendars_wrapper.data("max_width") > 0 && $calendars_wrapper.find(".wpbs-calendar").css("max-width", calendar_max_width);
        var column_count = 0;
        column_count = $months_wrapper_width.width() < 2 * calendar_min_width ? 1 : $months_wrapper_width.width() < 3 * calendar_min_width ? 2 : $months_wrapper_width.width() < 4 * calendar_min_width ? 3 : $months_wrapper_width.width() < 6 * calendar_min_width ? 4 : 6,
        $calendars_wrapper.find(".wpbs-calendar").length <= column_count && (column_count = $calendars_wrapper.find(".wpbs-calendar").length),
        $calendars_wrapper.attr("data-columns", column_count),
        $months_wrapper.hasClass("wpbs-legend-position-side") && ($months_wrapper.css("max-width", "none"),
        $months_wrapper.css("max-width", $calendars_wrapper.find(".wpbs-calendar").first().outerWidth(!0) * column_count));
        var td_width = $calendars_wrapper.find("td").first().width();
        $calendars_wrapper.find("td .wpbs-date-inner, td .wpbs-week-number").css("height", Math.ceil(td_width) + 1 + "px"),
        $calendars_wrapper.find("td .wpbs-date-inner, td .wpbs-week-number").css("line-height", Math.ceil(td_width) + 1 + "px");
        var th_height = $calendars_wrapper.find("th").css("height", "auto").first().height();
        $calendars_wrapper.find("th").css("height", Math.ceil(th_height) + 1 + "px");
        var calendar_month_height = 0;
        $month_inner.css("min-height", "1px"),
        $month_inner.each((function() {
            $(this).height() >= calendar_month_height && (calendar_month_height = $(this).height())
        }
        )),
        $month_inner.css("min-height", Math.ceil(calendar_month_height) + "px"),
        $calendars_wrapper.css("visibility", "visible")
    }
    function refresh_calendar($calendar_container, current_year, current_month) {
        var $calendar_container;
        if (($calendar_container = $calendar_container).hasClass("wpbs-is-loading"))
            return !1;
        var data = $calendar_container.data();
        data.action = "wpbs_refresh_calendar",
        data.current_year = current_year,
        data.current_month = current_month,
        $calendar_container.find(".wpbs-calendar").append('<div class="wpbs-overlay"><div class="wpbs-overlay-spinner"><div class="wpbs-overlay-bounce1"></div><div class="wpbs-overlay-bounce2"></div><div class="wpbs-overlay-bounce3"></div></div></div>'),
        $calendar_container.addClass("wpbs-is-loading"),
        $calendar_container.find("select").attr("disabled", !0),
        "undefined" != typeof wpbs_ajaxurl && (ajaxurl = wpbs_ajaxurl),
        $.post(ajaxurl, data, (function(response) {
            $calendar_container.replaceWith(response),
            $(".wpbs-container").each((function() {
                resize_calendar($(this)),
                wpbs_mark_selected_dates($(this).parents(".wpbs-main-wrapper")),
                wpbs_set_off_screen_date_limits($(this).parents(".wpbs-main-wrapper")),
                $(this).siblings("form").length || $(this).removeClass("wpbs-enable-hover")
            }
            ))
        }
        ))
    }
    function wpbs_render_recaptcha() {
        $(".wpbs-google-recaptcha").length && $(".wpbs-google-recaptcha").each((function() {
            if ($recaptcha = $(this),
            $recaptcha.find("iframe").length)
                return !0;
            grecaptcha.render($recaptcha.attr("id"), {
                sitekey: $recaptcha.data("sitekey")
            })
        }
        ))
    }
    function wpbs_set_selection_start_date(date, $calendar_instance) {
        $calendar_instance.find(".wpbs-container").data("start_date", date.getTime())
    }
    function wpbs_set_selection_end_date(date, $calendar_instance) {
        start_date = wpbs_get_selection_start_date($calendar_instance),
        start_date.getTime() > date ? (wpbs_set_selection_start_date(date, $calendar_instance),
        start_date.setUTCDate(start_date.getUTCDate()),
        $calendar_instance.find(".wpbs-container").data("end_date", start_date.getTime())) : $calendar_instance.find(".wpbs-container").data("end_date", date.getTime())
    }
    function wpbs_get_selection_start_date($calendar_instance) {
        return void 0 !== $calendar_instance.find(".wpbs-container").data("start_date") && "" != $calendar_instance.find(".wpbs-container").data("start_date") && (date = new Date($calendar_instance.find(".wpbs-container").data("start_date")),
        date)
    }
    function wpbs_get_selection_end_date($calendar_instance) {
        return void 0 !== $calendar_instance.find(".wpbs-container").data("end_date") && "" != $calendar_instance.find(".wpbs-container").data("end_date") && (date = new Date($calendar_instance.find(".wpbs-container").data("end_date")),
        date)
    }
    function wpbs_remove_selection_dates($calendar_instance) {
        $calendar_instance.find(".wpbs-container").data("start_date", !1),
        $calendar_instance.find(".wpbs-container").data("end_date", !1),
        $calendar_instance.find(".wpbs-container .wpbs-date").removeClass("wpbs-date-selected"),
        $calendar_instance.find(".wpbs-container .wpbs-date").removeClass("wpbs-date-hover"),
        $calendar_instance.find(".wpbs-container .wpbs-date").removeClass("wpbs-selected-first").removeClass("wpbs-selected-last"),
        $calendar_instance.find(".wpbs-container .wpbs-date .wpbs-legend-icon-select").remove(),
        $calendar_instance.data("future_date_limit", "infinite"),
        $calendar_instance.data("past_date_limit", "infinite")
    }
    function wpbs_mark_hover_selection(date, $calendar_instance) {
        if ($el = $calendar_instance.find('.wpbs-container .wpbs-date[data-day="' + date.getUTCDate() + '"][data-month="' + (date.getUTCMonth() + 1) + '"][data-year="' + date.getUTCFullYear() + '"]'),
        $el.length && !$el.hasClass("wpbs-is-bookable"))
            return !1;
        if (changeover_start = $calendar_instance.find(".wpbs-container").data("changeover_start"),
        changeover_end = $calendar_instance.find(".wpbs-container").data("changeover_end"),
        changeover_start && changeover_end) {
            var hovered_dates = {};
            if ($calendar_instance.find(".wpbs-date-hover").each((function() {
                hovered_date_legend = "normal",
                $(this).hasClass("wpbs-legend-item-" + changeover_start) && (hovered_date_legend = "start"),
                $(this).hasClass("wpbs-legend-item-" + changeover_end) && (hovered_date_legend = "end"),
                hovered_dates["" + $(this).data("year") + $(this).data("month") + $(this).data("day")] = hovered_date_legend
            }
            )),
            hovered_date_legend = "normal",
            $el.hasClass("wpbs-legend-item-" + changeover_start) && (hovered_date_legend = "start"),
            $el.hasClass("wpbs-legend-item-" + changeover_end) && (hovered_date_legend = "end"),
            hovered_dates["" + $el.data("year") + $el.data("month") + $el.data("day")] = hovered_date_legend,
            start_date_found = !1,
            exit_selection = !1,
            $.each(hovered_dates, (function(date, hovered_date_legend) {
                "start" == hovered_date_legend && (start_date_found = !0),
                "end" != hovered_date_legend || !0 !== start_date_found || (exit_selection = !0)
            }
            )),
            !0 === exit_selection)
                return !1
        }
        return !("infinite" != $calendar_instance.data("past_date_limit") && date.getTime() < $calendar_instance.data("past_date_limit")) && (!("infinite" != $calendar_instance.data("future_date_limit") && date.getTime() > $calendar_instance.data("future_date_limit")) && ($el.addClass("wpbs-date-hover"),
        !0))
    }
    function wpbs_mark_selection(date, $calendar_instance) {
        $el = $calendar_instance.find('.wpbs-container .wpbs-date[data-day="' + date.getUTCDate() + '"][data-month="' + (date.getUTCMonth() + 1) + '"][data-year="' + date.getUTCFullYear() + '"]'),
        $el.addClass("wpbs-date-selected")
    }
    function wpbs_mark_selection_split_start(date, $calendar_instance) {
        $el = $calendar_instance.find('.wpbs-container .wpbs-date[data-day="' + date.getUTCDate() + '"][data-month="' + (date.getUTCMonth() + 1) + '"][data-year="' + date.getUTCFullYear() + '"]'),
        $el.addClass("wpbs-selected-first").find(".wpbs-legend-item-icon").append('<div class="wpbs-legend-icon-select"><svg height="100%" width="100%" viewBox="0 0 50 50" preserveAspectRatio="none"><polygon points="0,50 50,50 50,0" /></svg></div>')
    }
    function wpbs_mark_selection_split_end(date, $calendar_instance) {
        $el = $calendar_instance.find('.wpbs-container .wpbs-date[data-day="' + date.getUTCDate() + '"][data-month="' + (date.getUTCMonth() + 1) + '"][data-year="' + date.getUTCFullYear() + '"]'),
        $el.addClass("wpbs-selected-last").find(".wpbs-legend-item-icon").append('<div class="wpbs-legend-icon-select"><svg height="100%" width="100%" viewBox="0 0 50 50" preserveAspectRatio="none"><polygon points="0,0 0,50 50,0" /></svg></div>')
    }
    function wpbs_mark_selected_dates($calendar_instance) {
        if (!1 !== wpbs_get_selection_start_date($calendar_instance) && !1 !== wpbs_get_selection_end_date($calendar_instance)) {
            $calendar_instance.find(".wpbs-date").removeClass("wpbs-date-selected"),
            $calendar_instance.find(".wpbs-date").removeClass("wpbs-date-hover");
            for (var i = wpbs_get_selection_start_date($calendar_instance); i <= wpbs_get_selection_end_date($calendar_instance); i.setUTCDate(i.getUTCDate() + 1))
                wpbs_mark_selection(i, $calendar_instance);
            $(document).trigger("wpbs_dates_selected", [$calendar_instance])
        }
    }
    function wpbs_set_off_screen_date_limits($calendar_instance) {
        if (!1 === wpbs_get_selection_start_date($calendar_instance))
            return !1;
        if ("infinite" != $calendar_instance.data("future_date_limit") && "infinite" != $calendar_instance.data("past_date_limit"))
            return !1;
        var future_dates = []
          , past_dates = []
          , selected_date = wpbs_get_selection_start_date($calendar_instance).getTime();
        $calendar_instance.find(".wpbs-date").not(".wpbs-is-bookable").not(".wpbs-gap").each((function() {
            date = wpbs_get_element_date($(this)).getTime(),
            date > selected_date ? future_dates.push(date) : past_dates.push(date)
        }
        )),
        future_dates.length && "infinite" == $calendar_instance.data("future_date_limit") && (future_dates.sort(),
        $calendar_instance.data("future_date_limit", future_dates[0])),
        past_dates.length && "infinite" == $calendar_instance.data("past_date_limit") && (past_dates.sort().reverse(),
        $calendar_instance.data("past_date_limit", past_dates[0]))
    }
    function wpbs_get_element_date($el) {
        return date = new Date(Date.UTC($el.data("year"), $el.data("month") - 1, $el.data("day"), 0, 0, 0)),
        date
    }
    function wpbs_is_touch_device() {
        var prefixes = " -webkit- -moz- -o- -ms- ".split(" "), mq = function(query) {
            return window.matchMedia(query).matches
        }, query;
        return !!("ontouchstart"in window || window.DocumentTouch && document instanceof DocumentTouch) || mq(["(", prefixes.join("touch-enabled),("), "heartz", ")"].join(""))
    }
    $(".wpbs-container").each((function() {
        resize_calendar($(this))
    }
    )),
    $(window).on("resize", (function() {
        var iframe;
        ($(".wpbs-container").each((function() {
            resize_calendar($(this))
        }
        )),
        $(".edit-site-visual-editor__editor-canvas").length) && $("iframe.edit-site-visual-editor__editor-canvas").contents().find(".wpbs-container").each((function() {
            console.log("resizing iframe"),
            resize_calendar($(this))
        }
        ))
    }
    )),
    $(document).on("click", ".wpbs-container .wpbs-prev", (function(e) {
        e.preventDefault();
        for (var $container = $(this).closest(".wpbs-container"), current_month = $container.data("current_month"), current_year = $container.data("current_year"), navigate_count = 1, i = 1; i <= 1; i++)
            (current_month -= 1) < 1 && (current_month = 12,
            current_year -= 1);
        refresh_calendar($container, current_year, current_month)
    }
    )),
    $(document).on("click", ".wpbs-container .wpbs-next", (function(e) {
        e.preventDefault();
        for (var $container = $(this).closest(".wpbs-container"), current_month = $container.data("current_month"), current_year = $container.data("current_year"), navigate_count = 1, i = 1; i <= 1; i++)
            (current_month += 1) > 12 && (current_month = 1,
            current_year += 1);
        refresh_calendar($container, current_year, current_month)
    }
    )),
    $(document).on("change", ".wpbs-container .wpbs-select-container select", (function() {
        var $container = $(this).closest(".wpbs-container"), date = new Date(1e3 * $(this).val()), year, month;
        refresh_calendar($container, date.getFullYear(), date.getMonth() + 1)
    }
    )),
    $(document).on("change", ".wpbs-form-field-payment_method input[type='radio']", (function() {
        $(this).parents(".wpbs-form-field-payment_method").find("p.wpbs-payment-method-description-open").removeClass("wpbs-payment-method-description-open"),
        $(this).parent().next("p").addClass("wpbs-payment-method-description-open")
    }
    )),
    $(document).on("submit", ".wpbs-form-container", (function(e) {
        e.preventDefault(),
        $form = $(this);
        var $calendar = $form.parents(".wpbs-main-wrapper").find(".wpbs-container");
        "undefined" != typeof wpbs_ajaxurl && (ajaxurl = wpbs_ajaxurl);
        var data = {
            action: "wpbs_submit_form"
        };
        data.form = $form.data(),
        data.calendar = $calendar.data(),
        data.wpbs_token = wpbs_ajax.token,
        data.form_data = $form.serialize(),
        $.post(ajaxurl, data, (function(response) {
            if (!1 === (response = JSON.parse(response)).success)
                $form.replaceWith(response.html),
                wpbs_render_recaptcha(),
                $("html, body").stop().animate({
                    scrollTop: $calendar.parents(".wpbs-main-wrapper").offset().top
                });
            else if (!0 === response.success)
                if ("message" == response.confirmation_type) {
                    $form.parents(".wpbs-payment-confirmation").length ? $form.parents(".wpbs-payment-confirmation").replaceWith('<div class="wpbs-form-confirmation-message"><p>' + response.confirmation_message + "</p></div>") : ($form.replaceWith('<div class="wpbs-form-confirmation-message"><p>' + response.confirmation_message + "</p></div>"),
                    $("html, body").stop().animate({
                        scrollTop: $calendar.parents(".wpbs-main-wrapper").offset().top
                    })),
                    $calendar_instance = $calendar.parents(".wpbs-main-wrapper"),
                    wpbs_remove_selection_dates($calendar_instance),
                    $calendar_instance.data("future_date_limit", "infinite"),
                    $calendar_instance.data("past_date_limit", "infinite");
                    var current_month = $calendar.data("current_month")
                      , current_year = $calendar.data("current_year");
                    refresh_calendar($calendar, current_year, current_month)
                } else
                    "redirect" == response.confirmation_type && (window.location.href = response.confirmation_redirect_url)
        }
        ))
    }
    )),
    $(window).on("load", (function() {
        wpbs_render_recaptcha()
    }
    )),
    $(document).on("elementor/popup/show", () => {
        $(window).trigger("resize")
    }
    ),
    $(document).on("click", ".wpbs-container .wpbs-is-bookable", (function() {
        if ($el = $(this),
        $calendar_instance = $el.parents(".wpbs-main-wrapper"),
        $el.hasClass("wpbs-gap"))
            return !1;
        if ($calendar_instance.hasClass("wpbs-main-wrapper-form-0"))
            return !1;
        if (!$calendar_instance.find(".wpbs-form-container").length)
            return !1;
        if (!1 === wpbs_get_selection_start_date($calendar_instance))
            $calendar_instance.data("future_date_limit", "infinite"),
            $calendar_instance.data("past_date_limit", "infinite"),
            wpbs_set_selection_start_date(wpbs_get_element_date($el), $calendar_instance),
            wpbs_set_off_screen_date_limits($calendar_instance),
            wpbs_is_touch_device() || $el.trigger("mouseenter");
        else if (!1 !== wpbs_get_selection_start_date($calendar_instance) && !1 === wpbs_get_selection_end_date($calendar_instance)) {
            if (wpbs_is_touch_device() && $el.trigger("mouseenter"),
            !$el.hasClass("wpbs-date-hover"))
                return !1;
            wpbs_set_selection_end_date(wpbs_get_element_date($el), $calendar_instance),
            wpbs_mark_selected_dates($calendar_instance),
            $calendar_instance.find(".wpbs-container").addClass("wpbs-enable-hover")
        } else
            !1 !== wpbs_get_selection_start_date($calendar_instance) && !1 !== wpbs_get_selection_end_date($calendar_instance) && (wpbs_remove_selection_dates($calendar_instance),
            $calendar_instance.data("future_date_limit", "infinite"),
            $calendar_instance.data("past_date_limit", "infinite"),
            wpbs_set_selection_start_date(wpbs_get_element_date($el), $calendar_instance),
            wpbs_set_off_screen_date_limits($calendar_instance),
            wpbs_is_touch_device() || $el.trigger("mouseenter"))
    }
    )),
    $(document).on("mouseenter", ".wpbs-container .wpbs-is-bookable", (function() {
        if ($el = $(this),
        $calendar_instance = $el.parents(".wpbs-main-wrapper"),
        $calendar_instance.hasClass("wpbs-main-wrapper-form-0"))
            return !1;
        if (!1 === wpbs_get_selection_start_date($calendar_instance) || !1 !== wpbs_get_selection_end_date($calendar_instance))
            return !1;
        if ($calendar_instance.find(".wpbs-container").removeClass("wpbs-enable-hover"),
        current_date = wpbs_get_element_date($el),
        selection_start_date = wpbs_get_selection_start_date($calendar_instance),
        $calendar_instance.find(".wpbs-container .wpbs-date").removeClass("wpbs-date-hover"),
        current_date > selection_start_date) {
            start_date = selection_start_date,
            end_date = current_date;
            for (var i = start_date; i <= end_date && !1 !== wpbs_mark_hover_selection(i, $calendar_instance); i.setUTCDate(i.getUTCDate() + 1))
                ;
        } else {
            start_date = current_date,
            end_date = selection_start_date;
            for (var i = end_date; i >= start_date && !1 !== wpbs_mark_hover_selection(i, $calendar_instance); i.setUTCDate(i.getUTCDate() - 1))
                ;
        }
    }
    ));
    var wpbs_frontend_visible_calendars = $(".wpbs-container:visible").length;
    function wpbs_check_if_calendar_is_visible() {
        return !!$(".wpbs-container").length && ($(".wpbs-container:visible").addClass("wpbs-visible"),
        wpbs_frontend_visible_calendars != $(".wpbs-container.wpbs-visible").length && ($(window).trigger("resize"),
        wpbs_frontend_visible_calendars = $(".wpbs-container.wpbs-visible").length),
        $(".wpbs-container:not(:visible)").removeClass("wpbs-visible"),
        $(".wpbs-container.wpbs-visible").length != $(".wpbs-container").length && void setTimeout(wpbs_check_if_calendar_is_visible, 250))
    }
    wpbs_check_if_calendar_is_visible(),
    $("body").hasClass("block-editor-page") && $("body").hasClass("wp-admin") && setInterval((function() {
        $(window).trigger("resize")
    }
    ), 1e3)
}
));
