import requests
from django.conf import settings
from django.urls import reverse
from custom_ecommerce.models import Order, Transaction, CallBackUrls  # Assuming you have Order and Transaction models

class Pesapal:

    def __init__(self):
        self.consumer_key = settings.PESAPAL_CONSUMER_KEY
        self.consumer_secret = settings.PESAPAL_CONSUMER_SECRET
        self.base_url = settings.PESAPAL_BASE_URL  # Sandbox or Live URL
        self.callback_url = settings.PESAPAL_CALLBACK_URL  # Django endpoint for IPN

    def _generate_auth_token(self):
        """
        Authenticate with Pesapal API to get an access token.
        """
        auth_url = f"{self.base_url}/api/Auth/RequestToken"
        headers = {"Content-Type": "application/json"}
        payload = {
            "consumer_key": self.consumer_key,
            "consumer_secret": self.consumer_secret
        }
        response = requests.post(auth_url, json=payload, headers=headers)

        return response.json().get("token")

    def register_ipn_url(self, ipn_url=None):
        """
        Register an Instant Payment Notification (IPN) URL with Pesapal.
        Returns the registered IPN ID which should be stored in settings.

        Args:
            ipn_url (str): The URL to be registered for IPN. If None, uses the callback_url.
        """
        token = self._generate_auth_token()
        if not token:
            raise Exception("Failed to authenticate with Pesapal")

        register_url = f"{self.base_url}/api/URLSetup/RegisterIPN"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        # Use provided IPN URL or fall back to callback_url
        url_to_register = ipn_url or self.callback_url
        payload = {
            "url": url_to_register,
            "ipn_notification_type": "POST"  # Pesapal will POST payment updates to this URL
        }

        response = requests.post(register_url, json=payload, headers=headers)
        response_data = response.json()

        if response.status_code == 200 and response_data.get("url") == url_to_register:
            return response_data.get("ipn_id")  # This ID should be stored in settings as PESAPAL_IPN_ID
        else:
            raise Exception(f"Failed to register IPN: {response_data.get('error') or 'Unknown error'}")

    def submit_order_request(self, order_id, amount, email, phone, description, force_mpesa=False):
        """
        Submit payment request to Pesapal with optional M-Pesa forced checkout.
        Returns a redirect URL or triggers STK push (if M-Pesa is forced).
        """
        # ipn_reigistration = self.register_ipn_url("https://webhook.site/ee457311-e4d0-4e70-a35c-0e9d4ec534bb")
        token = self._generate_auth_token()
        if not token:
            raise Exception("Failed to authenticate with Pesapal")

        submit_url = f"{self.base_url}/api/Transactions/SubmitOrderRequest"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        pesapal_ipn_id = CallBackUrls.objects.filter(identifier="active").first()

        payload = {
            "id": str(order_id),
            "currency": "KES",
            "amount": float(amount),
            "description": description,
            "callback_url": self.callback_url,
            # "notification_id": settings.PESAPAL_IPN_ID,
            "notification_id": pesapal_ipn_id.callback_url_id,
            "billing_address": {
                "email_address": email,
                "phone_number": phone,  # Must be an M-Pesa-registered number
            }
        }

        # Force M-Pesa payment if supported by Pesapal's API
        if force_mpesa:
            payload["payment_method"] = "mpesa"  # Check Pesapal's API docs for exact key

        response = requests.post(submit_url, json=payload, headers=headers)
        response_data = response.json()

        # Pesapal may return an M-Pesa STK push trigger or redirect URL
        return response_data

    def check_payment_status(self, order_tracking_id):
        """
        Check the status of a transaction using the order_tracking_id.
        """
        token = self._generate_auth_token()
        if not token:
            raise Exception("Failed to authenticate with Pesapal")

        status_url = f"{self.base_url}/api/Transactions/GetTransactionStatus"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        params = {"orderTrackingId": order_tracking_id}
        response = requests.get(status_url, headers=headers, params=params)
        return response.json()  # Returns status (PENDING, COMPLETED, FAILED)

    def handle_pesapal_callback(self, request_data):
        """
        Handle Pesapal IPN (Instant Payment Notification) callback.
        Updates the order status in the database.
        """
        transaction_tracking_id = request_data.get("OrderTrackingId") # Transaction id
        merchant_reference = request_data.get("OrderMerchantReference") # Order Number
        order_notification_type = request_data.get("OrderNotificationType")

        # Update the order and transaction in the database
        try:
            order = Order.objects.get(order_number=merchant_reference)
            transaction, created = Transaction.objects.get_or_create(
                order=order,
                transaction_id=transaction_tracking_id
            )
            # We query pesapal with the tx_id to get all the information
            response = self.check_payment_status(transaction_tracking_id)

            transaction.ipn_data = request_data
            payment_status = response.get("payment_status_description")

            tx_status = "PENDING"
            if str.lower(payment_status) == "completed":
                tx_status = "COMPLETED"
                order.is_paid = True
                order.status = "paid"
            else:
                tx_status = "FAILED"

            transaction.status = tx_status
            transaction.amount = response.get("amount")
            transaction.payment_method = response.get("payment_method")
            transaction.confirmation_code = response.get("confirmation_code")
            transaction.all_transaction_info_after_callback = response

            # Update the db by saving the order and transaction
            transaction.save()
            order.save()

            # if not created:
            #     transaction.status = status
            #     transaction.save()
            #
            # # Additional logic (e.g., send email on success)
            # if status == "COMPLETED":
            #     self._send_payment_confirmation(order)
            return True
        except Exception as e:
            return False

    def _send_payment_confirmation(self, order):
        """
        (Private) Send a payment confirmation email to the customer.
        """
        # Implement email logic (e.g., Django send_mail)
        pass