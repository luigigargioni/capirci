let current_task_name = "";
let modality;

function validateInput() {
    let input_program;
    let input_owner;
    let input_description;
    let input_shared;
    let find = false;

    input_program = $('#program_name').val().trim().toLowerCase();
    input_owner = $('#newChatModal').attr("owner").trim();
    input_description = $('#inputDescription').val();
    input_shared = "False";
    if ($('#sharedNewTask').is(':checked')) {
        input_shared = "True";
    }
    current_task_name = $('#program_name').val().trim().toLowerCase();

    $.ajax({
        type: 'POST',
        url: '/checkTaskName/',
        dataType: 'json',
        async: false,
        data: {
            username: input_owner,
            shared: input_shared,
            taskname: input_program,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (result) {
            if (result.nameExist === true) {
                find = true;
            }
        },

        error: function (result) {
            alert("ERROR: checkTaskName");
            alert(JSON.stringify(result))
        }
    });

    if (input_program === '') {
        $('#invalid-feedback-name').text('Please choose a task name.');
        event.preventDefault();
        $('#program_name').addClass('is-invalid');
        $('#program_name').removeClass('is-valid');

    }
    if (find === true) {
        $('#invalid-feedback-name').text('This name is already used. Please choose another name.');
        event.preventDefault();
        $('#program_name').addClass('is-invalid');
        $('#program_name').removeClass('is-valid');

    }
    if (find === false && input_program !== '') {
        event.preventDefault();
        $('#program_name').addClass('is-valid');
        $('#program_name').removeClass('is-invalid');

    }

    /*
    if (input_description === '') {
        event.preventDefault();
        $('#inputDescription').addClass('is-invalid');
        $('#inputDescription').removeClass('is-valid');
    }
    */

    if (input_description !== '' || input_description === '') {
        event.preventDefault();
        $('#inputDescription').addClass('is-valid');
        $('#inputDescription').removeClass('is-invalid');

    }

    if (find == false && $('#inputDescription').hasClass('is-valid') && $('#program_name').hasClass('is-valid')) {
        event.preventDefault();
        $('#newChatModal').hide();
        openNewChat(input_program, input_owner, input_description, input_shared);
    }
}


function objectDetails($imgs, username) {
    $('#SelectRobotEditObject')
        .find('option')
        .remove()
        .end()
        .append('<option disabled selected value hidden>Select robot ...</option>')
    ;
    $.ajax({
        type: 'POST',
        url: '/robotOfUser/',
        dataType: 'JSON',
        data: {
            username: username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            if ($(result).length !== 0) {
                $.each(result, function (index, element) {
                    var robot_name = element.fields.name;
                    var robot_id = element.fields.robot;
                    $("#SelectRobotEditObject").append(new Option(robot_name, robot_name));
                })
            } else {
                $('#errorSelectRobotEditObject').html("<i class=\"fas fa-times-circle\" style='color: red'></i>  associated to your account");
            }
        },

        error: function (result) {
            alert(JSON.stringify(result));
            alert("ERROR: robotOfUser")
        }
    });

    var expandImg = $('#expandedImg');
    let shared = $($imgs).attr('shared');
    let keywords = $($imgs).attr('keywords');
    let force = $($imgs).attr('force');
    let owner = $($imgs).attr('owner');
    let height = $($imgs).attr('heightObject');
    if (username !== owner) {
        $('#saveChangesObject').prop('disabled', true);
        $('#deleteObject').prop('disabled', true);
        $('#saveChangesObject').css('cursor', 'not-allowed');
        $('#deleteObject').css('cursor', 'not-allowed');
        $('#inputSharedObjectDetail').prop('disabled', true);
        $('#takePositionModifyObject').prop('disabled', true);
        $('#modifyObjectForceRange').prop('disabled', true);
        $('#inputSharedObjectDetail').css('cursor', 'not-allowed');
        $('#modifyObjectForceRange').css('cursor', 'not-allowed');
        $('#SelectRobotEditObject').prop("disabled",true);
        $('#modalTitle').html("Object details: " + $($imgs).attr('alt') + " <font color=\"red\">(not owned by you)</font>");
    } else {
        $('#saveChangesObject').prop('disabled', false);
        $('#deleteObject').attr('disabled', false);
        $('#saveChangesObject').css('cursor', 'default');
        $('#deleteObject').css('cursor', 'default');
        $('#inputSharedObjectDetail').prop('disabled', false);
        $('#takePositionModifyObject').prop('disabled', false);
        $('#modifyObjectForceRange').prop('disabled', false);
        $('#description').prop('disabled', false);
        $('#inputSharedObjectDetail').css('cursor', 'default');
        $('#modifyObjectForceRange').css('cursor', 'default');
        $('#SelectRobotEditObject').prop("disabled",false);
        $('#modalTitle').text("Object details: " + $($imgs).attr('alt'));
    }

    $('#modifyObjectForceRange').val(force);
    expandImg.attr('src', $($imgs).attr('src'));

    $('.tags-input-edit').html("");
    splitKeywords = keywords.split(',');
    keywordsDetailObject(splitKeywords);
    $('#inputKeywordsObjectDetails').val(keywords);

    if (shared === 'true') {
        $('#inputSharedObjectDetail').prop('checked', true);
    } else {
        $('#inputSharedObjectDetail').prop('checked', false);
    }
    $('#eliminaObject').text($($imgs).attr('alt'));
    $('#deleteObject').attr('object_name', $($imgs).attr('alt'));
    $('#modalObjectDetails').attr('heightObject', height);
    $('#modal_image').show();
    $("#modal_image").appendTo("body");
}

function openNav() {
    if ($('#mySidenav').hasClass('open')) {
        closeNav();
    } else {
        $('#mySidenav').css('width', '250px');
        $('#mySidenav').addClass('open');
    }
}

function closeNav() {
    $('#mySidenav').css('width', '0px');
    $('#mySidenav').removeClass('open');
}

function showTasks($this) {
    $('#subTitle').text('Tasks');
    $('#row_cards').addClass('d-none');
    $('#row_objects').addClass('d-none');
    $('#row_locations').addClass('d-none');
    $('#row_robot_management').addClass('d-none');
    $('#row_user_management').addClass('d-none');
    $('#row_my_robot_management').addClass('d-none');
    $('#row_programming_cards').addClass('d-none');
    $('#row_actions').addClass('d-none');
    $('#row_tasks').removeClass('d-none');
    $('.sidenav a').removeClass('link-clicked');
    $($this).addClass('link-clicked');
    $('.task_list_query').html("");
    getTaskList($('#username').html());
}

function showActions($this) {
    $('#subTitle').text('Actions');
    $('#row_cards').addClass('d-none');
    $('#row_objects').addClass('d-none');
    $('#row_locations').addClass('d-none');
    $('#row_robot_management').addClass('d-none');
    $('#row_user_management').addClass('d-none');
    $('#row_my_robot_management').addClass('d-none');
    $('#row_programming_cards').addClass('d-none');
    $('#row_tasks').addClass('d-none');
    $('#row_actions').removeClass('d-none');
    $('.sidenav a').removeClass('link-clicked');
    $($this).addClass('link-clicked');
    $('.action_list_query').html("");
    getActionList($('#username').html());
}

function showLocations($this) {
    $('#subTitle').text('Locations');
    $('#row_cards').addClass('d-none');
    $('#row_objects').addClass('d-none');
    $('#row_robot_management').addClass('d-none');
    $('#row_user_management').addClass('d-none');
    $('#row_my_robot_management').addClass('d-none');
    $('#row_programming_cards').addClass('d-none');
    $('#row_tasks').addClass('d-none');
    $('#row_actions').addClass('d-none');
    $('#row_locations').removeClass('d-none');
    $('.sidenav a').removeClass('link-clicked');
    $($this).addClass('link-clicked');
    $('.location_list_query').html("");
    getLocationList($('#username').html());
}

function showFeature($this) {
    $('#row_tasks').addClass('d-none');
    $('#row_objects').addClass('d-none');
    $('#row_locations').addClass('d-none');
    $('#row_user_management').addClass('d-none');
    $('#row_robot_management').addClass('d-none');
    $('#row_programming_cards').addClass('d-none');
    $('#row_actions').addClass('d-none');
    $('#row_my_robot_management').addClass('d-none');
    $('#row_cards').removeClass('d-none');
    $('.sidenav a').removeClass('link-clicked');
    $($this).addClass('link-clicked');
    $('#subTitle').text('Main features')
}

function showUser($this) {
    $('#subTitle').text('User management');
    $('#row_cards').addClass('d-none');
    $('#row_objects').addClass('d-none');
    $('#row_tasks').addClass('d-none');
    $('#row_locations').addClass('d-none');
    $('#row_actions').addClass('d-none');
    $('#row_my_robot_management').addClass('d-none');
    $('#row_programming_cards').addClass('d-none');
    $('#row_robot_management').addClass('d-none');
    $('#row_user_management').removeClass('d-none');
    $('.sidenav a').removeClass('link-clicked');
    $($this).addClass('link-clicked');
    $('.user_list_query').html("");
    getUserList();
}

function showRobot($this) {
    $('#subTitle').text('Robot management');
    $('#row_cards').addClass('d-none');
    $('#row_objects').addClass('d-none');
    $('#row_tasks').addClass('d-none');
    $('#row_locations').addClass('d-none');
    $('#row_actions').addClass('d-none');
    $('#row_my_robot_management').addClass('d-none');
    $('#row_user_management').addClass('d-none');
    $('#row_programming_cards').addClass('d-none');
    $('#row_robot_management').removeClass('d-none');
    $('.sidenav a').removeClass('link-clicked');
    $($this).addClass('link-clicked');
    $('.robot_list_query').html("");
    getRobotList();
}

function showMyRobot($this) {
    $('#subTitle').text('My robot management');
    $('#row_cards').addClass('d-none');
    $('#row_objects').addClass('d-none');
    $('#row_tasks').addClass('d-none');
    $('#row_locations').addClass('d-none');
    $('#row_actions').addClass('d-none');
    $('#row_user_management').addClass('d-none');
    $('#row_programming_cards').addClass('d-none');
    $('#row_robot_management').addClass('d-none');
    $('#row_my_robot_management').removeClass('d-none');
    $('.sidenav a').removeClass('link-clicked');
    $($this).addClass('link-clicked');
    $('.robot_list_query').html("");
    getMyRobotList($('#myrobot_menu').attr('username'));
}

function showObjects($this) {
    let username = $('#objects_menu').attr('username');
    $('#subTitle').text('Objects');
    $('#row_cards').addClass('d-none');
    $('#row_tasks').addClass('d-none');
    $('#row_actions').addClass('d-none');
    $('#row_locations').addClass('d-none');
    $('#row_robot_management').addClass('d-none');
    $('#row_user_management').addClass('d-none');
    $('#row_my_robot_management').addClass('d-none');
    $('#row_programming_cards').addClass('d-none');
    $('#row_objects').removeClass('d-none');
    $('.sidenav a').removeClass('link-clicked');
    $($this).addClass('link-clicked');
    $('.object_list_query').html("");
    getObjectsList(username);
}

$(document).ready(function () {
    $('#card1').click(function () {
        modality = 0;
        openModalTitleChat();
    });
    $('#card2').click(function () {
        modality = 1;
        openModalTitleChat();
    });

});


function openDetailTask() {
    let $task_name = $('#modalModifyTask').attr('taskname');
    window.location.href = 'task/' + $task_name;

}

function deleteTask() {
    let $task_name = $('#modalDeleteTask').attr('taskname');
    let $username = $('#username').html();
    $.ajax({
        type: 'POST',
        url: '/deleteTask/',
        data: {
            username: $username,
            name: $task_name,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (result) {
            $('#modalDeleteTaskConfirm').modal('show');
        },
        error: function () {
            alert("error");
        }
    });
}

function deleteLocation() {
    let $location_name = $('#modalDeleteLocation').attr('locationname');
    let $username = $('#username').html();
    $.ajax({
        type: 'POST',
        url: '/deleteLocation/',
        data: {
            username: $username,
            name: $location_name,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (result) {
            $('#modalDeleteLocationConfirm').modal('show');
        },
        error: function () {
            alert("error");
        }
    });
}

function deleteAction() {
    let $action_name = $('#modalDeleteAction').attr('actionname');
    let $username = $('#username').html();
    $.ajax({
        type: 'POST',
        url: '/deleteAction/',
        data: {
            username: $username,
            name: $action_name,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (result) {
            $('#modalDeleteActionConfirm').modal('show');
        },
        error: function () {
            alert("error");
        }
    });
}

function deleteObject() {
    let $object_name = $('#deleteConfirm').attr('objectname');
    let $username = $('#deleteConfirm').attr('username');
    $.ajax({
        type: 'POST',
        url: '/deleteObject/',
        data: {
            name: $object_name,
            username: $username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            getObjectsList($username);
        },
        error: function (result) {
            alert("ERROR: deleteObject");
            alert(JSON.stringify(result));
        }
    });
}

function deleteUser() {
    let $username = $('#modalDeleteUser').attr('username');
    $.ajax({
        type: 'POST',
        url: '/deleteUser/',
        data: {
            username: $username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function () {
            getUserList();
        },
        error: function () {
            alert("error: deleteUser");
        }
    });
}

function deleteRobot() {
    let $robotname = $('#modalDeleteRobot').attr('robotname');
    $.ajax({
        type: 'POST',
        url: '/deleteRobot/',
        data: {
            robotname: $robotname,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function () {
            getRobotList();
        },
        error: function () {
            alert("error: deleteRobot");
        }
    });
}

function deleteMyRobot(username) {
    let $robotname = $('#modalDeleteMyRobot').attr('robotname');
    $.ajax({
        type: 'POST',
        url: '/deleteMyRobot/',
        data: {
            robotname: $robotname,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function () {
            getMyRobotList(username);
        },
        error: function (result) {
            alert("error: deleteMyRobot");
        }
    });
}

function formatITA(date) {
    var year = date.substr(0, 4);
    var month = date.substr(5, 2);
    var day = date.substr(8, 2);
    var hour = date.substr(11, 2);
    var minute = date.substr(14, 2);
    var second = date.substr(17, 2);
    var strTime = hour + ':' + minute + ':' + second + " " + day + "-" + month + "-" + year;
    return strTime;
}

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
            $('.task_list_query').html('');
            var dest = $('.task_list_query');
            if ($(result).length !== 0) {

                $.each(result, function (index, element) {
                    var task_name = element.fields.name;
                    var task_date = formatITA(element.fields.last_modified);
                    var task_desc = element.fields.description;
                    var task_id = element.pk;
                    var task_shared = element.fields.shared;
                    var task_owner = element.fields.owner;

                    dest.append('<li class="task_item row" id="append_btn_' + task_id + '"></li>');
                    var content = '<span class="task_item_name column" style="width: 25%">' + task_name + '</span> ' +
                        '<span class="info task_item_desc column" style="width: 25%">' + task_desc + '</span>' +
                        '<span class="info task_item_date column" style="width: 25%">' + task_date + '</span>';

                    var toggle = '<div class="dropdown column" style="width: 25%; text-align: center;">' +
                        '<button class="btn dropdown-toggle button_white caret-off" ' +
                        'type="button" id="dropdownMenuButtonTask" data-toggle="dropdown" aria-haspopup="true" ' +
                        'aria-expanded="false"><i class="fas fa-edit"></i></button>' +
                        '<div class="dropdown-menu" aria-labelledby="dropdownMenuButtonTask">' +
                        '<a class="dropdown-item" href="#" onclick="openModalModifyTask(this);" shared="' + task_shared + '" taskname="' + task_name + '" owner="' + task_owner + '">Edit task</a>' +
                        '<a class="dropdown-item" href="#" onclick="openModalDeleteTask(this)" taskname="' + task_name + '" data-toggle="modal" data-target="#modalDeleteTask">Delete task</a></div>' +
                        '&ensp;&ensp;&ensp;&ensp;&ensp;<button href="#" onclick="openModalRunTask(this)" class="btn button_white caret-off" type="button" id="dropdownRunButtonTask" data-toggle="modal" data-target="#modalRunTask" taskname="' + task_name + '"><i class="fas fa-play-circle"></i></button>' + '</div>';

                    if (task_owner !== username) {
                        toggle = '<div class="dropdown column" style="width: 25%; text-align: center;"><button class="btn button_white caret-off" type="button" style="cursor: not-allowed"><i class="fas fa-globe-americas"></i></button>&ensp;&ensp;&ensp;&ensp;&ensp;<button href="#" onclick="openModalRunTask(this)" class="btn button_white caret-off" type="button" id="dropdownRunButtonTask" data-toggle="modal" data-target="#modalRunTask" taskname="' + task_name + '"><i class="fas fa-play-circle"></i></button></div>';
                    }
                    $('#append_btn_' + task_id).append(toggle);
                    $('#append_btn_' + task_id).append(content);

                });
                $(".task_list_query li").hover(function () {
                    //$(this).find('#dropdownMenuButtonTask').css('background-color', '#007bff');
                    $(this).css('background-color', '#007bff');
                    $(this).css('color', 'white');
                    //$(this).find('#dropdownMenuButtonTask').css('color', 'white');

                });
                $(".task_list_query li").mouseleave(function () {
                    //$(this).find('#dropdownMenuButtonTask').css('background-color', 'white');
                    $(this).css('background-color', 'white');
                    $(this).css('color', 'black');
                    //$(this).find('#dropdownMenuButtonTask').css('color', 'black');

                });
            } else {
                dest.append('<p style="text-align: center"><b><i>No tasks available</i></b></p>');
            }


        },
        error: function () {
            alert("error");
        }
    });
}

function getUserList() {
    $.ajax({
        type: 'POST',
        url: '/getUserList/',
        dataType: 'json',
        data: {
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            $('.user_list_query').html('');
            let dest = $('.user_list_query');
            if ($(result).length !== 0) {
                $.each(result, function (index, element) {
                    var user_name = element.fields.username;
                    var user_role = element.fields.groups[0];
                    var user_id = element.pk;
                    if (user_role !== 1 && user_role !== 2) {
                        return;
                    }
                    switch (user_role) {
                        case 1:
                            user_role = "Operator";
                            break;
                        case 2:
                            user_role = "Manager";
                            break;
                        default:
                            user_role = "Undefined";
                            break;
                    }

                    dest.append('<li class="user_item row" id="append_btn_' + user_id + '"></li>');
                    var content = '<span class="user_item_name column" style="width: 25%">' + user_name + '</span> ' +
                        '<span class="info user_item_role column" style="width: 25%">' + user_role + '</span>';

                    var toggle = '<div class="dropdown column" style="width: 25%; text-align: center;">' +
                        '<button class="btn dropdown-toggle button_white caret-off" ' +
                        'type="button" id="dropdownMenuButtonUser" data-toggle="dropdown" aria-haspopup="true" ' +
                        'aria-expanded="false"><i class="fas fa-edit"></i></button>' +
                        '<div class="dropdown-menu" aria-labelledby="dropdownMenuButtonUser">' +
                        '<a class="dropdown-item" href="#" onclick="openModalEditUser(this);" username="' + user_name + '" data-toggle="modal" data-target="#modalEditUser">Edit user</a>' +
                        '<a class="dropdown-item" href="#" onclick="openModalDeleteUser(this)" username="' + user_name + '" data-toggle="modal" data-target="#modalDeleteUser">Delete user</a></div> </div>';

                    $('#append_btn_' + user_id).append(toggle);
                    $('#append_btn_' + user_id).append(content);

                });
                $(".user_list_query li").hover(function () {
                    //$(this).find('#dropdownMenuButtonUser').css('background-color', '#007bff');
                    $(this).css('background-color', '#007bff');
                    $(this).css('color', 'white');
                    //$(this).find('#dropdownMenuButtonUser').css('color', 'white');

                });
                $(".user_list_query li").mouseleave(function () {
                    //$(this).find('#dropdownMenuButtonUser').css('background-color', 'white');
                    $(this).css('background-color', 'white');
                    $(this).css('color', 'black');
                    //$(this).find('#dropdownMenuButtonUser').css('color', 'black');

                });
            } else {
                dest.append('<p style="text-align: center"><b><i>No users available</i></b></p>');
            }


        },
        error: function (result) {
            alert(result)
        }
    });
}

function getRobotList() {
    $.ajax({
        type: 'POST',
        url: '/getRobotList/',
        dataType: 'json',
        data: {
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            $('.robot_list_query').html('');
            let dest = $('.robot_list_query');
            if ($(result).length !== 0) {
                $.each(result, function (index, element) {
                    var robot_name = element.fields.name;
                    var robot_model_val = element.fields.model;
                    var robot_ip = element.fields.ip;
                    var robot_id = element.pk;
                    var robot_port = element.fields.port;
                    var robot_camera = element.fields.cameraip;

                    switch (robot_model_val) {
                        case 'C':
                            robot_model = "Cobotta";
                            break;

                        case 'V':
                            robot_model = "VS-060";
                            break;

                        default:
                            robot_model = "Undefined";
                            break;
                    }

                    dest.append('<li class="robot_item row" id="append_btn_' + robot_id + '"></li>');
                    var content = '<span class="robot_item_name column" style="width: 25%">' + robot_name + '</span> ' +
                        '<span class="info robot_item_model column" style="width: 25%">' + robot_model + '</span>' +
                        '<span class="info robot_item_ip column" style="width: 25%">' + robot_ip + '</span>';
                    var toggle = '<div class="dropdown column" style="width: 25%; text-align: center;">' +
                        '<button class="btn dropdown-toggle button_white caret-off" ' +
                        'type="button" id="dropdownMenuButtonRobot" data-toggle="dropdown" aria-haspopup="true" ' +
                        'aria-expanded="false"><i class="fas fa-edit"></i></button>' +
                        '<div class="dropdown-menu" aria-labelledby="dropdownMenuButtonRobot">' +
                        '<a class="dropdown-item" href="#" onclick="openModalEditRobot(this);" robotport="' + robot_port + '" robotid="' + robot_id + '" robotname="' + robot_name + '" robotip="' + robot_ip + '" robotmodel="' + robot_model_val + '" robotcamera="' + robot_camera + '" data-toggle="modal" data-target="#modalEditRobot">Edit robot</a>' +
                        '<a class="dropdown-item" href="#" onclick="openModalDeleteRobot(this)" data-toggle="modal" data-target="#modalDeleteRobot" robotname="' + robot_name + '">Delete robot</a></div>&ensp;&ensp;&ensp;&ensp;&ensp;<a href="#" onclick="openModalqrRobot(this);" robotport="' + robot_port + '" robotid="' + robot_id + '" robotname="' + robot_name + '" robotip="' + robot_ip + '" robotmodel="' + robot_model_val + '" robotcamera="' + robot_camera + '" data-toggle="modal" data-target="#modalqrRobot"><button class="btn button_white caret-off"' +
                        'type="button" id="qrcodeRobot"><i class="fas fa-qrcode"></i></button></a></div>';

                    $('#append_btn_' + robot_id).append(toggle);
                    $('#append_btn_' + robot_id).append(content);
                });

                $(".robot_list_query li").hover(function () {
                    //$(this).find('#dropdownMenuButtonRobot').css('background-color', '#007bff');
                    $(this).css('background-color', '#007bff');
                    $(this).css('color', 'white');
                    //$(this).find('#dropdownMenuButtonRobot').css('color', 'white');

                });
                $(".robot_list_query li").mouseleave(function () {
                    //$(this).find('#dropdownMenuButtonRobot').css('background-color', 'white');
                    $(this).css('background-color', 'white');
                    $(this).css('color', 'black');
                    //$(this).find('#dropdownMenuButtonRobot').css('color', 'black');
                });
            } else {
                dest.append('<p style="text-align: center"><b><i>No robots available</i></b></p>');
            }


        },
        error: function (result) {
            alert(result)
        }
    });
}

function getMyRobotList(username) {
    let robot_model;
    $.ajax({
        type: 'POST',
        url: '/getMyRobotList/',
        dataType: 'json',
        data: {
            username: username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            $('.my_robot_list_query').html('');
            let dest = $('.my_robot_list_query');
            if ($(result).length !== 0) {
                $.each(result, function (index, element) {
                    var robot_name_original = element.fields.name;
                    robot_name = robot_name_original.replace(/\s+/g, '-');
                    var robot_pk = element.fields.robot;

                    $.ajax({
                        type: 'POST',
                        url: '/pkRobotToModel/',
                        dataType: 'json',
                        async: false,
                        data: {
                            pk: robot_pk,
                            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                        },

                        success: function (result) {
                            $.each(result, function (index, element) {
                                robot_model = element.fields.model;
                                switch (robot_model) {
                                    case 'C':
                                        robot_model = "Cobotta";
                                        break;

                                    case "V":
                                        robot_model = "VS-060";
                                        break;

                                    default:
                                        robot_model = "Undefined";
                                        break;
                                }
                            });
                        },
                        error: function (result) {
                            alert('Error pkRobotToModel');
                            alert(JSON.stringify(result));
                        }
                    });

                    dest.append('<li class="my_robot_item row" id="append_btn_' + robot_name + '"></li>');
                    var content = '<span class="my_robot_item_name column" style="width: 25%">' + robot_name_original + '</span> ' +
                        '<span class="info my_robot_item_model column" style="width: 25%">' + robot_model + '</span>';
                    var toggle = '<div class="dropdown column" style="width: 25%; text-align: center;">' +
                        '<button class="btn dropdown-toggle button_white caret-off" ' +
                        'type="button" id="dropdownMenuButtonMyRobot" data-toggle="dropdown" aria-haspopup="true" ' +
                        'aria-expanded="false"><i class="fas fa-edit"></i></button>' +
                        '<div class="dropdown-menu" aria-labelledby="dropdownMenuButtonMyRobot">' +
                        '<a class="dropdown-item" href="#" onclick="openModalEditMyRobot(this);" robotname="' + robot_name + '" data-toggle="modal" data-target="#modalEditMyRobot">Edit robot</a>' +
                        '<a class="dropdown-item" href="#" onclick="openModalDeleteMyRobot(this)" robotname="' + robot_name + '" data-toggle="modal" data-target="#modalDeleteMyRobot">Delete robot</a></div> </div>';

                    $('#append_btn_' + robot_name).append(toggle);
                    $('#append_btn_' + robot_name).append(content);
                });

                $(".my_robot_list_query li").hover(function () {
                    //$(this).find('#dropdownMenuButtonMyRobot').css('background-color', '#007bff');
                    $(this).css('background-color', '#007bff');
                    $(this).css('color', 'white');
                    //$(this).find('#dropdownMenuButtonMyRobot').css('color', 'white');

                });
                $(".my_robot_list_query li").mouseleave(function () {
                    //$(this).find('#dropdownMenuButtonMyRobot').css('background-color', 'white');
                    $(this).css('background-color', 'white');
                    $(this).css('color', 'black');
                    //$(this).find('#dropdownMenuButtonMyRobot').css('color', 'black');
                });
            } else {
                dest.append('<p style="text-align: center"><b><i>No robots available</i></b></p>');
            }


        },
        error: function (result) {
            alert('Error getMyRobotList');
            alert(JSON.stringify(result));
        }
    });
}

function checkConnectionRobot(code) {
    $('#MyNewRobotCheckConnection').css("color", "black");
    $('#MyNewRobotCheckConnection').html("  <i class=\"fa-2x fas fa-cog fa-spin\"></i>");
    if (code.trim() === '') {
        $('#MyNewRobotCheckConnection').css("color", "red");
        $('#MyNewRobotCheckConnection').html("&ensp;<i class=\"fas fa-times-circle\"></i>&ensp;Insert robot code");
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/checkConnectionRobot/',
        data: {
            code: code,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            if (result === 'True') {
                $('#MyNewRobotCheckConnection').css("color", "green");
                $('#MyNewRobotCheckConnection').html("&ensp;<i class='fas fa-check-circle'></i>&ensp;Connected")
            } else if (result === 'False') {
                $('#MyNewRobotCheckConnection').css("color", "red");
                $('#MyNewRobotCheckConnection').html("&ensp;<i class=\"fas fa-times-circle\"></i>&ensp;No connection")
            } else if (result === 'NoRobot') {
                $('#MyNewRobotCheckConnection').css("color", "red");
                $('#MyNewRobotCheckConnection').html("&ensp;<i class=\"fas fa-times-circle\"></i>&ensp;No robot with this code")
            }

        },

        error: function (result) {
            alert('Error checkConnectionRobot');
            alert(JSON.stringify(result));
        }
    });
}

function selectProgramming($this) {
    $('#subTitle').text('Programming');
    $('#row_tasks').addClass('d-none');
    $('#row_cards').addClass('d-none');
    $('#row_locations').addClass('d-none');
    $('#row_objects').addClass('d-none');
    $('#row_actions').addClass('d-none');
    $('#row_my_robot_management').addClass('d-none');
    $('#row_user_management').addClass('d-none');
    $('#row_robot_management').addClass('d-none');
    $('#row_programming_cards').removeClass('d-none');
    $('.sidenav a').removeClass('link-clicked');
    $($this).addClass('link-clicked');
    document.body.scrollTop = document.documentElement.scrollTop = 0;
}

function getObjectsList($this) {
    let usernameVal = $this;
    var userPk;
    $.ajax({
        type: "POST",
        url: '/getUserIdFromUsername/',
        dataType: 'json',
        async: false,
        data:
            {
                username: usernameVal,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },

        success: function (result) {
            $.each(result, function (index, element) {
                userPk = element.pk;
            })

        },
        error: function (result) {
            alert('ERROR: getUserIdFromUsername');
            alert(JSON.stringify(result));
        }
    });

    $.ajax({
        type: 'POST',
        url: '/getObjectList/',
        dataType: 'json',
        data: {
            username: usernameVal,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            $('.object_list_query').html('');
            $('#object_list_noObject').html('');
            if ($(result).length !== 0) {
                $('#object_list_noObject').html('<div class="row object_list_query"></div>');
                var dest = $('.object_list_query');
                $.each(result, function (index, element) {
                    var object_name = element.fields.name;
                    var object_keywords = element.fields.keywords;
                    var object_shared = element.fields.shared;
                    var object_owner = element.fields.owner;
                    var object_force = element.fields.force;
                    var object_height = element.fields.height;
                    var pkToUsername;
                    $.ajax({
                        type: "POST",
                        url: '/getUsernameFromUserId/',
                        dataType: 'json',
                        async: false,
                        data:
                            {
                                userpk: object_owner,
                                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                            },

                        success: function (result) {
                            $.each(result, function (index, element) {
                                pkToUsername = element.fields.username;
                            })

                        },
                        error: function (result) {
                            alert('ERROR: getUserIdFromUsername');
                            alert(JSON.stringify(result));
                        }
                    });
                    var object_image = pkToUsername.toString() + "_" + object_name.toString() + ".png";
                    dest.append('<div class="column column_img" data-toggle="tooltip" data-placement="bottom" title="' + object_name + '"> ' +
                        '<img src="../../static/images/objects/' + object_image + '" name="' + object_name + '" ' +
                        'alt="' + object_name + '" onclick="objectDetails(this, \'' + usernameVal + '\');" data-toggle="modal" ' +
                        'data-target="#modalObjectDetails" heightObject="' + object_height + '" owner="' + pkToUsername + '" keywords="' + object_keywords + '" shared="' + object_shared + '" force="' + object_force + '"></div>');

                });
            } else {
                $('#object_list_noObject').append('<p style="text-align: center"><b><i>No objects available</i></b></p>');
            }
            $('[data-toggle="tooltip"]').tooltip()
        },
        error: function (result) {
            alert("ERROR: getObjectList");
            alert(JSON.stringify(result));
        }
    });
}

function getLocationList($this) {
    let username = $this;
    var userPk;
    $.ajax({
        type: "POST",
        url: '/getUserIdFromUsername/',
        dataType: 'json',
        async: false,
        data:
            {
                username: username,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },

        success: function (result) {
            $.each(result, function (index, element) {
                userPk = element.pk;
            })

        },
        error: function (result) {
            alert('ERROR: getUserIdFromUsername');
            alert(JSON.stringify(result));
        }
    });

    $.ajax({
        type: 'POST',
        url: '/getLocationList/',
        dataType: 'json',
        data: {
            username: username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            $('.location_list_query').html('');
            var dest = $('.location_list_query');
            if ($(result).length !== 0) {

                $.each(result, function (index, element) {
                    var location_name = element.fields.name;
                    var location_id = element.pk;
                    var location_shared = element.fields.shared;
                    var location_owner = element.fields.owner;
                    var location_robot = element.fields.robot;
                    var location_position = element.fields.position;
                    location_position = location_position.toString().replace(/"/g, "'");
                    var location_robot_name;
                    $.ajax({
                        type: 'POST',
                        async: false,
                        url: '/myRobotNameFromId/',
                        dataType: 'json',
                        data: {
                            robot: location_robot,
                            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                        },

                        success: function (result) {
                            location_robot_name = result.robot_name;
                        },
                        error: function (result) {
                            alert('ERROR: myRobotNameFromId');
                            alert(JSON.stringify(result));
                        }
                    });

                    dest.append('<li class="location_item row" id="append_btn_' + location_id + '"></li>');
                    var content = '<span class="location_item_name column" style="width: 25%">' + location_name + '</span>' + '<span class="location_item_robot column" style="width: 25%">' + location_robot_name + '</span>';

                    var toggle = '<div class="dropdown column" style="width: 25%; text-align: center;">' +
                        '<button class="btn dropdown-toggle button_white caret-off" ' +
                        'type="button" id="dropdownMenuButtonLocation" data-toggle="dropdown" aria-haspopup="true" ' +
                        'aria-expanded="false"><i class="fas fa-edit"></i></button>' +
                        '<div class="dropdown-menu" aria-labelledby="dropdownMenuButtonLocation">' +
                        '<a class="dropdown-item" href="#" onclick="openModalModifyLocation(this);" shared="' + location_shared + '" robotname="' + location_robot_name + '" locationname="' + location_name + '" owner="' + location_owner + '" position="' + location_position.toString() + '" robot="' + location_robot + '">Edit location</a>' +
                        '<a class="dropdown-item" href="#" onclick="openModalDeleteLocation(this)" locationname="' + location_name + '" data-toggle="modal" data-target="#modalDeleteLocation">Delete location</a></div></div>';

                    if (location_owner !== userPk) {
                        toggle = '<div class="dropdown column" style="width: 25%; text-align: center;"><button class="btn button_white caret-off" type="button" style="cursor: not-allowed"><i class="fas fa-globe-americas"></i></button></div>';
                    }
                    $('#append_btn_' + location_id).append(toggle);
                    $('#append_btn_' + location_id).append(content);

                });
                $(".location_list_query li").hover(function () {
                    //$(this).find('#dropdownMenuButtonTask').css('background-color', '#007bff');
                    $(this).css('background-color', '#007bff');
                    $(this).css('color', 'white');
                    //$(this).find('#dropdownMenuButtonTask').css('color', 'white');

                });
                $(".location_list_query li").mouseleave(function () {
                    //$(this).find('#dropdownMenuButtonTask').css('background-color', 'white');
                    $(this).css('background-color', 'white');
                    $(this).css('color', 'black');
                    //$(this).find('#dropdownMenuButtonTask').css('color', 'black');

                });
            } else {
                dest.append('<p style="text-align: center"><b><i>No locations available</i></b></p>');
            }
        },
        error: function (result) {
            alert("ERROR: getLocationList");
            alert(JSON.stringify(result));
        }
    });
}

function getActionList($this) {
    let username = $this;
    var userPk;
    $.ajax({
        type: "POST",
        url: '/getUserIdFromUsername/',
        dataType: 'json',
        async: false,
        data:
            {
                username: username,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },

        success: function (result) {
            $.each(result, function (index, element) {
                userPk = element.pk;
            })

        },
        error: function (result) {
            alert('ERROR: getUserIdFromUsername');
            alert(JSON.stringify(result));
        }
    });

    $.ajax({
        type: 'POST',
        url: '/getActionList/',
        dataType: 'json',
        data: {
            username: username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            $('.action_list_query').html('');
            var dest = $('.action_list_query');
            if ($(result).length !== 0) {

                $.each(result, function (index, element) {
                    var action_name = element.fields.name;
                    var action_id = element.pk;
                    var action_shared = element.fields.shared;
                    var action_owner = element.fields.owner;
                    var action_robot = element.fields.robot;
                    var action_robot_name;
                    $.ajax({
                        type: 'POST',
                        async: false,
                        url: '/myRobotNameFromId/',
                        dataType: 'json',
                        data: {
                            robot: action_robot,
                            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                        },

                        success: function (result) {
                            action_robot_name = result.robot_name;
                        },
                        error: function (result) {
                            alert('ERROR: myRobotNameFromId');
                            alert(JSON.stringify(result));
                        }
                    });

                    dest.append('<li class="action_item row" id="append_btn_' + action_id + '"></li>');
                    var content = '<span class="action_item_name column" style="width: 25%">' + action_name + '</span>' + '<span class="action_item_robot column" style="width: 25%">' + action_robot_name + '</span>';
                    ;

                    var toggle = '<div class="dropdown column" style="width: 25%; text-align: center;">' +
                        '<button class="btn dropdown-toggle button_white caret-off" ' +
                        'type="button" id="dropdownMenuButtonLocation" data-toggle="dropdown" aria-haspopup="true" ' +
                        'aria-expanded="false"><i class="fas fa-edit"></i></button>' +
                        '<div class="dropdown-menu" aria-labelledby="dropdownMenuButtonAction">' +
                        //'<a class="dropdown-item" href="#" onclick="openModalModifyAction(this);" shared="' + action_shared + '" actionname="' + action_name + '" owner="' + action_owner + '">Edit action</a>' +
                        '<a class="dropdown-item" href="#" onclick="openModalDeleteAction(this)" actionname="' + action_name + '" data-toggle="modal" data-target="#modalDeleteAction">Delete action</a></div></div>';

                    if (action_owner !== userPk) {
                        toggle = '<div class="dropdown column" style="width: 25%; text-align: center;"><button class="btn button_white caret-off" type="button" style="cursor: not-allowed"><i class="fas fa-globe-americas"></i></button></div>';
                    }
                    $('#append_btn_' + action_id).append(toggle);
                    $('#append_btn_' + action_id).append(content);

                });
                $(".action_list_query li").hover(function () {
                    //$(this).find('#dropdownMenuButtonTask').css('background-color', '#007bff');
                    $(this).css('background-color', '#007bff');
                    $(this).css('color', 'white');
                    //$(this).find('#dropdownMenuButtonTask').css('color', 'white');

                });
                $(".action_list_query li").mouseleave(function () {
                    //$(this).find('#dropdownMenuButtonTask').css('background-color', 'white');
                    $(this).css('background-color', 'white');
                    $(this).css('color', 'black');
                    //$(this).find('#dropdownMenuButtonTask').css('color', 'black');

                });
            } else {
                dest.append('<p style="text-align: center"><b><i>No actions available</i></b></p>');
            }
        },
        error: function (result) {
            alert("ERROR: getActionList");
            alert(JSON.stringify(result));
        }
    });
}


function openModalTitleChat() {
    $('#program_name').removeClass('is-invalid');
    $('#program_name').removeClass('is-valid');
    $('#program_name').val('');
    $('#inputDescription').removeClass('is-invalid');
    $('#inputDescription').removeClass('is-valid');
    $('#inputDescription').val('');

    $('#newChatModal').show();
    $("#newChatModal").appendTo("body");

}

function openModalDeleteTask($this) {
    let $task_name = $($this).attr('taskname');
    $('#deleteConfirm').attr('taskname', $task_name);
    $('#eliminaTask').text($task_name);
    $('#modalDeleteTask').attr('taskname', $task_name);
    $('#titleDelete').html('Delete task: ' + $task_name);
    $('#modalDeleteTask').show();
    $("#modalDeleteTask").appendTo("body");
}

function openModalDeleteLocation($this) {
    let $location_name = $($this).attr('locationname');
    $('#deleteConfirm').attr('locationname', $location_name);
    $('#eliminaLocation').text($location_name);
    $('#modalDeleteLocation').attr('locationname', $location_name);
    $('#modalDeleteLocation').show();
    $("#modalDeleteLocation").appendTo("body");
}

function openModalDeleteAction($this) {
    let $action_name = $($this).attr('actionname');
    $("#SelectRobotRunTask").val('');
    $('#deleteConfirm').attr('actionname', $action_name);
    $('#eliminaAction').text($action_name);
    $('#modalDeleteAction').attr('actionname', $action_name);
    $('#modalDeleteAction').show();
    $("#modalDeleteAction").appendTo("body");
}

function openModalRunTask($this) {
    $('#errorSelectRobotRunTask').html("");
    let $username = $('#username').html();
    $('#SelectRobotRunTask')
        .find('option')
        .remove()
        .end()
        .append('<option disabled selected value hidden>Select robot ...</option>')
    ;
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
                    $("#SelectRobotRunTask").append(new Option(robot_name, robot_name));
                })
            } else {
                $('#errorSelectRobotRunTask').html("<i class=\"fas fa-times-circle\" style='color: red'></i>  associated to your account");
                $('#runTaskConfirm').prop('disabled', true);
                $('#runTaskConfirm').css('cursor', 'not-allowed');
            }


        },

        error: function (result) {
            alert(JSON.stringify(result));
            alert("ERROR: robotOfUser")
        }
    });

    let $task_name = $($this).attr('taskname');
    $('#runTaskConfirm').attr('taskname', $task_name);
    $('#taskToRun').text($task_name);
    $('#modalRunTask').attr('taskname', $task_name);
    $('#modalRunTask').show();
    $("#modalRunTask").appendTo("body");
}

