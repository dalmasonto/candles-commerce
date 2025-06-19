from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator
from main.models import TimeStampedModel
from django.utils import timezone


class ProductCategory(TimeStampedModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    # Cloudinary fields
    cloudinary_url = models.URLField(blank=True, null=True)
    public_id = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            
        # If this image has a file but no Cloudinary URL yet, upload it to Cloudinary
        if self.image and not self.public_id and not self.cloudinary_url:
            from utils.cloudinary_utils import upload_file_to_cloudinary
            # Upload the file to Cloudinary
            result = upload_file_to_cloudinary(
                file=self.image,
                folder='categories',
                resource_type='image'
            )
            # Store the Cloudinary URL and public_id
            self.cloudinary_url = result.get('secure_url')
            self.public_id = result.get('public_id')
            
            # Create a reference to the uploaded file before clearing it
            image_file = self.image
            # Clear the image field to prevent local storage
            self.image = None
                
        super().save(*args, **kwargs)
        
    def delete(self, *args, **kwargs):
        # Delete from Cloudinary if we have a public_id
        if self.public_id:
            from utils.cloudinary_utils import delete_file_from_cloudinary
            try:
                delete_file_from_cloudinary(self.public_id)
            except Exception as e:
                # Log the error but continue with deletion
                print(f"Error deleting from Cloudinary: {e}")
        
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(TimeStampedModel):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()

    top_notes = models.TextField(null=True)
    middle_notes = models.TextField(null=True)
    base_notes = models.TextField(null=True)

    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0)])
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name='products')
    stock = models.PositiveIntegerField(default=0)

    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_on']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductImage(TimeStampedModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    alt_text = models.CharField(max_length=100, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    # Cloudinary fields
    cloudinary_url = models.URLField(blank=True, null=True)
    public_id = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ['order', 'created_on']

    def __str__(self):
        return f"{self.product.name} - Image {self.order}"
        
    def save(self, *args, **kwargs):
        # If this image has a file but no Cloudinary URL yet, upload it to Cloudinary
        if self.image and not self.public_id and not self.cloudinary_url:
            from utils.cloudinary_utils import upload_file_to_cloudinary
            # Upload the file to Cloudinary
            result = upload_file_to_cloudinary(
                file=self.image,
                folder='products',
                resource_type='image'
            )
            # Store the Cloudinary URL and public_id
            self.cloudinary_url = result.get('secure_url')
            self.public_id = result.get('public_id')
            
            # Create a reference to the uploaded file before clearing it
            image_file = self.image
            # Clear the image field to prevent local storage
            self.image = None
            
            # Save the model with Cloudinary data but no local file
            super().save(*args, **kwargs)
        else:
            # Normal save for other cases
            super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        # Delete from Cloudinary if we have a public_id
        if self.public_id:
            from utils.cloudinary_utils import delete_file_from_cloudinary
            try:
                delete_file_from_cloudinary(self.public_id)
            except Exception as e:
                # Log the error but continue with deletion
                print(f"Error deleting from Cloudinary: {e}")
        
        super().delete(*args, **kwargs)


