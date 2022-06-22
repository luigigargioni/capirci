let librariesNotFound = [];
let objectToPick;

/** Costruisce il programma grafico dall'XML file */
function from_xml_to_graphic(xml_file) {
    //devo costruire l'html relativo al programma da XML
    let librariesNotFoundDiv = $('#librariesNotFound');
    let modalLibrariesNotFound = $('#modalLibrariesNotFound');
    let $contenitore = $('#droppable');
    $('#task_building_area').addClass('d-none');
    recursiveIteration(xml_file, $contenitore);
    let $figli = $contenitore.children();
    $figli.find('.obj').each(function () {
        $(this).find('.no-drop').droppable('disable');
    });
    $('.progress-div').remove();
    if (librariesNotFound.length !== 0) {
        for (let i = 0; i < librariesNotFound.length; i++) {
            librariesNotFoundDiv.append(librariesNotFound[i] + "<br><br>");
        }
        librariesNotFoundDiv.append("Please define the missing elements.");

        modalLibrariesNotFound.modal({
            backdrop: 'static',
            keyboard: false
        });
        modalLibrariesNotFound.modal('show');
    }
}

let $listContainer = [];

/**Processa il file XML e crea gli elementi grafici in modo ricorsivo*/
function recursiveIteration(object, $contenitore) {
    $listContainer.push($contenitore);
    for (let property in object) {
        if (property === 'repeat') {
            $contenitore = creaCiclo(object[property], $listContainer[$listContainer.length-1]);
        }
        if (property === 'event') {
            $contenitore = creaCicloEvent(object[property], $listContainer[$listContainer.length-1]);
        }
        if (property === 'pick') {
            creaPick(object[property], $listContainer[$listContainer.length-1]);
        }
        if (property === 'action') {
            creaAction(object[property], $listContainer[$listContainer.length-1]);
        }
        if (property === 'place') {
            creaPlace(object[property], $listContainer[$listContainer.length-1]);
        }
        if (object.hasOwnProperty(property)) {
            if (typeof object[property] == "object") {
                recursiveIteration(object[property], $contenitore);
            }
        }
    }
    $listContainer.pop();
}


/**Crea un blocco grafico di tipo event*/
function creaCicloEvent(object, $container) {
    //object.obj = undefined;
    let type = object.type;
    let $stop_when = $('#stop_when').clone();
    applica_proprieta($stop_when);
    $stop_when.removeClass('library');
    $stop_when.addClass('canvas');

    if (type === 'sens') {
        let $sensor = $('#sensor').clone();
        applica_proprieta($sensor);
        $stop_when.find('.drop_event').find('.drop_act').addClass('d-none');
        $stop_when.find('.drop_event').append($sensor);
    }
    if (type === 'obj') {
        let $object_to_find = object.obj;
        let $find = $('#exist').clone();
        applica_proprieta($find);

        let result = cercaOggetto($object_to_find, 'object');
        let trovato = result[0];
        let oggetto_id = result[1];
        if (trovato) {
            let $id = '#' + oggetto_id.trim();
            let $copyObj = $($id).clone();
            if ($copyObj.length === 0) {
                $find.find('.drop_pick_obj').children('p').first().removeClass('d-none');
            } else {
                applica_proprieta($copyObj);
                $find.find('.drop_pick_obj').find('.drop_obj').addClass('d-none');
                $find.find('.drop_pick_obj').append($copyObj);
            }
        } else {
            $find.find('.drop_pick_obj').children('p').first().removeClass('d-none');
            librariesNotFound.push("Event: " + $object_to_find);
        }
        $stop_when.find('.drop_event').children('p').first().addClass('d-none');
        $stop_when.find('.drop_event').append($find);


    }

    $container.append($stop_when);
    $stop_when.find('.drop_act').addClass('d-none');
    $container = $stop_when.find('.drop_motion');
    return $container;
}

