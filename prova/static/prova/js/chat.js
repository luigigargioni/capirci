avatarMe = "../../static/prova/images/User_chat.png";
avatarYou = "../../static/prova/images/Robot_chat.png";
let audio = false;
let recording = false;
let speechRecognizer;
let interval;
let end = '0';
let card = '';
let question = 0;
const QUESTION_CONDITION = "How many times do I have to perform this task?";
const QUESTION_END_PROGRAM = "Is there an event for which I have to end the execution?";
const MSG_NOT_UNDERSTAND = "Sorry, I did not understand what you said. ";
const QUESTION_GRAPHIC = 'Do you want to see the program in graphical form?';
const OPEN_GRAPHIC = "Wait please. I'm opening the program...";
const NOT_OPEN_GRAPHIC = "Okay. You can open it later in the task list.";
const NOT_OPEN_GRAPHIC_2 = "Thank you for collaborating. Bye.";
const QUESTION_ACTION = "Is there a processing to do on each object?";
const INIT_DIALOGUE = "Hello! Tell me what to do";
let current_sentence = '';
let librariesNotFoundChat = [];
let redirect;

let current_task_name = $('#taskName').text();

function say(m) {
    if (!audio) {
        return;
    }
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[4];
    msg.voiceURI = "native";
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 0.8;
    msg.text = m;
    msg.lang = 'en-US';
    speechSynthesis.speak(msg);
}

function changeAudio() {
    audio = !audio;
    if (audio === false) {
        $('#audio_icon').html('volume_off');
    }
    if (audio === true) {
        $('#audio_icon').html('volume_up');
    }

}

$(document).ready(function () {
    if (window.location.pathname.substr(0, 6) === '/chat/') {
        insertChat('you', INIT_DIALOGUE);
        say(INIT_DIALOGUE);
    }
    let type_msg = $(".type_msg");
    type_msg.on("input", function () {
        $("#send_btn").removeClass("d-none");
        $('#mic_btn').addClass('d-none');
    });

    type_msg.keyup(function () {
        if (!this.value) {
            $('#send_btn').addClass('d-none');
            $("#mic_btn").removeClass("d-none");
        }
    });

});


/**formato delle ore che serve nella chat, l'ora compare al di sotto dei messaggi*/
function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
}


/**inserisce il fumetto verde o quello azzurro in base a chi digita il messaggio*/
function insertChat(who, text) {

    let control = "";
    let date = formatAMPM(new Date());


    let stringa_me = '<div class="d-flex justify-content-end mb-4"> <div class="msg_cotainer_send">' +
        '<div class="current"> ' + text + '</div>' +
        '<span class="msg_time_send">' + date + '</span></div> <div class="img_cont_msg">' +
        '<img alt="avatarMe" src="' + avatarMe + '" class="rounded-circle user_img_msg"></div></div>';

    let stringa_you = '<div class="d-flex justify-content-start mb-4"> <div class="img_cont_msg">' +
        '<img alt="avatarYou" src="' + avatarYou + '" class="rounded-circle user_img_msg"></div><div class="msg_cotainer">' + text +
        '<span class="msg_time">' + date + '</span></div></div>';


    if (who === "me") {
        control = stringa_me;
        $('.current').removeClass('current');
    } else {
        control = stringa_you;
    }

    let card_dialog = $("#card_dialog");
    card_dialog.append(control).scrollTop(card_dialog.prop('scrollHeight'));
}


/**Tutto il dialogo è gestito qui, quando clicco sul bottone di invio viene preso l'input corrente e
 * inviato al back-end con ajax*/
$('#send_btn').click(function (e) {
    let input_text = $('#input_text');
    current_sentence = input_text.val();
    insertChat("me", current_sentence);
    input_text.val('');
    if (end === '0' && question === 0) {
        parse_ajax(e);
    }
    if (question === 1 && end === '1') {
        parse_ajax_times(e);
    }
    if (question === 2 && end === '2') {
        parse_ajax_action(e);
    }
    if (question === 3 && end === '3') {
        parse_ajax_end_prog(e);
    }
    if (question === 4 && end === '4') {
        parse_ajax_assert(e);
    }
});