function openModalDeleteUser($this) {
    let $username = $($this).attr('username');
    $('#deleteConfirm').attr('username', $username);
    $('#eliminaUser').text($username);
    $('#modalDeleteUser').attr('username', $username);
    $('#modalDeleteUser').show();
    $("#modalDeleteUser").appendTo("body");
}

function openModalDeleteRobot($this) {
    let $robotname = $($this).attr('robotname');
    $('#deleteConfirm').attr('robotname', $robotname);
    $('#eliminaRobot').text($robotname);
    $('#modalDeleteRobot').attr('robotname', $robotname);
    $('#modalDeleteRobot').show();
    $("#modalDeleteRobot").appendTo("body");
}

function openModalDeleteMyRobot($this) {
    let $robotname = $($this).attr('robotname');
    $robotname = $robotname.replace(/-/g, " ");
    $('#eliminaMyRobot').text($robotname);
    $('#modalDeleteMyRobot').attr('robotname', $robotname);
    $('#modalDeleteMyRobot').show();
    $("#modalDeleteMyRobot").appendTo("body");
}

function openModalEditTask($this) {
    let $task_name = $($this).attr('taskname');
    $('#editConfirm').attr('taskname', $task_name);
    $('#editTask').text($task_name);
    $('#modalEditTask').attr('taskname', $task_name);
    $('#modalModifyTask').modal('hide');
    $('#modalEditTask').modal('show');
}

