/**Chiude i popup quando si clicca al di fuori*/
$("html").on("mouseup", function (e) {
    let l = $(e.target);
    if (l[0].className.indexOf("popover") === -1) {
        $(".popover").each(function () {
            $(this).popover("hide");
        });
    }
});

/**Chiamata ajax al back-end, dal nome del file si ottiene il programma*/
function getTaskFromName(nameTask) {
    let username = $('#username').html();
    $.ajax({
        type: 'POST',
        url: '/getTaskFile/',
        data: {
            fileName: nameTask,
            username: username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (result) {
            let json = JSON.parse(result);
            let xml_file = json.file;
            if (json.file !== 'new') {
                let mode = json.mode;
                if (mode === 'xml') {
                    $('#task_building_area').addClass('d-none');
                    let toAppend = '<div class="container progress-div"><h2>Please wait...</h2><div class="progress progress-striped"> ' +
                        '<div style="background-color: #007bff!important;" id="dynamic" class="progress-bar" role="progressbar"' +
                        ' aria-valuemin="0" aria-valuemax="100" style="width:0%"><span id="current-progress"></span></div></div></div>';

                    $('#droppable').append(toAppend);
                    $('.progress-bar').addClass('active');
                    $(function () {
                        let current_progress = 20;
                        let interval = setInterval(function () {
                            current_progress += 20;
                            $(".progress-bar").animate({
                                width: current_progress + "%"
                            }, 750);
                            $("#dynamic")
                                .attr("aria-valuenow", current_progress)
                                .text(current_progress + "% Complete");
                            if (current_progress >= 100)
                                clearInterval(interval);
                        }, 750);
                    });
                    setTimeout(function () {
                        from_xml_to_graphic(xml_file);
                    }, 3500);

                } else {

                    $('#task_building_area').addClass('d-none');
                    let toAppend = '<div class="container progress-div"><h2>Please wait...</h2><div class="progress progress-striped"> ' +
                        '<div style="background-color: #007bff!important;" id="dynamic" class="progress-bar" role="progressbar" ' +
                        ' aria-valuemin="0" aria-valuemax="100" style="width:0"><span id="current-progress"></span></div></div></div>';

                    $('#droppable').append(toAppend);
                    $('.progress-bar').addClass('active');
                    $(function () {
                        let current_progress = 20;
                        let interval = setInterval(function () {
                            current_progress += 20;
                            $(".progress-bar").animate({
                                width: current_progress + "%"
                            }, 750);
                            $("#dynamic")
                                .css("background-color", "#007bff")
                                .attr("aria-valuenow", current_progress)
                                .text(current_progress + "% Complete");
                            if (current_progress >= 100)
                                clearInterval(interval);
                        }, 750);
                    });
                    setTimeout(function () {
                        from_txt_to_graphic(xml_file);
                    }, 3500);

                }
            } else {
                // se è nuovo e faccio SAVE devo andare a scrivere il .txt
                $('.progress-div').remove();
                $('#task_building_area').removeClass('d-none');
            }

        },
        error: function () {
            alert("error");
        }
    });

}

/**Rende draggable i blocchi task*/
function make_draggable() {
    $(".task").draggable({
        helper: 'clone'
    });
}


/**Ottiene la lista dei task, degli oggetti e il programma da caricare*/
$(document).ready(function () {
    current_task_name = $('#taskName').text();
    $('#task_building_area').addClass('d-none');
    getTaskList($('#username').html());
    getObjectList($('#username').html());
    getLocationList($('#username').html());
    getActionList($('#username').html());
    getTaskFromName(current_task_name);
    $('.progress-div').remove();

    $('#qty_input').on('keyup change click', function () {
        let number = $(this).val();
        $('#qty_input').attr('value', number);
    });

});


/**Funzione per la grafica*/
function controllo($element) {

    let $var = $element;

    if ($var.hasClass('obj')) {
        $element.parent().find('.drop_obj').addClass('d-none');
    }
    if ($var.hasClass('loc')) {
        $element.parent().find('.drop_obj').addClass('d-none');
    }
    if ($var.hasClass('act') && !$var.parent().parent().hasClass('repeat')) {
        $var.closest('.drop_motion').find('.drop_act').addClass('d-none');
    }
    if ($var.hasClass('act') && $var.parent().parent().hasClass('repeat')) {
        $element.parent().children('p').first().addClass('d-none');
    }
    if ($var.hasClass('repeat') && $var.parent().parent().hasClass('repeat')) {
        $var.parent().children('p').first().addClass('d-none');
    }
    if ($var.hasClass('repeat') && $var.parent().hasClass('drop_motion')) {
        $var.parent().children('p').first().addClass('d-none');
    }
    if ($var.hasClass('event')) {
        $element.closest('.drop_event').find('.drop_act').addClass('d-none');
    }


}

/**Apre le librerie quando si clicca sul tab*/
function openUtils(evt, cityName) {

    $('[data-toggle="tooltip"]').tooltip();

    $('#task_building').addClass('d-none');

    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
        $(tablinks[i]).css('font-size', '16px');
        $(tablinks[i]).css('font-weight', 'normal');
        $(tablinks[i]).css('color', 'black');
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";

    if (cityName === 'Tasks') {
        make_draggable();
        $('.indications').addClass('d-none');
        $('#indications_tasks').removeClass('d-none');
    }

    if (cityName === 'Controls') {
        $('.indications').addClass('d-none');
        $('#indications_controls').removeClass('d-none');
    }
    if (cityName === 'Events') {
        $('.indications').addClass('d-none');
        $('#indications_events').removeClass('d-none');
    }
    if (cityName === 'Actions') {
        $('.indications').addClass('d-none');
        $('#indications_actions').removeClass('d-none');
    }
    if (cityName === 'Objects') {
        $('.indications').addClass('d-none');
        $('#indications_objects').removeClass('d-none');
    }

    $('#dropdownMenuButton').text(cityName);

    $('.tablinks.active').addClass('tabactive');

    $(function () {
        $('#while').popover({
            container: 'body'
        });
        $('#do_when').popover({
            container: 'body'
        });
        $('#stop_when').popover({
            container: 'body'
        });
        $('#for').popover({
            container: 'body'
        });
        $('#if').popover({
            container: 'body'
        });
        $('#if-else').popover({
            container: 'body'
        });
        $('#sensor').popover({
            container: 'body'
        });
        $('#detect').popover({
            container: 'body'
        });
        $('#exist').popover({
            container: 'body'
        });
        $('#pick').popover({
            container: 'body'
        });
        $('#place').popover({
            container: 'body'
        });

        let obj = document.getElementsByClassName("obj drag ui-draggable ui-draggable-handle library");
        Array.prototype.forEach.call(obj, element => {
            if (element.id === "newObject") {
                return;
            }
            $('#' + element.id).popover({
                container: 'body'
            });
        });

        let act = document.getElementsByClassName("act drag ui-draggable ui-draggable-handle library");
        Array.prototype.forEach.call(act, element => {
            if (element.id === "newAction") {
                return;
            }
            $('#' + element.id).popover({
                container: 'body'
            });
        });

        let loc = document.getElementsByClassName("loc drag ui-draggable ui-draggable-handle library");
        Array.prototype.forEach.call(loc, element => {
            if (element.id === "newLocation") {
                return;
            }
            $('#' + element.id).popover({
                container: 'body'
            });
        });

        let task = document.getElementsByClassName("task drag ui-draggable ui-draggable-handle library");
        Array.prototype.forEach.call(task, element => {
            $('#' + element.id).popover({
                container: 'body'
            });
        });

    });
}

/**Ottiene la lista dei task dal back-end*/
function getTaskList(username) {
    $.ajax({
        type: 'POST',
        url: '/getTaskList/',
        dataType: 'json',
        data: {
            username: username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            let dest = $('#Tasks');
            if ($(result).length !== 0) {

                $.each(result, function (index, element) {

                    let task_name = element.fields.name;

                    if (task_name.localeCompare(current_task_name) !== 0) {
                        let task_description = element.fields.description;
                        let content = '<div id="' + task_name + '" ' +
                            'class="task drag ui-draggable ui-draggable-handle library" data-accept="" data-toggle="popover" data-placement="left"' +
                            ' data-content="' + task_description + '"><div class="no-drop">' + task_name.substring(0, 1).toUpperCase() + task_name.substring(1).toLowerCase() + ' </div></div>';
                        dest.append(content);
                    }
                });
                $(".task").draggable({
                    helper: 'clone'
                });
            }
            if ($(result).length === 0 || $(result).length === 1) {
                $('#messaggio_tasks').css("color", "#714cfe");
                $('#messaggio_tasks').text('No tasks available');
            }
        },
        error: function () {
            alert("error");
        }
    });
}


/**Opzioni per rendere gli elementi droppable*/
let droppable_options = {
    accept: '.act, .repeat, .task, .event, .obj',
    greedy: true,
    hoverClass: "droppable-hover",
    //quando ci mollo dentro un elemento
    drop: function (event, ui) {
        //clono l'elemento
        $d = $(ui.draggable).clone();
        if (!$d.hasClass('canvas')) {

            if ($d.hasClass('library')) {
                /* add a button so the element can be removed if no longer necessary */
                let $remove_btn = $('<button class="remove-choice" onclick="removeParent(this)"><i class="fas fa-times"></i></button>');
                $d.prepend($remove_btn);
            } else {
                // se non ha la classe library lo rimuovo
                $(ui.draggable).remove();
            }
            //opzioni di drop, se io metterò qualcosa dentro questo oggetto
            let options = droppable_options;
            let options_Cond = droppable_options;
            let options_Body = droppable_options;

            //prendo le classi di data-accept
            let accepted_elements = $d.attr('data-accept');


            if ($d.attr('data-accept') !== "") {
                if ($d.hasClass('ifCondition')) {

                    $divCond = $d.find('.drop_event');
                    let accepted_Cond = $divCond.attr('data-accept');


                    $divBody = $d.find('.drop_motion');
                    let accepted_Body = $divBody.attr('data-accept');


                    options_Cond = $.extend(true, {}, droppable_options);
                    options_Cond.accept = accepted_Cond;
                    options_Cond.hoverClass = 'droppable-hover';
                    $divCond.droppable(options_Cond).sortable();

                    options_Body = $.extend(true, {}, droppable_options);
                    options_Body.accept = accepted_Body;
                    options_Body.hoverClass = 'droppable-hover';
                    $divBody.droppable(options_Body).sortable();
                } else {
                    // deep clone droppable_options object
                    options = $.extend(true, {}, droppable_options);
                    options.accept = accepted_elements;
                }

            }

            /* make the new element droppable i.e. to support groups within groups etc... */

            if ($d.find("div").is('div') && !$d.hasClass('ifCondition')) {
                $d.find("div").droppable(options).sortable(); //estende droppable option al div dentro
            }
            if ($d.hasClass("obj")) {

            }

            $d.css('position', 'relative');
            $d.css('left', 'auto');
            $d.css('top', 'auto');

            if ($d.hasClass('obj')) {
                $d.css('width', '100%');
            }
            if ($d.hasClass('loc')) {
                $d.css('width', '100%');
            }

            if ($d.hasClass('task')) {
                $nameTask = $d.text().trim();
                addExistingTask($nameTask);
            } else {
                $(this).append($d);
                if ($(this).is('#droppable')) {
                    $('#task_building_area').addClass('d-none');
                }
            }

            //controllo


            if ($d.hasClass("event")) {
                parent_div = $d.parent(); //drop_pick_obj
                if (parent_div.is('#droppable')) {
                    message = '<div class="alert alert-mio" role="alert">' +
                        'Warning. Events must be dropped into Controls! ' +
                        '<a href="#" class="alert-link" onclick="closeWarning(this);">Ok</a>.</div>';
                    $('#droppable').prepend(message);
                    $d.remove();
                }
                if (parent_div.is('.drop_motion')) {
                    message = '<div class="alert alert-mio" role="alert">' +
                        'Warning. Events must be dropped into Controls! ' +
                        '<a href="#" class="alert-link" onclick="closeWarning(this);">Ok</a>.</div>';
                    $('#droppable').prepend(message);
                    $d.remove();
                }
            }
            //controllo
            if ($d.hasClass("obj")) {

                $d.find(".no-drop").droppable('disable');

                parent_div = $d.parent(); //drop_pick_obj

                $figli_obj = parent_div.find('.obj');
                let message = '';
                if (parent_div.is('#droppable')) {
                    message = '<div class="alert alert-mio" role="alert">' +
                        'Warning. Objects must be dropped into Actions! ' +
                        '<a href="#" class="alert-link" onclick="closeWarning(this);">Ok</a>.</div>';
                    $('#droppable').prepend(message);
                    $d.remove();
                }
                if (parent_div.is('.drop_motion')) {
                    message = '<div class="alert alert-mio" role="alert">' +
                        'Warning. Objects must be dropped into Actions! ' +
                        '<a href="#" class="alert-link" onclick="closeWarning(this);">Ok</a>.</div>';
                    $('#droppable').prepend(message);
                    $d.remove();
                }


                if ($($figli_obj).length > 1) {
                    if ($(parent_div).parent().parent().parent().parent().parent().hasClass('event')) {
                        message = '<div class="alert alert-mio" role="alert">' +
                            'Warning. Robot can find only one object at a time ' +
                            '<a href="#" class="alert-link" onclick="closeWarning(this);">Ok</a>.</div>';
                        $('#droppable').prepend(message);
                        $d.remove();
                    }
                    if ($(parent_div).parent().hasClass('act')) {
                        message = '<div class="alert alert-mio" role="alert">' +
                            'Warning. Robot can handle only one object at a time ' +
                            '<a href="#" class="alert-link" onclick="closeWarning(this);">Ok</a>.</div>';
                        $('#droppable').prepend(message);
                        $d.remove();
                    }
                }

            }

            //controllo location
            if ($d.hasClass("loc")) {

                parent_div = $d.parent(); //drop_pick_obj

                $figli_obj = parent_div.find('.loc');
                let message = '';

                if (parent_div.is('#droppable')) {
                    message = '<div class="alert alert-mio" role="alert">' +
                        'Warning. Locations must be dropped into Place! ' +
                        '<a href="#" class="alert-link" onclick="closeWarning(this);">Ok</a>.</div>';
                    $('#droppable').prepend(message);
                    $d.remove();
                }
                if (parent_div.is('.drop_motion')) {
                    message = '<div class="alert alert-mio" role="alert">' +
                        'Warning. Locations must be dropped into Place! ' +
                        '<a href="#" class="alert-link" onclick="closeWarning(this);">Ok</a>.</div>';
                    $('#droppable').prepend(message);
                    $d.remove();
                }

                if ($($figli_obj).length > 1) {
                    if ($(parent_div).parent().hasClass('act')) {
                        message = '<div class="alert alert-mio" role="alert">' +
                            'Warning. Robot can have only one destination at a time ' +
                            '<a href="#" class="alert-link" onclick="closeWarning(this);">Ok</a>.</div>';
                        $('#droppable').prepend(message);
                        $d.remove();
                    }
                }
            }


            if ($(this).hasClass('card-body')) {
                $d.css('margin-bottom', '10px');
            }
            if ($d.hasClass('act') || $d.hasClass('repeat')) {
                $d.css('width', '50%');
            }
            if ($d.hasClass('repeat') && $d.parent().hasClass('drop_motion')) {
                $d.css('width', '100%');
            }
            if ($d.hasClass('act') && $d.parent().hasClass('drop_motion')) {
                $d.css('width', '100%');
            }

            if ($d.hasClass("act")) {
                if ($d.parent().is('#droppable')) {

                    $d.find('.drop_pick_obj').css('min-width', '50%');
                    $d.find('.drop_pick_obj').css('margin-right', '10%');
                    $d.find('.drop_obj').css('margin-left', '15%');
                }
            }

            $('.drop_pick_obj > p').css({"padding-left": "0px", "padding-right": "0px"});

            $d.removeClass('library');
            $d.addClass('canvas');
            controllo($d);
        } else {

            if ($d.hasClass('act')) {
                if ($(this).hasClass('drop_motion') || $(this).is('#droppable')) {
                    $(this).append($d);
                    $d.css('position', 'relative');
                    $d.css('left', 'auto');
                    $d.css('top', 'auto');
                    $d.css('width', '100%');
                    controllo($d);
                    applica_proprieta_4($d);
                    applica_proprieta_3($d);
                    $(ui.draggable).addClass('d-none');
                }
            }
            if ($d.hasClass('repeat')) {
                if ($(this).hasClass('drop_motion') || $(this).is('#droppable')) {
                    $(this).append($d);
                    $d.css('position', 'relative');
                    $d.css('left', 'auto');
                    $d.css('top', 'auto');
                    $d.css('width', '100%');
                    controllo($d);
                    applica_proprieta_4($d);
                    applica_proprieta_3($d);
                    $(ui.draggable).addClass('d-none');
                }
            }

            if ($(this).hasClass('card-body')) {
                $d.css('margin-bottom', '10px');
            }
            if ($d.hasClass('act') || $d.hasClass('repeat')) {
                $d.css('width', '50%');
            }
            if ($d.hasClass('repeat') && $d.parent().hasClass('drop_motion')) {
                $d.css('width', '100%');
            }
            if ($d.hasClass('act') && $d.parent().hasClass('drop_motion')) {
                $d.css('width', '100%');
            }

            if ($d.hasClass("act")) {
                if ($d.parent().is('#droppable')) {
                    $d.find('.drop_pick_obj').css('min-width', '50%');
                    $d.find('.drop_pick_obj').css('margin-right', '10%');
                    $d.find('.drop_obj').css('margin-left', '15%');
                }
            }

            $('.drop_pick_obj > p').css({"padding-left": "0px", "padding-right": "0px"});

        }


    }
};

/**Applica le proprietà per rendere gli elementi droppable*/
function applica_proprieta_3($body) {

    $children = $body.children();

    $body.find('.repeat').each(function (i) {
        //$(this).css('background-color','green');
        $(this).find('.drop_motion').droppable(droppable_options_repeat).sortable({});
        $(this).find('.drop_event').droppable(droppable_options_event).sortable({});
    });
    $body.find('.act').each(function (i) {
        //$(this).css('background-color','blue');
        $(this).find('.drop_pick_obj').droppable(droppable_options_act).sortable({});
        $figli = $(this).find('.drop_pick_obj').find('.obj');
        if ($figli.is('div')) {
            //$(this).find('.drop_pick_obj').sortable("disable");
            //$(this).find('.drop_pick_obj').droppable("disable");
        }
    });
    $body.find('.event').each(function () {
        $(this).find('.drop_pick_obj').droppable(droppable_options_act).sortable({});
        $figli = $(this).find('.drop_pick_obj').find('.obj');
    });


}

/**applica le proprietà per rendere gli elementi droppable*/
function applica_proprieta_4($body) {

    let droppable_options_act = {
        accept: '.obj',
        greedy: true,
        hoverClass: "droppable-hover",
        //quando ci mollo dentro un elemento
        drop: function (event, ui) {
            //clono l'elemento
            $d = $(ui.draggable).clone();
            if (!$d.hasClass('canvas')) {
                if ($d.hasClass('library')) {
                    /* add a button so the element can be removed if no longer necessary */
                    let $remove_btn = $('<button class="remove-choice" onclick="removeParent(this)"><i class="fas fa-times"></i></button>');
                    $d.prepend($remove_btn);
                } else {
                    // se non ha la classe library lo rimuovo
                    $(ui.draggable).remove();
                }
                //opzioni di drop, se io metterò qualcosa dentro questo oggetto
                let options = droppable_options;
                let options_Cond = droppable_options;
                let options_Body = droppable_options;

                //prendo le classi di data-accept
                let accepted_elements = $d.attr('data-accept');


                if ($d.attr('data-accept') !== "") {
                    if ($d.hasClass('ifCondition')) {

                        $divCond = $d.find('.drop_event');
                        let accepted_Cond = $divCond.attr('data-accept');


                        $divBody = $d.find('.drop_motion');
                        let accepted_Body = $divBody.attr('data-accept');


                        options_Cond = $.extend(true, {}, droppable_options);
                        options_Cond.accept = accepted_Cond;
                        options_Cond.hoverClass = 'droppable-hover';
                        $divCond.droppable(options_Cond).sortable();

                        options_Body = $.extend(true, {}, droppable_options);
                        options_Body.accept = accepted_Body;
                        options_Body.hoverClass = 'droppable-hover';
                        $divBody.droppable(options_Body).sortable();
                    } else {
                        // deep clone droppable_options object
                        options = $.extend(true, {}, droppable_options);
                        options.accept = accepted_elements;
                    }

                }

                /* make the new element droppable i.e. to support groups within groups etc... */

                if ($d.find("div").is('div') && !$d.hasClass('ifCondition')) {
                    $d.find("div").droppable(options).sortable(); //estende droppable option al div dentro
                }


                $d.css('position', 'relative');
                $d.css('left', 'auto');
                $d.css('top', 'auto');

                if ($d.hasClass('obj')) {
                    $d.css('width', '100%');
                }

                if ($d.hasClass('task')) {
                    $nameTask = $d.text().trim();
                    addExistingTask($nameTask);
                } else {
                    $(this).append($d);
                    if ($(this).is('#droppable')) {
                        $('#task_building_area').addClass('d-none');
                    }
                }

                //controllo
                if ($d.hasClass("obj")) {

                    parent_div = $d.parent(); //drop_pick_obj
                    $figli_obj = parent_div.find('.obj');
                    let message = '';
                    if ($($figli_obj).length > 1) {
                        if ($(parent_div).parent().parent().parent().parent().parent().hasClass('event')) {
                            message = '<div class="alert alert-warning" role="alert">' +
                                'Warning. Robot can find only one object at a time ' +
                                '<a href="#" class="alert-link" onclick="closeWarning(this);">Ok</a>.</div>';
                            $('#droppable').prepend(message);
                            $d.remove();
                        }
                        if ($(parent_div).parent().hasClass('act')) {
                            message = '<div class="alert alert-warning" role="alert">' +
                                'Warning. Robot can handle only one object at a time ' +
                                '<a href="#" class="alert-link" onclick="closeWarning(this);">Ok</a>.</div>';
                            $('#droppable').prepend(message);
                            $d.remove();
                        }
                    }
                }

                //controllo location
                if ($d.hasClass("loc")) {

                    parent_div = $d.parent(); //drop_pick_obj

                    $figli_obj = parent_div.find('.loc');
                    let message = '';
                    if ($($figli_obj).length > 1) {
                        if ($(parent_div).parent().hasClass('act')) {
                            message = '<div class="alert alert-mio" role="alert">' +
                                'Warning. Robot can have only one destination at a time ' +
                                '<a href="#" class="alert-link" onclick="closeWarning(this);">Ok</a>.</div>';
                            $('#droppable').prepend(message);
                            $d.remove();
                        }
                    }
                }

                if ($(this).hasClass('card-body')) {
                    $d.css('margin-bottom', '10px');
                }
                if ($d.hasClass('act') || $d.hasClass('repeat')) {
                    $d.css('width', '50%');
                }
                if ($d.hasClass('repeat') && $d.parent().hasClass('drop_motion')) {
                    $d.css('width', '100%');
                }
                if ($d.hasClass('act') && $d.parent().hasClass('drop_motion')) {
                    $d.css('width', '100%');
                }
                $('.drop_pick_obj > p').css({"padding-left": "0px", "padding-right": "0px"});

                $d.removeClass('library');
                $d.addClass('canvas');
                controllo($d);
            } else {

                if ($d.hasClass('act')) {
                    if ($(this).hasClass('drop_motion') || $(this).is('#droppable')) {
                        $(this).append($d);
                        $d.css('position', 'relative');
                        $d.css('left', 'auto');
                        $d.css('top', 'auto');
                        $d.css('width', '100%');
                        controllo($d);
                        applica_proprieta_4($d);
                        applica_proprieta_3($d);
                        $(ui.draggable).addClass('d-none');
                    }
                }
                if ($d.hasClass('repeat')) {
                    if ($(this).hasClass('drop_motion') || $(this).is('#droppable')) {
                        $(this).append($d);
                        $d.css('position', 'relative');
                        $d.css('left', 'auto');
                        $d.css('top', 'auto');
                        $d.css('width', '100%');
                        controllo($d);
                        applica_proprieta_4($d);
                        applica_proprieta_3($d);
                        $(ui.draggable).addClass('d-none');
                    }
                }

                if ($(this).hasClass('card-body')) {
                    $d.css('margin-bottom', '10px');
                }
                if ($d.hasClass('act') || $d.hasClass('repeat')) {
                    $d.css('width', '50%');
                }
                if ($d.hasClass('repeat') && $d.parent().hasClass('drop_motion')) {
                    $d.css('width', '100%');
                }
                if ($d.hasClass('act') && $d.parent().hasClass('drop_motion')) {
                    $d.css('width', '100%');
                }

                if ($d.hasClass("act")) {
                    if ($d.parent().is('#droppable')) {
                        $d.find('.drop_pick_obj').css('min-width', '50%');
                        $d.find('.drop_pick_obj').css('margin-right', '10%');
                        $d.find('.drop_obj').css('margin-left', '15%');
                    }
                }

                $('.drop_pick_obj > p').css({"padding-left": "0px", "padding-right": "0px"});

            }
        }
    };

    let droppable_options_event = {
        accept: '.event',
        greedy: true,
        hoverClass: "droppable-hover",
        //quando ci mollo dentro un elemento
        drop: function (event, ui) {
            //clono l'elemento
            $d = $(ui.draggable).clone();
            if (!$d.hasClass('canvas')) {
                if ($d.hasClass('library')) {
                    /* add a button so the element can be removed if no longer necessary */
                    let $remove_btn = $('<button class="remove-choice" onclick="removeParent(this)"><i class="fas fa-times"></i></button>');
                    $d.prepend($remove_btn);
                } else {
                    // se non ha la classe library lo rimuovo
                    $(ui.draggable).remove();
                }
                //opzioni di drop, se io metterò qualcosa dentro questo oggetto
                let options = droppable_options;
                let options_Cond = droppable_options;
                let options_Body = droppable_options;

                //prendo le classi di data-accept
                let accepted_elements = $d.attr('data-accept');


                if ($d.attr('data-accept') !== "") {
                    if ($d.hasClass('ifCondition')) {

                        $divCond = $d.find('.drop_event');
                        let accepted_Cond = $divCond.attr('data-accept');


                        $divBody = $d.find('.drop_motion');
                        let accepted_Body = $divBody.attr('data-accept');


                        options_Cond = $.extend(true, {}, droppable_options);
                        options_Cond.accept = accepted_Cond;
                        options_Cond.hoverClass = 'droppable-hover';
                        $divCond.droppable(options_Cond).sortable();

                        options_Body = $.extend(true, {}, droppable_options);
                        options_Body.accept = accepted_Body;
                        options_Body.hoverClass = 'droppable-hover';
                        $divBody.droppable(options_Body).sortable();
                    } else {
                        // deep clone droppable_options object
                        options = $.extend(true, {}, droppable_options);
                        options.accept = accepted_elements;
                    }

                }

                /* make the new element droppable i.e. to support groups within groups etc... */

                if ($d.find("div").is('div') && !$d.hasClass('ifCondition')) {

                    $d.find("div").droppable(options).sortable(); //estende droppable option al div dentro
                }


                $d.css('position', 'relative');
                $d.css('left', 'auto');
                $d.css('top', 'auto');

                if ($d.hasClass('obj')) {
                    $d.css('width', '100%');
                }

                if ($d.hasClass('task')) {
                    $nameTask = $d.text().trim();
                    addExistingTask($nameTask);
                } else {
                    $(this).append($d);
                    if ($(this).is('#droppable')) {
                        $('#task_building_area').addClass('d-none');
                    }
                }

                //controllo
                if ($d.hasClass("obj")) {

                    parent_div = $d.parent(); //drop_pick_obj

                    $figli_obj = parent_div.find('.obj');
                    let message = '';
                    if ($($figli_obj).length > 1) {
                        if ($(parent_div).parent().parent().parent().parent().parent().hasClass('event')) {
                            message = '<div class="alert alert-warning" role="alert">' +
                                'Warning. Robot can find only one object at a time ' +
                                '<a href="#" class="alert-link" onclick="closeWarning(this);">Ok</a>.</div>';
                            $('#droppable').prepend(message);
                            $d.remove();
                        }
                        if ($(parent_div).parent().hasClass('act')) {
                            message = '<div class="alert alert-warning" role="alert">' +
                                'Warning. Robot can handle only one object at a time ' +
                                '<a href="#" class="alert-link" onclick="closeWarning(this);">Ok</a>.</div>';
                            $('#droppable').prepend(message);
                            $d.remove();
                        }
                    }
                }

                //controllo location
                if ($d.hasClass("loc")) {

                    parent_div = $d.parent(); //drop_pick_obj

                    $figli_obj = parent_div.find('.loc');
                    let message = '';
                    if ($($figli_obj).length > 1) {
                        if ($(parent_div).parent().hasClass('act')) {
                            message = '<div class="alert alert-mio" role="alert">' +
                                'Warning. Robot can have only one destination at a time ' +
                                '<a href="#" class="alert-link" onclick="closeWarning(this);">Ok</a>.</div>';
                            $('#droppable').prepend(message);
                            $d.remove();
                        }
                    }
                }

                if ($(this).hasClass('card-body')) {
                    $d.css('margin-bottom', '10px');
                }
                if ($d.hasClass('act') || $d.hasClass('repeat')) {
                    $d.css('width', '50%');
                }
                if ($d.hasClass('repeat') && $d.parent().hasClass('drop_motion')) {
                    $d.css('width', '100%');
                }
                if ($d.hasClass('act') && $d.parent().hasClass('drop_motion')) {
                    $d.css('width', '100%');
                }
                $('.drop_pick_obj > p').css({"padding-left": "0px", "padding-right": "0px"});

                $d.removeClass('library');
                $d.addClass('canvas');
                controllo($d);
            } else {

                if ($d.hasClass('act')) {
                    if ($(this).hasClass('drop_motion') || $(this).is('#droppable')) {
                        $(this).append($d);
                        $d.css('position', 'relative');
                        $d.css('left', 'auto');
                        $d.css('top', 'auto');
                        $d.css('width', '100%');
                        controllo($d);
                        applica_proprieta_4($d);
                        applica_proprieta_3($d);
                        $(ui.draggable).addClass('d-none');
                    }
                }
                if ($d.hasClass('repeat')) {
                    if ($(this).hasClass('drop_motion') || $(this).is('#droppable')) {
                        $(this).append($d);
                        $d.css('position', 'relative');
                        $d.css('left', 'auto');
                        $d.css('top', 'auto');
                        $d.css('width', '100%');
                        controllo($d);
                        applica_proprieta_4($d);
                        applica_proprieta_3($d);
                        $(ui.draggable).addClass('d-none');
                    }
                }

                if ($(this).hasClass('card-body')) {
                    $d.css('margin-bottom', '10px');
                }
                if ($d.hasClass('act') || $d.hasClass('repeat')) {
                    $d.css('width', '50%');
                }
                if ($d.hasClass('repeat') && $d.parent().hasClass('drop_motion')) {
                    $d.css('width', '100%');
                }
                if ($d.hasClass('act') && $d.parent().hasClass('drop_motion')) {
                    $d.css('width', '100%');
                }

                if ($d.hasClass("act")) {
                    if ($d.parent().is('#droppable')) {
                        $d.find('.drop_pick_obj').css('min-width', '50%');
                        $d.find('.drop_pick_obj').css('margin-right', '10%');
                        $d.find('.drop_obj').css('margin-left', '15%');
                    }
                }
                $('.drop_pick_obj > p').css({"padding-left": "0px", "padding-right": "0px"});

            }
        }
    };

    let droppable_options_repeat = {
        accept: '.act, .repeat',
        greedy: true,
        hoverClass: "droppable-hover",
        //quando ci mollo dentro un elemento
        drop: function (event, ui) {
            //clono l'elemento
            $d = $(ui.draggable).clone();

            if (!$d.hasClass('canvas')) {
                if ($d.hasClass('library')) {
                    /* add a button so the element can be removed if no longer necessary */
                    let $remove_btn = $('<button class="remove-choice" onclick="removeParent(this)"><i class="fas fa-times"></i></button>');
                    $d.prepend($remove_btn);
                } else {
                    // se non ha la classe library lo rimuovo
                    $(ui.draggable).remove();
                }
                //opzioni di drop, se io metterò qualcosa dentro questo oggetto
                let options = droppable_options;
                let options_Cond = droppable_options;
                let options_Body = droppable_options;

                //prendo le classi di data-accept
                let accepted_elements = $d.attr('data-accept');


                if ($d.attr('data-accept') !== "") {
                    if ($d.hasClass('ifCondition')) {

                        $divCond = $d.find('.drop_event');
                        let accepted_Cond = $divCond.attr('data-accept');


                        $divBody = $d.find('.drop_motion');
                        let accepted_Body = $divBody.attr('data-accept');


                        options_Cond = $.extend(true, {}, droppable_options);
                        options_Cond.accept = accepted_Cond;
                        options_Cond.hoverClass = 'droppable-hover';
                        $divCond.droppable(options_Cond).sortable();

                        options_Body = $.extend(true, {}, droppable_options);
                        options_Body.accept = accepted_Body;
                        options_Body.hoverClass = 'droppable-hover';
                        $divBody.droppable(options_Body).sortable();
                    } else {
                        // deep clone droppable_options object
                        options = $.extend(true, {}, droppable_options);
                        options.accept = accepted_elements;
                    }

                }

                /* make the new element droppable i.e. to support groups within groups etc... */

                if ($d.find("div").is('div') && !$d.hasClass('ifCondition')) {

                    $d.find("div").droppable(options).sortable(); //estende droppable option al div dentro
                }

                $d.css('position', 'relative');
                $d.css('left', 'auto');
                $d.css('top', 'auto');

                if ($d.hasClass('obj')) {
                    $d.css('width', '100%');
                }
                $(this).append($d);

                if ($d.hasClass("obj")) {
                    parent_div = $d.parent(); //drop_pick_obj
                    parent_div.sortable("disable");
                    parent_div.droppable("disable");
                }

                if ($(this).hasClass('card-body')) {
                    $d.css('margin-bottom', '10px');
                }
                if ($d.hasClass('act') || $d.hasClass('repeat')) {
                    $d.css('width', '50%');
                }
                if ($d.hasClass('repeat') && $d.parent().hasClass('drop_motion')) {
                    $d.css('width', '100%');
                }
                if ($d.hasClass('act') && $d.parent().parent().hasClass('repeat')) {
                    $d.css('width', '100%');
                }
                $('.drop_pick_obj > p').css({"padding-left": "0px", "padding-right": "0px"});

                $d.removeClass('library');
                $d.addClass('canvas');
                controllo($d);
            } else {

                if ($d.hasClass('act')) {
                    if ($(this).hasClass('drop_motion') || $(this).is('#droppable')) {
                        $(this).append($d);
                        $d.css('position', 'relative');
                        $d.css('left', 'auto');
                        $d.css('top', 'auto');
                        $d.css('width', '100%');
                        controllo($d);
                        applica_proprieta_4($d);
                        applica_proprieta_3($d);
                        $(ui.draggable).addClass('d-none');
                    }
                }
                if ($d.hasClass('repeat')) {
                    if ($(this).hasClass('drop_motion') || $(this).is('#droppable')) {
                        $(this).append($d);
                        $d.css('position', 'relative');
                        $d.css('left', 'auto');
                        $d.css('top', 'auto');
                        $d.css('width', '100%');
                        controllo($d);
                        applica_proprieta_4($d);
                        applica_proprieta_3($d);
                        $(ui.draggable).addClass('d-none');
                    }
                }

                if ($(this).hasClass('card-body')) {
                    $d.css('margin-bottom', '10px');
                }
                if ($d.hasClass('act') || $d.hasClass('repeat')) {
                    $d.css('width', '50%');
                }
                if ($d.hasClass('repeat') && $d.parent().hasClass('drop_motion')) {
                    $d.css('width', '100%');
                }
                if ($d.hasClass('act') && $d.parent().hasClass('drop_motion')) {
                    $d.css('width', '100%');
                }

                if ($d.hasClass("act")) {
                    if ($d.parent().is('#droppable')) {
                        $d.find('.drop_pick_obj').css('min-width', '50%');
                        $d.find('.drop_pick_obj').css('margin-right', '10%');
                        $d.find('.drop_obj').css('margin-left', '15%');
                    }
                }

                $('.drop_pick_obj > p').css({"padding-left": "0px", "padding-right": "0px"});

            }

        }
    };


    if ($body.hasClass('repeat')) {
        //$(this).css('background-color','green');
        $body.find('.drop_motion').droppable(droppable_options_repeat).sortable({});
        $body.find('.drop_event').droppable(droppable_options_event).sortable({});
    }
    if ($body.hasClass('act')) {
        //$(this).css('background-color','blue');
        $body.find('.drop_pick_obj').droppable(droppable_options_act).sortable({});
        $figli = $body.find('.drop_pick_obj').find('.obj');
        if ($figli.is('div')) {
            //$(this).find('.drop_pick_obj').sortable("disable");
            //$(this).find('.drop_pick_obj').droppable("disable");
        }
    }
    if ($body.hasClass('event')) {
        //$(this).css('background-color','red');
        $body.find('.drop_pick_obj').droppable(droppable_options_act).sortable({});
        $figli = $body.find('.drop_pick_obj').find('.obj');
        if ($figli.is('div')) {
            //$(this).find('.drop_pick_obj').sortable("disable");
            //$(this).find('.drop_pick_obj').droppable("disable");
        }
    }
    if ($body.hasClass('obj')) {
        //$(this).css('background-color','orange');
    }


}

/**Metodo per chiudere gli warning*/
function closeWarning($this) {
    $($this).parent().remove();
}

// aggiunte le opzioni al body che contiene il programma
$("#droppable").droppable(droppable_options).sortable({});

$(".act").draggable({
    helper: 'clone'
});
$(".repeat").draggable({
    helper: 'clone'
});

$(".event").draggable({
    helper: 'clone'
});

/**Metodo per eliminare un componente dalla project area con la X*/
function removeParent(el) {
    //in input ho il button
    let $var = $(el).parent().parent().find('p');
    let $parent = $(el).parent().parent().parent();

    let $parent_drop_event = $(el).closest('.drop_event');

    $parent_sub_bool = false;

    let $parent_sub = $(el).parent().parent().parent().parent().parent().parent().parent();
    if ($parent_sub.hasClass('event')) {
        $parent_sub.find('.drop_obj').removeClass('d-none');
        $parent_sub_bool = true;
    }

    if ($(el).parent().hasClass('obj')) {
        parent_div = $(el).contents('.drop_motion');  // il contenitore
        parent_div2 = $(el).parent().parent();
        if (parent_div2.is('div')) {
            parent_div2.sortable("enable");
            parent_div2.droppable("enable");
        } else {

        }
        parent_div.sortable("enable");
        parent_div.droppable("enable");

    }

    if ($(el).parent().hasClass('act')) {
        $motion = $(el).parent();
        $p = $motion.parent().find('p');
        $parent = $motion.parent();
        if ($p.hasClass('drop_act') && $parent.find('.act').length === 1 && $parent.find('.repeat').length === 0) {
            $p.removeClass('d-none');
        }
    }

    if ($(el).parent().hasClass('repeat')) {
        $repeat = $(el).parent();
        $p = $repeat.parent().find('p:first-of-type');
        $parent = $repeat.parent();
        if ($p.hasClass('drop_act') && $parent.find('.repeat').length === 1 && $parent.find('.act').length === 0) {

            $p.removeClass('d-none');
        }
    }


    if ($(el).parent().parent().is('#droppable') && $(el).parent().parent().children().length === 2) {
        $('#task_building_area').removeClass('d-none');
    }

    $(el).parent().remove();

    if ($parent.hasClass('repeat') && !$parent.find('.drop_motion').find('.act').is('div')) {

        let $drop = $parent.find('div').find('p:first-of-type').removeClass('d-none');
    }

    if ($parent_drop_event.is('div') && !$parent_sub_bool && !$parent_drop_event.find('.event').is('div')) {
        let $drop = $parent_drop_event.find('p:first-of-type').removeClass('d-none');
    } else if ($parent.hasClass('act')) {
        $parent.find('div').find('p:first-of-type').removeClass('d-none');
    }

}


function addExistingTask(nameTask) {
    getTaskFromName(nameTask);
}

/**Metodo per ottenere la lista degli oggetti*/
function getObjectList(username) {
    $.ajax({
        type: 'POST',
        url: '/getObjectList/',
        dataType: 'json',
        data: {
            username: username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            dest = $('#object_list');
            dest.html("");

            if ($(result).length !== 0) {

                $.each(result, function (index, element) {

                    let object_name = element.fields.name;
                    let object_keys = element.fields.keywords;
                    let object_id = object_name.replace(' ', '');
                    let partsOfStr = object_keys.split(',');
                    let ob = '<div id="' + object_id + '" class="obj drag ui-draggable ui-draggable-handle library" ' +
                        'data-accept="" data-container="body" data-toggle="popover" data-content="Keywords: ' + object_keys + '" ' +
                        'data-placement="left" keywords="' + object_keys + '"><div class="no-drop">' + object_name.substr(0, 1).toUpperCase() + object_name.substr(1).toLowerCase() + '</div></div>';
                    dest.append(ob);
                });
                $(".obj").draggable({
                    helper: 'clone'
                });
            }
            let newObject = '<div onclick="openModalSelectRobotNewObject()" id="newObject" class="obj drag ui-draggable ui-draggable-handle library"' +
                'data-placement="left" style="color: #FDD835; background-color: white; border: #FDD835 1px solid;"><div class="no-drop"><i class="fas fa-plus"></i> New</div></div>';
            dest.append(newObject);
        },
        error: function () {
            alert("error");
        }
    });

}

/**Metodo per ottenere la lista delle location*/
function getLocationList(username) {
    $.ajax({
        type: 'POST',
        url: '/getLocationList/',
        dataType: 'json',
        data: {
            username: username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            dest = $('#location_list');
            dest.html("");

            if ($(result).length !== 0) {

                $.each(result, function (index, element) {
                    let location_name = element.fields.name.replace(' ', '');
                    let location_id = element.pk;
                    let ob = '<div id="' + location_name + '" class="loc drag ui-draggable ui-draggable-handle library" ' +
                        'data-accept="" data-container="body" data-toggle="popover" data-content="This is a ' + location_name + '. Drop it in Actions!" ' +
                        'data-placement="left" keywords="' + location_name + '"><div class="no-drop">' + location_name.substring(0, 1).toUpperCase() + location_name.substring(1).toLowerCase() + '</div></div>';
                    dest.append(ob);

                });
                $(".loc").draggable({
                    helper: 'clone'
                });
            }
            let newLocation = '<div onclick="openModalNewLocation()" id="newLocation" class="loc drag ui-draggable ui-draggable-handle library"' +
                'data-placement="left" style="color: #fd87fb; background-color: white; border: #fd87fb 1px solid;"><div class="no-drop"><i class="fas fa-plus"></i> New</div></div>';
            dest.append(newLocation);
        },
        error: function () {
            alert("error");
        }
    });

}

/**Metodo per ottenere la lista delle azioni*/
function getActionList(username) {
    $.ajax({
        type: 'POST',
        url: '/getActionList/',
        dataType: 'json',
        data: {
            username: username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            dest = $('#action_list');
            dest.html("");

            if ($(result).length !== 0) {
                $.each(result, function (index, element) {
                    let action_name = element.fields.name.replace(' ', '');
                    let ob = '<div id="' + action_name + '" class="act drag ui-draggable ui-draggable-handle library" ' +
                        'data-accept=".obj" data-toggle="popover" data-content="This is a ' + action_name + '. Drop it in Actions!" ' +
                        'data-placement="right" keywords="' + action_name + '">' + action_name.substring(0, 1).toUpperCase() + action_name.substring(1).toLowerCase() + '<div class="drop_pick_obj"><p class="drop_obj">Drop here an object</p></div></div>';
                    dest.append(ob);
                });
                $(".act").draggable({
                    helper: 'clone'
                });
            }
            let newAction = '<div onclick="openModalNewAction()" id="newAction" class="act drag ui-draggable ui-draggable-handle library"' +
                'data-placement="right" style="color: #29B6F6; background-color: white; border: #29B6F6 1px solid;"><div class="no-drop"><i class="fas fa-plus"></i> New</div></div>';
            dest.append(newAction);
        },
        error: function () {
            alert("error");
        }
    });

}


let $scrollingDiv = $(".column1");

$(window).scroll(function () {
    let fromTop = $(window).scrollTop();
    if ($(window).scrollTop() > 220) {
        $margintop = fromTop;
        /**$scrollingDiv.animate({margin: $margintop+"px"+" 0px 0px 0px"}, 1000);**/
        $scrollingDiv.css("margin-top", $margintop + "px");
    } else {
        $scrollingDiv.css("margin-top", "0%")
    }
});

function openModalSelectRobotNewObject() {
    $('#errorSelectRobotNewObject').html("");
    $('#errorSelectRobotObjectName').html("");
    $('#errorSelectRobotObjectKeywords').html("");
    $('#SelectRobotObjectName').val('');
    $('#SelectRobotObjectKeywords').val('');
    $('#SelectRobotNext').prop('disabled', false);
    $('#SelectRobotNext').css('cursor', 'cursor');
    $('#SelectRobotNewObject')
        .find('option')
        .remove()
        .end()
        .append('<option disabled selected value hidden>Select robot ...</option>')
    ;
    let $username = $('#username').html();
    $.ajax({
        type: 'POST',
        url: '/robotOfUser/',
        dataType: 'JSON',
        data: {
            username: $username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            if ($(result).length !== 0) {
                $.each(result, function (index, element) {
                    let robot_name = element.fields.name;
                    let robot_id = element.fields.robot;
                    $("#SelectRobotNewObject").append(new Option(robot_name, robot_name));
                })
            } else {
                $('#errorSelectRobotNewObject').html("No robot associated to your account");
                $('#SelectRobotNext').prop('disabled', true);
                $('#SelectRobotNext').css('cursor', 'not-allowed');
            }


        },

        error: function (result) {
            alert(JSON.stringify(result));
            alert("ERROR: robotOfUser")
        }
    });

    $('#modalSelectRobotNewObject').attr('username', $username);
    $('#modalSelectRobotNewObject').modal('show');
}

function openModalNewObject(user) {
    let username = user;
    let noError = true;
    let robot = $('#SelectRobotNewObject').val();
    let object = $('#SelectRobotObjectName').val().toLowerCase();
    let keywords = $('#SelectRobotObjectKeywords').val();
    let shared = "False";
    if ($('#checkboxSelectRobotNewObject').is(':checked')) {
        shared = "True";
    }
    $('#errorSelectRobotNewObject').html("");
    $('#errorSelectRobotObjectName').html("");
    $('#errorSelectRobotObjectKeywords').html("");
    if (robot == null) {
        $('#errorSelectRobotNewObject').html("No robot selected");
        noError = false;
    }
    if (object === '') {
        $('#errorSelectRobotObjectName').html("No name selected");
        noError = false;
    } else {
        $.ajax({
            type: 'POST',
            url: '/objectExist/',
            dataType: 'JSON',
            async: false,
            data: {
                shared: shared,
                username: username,
                object: object,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },

            success: function (result) {
                if (result.nameExist == true) {
                    $('#errorSelectRobotObjectName').html("Object name already exist");
                    noError = false;
                } else if (result.keywordExist == true) {
                    $('#errorSelectRobotObjectName').html("Object name is already a keyword of another object");
                    noError = false;
                }
            },

            error: function (result) {
                alert(JSON.stringify(result));
                alert("ERROR: objectExist")
            }
        });
    }

    $.ajax({
        type: 'POST',
        url: '/keywordExist/',
        dataType: 'JSON',
        async: false,
        data: {
            shared: shared,
            username: username,
            keywords: keywords,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            if (result.keywordExist === true) {
                $('#errorSelectRobotObjectKeywords').html("Keywords already exist: " + result.keywordFound);
                noError = false;
            }
        },

        error: function (result) {
            alert(JSON.stringify(result));
            alert("ERROR: keywordExist")
        }
    });

    if (noError) {
        let keywords_split = keywords.split(",");
        if (object === pluralize(object)) {
            keywords = object;
        } else {
            keywords = object + ',' + pluralize(object);
        }

        for (let i = 0; i < keywords_split.length; i++) {
            if (keywords_split[i].trim() !== '' && keywords_split[i].trim() !== object && keywords_split[i].trim() !== pluralize(object)) {
                keywords += ',' + keywords_split[i].trim();
            }
        }
        $('#modalSelectRobotNewObject').modal('hide');
        $('#modalNewObject').attr('robot', robot);
        $('#modalNewObject').attr('object', object);
        $('#modalNewObject').attr('keywords', keywords);
        $('#modalNewObject').attr('shared', shared);
        $('#modalNewObject').modal('show');
    }
}

function saveObject(user) {
    username = user;
    //robot = $('#modalNewObject').attr('robot');
    object = $('#modalNewObject').attr('object');
    keywords = $('#modalNewObject').attr('keywords');
    shared = $('#modalNewObject').attr('shared');
    force = $('#modalNewObject').attr('force');
    height = $('#modalNewObject').attr('heightObject');

    $.ajax({
        type: 'POST',
        url: '/saveObject/',
        data: {
            username: username,
            keywords: keywords,
            object: object,
            shared: shared,
            force: force,
            height: height,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            $('#modalNewObject').modal('hide');
            $('#modalNewObjectConfirm').modal('show');
        },

        error: function (result) {
            alert(JSON.stringify(result));
            alert("ERROR: saveObject")
        }
    });
}

function takeShot(getUsername) {
    $('#spinnerNewObject').html("<i class=\"fa-2x fas fa-cog fa-spin\"></i>");
    let username = getUsername;
    let robot = $('#modalNewObject').attr('robot');
    let object = $('#modalNewObject').attr('object');
    $.ajax({
        type: 'POST',
        url: '/takeShot/',
        data: {
            robot_name: robot,
            username: username,
            object_name: object,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            $('#newObjectImg').css('opacity', '1');
            $('#newObjectImg').attr("src", "../../static/images/objects/" + username + "_" + object + "_contour.png?" + Date.now());
            $('#spinnerNewObject').html("");
        },

        error: function (result) {
            alert('ERROR: takeShot');
            alert(JSON.stringify(result));
        }
    });
}

function openModalNewLocation() {
    $('#errorPositionLocation').html("");
    $('#newLocationName').val("");
    $('#newLocationSelectRobot')
        .find('option')
        .remove()
        .end()
        .append('<option disabled selected value hidden>Select robot ...</option>')
    ;
    let $username = $('#username').html();
    $.ajax({
        type: 'POST',
        url: '/robotOfUser/',
        dataType: 'JSON',
        data: {
            username: $username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            if ($(result).length !== 0) {
                $.each(result, function (index, element) {
                    let robot_name = element.fields.name;
                    let robot_id = element.fields.robot;
                    $("#newLocationSelectRobot").append(new Option(robot_name, robot_name));
                })
            } else {
                $('#newLocationErrorSelectRobot').html("No robot associated to your account");
                $('#newLocationSelectRobot').prop('disabled', true);
                $('#newLocationSelectRobot').css('cursor', 'not-allowed');
            }


        },

        error: function (result) {
            alert(JSON.stringify(result));
            alert("ERROR: robotOfUser")
        }
    });

    $('#modalNewLocation').modal('show');
}

function saveLocation($this) {
    let position = $('#modalNewLocation').attr('position');
    let username = $this;
    let noError = true;
    let robot = $('#newLocationSelectRobot').val();
    let name = $('#newLocationName').val();
    let shared = "False";
    if ($('#checkboxSharedNewLocation').is(':checked')) {
        shared = "True";
    }
    if (position === undefined) {
        noError = false;
        $('#errorPositionLocation').css("color", "red");
        $('#errorPositionLocation').html('&ensp;<i class="fas fa-times-circle"></i>&ensp;Position not saved');
    }
    $('#newLocationErrorSelectRobot').html("");
    if (robot == null) {
        $('#newLocationErrorSelectRobot').html("<i class=\"fas fa-times-circle\" style='color: red'></i> No robot selected");
        noError = false;
    }
    $('#newLocationErrorName').html("");
    if (name === '') {
        $('#newLocationErrorName').html("<i class=\"fas fa-times-circle\" style='color: red'></i> No name selected");
        noError = false;
    } else {
        $.ajax({
            type: 'POST',
            url: '/locationExist/',
            dataType: 'JSON',
            async: false,
            data: {
                shared: shared,
                username: username,
                location: name,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },

            success: function (result) {
                if (result.nameExist == true) {
                    $('#newLocationErrorName').html("Location name already exist");
                    noError = false;
                }
            },

            error: function (result) {
                alert(JSON.stringify(result));
                alert("ERROR: locationExist")
            }
        });
    }

    if (noError === true) {
        $.ajax({
            type: 'POST',
            url: '/createLocation/',
            data: {
                shared: shared,
                username: username,
                location: name,
                position: position,
                robot: robot,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },

            success: function (result) {
                $('#modalNewLocation').modal('hide');
                $('#modalNewLocationConfirm').modal('show');
            },

            error: function (result) {
                alert(JSON.stringify(result));
                alert("ERROR: createLocation")
            }
        });
    }
}

function takePositionAction($this) {
    $('#btnTakePositionAction').attr("disabled", true);
    $('#newActionErrorSelectRobot').html('');
    $('#errorPosition').css("color", "black");
    $('#errorTakePositionModifyAction').css("color", "black");
    $('#errorPosition').html("");
    $('#errorTakePositionModifyAction').html("  <i class=\"fa-2x fas fa-cog fa-spin\"></i>");
    let username = $this;
    let robot = $('#newActionSelectRobot').val();
    if (robot == null) {
        $('#newActionErrorSelectRobot').html('<i class=\"fas fa-times-circle\"></i> No robot selected');
        $('#btnTakePositionAction').attr("disabled", false);
        return
    }
    $('#errorPosition').html("  <i class=\"fa-2x fas fa-cog fa-spin\"></i>");
    let userPk;
    $.ajax({
        type: "POST",
        url: '/getUserIdFromUsername/',
        dataType: 'json',
        async: false,
        data:
            {
                username: username,
                robotname: robot,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },

        success: function (result) {
            $.each(result, function (index, element) {
                userPk = element.pk;
            });

        },
        error: function (result) {
            alert('ERROR: getUserIdFromUsername');
            alert(JSON.stringify(result));
        }
    });

    $.ajax({
        type: 'POST',
        url: '/takePosition/',
        data: {
            user: userPk,
            robotname: robot,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            if (result === 'ConnectionRefusedError' || result === 'TimeoutError') {
                $('#newActionErrorSelectRobot').html("<i class=\"fas fa-times-circle\"></i> Robot not connected");
                $('#btnTakePositionAction').attr("disabled", false);
                return
            }
            var point_position = result;
            var point_id = $('.action_list_point').find("li").length + 1;

            var dest = $('.action_list_point');

            dest.append('<li class="point_item row" id="append_btn_point_' + point_id + '" point_id="' + point_id + '" point_position="' + point_position + '"></li>');
            let content_point = '<span class="position_item_id column" style="width: 25%">Point ' + point_id + '</span>';

            let toggle_point = '<div class="column" style="width: 25%; text-align: center;">' +
                '<button class="btn button_white caret-off" type="button" id="deletePointAction"' +
                'point_id="' + point_id + '"><i class="fas fa-map-pin"></i></button>'

            $('#append_btn_point_' + point_id).append(toggle_point);
            $('#append_btn_point_' + point_id).append(content_point);


            $(".action_list_point li").hover(function () {
                //$(this).find('#dropdownMenuButtonTask').css('background-color', '#007bff');
                $(this).css('background-color', '#007bff');
                $(this).css('color', 'white');
                //$(this).find('#dropdownMenuButtonTask').css('color', 'white');

            });
            $(".action_list_point li").mouseleave(function () {
                //$(this).find('#dropdownMenuButtonTask').css('background-color', 'white');
                $(this).css('background-color', 'white');
                $(this).css('color', 'black');
                //$(this).find('#dropdownMenuButtonTask').css('color', 'black');

            });
            $('#btnTakePositionAction').attr("disabled", false);
        },

        error: function (result) {
            alert(JSON.stringify(result));
            alert("ERROR: takePositionAction")
        }

    })
}

function takePosition($this) {
    $('#btnTakePositionLocation').attr("disabled", true);
    $('#errorPosition').css("color", "black");
    $('#newLocationErrorSelectRobot').html('');
    let username = $this;
    let robot = $('#newLocationSelectRobot').val();
    if (robot == null) {
        $('#newLocationErrorSelectRobot').html('<i class="fas fa-times-circle"></i> No robot selected');
        $('#btnTakePositionLocation').attr("disabled", false);
        return
    }
    $('#errorPosition').html("  <i class=\"fa-2x fas fa-cog fa-spin\"></i>");
    let userPk;
    $.ajax({
        type: "POST",
        url: '/getUserIdFromUsername/',
        dataType: 'json',
        async: false,
        data:
            {
                username: username,
                robotname: robot,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },

        success: function (result) {
            $.each(result, function (index, element) {
                userPk = element.pk;
            });

        },
        error: function (result) {
            alert('ERROR: getUserIdFromUsername');
            alert(JSON.stringify(result));
        }
    });

    $.ajax({
        type: 'POST',
        url: '/takePositionLocation/',
        data: {
            user: userPk,
            robotname: robot,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            if (result === 'ConnectionRefusedError' || result === 'TimeoutError') {
                $('#newLocationErrorSelectRobot').html("<i class=\"fas fa-times-circle\"></i> Robot not connected");
                $('#btnTakePositionLocation').attr("disabled", false);
                $('#errorPosition').html("");
                return
            }
            $('#modalNewLocation').attr('position', result);
            $('#errorPosition').css('color', 'green');
            $('#errorPosition').html("&ensp;<i class=\'fas fa-check-circle\'></i>&ensp;New position received");
            $('#btnTakePositionLocation').attr("disabled", false);
        },

        error: function (result) {
            alert(JSON.stringify(result));
            alert("ERROR: takePositionLocation")
        }

    });
}

function takePositionObject($this) {
    $('#takePositionObjectButton').attr("disabled", true);
    $('#errorSelectRobotNewObject').html('');
    $('#errorPositionApproachNewObject').html("");
    let username = $this;
    let robot = $('#SelectRobotNewObject').val();
    if (robot == null) {
        $('#errorSelectRobotNewObject').html('<i class="fas fa-times-circle"></i> No robot selected');
        $('#errorPositionApproachNewObject').css("color", "red");
        $('#errorPositionApproachNewObject').html("<i class=\"fas fa-times-circle\"></i> No robot selected");
        $('#takePositionObjectButton').attr("disabled", false);
        return
    }
    $('#errorPositionApproachNewObject').css("color", "black");
    $('#errorPositionApproachNewObject').html("  <i class=\"fa-2x fas fa-cog fa-spin\"></i>");
    let userPk;
    $.ajax({
        type: "POST",
        url: '/getUserIdFromUsername/',
        dataType: 'json',
        async: false,
        data:
            {
                username: username,
                robotname: robot,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },

        success: function (result) {
            $.each(result, function (index, element) {
                userPk = element.pk;
            });

        },
        error: function (result) {
            alert('ERROR: getUserIdFromUsername');
            alert(JSON.stringify(result));
        }
    });

    $.ajax({
        type: 'POST',
        url: '/takePositionObject/',
        data: {
            user: userPk,
            robotname: robot,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            if (result === 'ConnectionRefusedError') {
                $('#errorSelectRobotNewObject').html("<i class=\"fas fa-times-circle\"></i> Robot not connected");
                $('#takePositionObjectButton').attr("disabled", false);
                $('#errorPositionApproachNewObject').html("");
                return;
            }
            $('#modalSelectRobotNewObject').attr('heightObject', result);
            $('#errorPositionApproachNewObject').css('color', 'green');
            $('#errorPositionApproachNewObject').html("&ensp;<i class=\'fas fa-check-circle\'></i>&ensp;New position received");
            $('#takePositionObjectButton').attr("disabled", false);
        },

        error: function (result) {
            alert(JSON.stringify(result));
            alert("ERROR: takePositionObject")
        }

    });
}

function openModalNewAction() {
    $('#errorPosition').html("");
    $('#newActionName').val("");
    $('#newActionSelectRobot')
        .find('option')
        .remove()
        .end()
        .append('<option disabled selected value hidden>Select robot ...</option>')
    ;
    let $username = $('#username').html();
    $.ajax({
        type: 'POST',
        url: '/robotOfUser/',
        dataType: 'JSON',
        data: {
            username: $username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            if ($(result).length !== 0) {
                $.each(result, function (index, element) {
                    let robot_name = element.fields.name;
                    let robot_id = element.fields.robot;
                    $("#newActionSelectRobot").append(new Option(robot_name, robot_name));
                })
            } else {
                $('#newActionErrorSelectRobot').html("No robot associated to your account");
                $('#newActionSelectRobot').prop('disabled', true);
                $('#newActionSelectRobot').css('cursor', 'not-allowed');
            }

        },

        error: function (result) {
            alert(JSON.stringify(result));
            alert("ERROR: robotOfUser")
        }
    });

    $('#modalNewAction').modal('show');
}

function saveAction($this) {
    let positions = new Array($('.action_list_point').find("li").length);

    $(".point_item").each(function (index) {
        positions[index] = ($(this).attr('point_position'));
    });
    let username = $this;
    let noError = true;
    let robot = $('#newActionSelectRobot').val();
    let name = $('#newActionName').val();
    let shared = "False";
    if ($('#checkboxSharedNewAction').is(':checked')) {
        shared = "True";
    }
    alert(positions);
    if (positions === undefined || positions === '') {
        noError = false;
        $('#errorPosition').html('&ensp;<i class="fas fa-times-circle"></i>&ensp;Position not saved');
    }
    $('#newActionErrorSelectRobot').html("");
    if (robot == null) {
        $('#newActionErrorSelectRobot').html("<i class=\"fas fa-times-circle\" style='color: red'></i> No robot selected");
        noError = false;
    }
    $('#newActionErrorName').html("");
    if (name === '') {
        $('#newActionErrorName').html("<i class=\"fas fa-times-circle\" style='color: red'></i> No name selected");
        noError = false;
    } else {
        $.ajax({
            type: 'POST',
            url: '/actionExist/',
            dataType: 'JSON',
            async: false,
            data: {
                shared: shared,
                username: username,
                action: name,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },

            success: function (result) {
                if (result.nameExist == true) {
                    $('#newActionErrorName').html("Action name already exist");
                    noError = false;
                }
            },

            error: function (result) {
                alert(JSON.stringify(result));
                alert("ERROR: actionExist")
            }
        });
    }
    if (noError === true) {
        $.ajax({
            type: 'POST',
            url: '/createAction/',
            data: {
                shared: shared,
                username: username,
                action: name,
                positions: positions.toString(),
                robot: robot,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },

            success: function (result) {
                $('#modalNewAction').modal('hide');
                $('#modalNewActionConfirm').modal('show');
            },

            error: function (result) {
                alert(JSON.stringify(result));
                alert("ERROR: createAction")
            }
        });
    }
}