$(".delete-pin").click(function() {
    var id = $(this).attr('data-id');
    $.ajax({
        url: '/api/delete/pin/' + id,
        type: 'DELETE',
        success: function(data) {
            $("#pin-" + id).replaceWith(
                '<div class="card text-white text-center bg-dark"><div class="card-body"><h5>Pin deleted</h5></div></div>'
            );
        }
    });
});