function openModalModifyTask($this) {
    $('#errorModifyTask').text("");
    let $task_name = $($this).attr('taskname');
    let $task_shared = $($this).attr('shared');
    let $task_owner = $($this).attr('owner');
    if ($task_shared === 'true') {
        $('#sharedModifyTask').prop('checked', true);
    } else {
        $('#sharedModifyTask').prop('checked', false);
    }
    $('#editTaskStructure').attr('taskname', $task_name);
    $('#modalModifyTask').attr('taskname', $task_name);
    $('#modalModifyTask').attr('task_owner', $task_owner);
    $('#titleModify').html("Modify task: " + $task_name);
    $('#titleEdit').html("Modify task: " + $task_name);
    $('#modalModifyTask').modal('show');
}

function openModalModifyLocation($this) {
    $('#errorTakePositionModifyLocation').text("");
    let $locationname = $($this).attr('locationname');
    let $robotname = $($this).attr('robotname');
    let $locationshared = $($this).attr('shared');
    let $locationowner = $($this).attr('owner');
    let $locationposition = $($this).attr('position');
    let $locationrobot = $($this).attr('robot');
    if ($locationshared === 'true') {
        $('#sharedModifyLocation').prop('checked', true);
    } else {
        $('#sharedModifyLocation').prop('checked', false);
    }
    $('#robotNameModifyLocation').val($robotname);
    $('#modalModifyLocation').attr('locationname', $locationname);
    $('#modalModifyLocation').attr('locationshared', $locationshared);
    $('#modalModifyLocation').attr('locationowner', $locationowner);
    $('#modalModifyLocation').attr('locationposition', $locationposition);
    $('#modalModifyLocation').attr('locationrobot', $locationrobot);
    $('#modalModifyLocation').attr('robotname', $robotname);
    $('#title-modifyLocation').text("Location details: " + $locationname);
    $('#modalModifyLocation').modal('show');
}

