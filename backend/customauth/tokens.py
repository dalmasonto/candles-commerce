from django.contrib.auth.tokens import PasswordResetTokenGenerator
import six


class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        # Include more user attributes to make the token more secure
        # and ensure it becomes invalid if any of these attributes change
        return (
            six.text_type(user.pk) + 
            six.text_type(timestamp) + 
            six.text_type(user.is_active) +
            six.text_type(user.email) +
            six.text_type(user.last_login if user.last_login else '')
        )


account_activation_token = AccountActivationTokenGenerator()
