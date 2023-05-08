import json
import boto3
import os
import time


def pushRequestToSQS(city, state, num_bedrooms, num_br_full, num_br_half, lot_size, living_area_size, email):
    sqs = boto3.client('sqs')  # don't need to specify access key rite?

    queue_url = "https://sqs.us-east-1.amazonaws.com/129616051474/LexHandlerToLF2"
    #print(location, cuisine, date, time, num_people, phone_num, email)

    # Send message to SQS queue
    # supported 'DataType': string, number, binary
    response = sqs.send_message(
        QueueUrl=queue_url,
        MessageBody=(
            'HousePriceEstimator Bot user input'
        ),
        MessageAttributes={
            'city': {
                'StringValue': city,
                'DataType': 'String'
            },
            'state': {
                'StringValue': state,
                'DataType': 'String'
            },
            'num_bedrooms': {
                'StringValue': str(num_bedrooms),
                'DataType': 'Number'
            },
            'num_br_full': {
                'StringValue': str(num_br_full),
                'DataType': 'Number'
            },
            'num_br_half': {
                'StringValue': str(num_br_half),
                'DataType': 'Number'
            },
            'lot_size': {
                'StringValue': str(lot_size),
                'DataType': 'Number'
            },
            'living_area_size': {
                'StringValue': str(living_area_size),
                'DataType': 'Number'
            },
            'email': {
                'StringValue': email,
                'DataType': 'String'
            }
        }
    )
    print("SQS messageID:" + str(response['MessageId']))
    return


def sendCloseResponseToUser(session_attributes, fulfillment_state, message):
    return {
        'sessionState': {
            'sessionAttributes': session_attributes,
            'dialogAction': {
                'type': 'Close'
            },
            'intent': {
                'state': fulfillment_state,  # ?? not just 'Fulfilled bc may have failed rite?'
                'name': 'HousePriceEstimatorIntent'
            },
        },
        'messages': [{'contentType': 'PlainText',
                      'content': message}]
    }
    return response


def parse_int(n):
    try:
        return int(n)
    except ValueError:
        return float('nan')


def build_validation_result(is_valid, violated_slot, message_content):
    if message_content is None:
        return {
            "isValid": is_valid,
            "violatedSlot": violated_slot
        }

    return {
        'isValid': is_valid,
        'violatedSlot': violated_slot,
        'message': message_content
    }


def validate_criteria(num_bedrooms, num_br_full, num_br_half, lot_size, living_area_size):

    if num_bedrooms is not None: # ?? can take this part out? I think so
        print('num_bedrooms: ', num_bedrooms)
        if num_bedrooms < 0:
            return build_validation_result(False,
                                           'num_bedrooms',
                                           'Sorry, but you must enter a (+) number')
        if num_bedrooms > 10:
            return build_validation_result(False,
                                           'num_bedrooms',
                                           'Sorry, but you must enter a (+) number at most 10')

    if num_br_full is not None:
        if num_br_full < 0:
            return build_validation_result(False,
                                           'num_br_full',
                                           'Sorry, but you must enter a (+) number')
        if num_br_full > 10:
            return build_validation_result(False,
                                           'num_br_full',
                                           'Sorry, but you must enter a (+) number at most 10')

    if num_br_half is not None:
        if num_br_half < 0:
            return build_validation_result(False,
                                           'num_br_half',
                                           'Sorry, but you must enter a (+) number')
        if num_br_half > 5:
            return build_validation_result(False,
                                           'num_br_half',
                                           'Sorry, but you must enter a (+) number at most 5')

    if lot_size:
        if lot_size < 0:
            return build_validation_result(False,
                                           'lot_size',
                                           'Sorry, but you must enter a (+) number')

    if living_area_size is not None:
        if living_area_size < 0:
            return build_validation_result(False,
                                           'living_area_size',
                                           'Sorry, but you must enter a (+) number')

    return build_validation_result(True, None, None)


def elicit_slot(session_attributes, slot_to_elicit, message):
    return {
        'sessionState': {
            'sessionAttributes': session_attributes,
            'dialogAction': {
                'slotToElicit': slot_to_elicit,
                'type': 'ElicitSlot',

            },
            'intent': {
                #    'state': '__', # ?? What should this state be? get something sessionState
                'name': 'HousePriceEstimatorIntent'
            }
        },
        'messages': [{'contentType': 'PlainText',
                      'content': message}]
    }


def delegate(session_attributes, slots):
    return {
        'sessionState': {
            'sessionAttributes': session_attributes,
            'dialogAction': {
                'type': 'Delegate',
            },
            'intent': {
                'state': 'ReadyForFulfillment',
                'name': 'HousePriceEstimatorIntent',
                'slots': slots
            }

        }

    }