function openModalEditRobot($this) {
    let $robotname = $($this).attr('robotname');
    let $robotport = $($this).attr('robotport');
    let $robotip = $($this).attr('robotip');
    let $robotmodel = $($this).attr('robotmodel');
    let $robotid = $($this).attr('robotid');
    let $robotcamera = $($this).attr('robotcamera');
    $('#editConfirm').attr('robotname', $robotname);
    $('#editRobot').text($robotname);
    $('#modalEditRobot').attr('robotid', $robotid);
    $('#EditRobotName').removeClass('is-valid');
    $('#EditRobotIP').removeClass('is-valid');
    $('#EditRobotErrorName').html('');
    $('#EditRobotErrorIP').html('');
    $('#EditRobotName').val($robotname);
    $('#EditRobotIP').val($robotip);
    $('#EditRobotIPCamera').val($robotcamera);
    $('#EditRobotPort').val($robotport);
    $('#EditRobotSelectModel').val($robotmodel);
    $('#modalEditRobot').show();
    $("#modalEditRobot").appendTo("body");
}

function openModalEditMyRobot($this) {
    let $robotname = $($this).attr('robotname');
    $robotname = $robotname.replace(/-/g, " ");
    $('#editMyRobot').text($robotname);
    $('#EditMyRobotErrorName').text('');
    $('#EditMyRobotName').removeClass('is-valid');
    $('#EditMyRobotName').val($robotname);
    $('#modalEditMyRobot').attr('robotname', $robotname);
    $('#modalEditMyRobot').show();
    $("#modalEditMyRobot").appendTo("body");
}

