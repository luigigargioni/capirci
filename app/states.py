from .robot_function import *


def move_to_object(object_id):
    # Parameters
    robot_ip = "169.254.165.133"
    port = 5007
    timeout = 2000
    # Start b-Cap Service
    client = bcapclient.BCAPClient(robot_ip, port, timeout)
    client.service_start("")
    # Connect to RC8
    controller = client.controller_connect("", "CaoProv.DENSO.VRC", "localhost", "")
    # Connect to Robot
    robot = client.controller_getrobot(controller, "Arm", "")
    # Get robot arm
    client.robot_execute(robot, "TakeArm", [0, 0])
    # Turn on the motor
    client.robot_execute(robot, "Motor", True)
    # Move the robot in position P1
    p1 = get_object_position(object_id)
    client.robot_move(robot, 1, p1, "")
    # Turn off the motor
    client.robot_execute(robot, "Motor", False)
    # Release robot arm
    client.robot_execute(robot, "GiveArm", None)
    # Disconnect
    client.robot_release(robot)
    client.controller_execute(controller, "ClearError")
    client.controller_disconnect(controller)
    client.service_stop()


# set Parameter
robotIp = "169.254.165.133"
port = 5007
timeout = 2000
name = ""
provider = "CaoProv.DENSO.VRC"
machine = "localhost"
option = ""


def get_object_position(obj):
    if obj.lower().strip() == "ball":
        return "J0", True  # ancora piu left

    if obj.lower().strip() == "Wine glass":
        return "J2", True

    return "", False


def get_location_position(location):
    if location.lower().strip() == "table":
        pose = "J4"
        return pose, True
    if location.lower().strip() == "box":
        pose = "J5"
        return pose, True
    return "", False


def open_gripper():
    print('open gripper')


def close_gripper():
    print('close gripper')


def find_object(object_id):
    return True


def example_for_loop(times, object_id, location_id):
    # Get robot arm
    client.robot_execute(robot, "TakeArm", [0, 0])
    # Turn on the motor
    client.robot_execute(robot, "Motor", True)

    for i in range(0, times):
        p0 = get_object_position(object_id)
        p1 = get_location_position(location_id)
        # Take the object in position p0
        pick_object(robot, p0)
        # Release the object in position p1
        place_object(robot, p1)

    # Turn off the motor
    client.robot_execute(robot, "Motor", False)
    # Release robot arm
    client.robot_execute(robot, "GiveArm", None)


def example_do_while(object_id, location_id):
    # Get robot arm
    client.robot_execute(robot, "TakeArm", [0, 0])
    # Turn on the motor
    client.robot_execute(robot, "Motor", True)

    while find_object(object_id):
        p0 = get_object_position(object_id)
        p1 = get_location_position(location_id)
        # Take the object in position p0
        pick_object(robot, p0)
        # Release the object in position p1
        place_object(robot, p1)

    # Turn off the motor
    client.robot_execute(robot, "Motor", False)
    # Release robot arm
    client.robot_execute(robot, "GiveArm", None)


def example_simple_pick_place(object_id, location_id):
    # Get robot arm
    client.robot_execute(robot, "TakeArm", [0, 0])
    # Turn on the motor
    client.robot_execute(robot, "Motor", True)

    p0 = get_object_position(object_id)
    p1 = get_location_position(location_id)
    # Take the object in position p0
    pick_object(robot, p0)
    # Release the object in position p1
    place_object(robot, p1)

    # Turn off the motor
    client.robot_execute(robot, "Motor", False)
    # Release robot arm
    client.robot_execute(robot, "GiveArm", None)


def pick_object(robot, p0):
    client.robot_execute(robot, "Approach", [1, p0, "@0 200"])
    client.robot_move(robot, 1, p0, "")
    open_gripper()
    close_gripper()
    client.robot_execute(robot, "Depart", [1, "@0 200"])


def place_object(robot, p1):
    client.robot_execute(robot, "Approach", [1, p1, "@0 200"])
    client.robot_move(robot, 1, p1, "")
    open_gripper()
    close_gripper()
    client.robot_execute(robot, "Depart", [1, "@0 200"])
