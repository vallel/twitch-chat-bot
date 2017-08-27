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
        $('.btn-create-cmd').on('click', onCommandCreate);
    }

    function onCommandCreate() {
        $('#command').find('form')[0].reset();
    }

    function onCommandEdit() {
        var cmdName = $(this).data('name');
        getCommand(cmdName, function(data) {
            var $modal = $('#command');
            $modal.find('#commandId').val(data.id);
            $modal.find('#commandName').val(data.name);
            $modal.find('#commandMessage').val(data.message);
            if (data.enabled == 'on') {
                $modal.find('#commandEnabled').attr('checked', 'checked');
            }
            $modal.modal('show');
        });
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

    function getCommand(name, fn) {
        $.ajax({
            url: 'comandos/'+ name,
            success: function(response) {
                if (response && response.success && fn) {
                    fn(response.data);
                }
            }
        });
    }

    $(function() {
        twitchBot.commands.init();
    });
})(jQuery);