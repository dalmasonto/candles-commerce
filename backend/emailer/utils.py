from django.core.mail import get_connection


def send_emails(emails):
    connection = get_connection(
        from_email='Rhea Africa <no-reply@rhea.africa',
    )

    try:
        connection.open()
        connection.send_messages(emails)
        connection.close()
    except Exception as e:
        print("Exception sending emails:", e)