/**Crea un blocco di tipo controlli*/
function creaCiclo(object, $container) {
    let times = object.times;
        if (!isNaN(times)) {
            let $for = $('#for').clone();
            applica_proprieta($for);
            $for.removeClass('library');
            $for.addClass('canvas');
            $for.find('#qty_input').attr('value', times);
            $container.append($for);
            $for.find('.drop_act').addClass('d-none');
            $container = $for.find('.drop_motion');

            if ($for.parent().hasClass('drop_motion')) {
                $for.css('width', '100%');
            }
        } else if (times === 'while') {
            let $while = $('#while').clone();
            applica_proprieta($while);
            $container.append($while);
            $while.find('.drop_act').addClass('d-none');
            let $eventFind = $('#exist').clone();
            applica_proprieta($eventFind);
            $while.find('.drop_event').append($eventFind);
            $container = $while.find('.drop_motion');
            if ($while.parent().hasClass('drop_motion')) {
                $while.css('width', '100%');
            }
        } else if (times === 'if_sensor'){
            let $if = $('#if').clone();
            applica_proprieta($if);
            $container.append($if);
            $if.find('.drop_act').addClass('d-none');
            let $eventFind = $('#sensor').clone();
            applica_proprieta($eventFind);
            $if.find('.drop_event').append($eventFind);
            $container = $if.find('.drop_motion');
            if ($if.parent().hasClass('drop_motion')) {
                $if.css('width', '100%');
            }
        }else if (times === 'if_detect'){
            let $if = $('#if').clone();
            applica_proprieta($if);
            $container.append($if);
            $if.find('.drop_act').addClass('d-none');
            let $eventFind = $('#detect').clone();
            applica_proprieta($eventFind);
            $if.find('.drop_event').append($eventFind);
            $container = $if.find('.drop_motion');
            if ($if.parent().hasClass('drop_motion')) {
                $if.css('width', '100%');
            }
        }
        else if (times.substring(0,8) === 'if_exist'){
            let $obj = times.substring(9);
            let $if = $('#if').clone();
            applica_proprieta($if);
            $container.append($if);
            $if.find('.drop_act').addClass('d-none');

            let $eventFind = $('#exist').clone();
            applica_proprieta($eventFind);
            $if.find('.drop_event').append($eventFind);
            $container = $if.find('.drop_motion');
            if ($if.parent().hasClass('drop_motion')) {
                $if.css('width', '100%');
            }
            let $objfind = $('#'+$obj).clone();
            applica_proprieta($objfind);
            $eventFind.find('.drop_pick_obj').append($objfind);
             $eventFind.find('.drop_obj').addClass('d-none');
            $objfind.css('width', '100%');
        }else if (times === 'stop_when_sensor'){
            let $stop_when = $('#stop_when').clone();
            applica_proprieta($stop_when);
            $container.append($stop_when);
            $stop_when.find('.drop_act').addClass('d-none');
            let $eventFind = $('#sensor').clone();
            applica_proprieta($eventFind);
            $stop_when.find('.drop_event').append($eventFind);
            $container = $stop_when.find('.drop_motion');
            if ($stop_when.parent().hasClass('drop_motion')) {
                $stop_when.css('width', '100%');
            }
        }else if (times === 'stop_when_detect'){
            let $stop_when = $('#stop_when').clone();
            applica_proprieta($stop_when);
            $container.append($stop_when);
            $stop_when.find('.drop_act').addClass('d-none');
            let $eventFind = $('#detect').clone();
            applica_proprieta($eventFind);
            $stop_when.find('.drop_event').append($eventFind);
            $container = $stop_when.find('.drop_motion');
            if ($stop_when.parent().hasClass('drop_motion')) {
                $stop_when.css('width', '100%');
            }
        }
        else if (times.substring(0,15) === 'stop_when_exist'){
            let $obj = times.substring(16);
            let $stop_when = $('#stop_when').clone();
            applica_proprieta($stop_when);
            $container.append($stop_when);
            $stop_when.find('.drop_act').addClass('d-none');

            let $eventFind = $('#exist').clone();
            applica_proprieta($eventFind);
            $stop_when.find('.drop_event').append($eventFind);
            $container = $stop_when.find('.drop_motion');
            if ($stop_when.parent().hasClass('drop_motion')) {
                $stop_when.css('width', '100%');
            }
            let $objfind = $('#'+$obj).clone();
            applica_proprieta($objfind);
            $eventFind.find('.drop_pick_obj').append($objfind);
            $eventFind.find('.drop_obj').addClass('d-none');
            $objfind.css('width', '100%');
        }else if (times === 'do_when_sensor'){
            let $do_when = $('#do_when').clone();
            applica_proprieta($do_when);
            $container.append($do_when);
            $do_when.find('.drop_act').addClass('d-none');
            let $eventFind = $('#sensor').clone();
            applica_proprieta($eventFind);
            $do_when.find('.drop_event').append($eventFind);
            $container = $do_when.find('.drop_motion');
            if ($do_when.parent().hasClass('drop_motion')) {
                $do_when.css('width', '100%');
            }
        }else if (times === 'do_when_detect'){
            let $do_when = $('#do_when').clone();
            applica_proprieta($do_when);
            $container.append($do_when);
            $do_when.find('.drop_act').addClass('d-none');
            let $eventFind = $('#detect').clone();
            applica_proprieta($eventFind);
            $do_when.find('.drop_event').append($eventFind);
            $container = $do_when.find('.drop_motion');
            if ($do_when.parent().hasClass('drop_motion')) {
                $do_when.css('width', '100%');
            }
        }
        else if (times.substring(0,13) === 'do_when_exist'){
            let $obj = times.substring(14);
            let $do_when = $('#do_when').clone();
            applica_proprieta($do_when);
            $container.append($do_when);
            $do_when.find('.drop_act').addClass('d-none');

            let $eventFind = $('#exist').clone();
            applica_proprieta($eventFind);
            $do_when.find('.drop_event').append($eventFind);
            $container = $do_when.find('.drop_motion');
            if ($do_when.parent().hasClass('drop_motion')) {
                $do_when.css('width', '100%');
            }
            let $objfind = $('#'+$obj).clone();
            applica_proprieta($objfind);
            //$eventFind.find('.drop_pick_obj').append($objfind);
            $eventFind.find('.drop_obj').addClass('d-none');
            $objfind.css('width', '100%');
        }


    //ritorno il prossimo a cui appendere i contenuti
    return $container;
}

