var twitchBot = twitchBot || {};

(function($) {
    twitchBot.commands = {
        init: function() {
            eventWiring();
        }
    };

    function eventWiring() {
        $('.cmd-list').on('click', '.btn-edit-cmd', onCommandEdit);
        $('.cmd-list').on('click', '.btn-delete-cmd', onCommandDelete);
    }

    function onCommandEdit() {

    }

    function onCommandDelete(e) {
        e.preventDefault();

        var cmdName = $(this).data('name'),
            actionUrl = $(this).attr('href');

        swal({
                title: 'Borrar comando',
                text: 'El comando !'+ cmdName +' será eliminado permanentemente. ¿Esta seguro que quiere borrarlo?',
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: 'No',
                confirmButtonText: '¡Sí, borralo!',
            },
            function(isConfirm) {
                if (isConfirm) {
                    location.href = actionUrl;
                }
            }
        );
    }

    $(function() {
        twitchBot.commands.init();
    });
})(jQuery);