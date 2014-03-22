$('#addpass').on('click', function () {
    $('.addpass').toggle(300);
});

checkbox = $('.onoffswitch-checkbox');

checkbox.on('click', function () {
    var state;

    if (checkbox.attr('checked') === "checked") {
        checkbox.attr('checked', false);
        state = false;
    } else {
        checkbox.attr('checked', true);
        state = true;
    }

    $.ajax({
        url: "/users/onoff",
        type: "put",
        data: JSON.stringify({ state: state }),
        contentType: 'application/json',
        success: function (data) {
            console.log(data);

            $('.check').show(300, function () {
                $(this).delay(800).hide(300);
            })
        }
    });

});