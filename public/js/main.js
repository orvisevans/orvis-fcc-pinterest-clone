$(".delete-pin").click(function() {
    var id = $(this).attr('data-id');
    $.ajax({
        url: '/api/delete/pin/' + id,
        type: 'DELETE',
        success: function(data) {
            $("#pin-" + id).remove();
        }
    });
});