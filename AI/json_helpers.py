from .Command import Command


def json_to_object(json_object, type):  # helper function for json -> object

    if type == "unit_command":
        return Command(json_object['tile'], json_object['unit_command'], json_object['number_of_units'], json_object['direction'])


def json_to_object_list(json_list, type):  # turn list of json to list of objects
    objects = []

    if type == 'unit_command':  # checking type to allow other json -> object ops

        for json_obj in json_list:
            objects.append(json_to_object(json_obj, type))

        return objects
