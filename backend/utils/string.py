def get_or_default(value: any, default: any = ""):
    return default if value is None else value


CHAT_MESSAGE_TIMES = "How many times do I have to perform this task?"
CHAT_MESSAGE_EVENT = "Is there an event for which I have to end the execution?"
CHAT_MESSAGE_MSG_NOT_UNDERSTAND = (
    "I did not understand what you said. Tell me again what to do."
)
CHAT_MESSAGE_QUESTION_GRAPHIC = "Do you want to see the program in graphical form?"
CHAT_MESSAGE_OPEN_GRAPHIC = "Wait please. I'm opening the program..."
CHAT_MESSAGE_NOT_OPEN_GRAPHIC = "Okay. You can open it in the task list."
CHAT_MESSAGE_ACTION = "Is there a processing to do on each object?"

CHAT_PROCESSING_OBJECT = "Which is the object to be taken?"
CHAT_PROCESSING_LOCATION = "Where should I put the {}?"
CHAT_PROCESSING_PICK_PLACE = "I have to put the {} in the {}"