def getNonInterpretableSlot(city, state, num_bedrooms, num_br_full, num_br_half, lot_size, living_area_size, email):
    if city is not None:
        if 'interpretedValue' not in city['value']:
            return 'city'
    if state is not None:
        if 'interpretedValue' not in state['value']:
            return 'state'
    if num_bedrooms is not None:
        if 'interpretedValue' not in num_bedrooms['value']:
            return 'num_bedrooms'

    if num_br_full is not None:
        print('num_br_full: ', num_br_full)
        if 'interpretedValue' not in num_br_full['value']:
            return 'num_br_full'

    if num_br_half is not None:
        if 'interpretedValue' not in num_br_half['value']:
            return 'num_br_half'

    if lot_size is not None:
        if 'interpretedValue' not in lot_size['value']:
            return 'lot_size'

    if living_area_size is not None:
        if 'interpretedValue' not in living_area_size['value']:
            return 'living_area_size'

    if email is not None:
        if 'interpretedValue' not in email['value']:
            return 'email'
    return None


def estimate_price(event):
    estimator_intent = event['sessionState']['intent']
    print('estimator_intent: ', estimator_intent)

    session_attributes = {}
    if event['sessionState']['sessionAttributes'] is not None:
        session_attributes = event['sessionState']['sessionAttributes']

    slots = estimator_intent['slots']

    city = slots['city']
    state = slots['state']
    num_bedrooms = slots['num_bedrooms']
    num_br_full = slots['num_br_full']
    num_br_half = slots['num_br_half']
    lot_size = slots['lot_size']
    living_area_size = slots['living_area_size']
    email = slots['email']

    '''If a value is not interpretable, return need to set that slot value to null so Lex can ask user for an (interpretable) value'''
    nonInterpretableSlot = getNonInterpretableSlot(city, state, num_bedrooms, num_br_full, num_br_half, lot_size, living_area_size, email)
    print('nonInterpretableSlot: ')
    print(nonInterpretableSlot)
    if nonInterpretableSlot is not None:
        '''Can do sth like this below if wanna give specific msgs for specific erronous cases
        # if nonInterpretableSlot == 'time':
        #     return elicit_slot(
        #         session_attributes,
        #         'time',
        #         'Please not only specify a # but also whether its \'am\' or \'pm\''
        #     ) '''

        # make slot -> None bc it must be respecified by user
        slots[nonInterpretableSlot] = None
        return delegate(session_attributes, slots)

    '''If reach here, there is an interpretable value'''
    if city is not None:
        city = city['value']['interpretedValue']
    if state is not None:
        state = state['value']['interpretedValue']
    if num_bedrooms is not None:
        num_bedrooms = int(num_bedrooms['value']['interpretedValue'])
    if num_br_full is not None:
        num_br_full = int(num_br_full['value']['interpretedValue'])
    if num_br_half is not None:
        num_br_half = int(num_br_half['value']['interpretedValue'])
    if lot_size is not None:
        lot_size = int(lot_size['value']['interpretedValue'])
    if living_area_size is not None:
        living_area_size = int(living_area_size['value']['interpretedValue'])
    if email is not None:
        email = email['value']['interpretedValue']

    if event['invocationSource'] == 'DialogCodeHook':
        # Check if slots are valid

        validation_result_assume_not_null = validate_criteria(num_bedrooms, num_br_full, num_br_half,
                                                              lot_size, living_area_size) # only one violated slot will be returned at a time
        print("validation result: ")
        print(validation_result_assume_not_null)
        if not validation_result_assume_not_null['isValid']:
            print("elicit slots")
            # This is bc we want this slot to be requested again (since currently has a non-null value, but a faulty one)
            # if it was null to begin with, then it'll just become null again
            slots[validation_result_assume_not_null['violatedSlot']] = None

            return elicit_slot(
                session_attributes,
                validation_result_assume_not_null['violatedSlot'],
                validation_result_assume_not_null['message']
            )
        ''' delegate(...) tells Lex to determine the next action (As specified myself in the Lex console-- Conversation flow),
            as determined by the session_attributes and slots '''

        print('Reached here right before delegate(...)')
        return delegate(session_attributes, slots)


    elif event['invocationSource'] == 'FulfillmentCodeHook':

        pushRequestToSQS(city, state, num_bedrooms, num_br_full, num_br_half, lot_size, living_area_size, email)
        print('pushed request to SQS')
        fulfillment_msg = "Thank you for the information. We will text you our recommendations soon."

        return sendCloseResponseToUser(session_attributes,
                                       'Fulfilled', fulfillment_msg)




# intent: an action that the user wants to perform
# intent_request: a user's request to perform an intent (action)
def invoke_intent(event):
    print('Event: ')
    print(event)
    intent_name = event['sessionState']['intent']['name']
    print('Intent name: ' + str(intent_name))

    if intent_name == "HousePriceEstimatorIntent":
        return estimate_price(event)


def lambda_handler(event, context):
    # Set timezone to do time checks
    os.environ['TZ'] = 'America/New_York'
    time.tzset()
    print(event)
    return invoke_intent(event)