/**Tutto il dialogo è gestito qui, quando clicco sul invio sulla tastiera viene preso l'input corrente e
 * inviato al back-end con ajax*/
$(".type_msg").on("keydown", function (e) {
    if (e.which === 13) {
        current_sentence = $(this).val();
        insertChat("me", current_sentence);
        $(this).val('');

        if (end === '0' && question === 0) {
            parse_ajax(e);
        }
        if (question === 1 && end === '1') {
            parse_ajax_times(e);
        }
        if (question === 2 && end === '2') {
            parse_ajax_action(e);
        }
        if (question === 3 && end === '3') {
            parse_ajax_end_prog(e);
        }
        if (question === 4 && end === '4') {
            parse_ajax_assert(e);
        }
    }
});

/**Parsing del primo input, il pick and place*/
function parse_ajax(e) {
    let text_to_parse = current_sentence;
    let username = $('#username').html();
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/ajaxCallParser/',
        data: {
            text: text_to_parse,
            username: username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            let json = JSON.parse(result);
            let response = json['response'];
            end = json['end'];
            card = json['card'];

            setTimeout(function () {
                insertChat('you', response);
                say(response);
            }, 2000);


            if (end === '1' && question === 0) //il pick place è definito
            {
                if ((card.toString() === 'while') || !isNaN(card)) {
                    question = 2;
                    end = '2';
                    setTimeout(function () {
                        insertChat("you", QUESTION_ACTION);
                        say(QUESTION_ACTION);
                    }, 3500);
                } else {
                    end = '1';
                    question = 1;
                    setTimeout(function () {
                        insertChat("you", QUESTION_CONDITION);
                        say(QUESTION_CONDITION);
                    }, 3500);
                }
            }
        },
        error: function () {
            alert("error");
        }
    });
}

/**Parsing numero di volte che deve essere eseguito il compito*/
function parse_ajax_times(e) {
    let text_to_parse = current_sentence;
    let task_name = $('#username').html() + "_" + current_task_name;
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/ajaxCallParserTimes/',
        data: {
            text: text_to_parse,
            program_name: task_name,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            let json = JSON.parse(result);
            let response = json['response'];
            end = json['end'];
            if (response.localeCompare('ok') === 0 && end === "2") {
                question = 2;
                setTimeout(function () {
                    insertChat("you", QUESTION_ACTION);
                    say(QUESTION_ACTION);
                }, 2000);
            } else {
                end = '1';
                question = 1;
                insertChat("you", MSG_NOT_UNDERSTAND);
                say(MSG_NOT_UNDERSTAND);
                setTimeout(function () {
                    insertChat("you", QUESTION_CONDITION);
                    say(QUESTION_CONDITION);
                }, 2000);
            }
        },
        error: function () {
            alert("error")
        }
    });

}


/**Parsing lavorazione*/
function parse_ajax_action(e) {
    let task_name = $('#username').html() + "_" + current_task_name;
    let text_to_parse = current_sentence;
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/ajaxCallParserAction/',
        data: {
            text: text_to_parse,
            program_name: task_name,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            let json = JSON.parse(result);
            let response = json['response'];
            end = json['end'];
            if (response.localeCompare('ok') === 0 && end === "3") {
                question = 3;
                setTimeout(function () {
                    insertChat("you", QUESTION_END_PROGRAM);
                    say(QUESTION_END_PROGRAM);
                }, 2000);
            }
            if (response.localeCompare('no') === 0 && end === "3") {
                question = 3;

                setTimeout(function () {
                    insertChat("you", QUESTION_END_PROGRAM);
                    say(QUESTION_END_PROGRAM);
                }, 2000);
            }
            if (response.localeCompare('ko') === 0 && end === "3") {

                insertChat("you", MSG_NOT_UNDERSTAND);
                say(MSG_NOT_UNDERSTAND);
                setTimeout(function () {
                    insertChat("you", QUESTION_ACTION);
                    say(QUESTION_ACTION);
                }, 2000);
                question = 2;
                end = '2';
            }

        },
        error: function () {
            alert("error")
        }
    });

}

