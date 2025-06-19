from django.contrib import messages

def add_form_errors_to_messages(request, error_dict):
    for field, errors in error_dict.items():
        for error in errors:
            error_message = error.get('message', '')
            messages.error(request, f"{field.capitalize()}: {error_message}", extra_tags='danger')