function openModalqrRobot($this) {
    $('#modalqrRobot.modal-body').html('');
    let $robotname = $($this).attr('robotname');
    let $robotid = $($this).attr('robotid');
    let $robotport = $($this).attr('robotport');
    let $robotmodel = $($this).attr('robotmodel');
    let $robotip = $($this).attr('robotip');
    let $robotcamera = $($this).attr('robotcamera');
    switch ($robotmodel) {
        case 'C':
            $robotmodel = "Cobotta";
            break;
        case 'V':
            $robotmodel = "VS-060";
            break;
    }
    $('#modalqrRobot').attr('robotname', $robotname);
    $('#modalqrRobot').attr('robotid', $robotid);
    $('#modalqrRobot').attr('robotmodel', $robotmodel);
    $('#modalqrRobot').attr('robotip', $robotip);
    $('#modalqrRobot').attr('robotport', $robotport);
    $('#modalqrRobot').attr('robotport', $robotcamera);
    $('#qrcodeRobotModal').html('');
    new QrcodeMaker(document.getElementById("qrcodeRobotModal"), $robotid);
    $('#qrcode-idlabel').html('ID: ' + $robotid);
    $('#qrcode-namelabel').html('Name: ' + $robotname);
    $('#qrcode-modellabel').html('Model: ' + $robotmodel);
    $('#qrcode-iplabel').html('IP: ' + $robotip);
    $('#qrcode-portlabel').html('Port: ' + $robotport);
    $('#qrcode-cameralabel').html('Camera: ' + $robotcamera);
    $('#modalqrRobot').show();
    $("#modalqrRobot").appendTo("body");
}

function qrModalPrint() {
    var x = window.open('');
    x.document.write($('#modalqr-body').html() + "<style>@page { size: auto;  margin: 0mm; }</style>"); //style per non stampare data e numero pagina
    x.print();
    x.close();
}

function openModalEditUser($this) {
    let $username = $($this).attr('username');
    $('#editConfirm').attr('username', $username);
    $('#editUser').text($username);
    $('#modalEditUser').attr('username', $username);
    $('#modalEditUser').show();
    $("#modalEditUser").appendTo("body");
}


function openNewChat(input_program, input_owner, input_description, input_shared) {
    createNewDialogue(input_program, input_owner, input_description, input_shared);
    if (modality === 0) {
        window.location.href = 'chat/' + input_program;
    } else {
        window.location.href = 'task/' + input_program;
    }

}

function createNewDialogue(current_task_name, input_owner, input_description, input_shared) {
    $.ajax({
        type: 'POST',
        url: '/ajaxCreateDialogue/',
        data: {
            dialogue_name: current_task_name,
            dialogue_owner: input_owner,
            dialogue_description: input_description,
            dialogue_shared: input_shared,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },

        success: function (result) {
            //objectDetails(result);
            end = '0';
            execute = '0';

        },
        error: function () {
            alert("error");
        }
    });
}

function hasNumber(myString) {
    return /\d/.test(myString);
}

function hasLowerCase(str) {
    return (/[a-z]/.test(str));
}

function hasUpperCase(str) {
    return (/[A-Z]/.test(str));
}

function runTask(taskname) {
    $('#errorSelectRobotRunTask').html("");
    let task_name = $(taskname).attr("taskname");
    let username = $('#username').html();
    let robot = $('#SelectRobotRunTask').val();
    if (robot === null) {
        $('#errorSelectRobotRunTask').html("<i class=\"fas fa-times-circle\" style='color: red'></i> No robot selected");
        return
    }
    $('#modalRunTask').modal('hide');

    $("#objectExistRunTaskResultIcon").removeClass();
    $("#objectExistRunTaskResultIcon").addClass('fas fa-cog fa-spin');
    $("#objectExistRunTaskResultIcon").css("color", "black");

    $("#placeExistRunTaskResultIcon").removeClass();
    $("#placeExistRunTaskResultIcon").addClass('fas fa-cog fa-spin');
    $("#placeExistRunTaskResultIcon").css("color", "black");

    $("#actionExistRunTaskResultIcon").removeClass();
    $("#actionExistRunTaskResultIcon").addClass('fas fa-cog fa-spin');
    $("#actionExistRunTaskResultIcon").css("color", "black");
    $('#actionExistRunTaskResult').css("text-decoration", "");

    $("#objectFoundRunTaskResultIcon").removeClass();
    $("#objectFoundRunTaskResultIcon").addClass('fas fa-cog fa-spin');
    $("#objectFoundRunTaskResultIcon").css("color", "black");

    $("#taskFinishRunTaskResultIcon").removeClass();
    $("#taskFinishRunTaskResultIcon").addClass('fas fa-cog fa-spin');
    $("#taskFinishRunTaskResultIcon").css("color", "black");

    $('#modalRunTaskResult').modal('show');

    $.ajax({
        type: 'POST',
        url: '/runTask/',
        dataType: 'json',
        data: {
            robot: robot,
            taskName: task_name,
            username: username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            //alert(JSON.stringify(result));
            if (result.exception === 'com_error') {
                $('#modalRunTaskResult').modal('hide');
                $('#modalRunTask').modal('show');
                $('#errorSelectRobotRunTask').html("<i class=\"fas fa-times-circle\" style='color: red'></i> Robot not connected");
            } else if (result.exception === 'ORiNException') {
                switch (result.codeException) {
                    case "-2091909002":
                        $('#errorSelectRobotRunTask').html("<i class=\"fas fa-times-circle\" style='color: red'></i> Task stopped  by emergency button: check the TP");
                        break;
                    case "-2125459419":
                        $('#errorSelectRobotRunTask').html("<i class=\"fas fa-times-circle\" style='color: red'></i> Impossible to run task when an error occurs: check the TP");
                        break;
                    case "-2125459430":
                        $('#errorSelectRobotRunTask').html("<i class=\"fas fa-times-circle\" style='color: red'></i> Impossible to run task when emergency button is pressed: check the TP");
                        break;
                    case "-2125459351":
                        $('#errorSelectRobotRunTask').html("<i class=\"fas fa-times-circle\" style='color: red'></i> Operation preparation is necessary: check the TP");
                        break;
                    case "-2111814863":
                        $('#errorSelectRobotRunTask').html("<i class=\"fas fa-times-circle\" style='color: red'></i> J1 Collision detected: check the TP");
                        break;
                    case "-2111814862":
                        $('#errorSelectRobotRunTask').html("<i class=\"fas fa-times-circle\" style='color: red'></i> J2 Collision detected: check the TP");
                        break;
                    case "-2111814861":
                        $('#errorSelectRobotRunTask').html("<i class=\"fas fa-times-circle\" style='color: red'></i> J3 Collision detected: check the TP");
                        break;
                    case "-2111814860":
                        $('#errorSelectRobotRunTask').html("<i class=\"fas fa-times-circle\" style='color: red'></i> J4 Collision detected: check the TP");
                        break;
                    case "-2111814859":
                        $('#errorSelectRobotRunTask').html("<i class=\"fas fa-times-circle\" style='color: red'></i> J5 Collision detected: check the TP");
                        break;
                    case "-2111814858":
                        $('#errorSelectRobotRunTask').html("<i class=\"fas fa-times-circle\" style='color: red'></i> J6 Collision detected: check the TP");
                        break;
                    default:
                        $('#errorSelectRobotRunTask').html("<i class=\"fas fa-times-circle\" style='color: red'></i> Robot error: check the TP");
                        break;
                }
                $('#modalRunTaskResult').modal('hide');
                $('#modalRunTask').modal('show');

            } else {
                $('#buttonOkRunTaskModal').attr('disabled', false);
                $('#closableRunTaskModal').attr('disabled', false);
                if (result.pickExist === true) {
                    $("#objectExistRunTaskResultIcon").removeClass('fas fa-cog fa-spin');
                    $("#objectExistRunTaskResultIcon").addClass('fas fa-check-circle');
                    $("#objectExistRunTaskResultIcon").css("color", "green")
                } else {
                    $("#objectExistRunTaskResultIcon").removeClass('fas fa-cog fa-spin');
                    $("#objectExistRunTaskResultIcon").addClass('fas fa-times-circle');
                    $("#objectExistRunTaskResultIcon").css("color", "red")
                }

                if (result.placeExist === true) {
                    $("#placeExistRunTaskResultIcon").removeClass('fas fa-cog fa-spin');
                    $("#placeExistRunTaskResultIcon").addClass('fas fa-check-circle');
                    $("#placeExistRunTaskResultIcon").css("color", "green")
                } else {
                    $("#placeExistRunTaskResultIcon").removeClass('fas fa-cog fa-spin');
                    $("#placeExistRunTaskResultIcon").addClass('fas fa-times-circle');
                    $("#placeExistRunTaskResultIcon").css("color", "red")
                }

                if (result.actionExist === true) {
                    $("#actionExistRunTaskResultIcon").removeClass('fas fa-cog fa-spin');
                    $("#actionExistRunTaskResultIcon").addClass('fas fa-check-circle');
                    $("#actionExistRunTaskResultIcon").css("color", "green");
                    $('#actionExistRunTaskResult').css("text-decoration", "");
                } else if (result.actionExist === null) {
                    $("#actionExistRunTaskResultIcon").removeClass('fas fa-cog fa-spin');
                    $("#actionExistRunTaskResultIcon").addClass('fas fa-question-circle');
                    $("#actionExistRunTaskResultIcon").css("color", "blue");
                    $('#actionExistRunTaskResult').css("text-decoration", "line-through");
                } else {
                    $("#actionExistRunTaskResultIcon").removeClass('fas fa-cog fa-spin');
                    $("#actionExistRunTaskResultIcon").addClass('fas fa-times-circle');
                    $("#actionExistRunTaskResultIcon").css("color", "red")
                }

                if (result.objectNotFound === false) {
                    $("#objectFoundRunTaskResultIcon").removeClass('fas fa-cog fa-spin');
                    $("#objectFoundRunTaskResultIcon").addClass('fas fa-check-circle');
                    $("#objectFoundRunTaskResultIcon").css("color", "green")
                } else if (result.objectNotFound === null) {
                    $("#objectFoundRunTaskResultIcon").removeClass('fas fa-cog fa-spin');
                    $("#objectFoundRunTaskResultIcon").addClass('fas fa-question-circle');
                    $("#objectFoundRunTaskResultIcon").css("color", "blue");
                    $('#objectFoundRunTaskResult').css("text-decoration", "line-through");
                } else {
                    $("#objectFoundRunTaskResultIcon").removeClass('fas fa-cog fa-spin');
                    $("#objectFoundRunTaskResultIcon").addClass('fas fa-times-circle');
                    $("#objectFoundRunTaskResultIcon").css("color", "red")
                }

                if (result.finishTask === true) {
                    $("#taskFinishRunTaskResultIcon").removeClass('fas fa-cog fa-spin');
                    $("#taskFinishRunTaskResultIcon").addClass('fas fa-check-circle');
                    $("#taskFinishRunTaskResultIcon").css("color", "green")
                } else if (result.finishTask === null) {
                    $("#taskFinishRunTaskResultIcon").removeClass('fas fa-cog fa-spin');
                    $("#taskFinishRunTaskResultIcon").addClass('fas fa-question-circle');
                    $("#taskFinishRunTaskResultIcon").css("color", "blue");
                    $('#taskFinishRunTaskResult').css("text-decoration", "line-through");
                } else {
                    $("#taskFinishRunTaskResultIcon").removeClass('fas fa-cog fa-spin');
                    $("#taskFinishRunTaskResultIcon").addClass('fas fa-times-circle');
                    $("#taskFinishRunTaskResultIcon").css("color", "red")
                }
            }
        },

        error: function (result) {
            alert("error: runTask");
            alert(JSON.stringify(result));
        }
    });
}