class Cart(TimeStampedModel):
    session_id = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    shipping_address = models.TextField(null=True, blank=True)
    is_guest = models.BooleanField(default=True)
    is_ordered = models.BooleanField(default=False)

    total = models.DecimalField(blank=True, null=True, max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(blank=True, null=True, max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Cart {self.id} - {self.session_id}"

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    @property
    def subtotal(self):
        return sum(item.total_price for item in self.items.all())


class CartItem(TimeStampedModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at time of adding to cart

    class Meta:
        unique_together = ('cart', 'product')

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    @property
    def total_price(self):
        return self.quantity * self.price


class Discount(TimeStampedModel):
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    discount_type = models.CharField(
        max_length=10,
        choices=[
            ('percentage', 'Percentage'),
            ('fixed', 'Fixed Amount')
        ],
        default='percentage'
    )
    value = models.DecimalField(max_digits=10, decimal_places=2)  # Percentage or fixed amount
    min_purchase = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    max_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    usage_limit = models.PositiveIntegerField(null=True, blank=True)
    times_used = models.PositiveIntegerField(default=0)
    is_first_purchase = models.BooleanField(default=False)
    is_single_use = models.BooleanField(default=False)
    used_by = models.ManyToManyField('auth.User', blank=True, related_name='used_discounts')

    class Meta:
        ordering = ['-created_on']

    def __str__(self):
        return f"{self.code} - {self.get_discount_type_display()}"

    def is_valid(self, user=None, cart_total=None):
        if not self.is_active:
            return False, "Discount code is not active"

        if self.end_date < timezone.now():
            return False, "Discount code has expired"

        if self.start_date > timezone.now():
            return False, "Discount code is not yet active"

        if self.usage_limit and self.times_used >= self.usage_limit:
            return False, "Discount code usage limit reached"

        if self.is_single_use and user and user in self.used_by.all():
            return False, "Discount code has already been used"

        if self.is_first_purchase and user and user.order_set.exists():
            return False, "Discount code is only valid for first purchase"

        if self.min_purchase and cart_total and cart_total < self.min_purchase:
            return False, f"Minimum purchase amount of {self.min_purchase} required"

        return True, "Valid discount code"

    def calculate_discount(self, amount):
        if self.discount_type == 'percentage':
            discount = (amount * self.value) / 100
            if self.max_discount:
                discount = min(discount, self.max_discount)
        else:  # fixed amount
            discount = min(self.value, amount)
        return discount


class Order(TimeStampedModel):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    cart = models.OneToOneField(Cart, on_delete=models.SET_NULL, blank=True, null=True)
    order_number = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    shipping_address = models.TextField()
    billing_address = models.TextField()
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_code = models.ForeignKey(Discount, on_delete=models.SET_NULL, null=True, blank=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)
    tracking_number = models.CharField(max_length=100, blank=True)
    estimated_delivery = models.DateField(null=True, blank=True)
    payment_url = models.URLField(max_length=500, blank=True, null=True)

    is_paid = models.BooleanField(default=False)

    def __str__(self):
        return f"Order {self.order_number}"

    def save(self, *args, **kwargs):
        if not self.order_number:
            # Generate order number based on timestamp and random string
            import random
            import string
            timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
            random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            self.order_number = f"ORD-{timestamp}-{random_str}"
        super().save(*args, **kwargs)


class OrderItem(TimeStampedModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at time of purchase
    product_name = models.CharField(max_length=200)  # Store product name at time of purchase

    def __str__(self):
        return f"{self.quantity} x {self.product_name}"

    @property
    def total_price(self):
        return self.quantity * self.price


class Transaction(TimeStampedModel):
    # Transaction status choices (based on Pesapal's response)
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]

    # Required fields
    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name='transaction',
        blank=True,
        null=True
    )
    transaction_id = models.CharField(
        max_length=100,
        unique=True,
        help_text="Pesapal's unique transaction ID"
    )

    # We will obtain the amount after the callback and then compare it with what is in the order and confirm the order as paid
    amount = models.DecimalField(
        blank=True,
        null=True,
        max_digits=10,
        decimal_places=2,
        help_text="Amount paid"
    )
    currency = models.CharField(
        max_length=3,
        default='KES',
        help_text="Currency code (e.g., KES, USD)"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )

    # Additional fields (optional)
    payment_method = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="e.g., M-Pesa, Credit Card"
    )
    pesapal_merchant_reference = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Pesapal's merchant reference (if needed)"
    )
    pesapal_order_tracking_id = models.TextField(null=True)
    pesapal_redirect_url = models.TextField(null=True)
    transaction_init_info = models.JSONField(
        blank=True,
        null=True,
        help_text="Information received from pesapal when the tx was started"
    )

    # Call back information
    ipn_data = models.JSONField(
        blank=True,
        null=True,
        help_text="Raw IPN callback data from Pesapal for debugging"
    )
    all_transaction_info_after_callback = models.JSONField(
        blank=True,
        null=True,
        help_text="This field will be updated after we query the actual tx from pesapal and update transaction status here"
    )
    confirmation_code = models.CharField(blank=True, null=True, max_length=50)

    def __str__(self):
        return f"Transaction #{self.transaction_id} ({self.status})"

    class Meta:
        ordering = ['-created_on']
        verbose_name = "Payment Transaction"
        verbose_name_plural = "Payment Transactions"


class CallBackUrls(TimeStampedModel):
    url = models.URLField(blank=False, null=True, max_length=200)
    callback_url_id = models.TextField(blank=False, null=True)
    identifier = models.CharField(blank=True, default="active", max_length=20)
    name = models.CharField(blank=True, default="CallBack", max_length=20)