/**Parsing evento per terminare l'esecuzione*/
function parse_ajax_end_prog(e) {
    let task_name = $('#username').html() + "_" + current_task_name;
    let text_to_parse = current_sentence;
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/ajaxCallParserEnd/',
        data: {
            text: text_to_parse,
            program_name: task_name,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            let json = JSON.parse(result);
            let response = json['response'];
            end = json['end'];
            if (response.localeCompare('ok') === 0 && end === "4") {
                question = 4;
                setTimeout(function () {
                    insertChat("you", QUESTION_GRAPHIC);
                    say(QUESTION_GRAPHIC);
                }, 2000);
            }
            if (response.localeCompare('no') === 0 && end === "4") {
                question = 4;

                setTimeout(function () {
                    insertChat("you", QUESTION_GRAPHIC);
                    say(QUESTION_GRAPHIC);
                }, 2000);
            }
            if (response.localeCompare('ko') === 0 && end === "4") {

                insertChat("you", MSG_NOT_UNDERSTAND);
                say(MSG_NOT_UNDERSTAND);
                setTimeout(function () {
                    insertChat("you", QUESTION_END_PROGRAM);
                    say(QUESTION_END_PROGRAM);
                }, 2000);
                question = 3;
                end = '3';
            }

        },
        error: function () {
            alert("error")
        }
    });

}