function changePassword(username, newPassword, repeatPassword) {
    let newPasswordVal = newPassword.val();
    let repeatPasswordVal = repeatPassword.val();

    //CONTROLLI SU NEWPASSWORDVAL
    if (newPasswordVal.trim().length < 8 || !hasNumber(newPasswordVal.trim()) || !hasLowerCase(newPasswordVal.trim()) || !hasUpperCase(newPasswordVal.trim())) {
        newPassword.addClass('is-invalid');
        newPassword.removeClass('is-valid');
        $('#ResetErrorNewPassword').css('color', 'red');
        $('#ResetErrorNewPassword').html("<i class=\"fas fa-times-circle\"></i> New password doesn't respect password policy");
        repeatPassword.addClass('is-invalid');
        repeatPassword.removeClass('is-valid');
    } else {
        if (newPasswordVal === repeatPasswordVal) {
            newPassword.addClass('is-valid');
            repeatPassword.addClass('is-valid');
            newPassword.removeClass('is-invalid');
            repeatPassword.removeClass('is-invalid');
            $('#ResetErrorNewPassword').css('color', 'green');
            $('#ResetErrorRepeatPassword').css('color', 'green');
            $('#ResetErrorNewPassword').html("<i class='fas fa-check-circle'></i> Correct");
            $('#ResetErrorRepeatPassword').html("<i class='fas fa-check-circle'></i> Correct");
        } else {
            newPassword.addClass('is-invalid');
            repeatPassword.addClass('is-invalid');
            newPassword.removeClass('is-valid');
            repeatPassword.removeClass('is-valid');
            $('#ResetErrorNewPassword').css('color', 'red');
            $('#ResetErrorRepeatPasswordPassword').css('color', 'red');
            $('#ResetErrorNewPassword').html("<i class=\"fas fa-times-circle\"></i> New and confirm password don't match");
            $('#ResetErrorRepeatPassword').html("<i class=\"fas fa-times-circle\"></i> New and confirm password don't match");
        }
    }
    if (newPassword.hasClass('is-valid') && repeatPassword.hasClass('is-valid')) {
        $.ajax({
            type: 'POST',
            url: '/changePassword/',
            data: {
                newPassword: newPasswordVal,
                username: username,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },

            success: function (result) {
                $('#modalEditUser').modal('toggle');
                $('#modalPasswordModifyConfirmUser').modal('toggle');
            },

            error: function (result) {
                alert("error: changePassword");
            }
        });
    }
}

function changeMyPassword(username, oldPassword, newPassword, repeatPassword) {
    let oldPasswordVal = oldPassword.val();
    let newPasswordVal = newPassword.val();
    let repeatPasswordVal = repeatPassword.val();
    $.ajax({
        type: 'POST',
        url: '/checkPassword/',
        data: {
            oldPassword: oldPasswordVal,
            username: username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            if (result === 'True') {
                oldPassword.addClass('is-valid');
                oldPassword.removeClass('is-invalid');
                $('#ErrorOldPassword').css('color', 'green');
                $('#ErrorOldPassword').html("<i class='fas fa-check-circle'></i> Correct");
            } else {
                oldPassword.addClass('is-invalid');
                oldPassword.removeClass('is-valid');
                $('#ErrorOldPassword').css('color', 'red');
                $('#ErrorOldPassword').html("<i class=\"fas fa-times-circle\"></i> Old password doesn't match");
            }

            //CONTROLLI SU NEWPASSWORDVAL
            if (newPasswordVal.trim().length < 8 || !hasNumber(newPasswordVal.trim()) || !hasLowerCase(newPasswordVal.trim()) || !hasUpperCase(newPasswordVal.trim())) {
                newPassword.addClass('is-invalid');
                newPassword.removeClass('is-valid');
                $('#ErrorNewPassword').css('color', 'red');
                $('#ErrorNewPassword').html("<i class=\"fas fa-times-circle\"></i> New password doesn't respect password policy");
                repeatPassword.addClass('is-invalid');
                repeatPassword.removeClass('is-valid');
            } else {
                if (newPasswordVal === repeatPasswordVal) {
                    newPassword.addClass('is-valid');
                    repeatPassword.addClass('is-valid');
                    newPassword.removeClass('is-invalid');
                    repeatPassword.removeClass('is-invalid');
                    $('#ErrorNewPassword').css('color', 'green');
                    $('#ErrorRepeatPassword').css('color', 'green');
                    $('#ErrorNewPassword').html("<i class='fas fa-check-circle'></i> Correct");
                    $('#ErrorRepeatPassword').html("<i class='fas fa-check-circle'></i> Correct");
                } else {
                    newPassword.addClass('is-invalid');
                    repeatPassword.addClass('is-invalid');
                    newPassword.removeClass('is-valid');
                    repeatPassword.removeClass('is-valid');
                    $('#ErrorNewPassword').css('color', 'red');
                    $('#ErrorRepeatPasswordPassword').css('color', 'red');
                    $('#ErrorNewPassword').html("<i class=\"fas fa-times-circle\"></i> New and confirm password don't match");
                    $('#ErrorRepeatPassword').html("<i class=\"fas fa-times-circle\"></i> New and confirm password don't match");
                }
            }
            if (oldPassword.hasClass('is-valid') && newPassword.hasClass('is-valid') && repeatPassword.hasClass('is-valid')) {
                $.ajax({
                    type: 'POST',
                    url: '/changePassword/',
                    data: {
                        newPassword: newPasswordVal,
                        username: username,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                    },

                    success: function (result) {
                        $('#modalProfile').modal('toggle');
                        $('#modalPasswordModifyConfirm').modal('toggle');
                    },

                    error: function (result) {
                        alert("error: changePassword");
                    }
                })
            }
        },

        error: function (result) {
            alert("error: checkPassword");
        }

    });
}

function newUser(username, newPassword, repeatPassword, role) {
    let newPasswordVal = newPassword.val();
    let repeatPasswordVal = repeatPassword.val();
    let roleVal = role.val();
    let usernameVal = username.val();

    $.ajax({
        type: 'POST',
        url: '/checkUser/',
        async: false,
        data: {
            username: usernameVal,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            if (result.usernameExist === true) {
                username.addClass('is-invalid');
                username.removeClass('is-valid');
                $('#NewUserErrorUsername').css("color", "red");
                $('#NewUserErrorUsername').html("<i class=\"fas fa-times-circle\"></i> Username already exists");
            } else {
                username.removeClass('is-invalid');
                username.addClass('is-valid');
                $('#NewUserErrorUsername').css("color", "green");
                $('#NewUserErrorUsername').html("<i class='fas fa-check-circle'></i> Correct");
            }
        },

        error: function () {
            alert("error: checkUser");
        }

    });

    //CONTROLLI SU NEWPASSWORDVAL
    if (newPasswordVal.trim().length < 8 || !hasNumber(newPasswordVal.trim()) || !hasLowerCase(newPasswordVal.trim()) || !hasUpperCase(newPasswordVal.trim())) {
        newPassword.addClass('is-invalid');
        newPassword.removeClass('is-valid');
        $('#NewUserErrorNewPassword').css('color', 'red');
        $('#NewUserErrorNewPassword').html("<i class=\"fas fa-times-circle\"></i> New password doesn't respect password policy");
        repeatPassword.addClass('is-invalid');
        repeatPassword.removeClass('is-valid');
    } else {
        if (newPasswordVal === repeatPasswordVal) {
            newPassword.addClass('is-valid');
            repeatPassword.addClass('is-valid');
            newPassword.removeClass('is-invalid');
            repeatPassword.removeClass('is-invalid');
            $('#NewUserErrorNewPassword').css('color', 'green');
            $('#NewUserErrorRepeatPassword').css('color', 'green');
            $('#NewUserErrorNewPassword').html("<i class='fas fa-check-circle'></i> Correct");
            $('#NewUserErrorRepeatPassword').html("<i class='fas fa-check-circle'></i> Correct");
        } else {
            newPassword.addClass('is-invalid');
            repeatPassword.addClass('is-invalid');
            newPassword.removeClass('is-valid');
            repeatPassword.removeClass('is-valid');
            $('#NewUserErrorNewPassword').css('color', 'red');
            $('#NewUserErrorRepeatPasswordPassword').css('color', 'red');
            $('#NewUserErrorNewPassword').html("<i class=\"fas fa-times-circle\"></i> New and confirm password don't match");
            $('#NewUserErrorRepeatPassword').html("<i class=\"fas fa-times-circle\"></i> New and confirm password don't match");
        }
    }
    if (username.hasClass('is-valid') && newPassword.hasClass('is-valid') && repeatPassword.hasClass('is-valid')) {
        $.ajax({
            type: 'POST',
            url: '/createNewUser/',
            data: {
                newPassword: newPasswordVal,
                username: usernameVal,
                role: roleVal,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },

            success: function () {
                $('#modalNewUser').modal('toggle');
                $('#modalNewUserConfirm').modal('toggle');
            },

            error: function (result) {
                alert(JSON.stringify(result));
                alert("error: newUser");
            }
        });
    }
}

function openModalNewRobot() {
    $('#NewRobotErrorName').html("");
    $('#NewRobotErrorIP').html("");
    $('#NewRobotErrorIPCamera').html("");
    $('#NewRobotErrorModel').html("");
    $('#NewRobotName').removeClass('is-invalid');
    $('#NewRobotName').removeClass('is-valid');
    $('#NewRobotIP').removeClass('is-invalid');
    $('#NewRobotIP').removeClass('is-valid');
}

function newRobot(name, IP, model, port, camera) {
    let nameVal = name.val();
    let IPVal = IP.val();
    let modelVal = model.val();
    let portVal = port.val();
    let cameraVal = camera.val();

    if (modelVal === null) {
        $('#NewRobotErrorModel').html("<i class=\"fas fa-times-circle\"></i> Select robot model");
        return
    }

    $.ajax({
        type: 'POST',
        url: '/checkRobot/',
        dataType: 'JSON',
        async: false,
        data: {
            name: nameVal,
            IP: IPVal,
            model: modelVal,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            if (result.nameExist === true) {
                name.addClass('is-invalid');
                name.removeClass('is-valid');
                $('#NewRobotErrorName').css("color", "red");
                $('#NewRobotErrorName').html("<i class=\"fas fa-times-circle\"></i> Name already exists");
            } else {
                name.removeClass('is-invalid');
                name.addClass('is-valid');
                $('#NewRobotErrorName').css("color", "green");
                $('#NewRobotErrorName').html("<i class='fas fa-check-circle'></i> Correct");
            }

            if (result.IPExist === true) {
                IP.addClass('is-invalid');
                IP.removeClass('is-valid');
                $('#NewRobotErrorIP').css("color", "red");
                $('#NewRobotErrorIP').html("<i class=\"fas fa-times-circle\"></i> IP already exists");
            } else {
                IP.removeClass('is-invalid');
                IP.addClass('is-valid');
                $('#NewRobotErrorIP').css("color", "green");
                $('#NewRobotErrorIP').html("<i class='fas fa-check-circle'></i> Correct");
            }
        },

        error: function (result) {
            alert(JSON.stringify(result));
            alert("error: checkRobot");
        }

    });

    if (name.hasClass('is-valid') && IP.hasClass('is-valid')) {
        $.ajax({
            type: 'POST',
            url: '/createNewRobot/',
            data: {
                name: nameVal,
                IP: IPVal,
                model: modelVal,
                port: portVal,
                camera: cameraVal,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },

            success: function () {
                $('#modalNewRobot').modal('toggle');
                $('#modalNewRobotConfirm').modal('toggle');
            },

            error: function () {
                alert("error: newRobot");
            }
        });
    } else {
        $('#NewRobotName').removeClass('is-valid');
        $('#NewRobotIP').removeClass('is-valid');
    }
}

