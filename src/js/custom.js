jQuery(document).ready(function ($) {
    $('.select2').select2({
        minimumResultsForSearch: -1,
        dropdownCssClass: "custom-select",
    });

    $(".js-temperature").click(function() {
        if ($(this).is(':checked')) {
            $('.form-page__temperature').addClass('show');
        } else {
            $('.form-page__temperature').removeClass('show');
        }
    });
});