/**Parsing: vedere il programma in forma grafica*/
function parse_ajax_assert(e) {
    let text_to_parse = current_sentence;
    let username = $('#username');
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/ajaxCallParserAssert/',
        data: {
            text: text_to_parse,
            program_name: current_task_name,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            let json = JSON.parse(result);
            let response = json['response'];
            end = json['end'];
            if (response.localeCompare('yes') === 0 && end === "5") {
                question = 5;
                insertChat("you", OPEN_GRAPHIC);
                say(OPEN_GRAPHIC);
                let fileName = username.html() + "_" + current_task_name + ".xml";
                $.ajax({
                    type: 'POST',
                    url: '/checkLibrariesXML/',
                    async: false,
                    dataType: 'json',
                    data: {
                        fileName: fileName,
                        username: username.html(),
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    },

                    success: function (result) {
                        if (result.pickExist === true && result.placeExist === true && result.actionExist === true) {
                            setTimeout(function () {
                                window.location.href = 'http://'+document.domain+':8000/task/' + current_task_name;
                            }, 4000);
                        } else {
                            redirect = 'http://'+document.domain+':8000/task/' + current_task_name;
                            if (result.pickExist === false) {
                                librariesNotFoundChat.push("<p id='nameObject'>Object: " + result.pick + '</p><button id="newObjectLibraries" class="btn btn-primary" object="' + result.pick + '" checked="false" onclick="openModalSelectRobotNewObject()">New object</button>');
                            }
                            if (result.placeExist === false) {
                                librariesNotFoundChat.push("<p id='nameLocation'>Location: " + result.place + '</p><button id="newLocationLibraries" class="btn btn-primary" location="' + result.place + '" checked="false" onclick="openModalNewLocation()">New location</button>');
                            }
                            if (result.actionExist === false) {
                                librariesNotFoundChat.push("<p id='nameAction'>Action: " + result.action + '</p><button id="newActionLibraries" class="btn btn-primary" action="' + result.action + '" checked="false" onclick="openModalNewAction()">New action</button>');
                            }

                            let librariesNotFound = $('#librariesNotFound');
                            let modalLibrariesNotFound = $('#modalLibrariesNotFound');
                            for (let i = 0; i < librariesNotFoundChat.length; i++) {
                                librariesNotFound.append(librariesNotFoundChat[i]+"<br><br>");
                            }
                            librariesNotFound.append("Please define the missing elements");

                            modalLibrariesNotFound.modal({
                                backdrop: 'static',
                                keyboard: false
                            });

                            modalLibrariesNotFound.modal('show');
                        }
                    },

                    error: function () {
                        alert("error");
                    }
                });
            }
            if (response.localeCompare('no') === 0 && end === "5") {
                question = 5;
                insertChat("you", NOT_OPEN_GRAPHIC);
                say(NOT_OPEN_GRAPHIC);
                /*setTimeout(function () {
                    insertChat("you", NOT_OPEN_GRAPHIC_2);
                    say(NOT_OPEN_GRAPHIC_2);
                }, 2000);*/

                let fileName = username.html() + "_" + current_task_name + ".xml";
                $.ajax({
                    type: 'POST',
                    url: '/checkLibrariesXML/',
                    async: false,
                    dataType: 'json',
                    data: {
                        fileName: fileName,
                        username: username.html(),
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    },

                    success: function (result) {
                        if (result.pickExist === true && result.placeExist === true) {
                            setTimeout(function () {
                                window.location.href = '/';
                            }, 4000);
                        } else {
                            redirect = '/';
                            if (result.pickExist === false) {
                                librariesNotFoundChat.push("<p id='nameObject'>Object: " + result.pick + '</p><button id="newObjectLibraries" class="btn btn-primary" object="' + result.pick + '" checked="false" onclick="openModalSelectRobotNewObject()">New object</button>');
                            }
                            if (result.placeExist === false) {
                                librariesNotFoundChat.push("<p id='nameLocation'>Location: " + result.place + '</p><button id="newLocationLibraries" class="btn btn-primary" location="' + result.place + '" checked="false" onclick="openModalNewLocation()">New location</button>');
                            }
                            if (result.actionExist === false) {
                                librariesNotFoundChat.push("<p id='nameAction'>Action: " + result.action + '</p><button id="newActionLibraries" class="btn btn-primary" action="' + result.action + '" checked="false" onclick="openModalNewAction()">New action</button>');
                            }

                            let librariesNotFound = $('#librariesNotFound');
                            let modalLibrariesNotFound = $('#modalLibrariesNotFound');
                            for (let i = 0; i < librariesNotFoundChat.length; i++) {
                                librariesNotFound.append("<br><br>" + librariesNotFoundChat[i]);
                            }
                            librariesNotFound.append("<br><br>Please define the missing elements");

                            modalLibrariesNotFound.modal({
                                backdrop: 'static',
                                keyboard: false
                            });

                            modalLibrariesNotFound.modal('show');
                        }
                    },

                    error: function () {
                        alert("error");
                    }
                });
            }
            if (response.localeCompare('ko') === 0 && end === "5") {
                question = 4;
                end = '4';
                insertChat("you", MSG_NOT_UNDERSTAND);
                say(MSG_NOT_UNDERSTAND);
                setTimeout(function () {
                    insertChat("you", QUESTION_GRAPHIC);
                    say(QUESTION_GRAPHIC);
                }, 2000);
            }

        },
        error: function () {
            alert("error")
        }
    });

}