function editRobot(id, name, IP, model, port, camera) {
    let nameVal = name.val();
    let IPVal = IP.val();
    let modelVal = model.val();
    let portVal = port.val();
    let cameraVal = camera.val();

    $.ajax({
        type: 'POST',
        url: '/checkEditRobot/',
        dataType: 'JSON',
        async: false,
        data: {
            id: id,
            name: nameVal,
            IP: IPVal,
            model: modelVal,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            if (result.nameExist === true) {
                name.addClass('is-invalid');
                name.removeClass('is-valid');
                $('#EditRobotErrorName').css("color", "red");
                $('#EditRobotErrorName').html("<i class=\"fas fa-times-circle\"></i> Name already exists");
            } else {
                name.removeClass('is-invalid');
                name.addClass('is-valid');
                $('#EditRobotErrorName').css("color", "green");
                $('#EditRobotErrorName').html("<i class='fas fa-check-circle'></i> Correct");
            }

            if (result.IPExist === true) {
                IP.addClass('is-invalid');
                IP.removeClass('is-valid');
                $('#EditRobotErrorIP').css("color", "red");
                $('#EditRobotErrorIP').html("<i class=\"fas fa-times-circle\"></i> IP already exists");
            } else {
                IP.removeClass('is-invalid');
                IP.addClass('is-valid');
                $('#EditRobotErrorIP').css("color", "green");
                $('#EditRobotErrorIP').html("<i class='fas fa-check-circle'></i> Correct");
            }
        },

        error: function (result) {
            alert("error: checkEditRobot");
        }

    });

    if (name.hasClass('is-valid') && IP.hasClass('is-valid')) {
        $.ajax({
            type: 'POST',
            url: '/editRobot/',
            data: {
                id: id,
                name: nameVal,
                IP: IPVal,
                model: modelVal,
                port: portVal,
                camera: cameraVal,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },

            success: function () {
                $('#modalEditRobot').modal('toggle');
                $('#modalEditRobotConfirm').modal('toggle');
            },

            error: function (result) {
                alert(JSON.stringify(result));
                alert("error: editRobot");
            }
        });
    }
}

function editMyRobot(robotnameOld, robotnameNew, username) {
    if (robotnameOld === robotnameNew) {
        $('#EditMyRobotErrorName').css("color", "red");
        $('#EditMyRobotErrorName').html("<i class=\"fas fa-times-circle\"></i> The name is the same as the previous one");
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/checkEditMyRobot/',
        dataType: 'JSON',
        async: false,
        data: {
            robotnameOld: robotnameOld,
            robotnameNew: robotnameNew,
            username: username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            if (result.nameExist === true) {
                $('#EditMyRobotName').addClass('is-invalid');
                $('#EditMyRobotName').removeClass('is-valid');
                $('#EditMyRobotErrorName').css("color", "red");
                $('#EditMyRobotErrorName').html("<i class=\"fas fa-times-circle\"></i> Name already exists");
            } else {
                $('#EditMyRobotName').removeClass('is-invalid');
                $('#EditMyRobotName').addClass('is-valid');
                $('#EditMyRobotErrorName').css("color", "green");
                $('#EditMyRobotErrorName').html("<i class='fas fa-check-circle'></i> Correct");
            }
        },

        error: function (result) {
            alert(JSON.stringify(result));
            alert("error: checkEditMyRobot");
        }

    });

    if ($('#EditMyRobotName').hasClass('is-valid')) {
        $.ajax({
            type: 'POST',
            url: '/editMyRobot/',
            data: {
                robotnameOld: robotnameOld,
                robotnameNew: robotnameNew,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },

            success: function (result) {
                $('#modalEditMyRobot').modal('toggle');
                $('#modalEditMyRobotConfirm').modal('toggle');
            },

            error: function (result) {
                alert(JSON.stringify(result));
                alert("error: editRobot");
            }
        });
    }
}

function MyNewRobot(name, code, user) {
    let nameVal = name.val();
    let robotpk = code.val();
    $('#MyNewRobotErrorName').html("");
    $('#MyNewRobotErrorCode').html("");

    if (nameVal.trim() === '') {
        $('#MyNewRobotErrorName').css("color", "red");
        $('#MyNewRobotErrorName').html("<i class=\"fas fa-times-circle\"></i> Enter robot name");
    } else {
        $('#MyNewRobotErrorName').css("color", "green");
        $('#MyNewRobotErrorName').html("<i class='fas fa-check-circle'></i> Correct");
    }
    if (robotpk.trim() === '') {
        $('#MyNewRobotErrorCode').css("color", "red");
        $('#MyNewRobotErrorCode').html("<i class=\"fas fa-times-circle\"></i> Enter robot code");
    } else {
        $('#MyNewRobotErrorCode').css("color", "green");
        $('#MyNewRobotErrorCode').html("<i class='fas fa-check-circle'></i> Correct");
    }
    if (robotpk.trim() === '' || nameVal.trim() === '') {
        return
    }

    $.ajax({
        type: 'POST',
        url: '/checkMyRobot/',
        dataType: 'JSON',
        async: false,
        data: {
            name: nameVal,
            robotpk: robotpk,
            username: user,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            if (result.nameExist === true) {
                name.addClass('is-invalid');
                name.removeClass('is-valid');
                $('#MyNewRobotErrorName').css("color", "red");
                $('#MyNewRobotErrorName').html("<i class=\"fas fa-times-circle\"></i> Name already exists");
            } else {
                name.removeClass('is-invalid');
                name.addClass('is-valid');
                $('#MyNewRobotErrorName').css("color", "green");
                $('#MyNewRobotErrorName').html("<i class='fas fa-check-circle'></i> Correct");
            }

            if (result.robotExist === false) {
                code.addClass('is-invalid');
                code.removeClass('is-valid');
                $('#MyNewRobotErrorCode').css("color", "red");
                $('#MyNewRobotErrorCode').html("<i class=\"fas fa-times-circle\" style='color: red'></i> No robot with this code");
            } else {
                code.removeClass('is-invalid');
                code.addClass('is-valid');
                $('#MyNewRobotErrorCode').css("color", "green");
                $('#MyNewRobotErrorCode').html("<i class='fas fa-check-circle'></i> Correct");

                if (result.robotAssigned === true) {
                    code.addClass('is-invalid');
                    code.removeClass('is-valid');
                    $('#MyNewRobotErrorCode').css("color", "red");
                    $('#MyNewRobotErrorCode').html("<i class=\"fas fa-times-circle\"></i> Robot already associated");
                } else {
                    code.removeClass('is-invalid');
                    code.addClass('is-valid');
                    $('#MyNewRobotErrorCode').css("color", "green");
                    $('#MyNewRobotErrorCode').html("<i class='fas fa-check-circle'></i> Correct");
                }
            }
        },

        error: function (result) {
            alert(JSON.stringify(result));
            alert("error: checkRobot");
        }

    });

    if (name.hasClass('is-valid') && code.hasClass('is-valid')) {
        $.ajax({
            type: 'POST',
            url: '/createMyNewRobot/',
            data: {
                name: nameVal,
                robotpk: robotpk,
                username: user,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },

            success: function () {
                $('#modalMyNewRobot').modal('toggle');
                $('#modalMyNewRobotConfirm').modal('toggle');
            },

            error: function (result) {
                alert(JSON.stringify(result));
                alert("error: newRobot");
            }
        });
    }
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
            if (result === 'ConnectionRefusedError' || result === 'com_error') {
                 $('#errorSelectRobotNewObject').html("<i class=\"fas fa-times-circle\" style='color: red'></i> Camera of this robot not connected");
                $('#modalNewObject').modal('hide');
                $('#modalSelectRobotNewObject').modal('show');
            } else {
                $('#newObjectImg').css('opacity', '1');
                $("#newObjectImg").css('padding','');
                $('#newObjectImg').attr("src", "../../static/images/objects/" + username + "_" + object + "_contour.png?" + Date.now());
                $('#spinnerNewObject').html("");
            }

        },

        error: function (result) {
            alert('ERROR: takeShot');
            alert(JSON.stringify(result));
        }
    });
}