/**Applica le proprietà per rendere gli elementi droppable e draggable*/
function applica_proprieta($d) {
    if (!$d.hasClass('canvas')) {
        if ($d.hasClass('library')) {
            /* add a button so the element can be removed if no longer necessary */
            let $remove_btn = $('<button class="remove-choice" onclick="removeParent(this)"><i class="fas fa-times"></i></button>');
            $d.prepend($remove_btn);
        } else {
            // se non ha la classe library lo rimuovo

        }
        //opzioni di drop, se io metterò qualcosa dentro questo oggetto
        let options = droppable_options;
        let options_Cond = droppable_options;
        let options_Body = droppable_options;

        //prendo le classi di data-accept
        let accepted_elements = $d.attr('data-accept');
        if ($d.attr('data-accept') !== "") {
            if ($d.hasClass('ifCondition')) {

                let $divCond = $d.find('.drop_event');
                let accepted_Cond = $divCond.attr('data-accept');
                let $divBody = $d.find('.drop_motion');
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
        if ($d.hasClass('loc')) {
            $d.css('width', '100%');
        }
        if ($d.hasClass("obj")) {
            let parent_div = $d.parent(); //drop_pick_obj
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
        if ($d.hasClass('act') && $d.parent().hasClass('drop_motion')) {
            $d.css('width', '100%');
        }
        $('.drop_pick_obj > p').css({"padding-left": "0px", "padding-right": "0px"});

        $d.removeClass('library');
        $d.addClass('canvas');
        controllo($d);
    }

}


/**Crea un blocco di tipo pick*/
function creaPick(object, $contenitore) {
    object.adj = undefined;
    let oggetto;
    let $copyObj_find;
    if (object.adj !== undefined) {
        oggetto = object.adj + ' ' + object.obj;
    } else {
        oggetto = object.obj;
    }
    objectToPick = oggetto;
    let $pick = $('#pick').clone();
    applica_proprieta($pick);
    let result = cercaOggetto(oggetto, 'object');
    let cerca = result[0];
    let oggetto_id = result[1];
    if (cerca) {
        let $id = '#' + oggetto_id;
        let $copyObj = $($id).clone();
        $copyObj_find = $($id).clone();
        applica_proprieta($copyObj);
        applica_proprieta($copyObj_find);
        $pick.find('.drop_pick_obj').find('.drop_obj').addClass('d-none');
        $copyObj.find('no-drop').droppable("disable");
        $pick.find('.drop_pick_obj').append($copyObj);
        $pick.find('.no-drop').droppable("disable");
    } else {
        $pick.find('.drop_pick_obj').find('.drop_obj').removeClass('d-none');
        librariesNotFound.push("Pick: " + oggetto)
    }

    $contenitore.append($pick);

    if ($pick.parent().parent().is('#do_when') && cerca) {
        $pick.parent().parent().find('.drop_pick_obj').first().append($copyObj_find);
        $pick.parent().parent().find('.drop_pick_obj').first().find('.drop_obj').addClass('d-none');
    }

    if ($pick.parent().hasClass('drop_motion')) {
        $pick.css('width', '100%');
    }
    return $contenitore;
    // pick non ridefinisce il container
}

/**Crea un blocco di tipo action*/
function creaAction(object, $contenitore) {
    let oggetto = objectToPick;
    let $copyObj_find;
    let $action;
    if ($('#' + object).html() == null) {
        librariesNotFound.push("Action: " + object);
    } else {
        $action = $('#' + object).clone();
        applica_proprieta($action);
        let result = cercaOggetto(oggetto, 'object');
        let cerca = result[0];
        let oggetto_id = result[1];

        if (cerca) {
            let $id = '#' + oggetto_id;
            let $copyObj = $($id).clone();
            $copyObj_find = $($id).clone();
            applica_proprieta($copyObj);
            applica_proprieta($copyObj_find);
            $action.find('.drop_pick_obj').find('.drop_obj').addClass('d-none');
            $copyObj.find('.no-drop').droppable("disable");
            $action.find('.drop_pick_obj').append($copyObj);
            $action.find('.no-drop').droppable("disable");
        } else {
            $action.find('.drop_pick_obj').find('.drop_obj').removeClass('d-none');
        }

        $contenitore.append($action);

        if ($action.parent().hasClass('drop_motion')) {
            $action.css('width', '100%');
        }
    }

    return $contenitore;
}

/**Crea un blocco di tipo place*/
function creaPlace(object, $contenitore) {
    let oggetto;
    if (object.adj !== '') {
        oggetto = object.adj + ' ' + object.obj;
    } else {
        oggetto = object.obj;
    }

    let $place = $('#place').clone();
    applica_proprieta($place);
    let result = cercaOggetto(oggetto, 'location');

    let cerca = result[0];
    let oggetto_id = result[1];

    if (cerca) {
        let $id = '#' + oggetto_id;
        let $copyObj = $($id).clone();
        applica_proprieta($copyObj);
        $place.find('.drop_pick_obj').find('.drop_obj').addClass('d-none');
        $copyObj.find('no-drop').droppable("disable");
        $place.find('.drop_pick_obj').append($copyObj);
        $place.find('.no-drop').droppable("disable");
    } else {
        $place.find('.drop_pick_obj').find('.drop_obj').removeClass('d-none');
        librariesNotFound.push("Place: " + oggetto);
    }

    $contenitore.append($place);
    if ($place.parent().hasClass('drop_motion')) {
        $place.css('width', '100%');
    }
    return $contenitore;
    // pick non ridefinisce il container
}

/**Cerca  un oggetto nella lista di oggetti*/
function cercaOggetto(object_to_find, type) {
    let word = '';
    let trovato = false;
    let $children;
    switch (type) {
        case 'object':
            $children = $('#object_list').find('.obj');
            break;

        case 'location':
            $children = $('#location_list').find('.loc');
            break;

        case 'event':
            $children = $('#event_list').find('.event');
            break;

        case 'action':
            $children = $('#action_list').find('.act');
            break;
    }

    $.each($children, function (i, item) {
        let parola = $(item).attr('id');
        if (parola === "newObject" || parola === "newLocation" || parola === "newAction") {
            return;
        }
        let keywords = $(item).attr('keywords');
        let keys = keywords.split(',');

        $.each(keys, function (j, item_j) {
            if (typeof item_j !== undefined){
                if (item_j.includes(object_to_find) || object_to_find.includes(item_j)) {
                    word = parola;
                    trovato = true;
                }
            }
        });
    });
    return [trovato, word]
}

/**Applica le proprietà per rendere gli elementi draggable e droppable*/
function applicaProprieta($body) {

    let droppable_options_act = {
        accept: '.obj',
        greedy: true,
        hoverClass: "droppable-hover",
        //quando ci mollo dentro un elemento
        drop: function (event, ui) {
            //clono l'elemento
            let $d = $(ui.draggable).clone();
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

                        let $divCond = $d.find('.drop_event');
                        let accepted_Cond = $divCond.attr('data-accept');


                        let $divBody = $d.find('.drop_motion');
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

                if ($d.hasClass('loc')) {
                    $d.css('width', '100%');
                }

                if ($d.hasClass('task')) {
                    let $nameTask = $d.text().trim();
                    addExistingTask($nameTask);
                } else {
                    $(this).append($d);
                    if ($(this).is('#droppable')) {
                        $('#task_building_area').addClass('d-none');
                    }
                }

                //controllo
                if ($d.hasClass("obj")) {
                    let parent_div = $d.parent(); //drop_pick_obj
                    let $figli_obj = parent_div.find('.obj');
                    let message = '';
                    if ($($figli_obj).length > 1) {
                        if ($(parent_div).parent().parent().parent().parent().parent().hasClass('event')) {
                            message = '<div class="alert alert-warning" role="alert">' +
                                'Warning. Robot can find only one object at a time ' +
                                '<a href="#" class="alert-link" onclick="closeWarning(this);">Ok</a>.</div>';
                            $('#droppable').prepend(message);
                            $d.remove();
                        }
                        if ($(parent_div).parent().hasClass('act') && $(parent_div).parent().attr("data-accept") === ".obj") {
                            message = '<div class="alert alert-warning" role="alert">' +
                                'Warning. Robot can handle only one object at a time ' +
                                '<a href="#" class="alert-link" onclick="closeWarning(this);">Ok</a>.</div>';
                            $('#droppable').prepend(message);
                            $d.remove();
                        }
                        if ($(parent_div).parent().hasClass('act') && $(parent_div).parent().attr("data-accept") === ".loc") {
                            message = '<div class="alert alert-warning" role="alert">' +
                                'Warning. Robot can handle only one object at a time ' +
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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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
            let $d = $(ui.draggable).clone();
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

                        let $divCond = $d.find('.drop_event');
                        let accepted_Cond = $divCond.attr('data-accept');


                        let $divBody = $d.find('.drop_motion');
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

                if ($d.hasClass('loc')) {
                    $d.css('width', '100%');
                }

                if ($d.hasClass('task')) {
                    let $nameTask = $d.text().trim();
                    addExistingTask($nameTask);
                } else {
                    $(this).append($d);
                    if ($(this).is('#droppable')) {
                        $('#task_building_area').addClass('d-none');
                    }
                }

                //controllo
                if ($d.hasClass("obj")) {

                    let parent_div = $d.parent(); //drop_pick_obj
                    let $figli_obj = parent_div.find('.obj');
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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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
            let $d = $(ui.draggable).clone();

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

                        let $divCond = $d.find('.drop_event');
                        let accepted_Cond = $divCond.attr('data-accept');


                        let $divBody = $d.find('.drop_motion');
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
                    let parent_div = $d.parent(); //drop_pick_obj
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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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

    $body.find('.repeat').each(function () {
        $(this).find('.drop_motion').droppable(droppable_options_repeat).sortable({});
        $(this).find('.drop_event').droppable(droppable_options_event).sortable({});
    });
    $body.find('.act').each(function () {
        $(this).find('.drop_pick_obj').droppable(droppable_options_act).sortable({});
    });
    $body.find('.event').each(function () {
        $(this).find('.drop_pick_obj').droppable(droppable_options_act).sortable({});
    });
    $body.find('.obj').each(function (i) {

    });


}

function applicaProprieta2($body) {

    let droppable_options_act = {
        accept: '.obj',
        greedy: true,
        hoverClass: "droppable-hover",
        //quando ci mollo dentro un elemento
        drop: function (event, ui) {
            //clono l'elemento
            let $d = $(ui.draggable).clone();
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

                        let $divCond = $d.find('.drop_event');
                        let accepted_Cond = $divCond.attr('data-accept');


                        let $divBody = $d.find('.drop_motion');
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

                if ($d.hasClass('loc')) {
                    $d.css('width', '100%');
                }

                if ($d.hasClass('task')) {
                    let $nameTask = $d.text().trim();
                    addExistingTask($nameTask);
                } else {
                    $(this).append($d);
                    if ($(this).is('#droppable')) {
                        $('#task_building_area').addClass('d-none');
                    }
                }

                //controllo
                if ($d.hasClass("obj")) {

                    let parent_div = $d.parent(); //drop_pick_obj
                    let $figli_obj = parent_div.find('.obj');
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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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
            let $d = $(ui.draggable).clone();
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

                        let $divCond = $d.find('.drop_event');
                        let accepted_Cond = $divCond.attr('data-accept');


                        let $divBody = $d.find('.drop_motion');
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
                    let $nameTask = $d.text().trim();
                    addExistingTask($nameTask);
                } else {
                    $(this).append($d);
                    if ($(this).is('#droppable')) {
                        $('#task_building_area').addClass('d-none');
                    }
                }

                //controllo
                if ($d.hasClass("obj")) {

                    let parent_div = $d.parent(); //drop_pick_obj
                    let $figli_obj = parent_div.find('.obj');
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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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
            let $d = $(ui.draggable).clone();

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

                        let $divCond = $d.find('.drop_event');
                        let accepted_Cond = $divCond.attr('data-accept');

                        let $divBody = $d.find('.drop_motion');
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
                    let parent_div = $d.parent(); //drop_pick_obj
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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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
        $body.find('.drop_motion').droppable(droppable_options_repeat).sortable({});
        $body.find('.drop_event').droppable(droppable_options_event).sortable({});
    }
    if ($body.hasClass('act')) {
        $body.find('.drop_pick_obj').droppable(droppable_options_act).sortable({});
    }
    if ($body.hasClass('event')) {
        $body.find('.drop_pick_obj').droppable(droppable_options_act).sortable({});
    }


}

function recursiveDOM(element) {
    var figli = element.children;
    let temp_array = [];
    let return_array = [];
    for (let i = 0; i < figli.length; i++) {
        if (figli[i].tagName === "DIV") {
            let valid = false;
            if ($(figli[i]).hasClass('act')) {
                if (figli[i].getElementsByClassName("obj")[0] === undefined) {
                    if (figli[i].getElementsByClassName("loc")[0] === undefined) {
                        alert("Object not found");
                    } else {
                        return_array.push(figli[i].getElementsByClassName("loc")[0].id);
                    }
                } else {
                    return_array.push(figli[i].getElementsByClassName("obj")[0].id);
                }
                valid = true;
            }

            if ($(figli[i]).hasClass('repeat')) {
                return_array = recursiveDOM(figli[i].getElementsByClassName("drop_motion")[0]);
                valid = true;
            }

            if (valid) {
                let id = figli[i].id;

                if (figli[i].id === 'for') {
                    id = figli[i].id + "_" + figli[i].getElementsByClassName("form-control form-control-sm small")[0].value;
                }

                if (figli[i].id === 'if' || figli[i].id === 'if-else' || figli[i].id === 'stop_when' || figli[i].id === 'do_when') {
                    let event = figli[i].getElementsByClassName("event")[0].id;
                    if (event === "sensor") {
                        id = figli[i].id + "_" + event;
                    }
                    if (event === "detect") {
                        id = figli[i].id + "_" + event;
                    }
                    if (event === "exist") {
                        let obj = figli[i].getElementsByClassName("event")[0].getElementsByClassName("obj")[0].id;
                        id = figli[i].id + "_" + event + "_" + obj;
                    }
                }


                let elementToAdd = {id: id, children: return_array};
                temp_array.push(elementToAdd);
            }
            return_array = [];

        }
    }
    return temp_array
}

var parser = new DOMParser();
var resultParser = parser.parseFromString("<program></program>", "text/xml");

var lastParentBlockID = -1;
let lastParentBlock;
let fromProgram = false;

function recursiveParser(array) {
    let node, elements;
    lastParentBlockID = lastParentBlockID +1;

    lastParentBlock = resultParser.getElementsByTagName("repeat")
    if (fromProgram === true){
        fromProgram = false;
        lastParentBlockID = 0;
    }

    if (lastParentBlock[0] == undefined) {
        lastParentBlock = resultParser.getElementsByTagName("program");
        lastParentBlockID = 0;
        fromProgram = true;
    }

    let lastParentBlockIdFor = lastParentBlockID;
    let lastParentBlockFor = lastParentBlock;
    for (let i = 0; i < array.length; i++) {
        switch (array[i].id) {
            case "pick":
                node = resultParser.createElement("pick");
                lastParentBlockFor[lastParentBlockIdFor].appendChild(node);
                elements = resultParser.getElementsByTagName("pick");
                elements[elements.length-1].textContent = (array[i].children.toString());
                break;
            case "place":
                node = resultParser.createElement("place");
                lastParentBlockFor[lastParentBlockIdFor].appendChild(node);
                elements = resultParser.getElementsByTagName("place");
                elements[elements.length-1].textContent = (array[i].children.toString());
                break;

            //Nel caso di azioni e loop, visto che non so come si chiamano
            default:
                if (array[i].id.substring(0, 3) === 'for') {
                    node = resultParser.createElement("repeat");
                    lastParentBlockFor[lastParentBlockIdFor].appendChild(node);
                    elements = resultParser.getElementsByTagName("repeat");
                    elements[elements.length - 1].setAttribute("times", array[i].id.substring(4));
                    recursiveParser(array[i].children);

                } else if (array[i].id === 'while') {
                    node = resultParser.createElement("repeat");
                    lastParentBlockFor[lastParentBlockIdFor].appendChild(node);
                    elements = resultParser.getElementsByTagName("repeat");
                    elements[elements.length - 1].setAttribute("times", "while");
                    recursiveParser(array[i].children);

                } else if (array[i].id.substring(0, 2) === 'if' || array[i].id.substring(0, 9) === 'stop_when' || array[i].id.substring(0, 7) === 'do_when') {
                    node = resultParser.createElement("repeat");
                    lastParentBlockFor[lastParentBlockIdFor].appendChild(node);
                    elements = resultParser.getElementsByTagName("repeat");
                    elements[elements.length - 1].setAttribute("times", array[i].id);
                    recursiveParser(array[i].children);
                }
                //Caso di action
                else {
                    node = resultParser.createElement("action");
                    lastParentBlockFor[lastParentBlockIdFor].appendChild(node);
                    elements = resultParser.getElementsByTagName("action");
                    elements[elements.length-1].textContent = (array[i].id);
                }
                break;
        }
    }
    if (lastParentBlockID != 0) {
        lastParentBlockID = lastParentBlockID -1;
    }
}


$('#btn-save').click(function () {
    let root = document.getElementById("droppable");
    let xml_array = new Array();
    xml_array = recursiveDOM(root);
    resultParser = parser.parseFromString("<program></program>", "text/xml");
    recursiveParser(xml_array);


    let current_task_name = $('#taskName').text();
    let username = $('#username').html();
    $.ajax({
        type: 'POST',
        url: '/getHtmlText/',
        data: {
            username: username,
            taskname: current_task_name,
            text: (new XMLSerializer()).serializeToString(resultParser),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function () {
            $('#modalModifyTaskConfirm').modal('show');
        },
        error: function () {
            alert("error");
        }
    });

});

$stringa = "";
JSONstringa = {};

/**Appende il codice della grafica alla project area e riapplica le proprieta' per rendere i blocchi droppable e draggable*/
function from_txt_to_graphic(file) {

    let $body = $('#droppable');
    $('#task_building_area').addClass('d-none');
    $body.append(file);

    $body.find('#task_building_area').remove();

    let droppable_options_act = {
        accept: '.obj',
        greedy: true,
        hoverClass: "droppable-hover",
        //quando ci mollo dentro un elemento
        drop: function (event, ui) {
            //clono l'elemento
            let $d = $(ui.draggable).clone();
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

                        let $divCond = $d.find('.drop_event');
                        let accepted_Cond = $divCond.attr('data-accept');


                        let $divBody = $d.find('.drop_motion');
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
                    let $nameTask = $d.text().trim();
                    addExistingTask($nameTask);
                } else {
                    $(this).append($d);
                    if ($(this).is('#droppable')) {
                        $('#task_building_area').addClass('d-none');
                    }
                }

                //controllo
                if ($d.hasClass("obj")) {

                    let parent_div = $d.parent(); //drop_pick_obj

                    let $figli_obj = parent_div.find('.obj');
                    let message = '';
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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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
            let $d = $(ui.draggable).clone();
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

                        let $divCond = $d.find('.drop_event');
                        let accepted_Cond = $divCond.attr('data-accept');


                        let $divBody = $d.find('.drop_motion');
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

                if ($d.hasClass('loc')) {
                    $d.css('width', '100%');
                }

                if ($d.hasClass('task')) {
                    let $nameTask = $d.text().trim();
                    addExistingTask($nameTask);
                } else {
                    $(this).append($d);
                    if ($(this).is('#droppable')) {
                        $('#task_building_area').addClass('d-none');
                    }
                }

                //controllo
                if ($d.hasClass("obj")) {

                    let parent_div = $d.parent(); //drop_pick_obj

                    let $figli_obj = parent_div.find('.obj');
                    let message = '';
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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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
            let $d = $(ui.draggable).clone();

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

                        let $divCond = $d.find('.drop_event');
                        let accepted_Cond = $divCond.attr('data-accept');


                        let $divBody = $d.find('.drop_motion');
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

                if ($d.hasClass('loc')) {
                    $d.css('width', '100%');
                }
                $(this).append($d);

                if ($d.hasClass("obj")) {
                    let parent_div = $d.parent(); //drop_pick_obj

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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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
                        applicaProprieta2($d);
                        applicaProprieta($d);
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

    $body.find('.repeat').each(function () {
        $(this).find('.drop_motion').droppable(droppable_options_repeat).sortable({});
        $(this).find('.drop_event').droppable(droppable_options_event).sortable({});
    });
    $body.find('.act').each(function () {
        $(this).find('.drop_pick_obj').droppable(droppable_options_act).sortable({});
    });
    $body.find('.event').each(function () {
        $(this).find('.drop_pick_obj').droppable(droppable_options_act).sortable({});

    });

    $('.progress-div').remove();

}