/**Avvia la conversione dell'input da parlato a scritto*/
function startConverting() {
    if (recording) {
        speechRecognizer.stop();
        clearInterval(interval);
        $('#input_text').attr('disabled', false);
        $('#camera_span').attr('disabled', false);
        $('#microphone-icon').css('color', '#2a2e47');
        recording = false;
        insertChat("you", "Recording has been stopped");
        say("Recording has been stopped");
        return;
    }
    recording = true;
    //insertChat("you", "I'm listening...you can talk");
    //say("I'm listening...you can talk");
    $('#input_text').attr('disabled', true);
    $('#camera_span').attr('disabled', true);
    $('#microphone-icon').css('color', 'rgb(0,255,0)');
    interval = window.setInterval(function () {
        if ($('#microphone-icon').css('color') === 'rgb(255, 0, 0)') {
            $('#microphone-icon').css('color', 'rgb(0,255,0)');
        } else {
            $('#microphone-icon').css('color', 'rgb(255,0,0)');
        }
    }, 700);

    if ('webkitSpeechRecognition' in window) {

        speechRecognizer = new webkitSpeechRecognition;

        speechRecognizer.continuous = true;
        speechRecognizer.interimResult = true;
        speechRecognizer.lang = 'en-US';
        speechRecognizer.start();

        let finalTranscripts = '';

        speechRecognizer.onresult = function (event) {

            let interimTranscripts = '';
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript = event.results[i][0].transcript;
                transcript.replace("\n", "<br>");
                speechRecognizer.stop();
                if (event.results[i].isFinal) {
                    finalTranscripts += transcript;
                } else {
                    interimTranscripts += transcript;
                }
            }

            clearInterval(interval);
            $('#input_text').attr('disabled', false);
            $('#camera_span').attr('disabled', false);
            $('#microphone-icon').css('color', '#2a2e47');
            recording = false;
            insertChat("me", transcript);
            current_sentence = transcript;
            $('#input_text').val('');


            if (end === '0' && question === 0) {
                parse_ajax(event);
            }
            if (question === 1 && end === '1') {
                parse_ajax_times(event);
            }
            if (question === 2 && end === '2') {
                parse_ajax_action(event);
            }
            if (question === 3 && end === '3') {
                parse_ajax_end_prog(event);
            }
            if (question === 4 && end === '4') {
                parse_ajax_assert(event);
            }
        };

        speechRecognizer.onerror = function (event) {
            clearInterval(interval);
            $('#input_text').attr('disabled', false);
            $('#camera_span').attr('disabled', false);
            $('#microphone-icon').css('color', '#2a2e47');
            recording = false;
            insertChat("you", "Sorry, I don't understand what you said.");
            say("Sorry, I don't understand what you said.");
        };
    } else {
        clearInterval(interval);
        $('#input_text').attr('disabled', false);
        $('#camera_span').attr('disabled', false);
        $('#microphone-icon').css('color', '#2a2e47');
        recording = false;
        insertChat("you", "Sorry, your browser is not supported.");
        say("Sorry, your browser is not supported.");
    }

}

function openModalSelectRobotNewObject() {
    $('#SelectRobotObjectName').val($('#newObjectLibraries').attr('object'));
    $('#SelectRobotObjectName').prop('disabled', true);
    $('#errorSelectRobotNewObject').html("");
    $('#errorSelectRobotObjectName').html("");
    $('#errorSelectRobotObjectKeywords').html("");
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
                    var robot_name = element.fields.name;
                    var robot_id = element.fields.robot;
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

function openModalNewLocation() {
    let location_name = $('#newLocationLibraries').attr('location');
    $('#newLocationName').val(location_name);
    $('#newLocationName').prop('disabled', true);
    $('#errorPosition').html("");
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
                    var robot_name = element.fields.name;
                    var robot_id = element.fields.robot;
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
            if (result.keywordExist == true) {
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
    if (position == undefined) {
        noError = false;
        $('#errorPosition').css("color", "red");
        $('#errorPosition').html('&ensp;<i class="fas fa-times-circle"></i>&ensp;Position not saved');
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

        success: function () {
            $('#newObjectImg').css('opacity', '1');
            $('#newObjectImg').attr("src", "../../static/prova/images/objects/" + username + "_" + object + "_contour.png?" + Date.now());
            $('#spinnerNewObject').html("");
        },

        error: function (result) {
            alert('ERROR: takeShot');
            alert(JSON.stringify(result));
        }
    });
}

function openModalNewAction() {
    let action_name = $('#newActionLibraries').attr('action');
    $('#newActionName').val(action_name);
    $('#newActionName').prop('disabled', true);
    $('#errorPosition').html("");
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
                    var robot_name = element.fields.name;
                    var robot_id = element.fields.robot;
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
                return
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

function takePositionAction($this) {
    $('#btnTakePositionAction').attr("disabled", true);
    $('#newActionErrorSelectRobot').html('');
    $('#errorPosition').html("");
    $('#errorPosition').css("color", "black");
    $('#errorTakePositionModifyAction').css("color", "black");
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
    if (positions == undefined) {
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