function deleteObjectImage(username) {
    let object_name = $('#modalNewObject').attr('object');
    $.ajax({
        type: 'POST',
        url: '/deleteImageObject/',
        data: {
            object_name: object_name,
            object_owner: username,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {

        },

        error: function (result) {
            alert('ERROR: deleteImageObject');
            alert(JSON.stringify(result));
        }
    });
}


function openModalSelectRobotNewObject($this) {
    $('#errorSelectRobotNewObject').html("");
    $('#errorSelectRobotObjectName').html("");
    $('#errorSelectRobotObjectKeywords').html("");
    $('#errorPositionApproachNewObject').html("");
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
    let $username = $($this).attr('user');
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
                $('#errorSelectRobotNewObject').html("<i class=\"fas fa-times-circle\" style='color: red'></i> No robot associated to your account");
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

function openModalNewLocation($this) {
    $('#errorPositionNewLocation').html("");
    $('#newLocationName').val("");
    $('#newLocationSelectRobot')
        .find('option')
        .remove()
        .end()
        .append('<option disabled selected value hidden>Select robot ...</option>')
    ;
    let $username = $($this).attr('user');
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
                $('#newLocationErrorSelectRobot').html("<i class=\"fas fa-times-circle\" style='color: red'></i> No robot associated to your account");
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

function openModalNewAction($this) {
    $('.action_list_point').html("");
    $('#errorPositionNewAction').html("");
    $('#newActionName').val("");
    $('#newActionSelectRobot')
        .find('option')
        .remove()
        .end()
        .append('<option disabled selected value hidden>Select robot ...</option>')
    ;
    let $username = $($this).attr('user');
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
                $('#newActionErrorSelectRobot').html("<i class=\"fas fa-times-circle\" style='color: red'></i> No robot associated to your account");
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

function openModalNewObject(user) {
    let username = user;
    let noError = true;
    let robot = $('#SelectRobotNewObject').val();
    let object = $('#SelectRobotObjectName').val().toLowerCase();
    let keywords = $('#SelectRobotObjectKeywords').val();
    let force = $('#newObjectForceRange').val();
    let height = $('#modalSelectRobotNewObject').attr('heightObject');
    let shared = "False";
    if ($('#checkboxSelectRobotNewObject').is(':checked')) {
        shared = "True";
    }
    $('#errorSelectRobotNewObject').html("");
    $('#errorSelectRobotObjectName').html("");
    $('#errorPositionApproachNewObject').html("");
    $('#errorSelectRobotObjectKeywords').html("");
    if (robot == null) {
        $('#errorSelectRobotNewObject').html("<i class=\"fas fa-times-circle\" style='color: red'></i> No robot selected");
        noError = false;
    }
    if (height == null) {
        $('#errorPositionApproachNewObject').css("color", "red");
        $('#errorPositionApproachNewObject').html("<i class=\"fas fa-times-circle\" style='color: red'></i> No position received");
        noError = false;
    }
    if (object === '') {
        $('#errorSelectRobotObjectName').html("<i class=\"fas fa-times-circle\" style='color: red'></i> No name selected");
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
                    $('#errorSelectRobotObjectName').html("<i class=\"fas fa-times-circle\" style='color: red'></i> Object name already exist");
                    noError = false;
                } else if (result.keywordExist == true) {
                    $('#errorSelectRobotObjectName').html("<i class=\"fas fa-times-circle\" style='color: red'></i> Object name is already a keyword of another object");
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
                $('#errorSelectRobotObjectKeywords').html("<i class=\"fas fa-times-circle\" style='color: red'></i> Keywords already exist: " + result.keywordFound);
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
        $('#modalNewObject').attr('force', force);
        $('#modalNewObject').attr('heightObject', height);
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

function readImgQr(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#qrCodeImg')
                .attr('src', e.target.result)
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function useCamera() {
    let scanner = new Instascan.Scanner({video: document.getElementById('previewVideoQr')});
    scanner.addListener('scan', function (content) {
        $('#descriptionSearchQr').text(content);
        $('#errorQRCodeReturn').html("<i class='fas fa-check-circle'></i> Information acquired");
        $('#errorQRCodeReturn').css('color','green');
        scanner.stop();
        $("previewVideoQr").attr('poster','../../static/images/camera.png');
    });
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error('No cameras found.');
        }
    }).catch(function (e) {
        console.error(e);
    });
}

function returnQrCode() {
    let code = $('#descriptionSearchQr').html();
    if (!isNaN(code) && code.trim() !== '') {
        $('#MyNewRobotCode').val(code);
        $('#modalSearchQr').modal('hide');
    } else {
        $('#errorQRCodeReturn').css('color','red');
        $('#errorQRCodeReturn').html("<i class=\"fas fa-times-circle\"></i> Information empty or it's not a number")
    }
}

function modifyTask() {
    let taskowner = $('#modalModifyTask').attr('task_owner');
    let taskname = $('#modalModifyTask').attr('taskname');
    let input_shared = "False";
    let find = false;
    if ($('#sharedModifyTask').is(':checked')) {
        input_shared = "True";
    }

    $.ajax({
        type: 'POST',
        url: '/checkTaskNameModify/',
        dataType: 'json',
        async: false,
        data: {
            username: taskowner,
            shared: input_shared,
            taskname: taskname,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (result) {
            if (result.nameExist === true) {
                find = true;
            }
        },

        error: function (result) {
            alert("ERROR: checkTaskNameModify");
            alert(JSON.stringify(result))
        }
    });
    if (find === true) {
        $('#errorModifyTask').text("<i class=\"fas fa-times-circle\" style='color: red'></i> Not possible to make 'Shared' this task: name already exists");
    } else {
        $.ajax({
            type: 'POST',
            url: '/modifyTask/',
            data: {
                shared: input_shared,
                taskname: taskname,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },

            success: function (result) {
                $('#modalModifyTask').modal('hide');
                $('#modalModifyTaskConfirm').modal('show');
            },

            error: function (result) {
                alert(JSON.stringify(result));
                alert("ERROR: modifyTask")
            }
        });
        $('#modalModifyTask').modal('hide');
    }
}

function saveChangesObject(user, object) {
    let username = user;
    let object_name = object;
    let input_shared = "False";
    let NoError = true;
    if ($('#inputSharedObjectDetail').is(':checked')) {
        input_shared = "True";
    }
    let keywords = $('#inputKeywordsObjectDetails').val();
    let force = $('#modifyObjectForceRange').val();
    let height = $('#modalObjectDetails').attr('heightObject');
    $.ajax({
        type: 'POST',
        url: '/keywordExistSaveChanges/',
        dataType: 'JSON',
        async: false,
        data: {
            shared: input_shared,
            username: username,
            object: object_name,
            keywords: keywords,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            if (result.keywordExist) {
                NoError = false;
                $('#errorKeywordsSaveChanges').html("<i class=\"fas fa-times-circle\" style='color: red'></i> Keywords already exist: " + result.keywordFound);
            }
        },

        error: function (result) {
            alert(JSON.stringify(result));
            alert("ERROR: keywordExistSaveChanges")
        }
    });

    if (NoError) {
        $.ajax({
            type: 'POST',
            url: '/objectSaveChanges/',
            data: {
                username: username,
                object: object_name,
                keywords: keywords,
                shared: input_shared,
                force: force,
                height: height,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },

            success: function () {
                $('#modalObjectDetails').modal('hide');
                $('#modalObjectDetailsConfirmChanges').modal('show');
            },

            error: function (result) {
                alert(JSON.stringify(result));
                alert("ERROR: objectSaveChanges")
            }
        });
    }
}

function takePosition($this) {
    $('#btnTakePositionLocation').attr("disabled", true);
    $('#errorPositionNewLocation').css("color", "black");
    $('#newLocationErrorSelectRobot').html('');
    let username = $this;
    let robot = $('#newLocationSelectRobot').val();
    if (robot == null) {
        $('#newLocationErrorSelectRobot').html('<i class="fas fa-times-circle"></i> No robot selected');
        $('#errorPositionNewLocation').html('<i class="fas fa-times-circle"></i> No robot selected');
        $('#errorPositionNewLocation').css("color", "red");
        $('#btnTakePositionLocation').attr("disabled", false);
        return
    }
    $('#errorPositionNewLocation').html("  <i class=\"fa-2x fas fa-cog fa-spin\"></i>");
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
                $('#errorPositionNewLocation').html('<i class="fas fa-times-circle"></i> Robot not connected');
                $('#errorPositionNewLocation').css("color", "red");
                $('#btnTakePositionLocation').attr("disabled", false);
                return
            }
            $('#modalNewLocation').attr('position', result);
            $('#errorPositionNewLocation').css('color', 'green');
            $('#errorPositionNewLocation').html("&ensp;<i class=\'fas fa-check-circle\'></i>&ensp;New position received");
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
            if (result === 'ConnectionRefusedError' || result === 'TimeoutError') {
                $('#errorSelectRobotNewObject').html("<i class=\"fas fa-times-circle\"></i> Robot not connected");
                $('#takePositionObjectButton').attr("disabled", false);
                $('#errorPositionApproachNewObject').css('color', 'red');
                $('#errorPositionApproachNewObject').html("&ensp;<i class=\"fas fa-times-circle\"></i> Robot not connected");
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

function takePositionEditObject($this) {
    $('#takePositionModifyObject').attr("disabled", true);
    $('#errorPositionDetailObject').html("");
    let username = $this;
    let robot = $('#SelectRobotEditObject').val();
    if (robot == null) {
        $('#errorSelectRobotEditObject').html('<i class="fas fa-times-circle"></i> No robot selected');
        $('#errorPositionDetailObject').css("color", "red");
        $('#errorPositionDetailObject').html("<i class=\"fas fa-times-circle\"></i> No robot selected");
        $('#takePositionModifyObject').attr("disabled", false);
        return
    }else{
        $('#errorPositionDetailObject').html("");
        $('#errorSelectRobotEditObject').html("");
    }
    $('#errorPositionDetailObject').css("color", "black");
    $('#errorPositionDetailObject').html("  <i class=\"fa-2x fas fa-cog fa-spin\"></i>");
    let userPk;
    $.ajax({
        type: "POST",
        url: '/getUserIdFromUsername/',
        dataType: 'json',
        async: false,
        data:
            {
                username: username,
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
            if (result === 'ConnectionRefusedError' || result === 'TimeoutError') {
                $('#takePositionModifyObject').attr("disabled", false);
                $('#errorPositionDetailObject').css("color", "red");
                $('#errorPositionDetailObject').html('<i class=\"fas fa-times-circle\"></i> No robot connected');
                return
            }
            $('#modalObjectDetails').attr('heightObject', result);
            $('#errorPositionDetailObject').css('color', 'green');
            $('#errorPositionDetailObject').html("&ensp;<i class=\'fas fa-check-circle\'></i>&ensp;New position received");
            $('#takePositionModifyObject').attr("disabled", false);
        },

        error: function (result) {
            alert(JSON.stringify(result));
            alert("ERROR: takePositionObject")
        }

    });
}

function takePositionModifyLocation($this) {
    $('#btnTakePositionModifyLocation').attr("disabled", true);
    $('#errorTakePositionModifyLocation').html('');
    $('#errorTakePositionModifyLocation').css("color", "black");
    let username = $this;
    let robot = $('#modalModifyLocation').attr('locationrobot');
    $('#errorTakePositionModifyLocation').html("  <i class=\"fa-2x fas fa-cog fa-spin\"></i>");
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
            if (result === 'ConnectionRefusedError') {
                $('#errorTakePositionModifyLocation').css("color", "red");
                $('#errorTakePositionModifyLocation').html('<i class=\"fas fa-times-circle\"></i> No robot connected');
                $('#btnTakePositionModifyLocation').attr("disabled", false);
                return
            }
            $('#modalModifyLocation').attr('locationpositionModify', result);
            $('#errorTakePositionModifyLocation').css('color', 'green');
            $('#errorTakePositionModifyLocation').html("&ensp;<i class=\'fas fa-check-circle\'></i>&ensp;New position received");
            $('#btnTakePositionModifyLocation').attr("disabled", false);
        },

        error: function (result) {
            alert(JSON.stringify(result));
            alert("ERROR: takePositionLocation")
        }

    });
}

function takePositionAction($this) {
    $('#btnTakePositionAction').attr("disabled", true);
    $('#newActionErrorSelectRobot').html('');
    $('#errorPositionNewAction').css("color", "black");
    $('#errorTakePositionModifyAction').css("color", "black");
    $('#errorPositionNewAction').html("");
    $('#errorTakePositionModifyAction').html("  <i class=\"fa-2x fas fa-cog fa-spin\"></i>");
    let username = $this;
    let robot = $('#newActionSelectRobot').val();
    if (robot == null) {
        $('#newActionErrorSelectRobot').html('<i class=\"fas fa-times-circle\"></i> No robot selected');
        $('#errorPositionNewAction').css("color", "red");
        $('#errorPositionNewAction').html("<i class=\"fas fa-times-circle\"></i> No robot selected");
        $('#btnTakePositionAction').attr("disabled", false);
        return
    }
        $('#errorPositionNewAction').html("  <i class=\"fa-2x fas fa-cog fa-spin\"></i>");
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
            $('#errorPositionNewAction').html("");
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
                        $('#errorPositionNewAction').css("color", "red");
                $('#errorPositionNewAction').html("<i class=\"fas fa-times-circle\"></i> Robot not connected");
                $('#btnTakePositionAction').attr("disabled", false);
                return
            }
            $('#newActionErrorSelectRobot').html("");
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
        $('#errorPositionNewLocation').css("color", "red");
        $('#errorPositionNewLocation').html('<i class="fas fa-times-circle"></i> Position not saved');
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
                if (result.nameExist === true) {
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
        $('#errorPositionNewAction').html('&ensp;<i class="fas fa-times-circle"></i>&ensp;Position not saved');
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

function modifyLocation() {
    let location_name = $('#modalModifyLocation').attr('locationname');
    let location_owner = $('#modalModifyLocation').attr('locationowner');
    let location_position = $('#modalModifyLocation').attr('locationposition');
    let location_position_modify = $('#modalModifyLocation').attr('locationpositionmodify');
    let location_shared = "False";
    if ($('#sharedModifyLocation').is(':checked')) {
        location_shared = "True";
    }
    if (location_position_modify === undefined) {
        location_position_modify = location_position.replace(/'/g, '"');
        //$('#errorTakePositionModifyLocation').css("color", "red");
        //$('#errorTakePositionModifyLocation').html("<i class=\"fas fa-times-circle\"></i> No position registered");
        //return
    }
    let noError = true;
    $.ajax({
        type: 'POST',
        url: '/locationExistModify/',
        dataType: 'json',
        async: false,
        data: {
            shared: location_shared,
            name: location_name,
            owner: location_owner,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },

        success: function (result) {
            if (result.nameExist === true) {
                noError = false;
                $('#errorSharedModifyLocation').text('Name already exists')
            }
        },

        error: function (result) {
            alert('ERROR: locationExistModify');
            alert(JSON.stringify(result));
        }
    });

    if (noError === true) {
        alert(location_position_modify);
        $.ajax({
            type: 'POST',
            url: '/modifyLocation/',
            data: {
                shared: location_shared,
                name: location_name,
                owner: location_owner,
                position: location_position_modify,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },

            success: function (result) {
                $('#modalModifyLocation').modal('hide');
                $('#modalModifyLocationConfirm').modal('show');
            },

            error: function (result) {
                alert('ERROR: modifyLocation');
                alert(JSON.stringify(result));
            }
        });
    }
}

function openModalNewMyRobot() {
    $('#MyNewRobotName').val('');
    $('#MyNewRobotCode').val('');
    $('#MyNewRobotCheckConnection').html('');
    $('#MyNewRobotErrorName').html('');
    $('#MyNewRobotErrorCode').html('');
}

function openModalSearchQR() {
    $('#errorQRCodeReturn').html('');
    $('#descriptionSearchQr').html('');
    $('#qrCodeImg').attr('src', '../../static/images/image.png');
}