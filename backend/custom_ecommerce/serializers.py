from rest_framework import serializers
from drf_writable_nested import WritableNestedModelSerializer, UniqueFieldsMixin
from main.utils import BaseSerializer
from .models import (
    ProductCategory, Product, ProductImage,
    Cart, CartItem, Order, OrderItem, Discount, Transaction, CallBackUrls
)


class ProductImageSerializer(BaseSerializer, serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order', 'cloudinary_url', 'public_id', 'created_on']


class ProductCategorySerializer(BaseSerializer, serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = ProductCategory
        fields = ['id', 'name', 'slug', 'description', 'parent', 'image', 'cloudinary_url', 'public_id',
                 'is_active', 'children', 'product_count', 'created_on', 'updated_on']
        extra_kwargs = {
            'parent': {'required': False}
        }

    def get_children(self, obj):
        children = ProductCategory.objects.filter(parent=obj)
        return ProductCategorySerializer(children, many=True).data

    def get_product_count(self, obj):
        return obj.products.count()


class ProductSerializer(BaseSerializer, WritableNestedModelSerializer):
    _images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    images = ProductImageSerializer(many=True, required=False)
    category = ProductCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductCategory.objects.all(),
        write_only=True,
        source='category'
    )
    is_on_sale = serializers.SerializerMethodField()
    discount_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'top_notes', 'middle_notes', 'base_notes',
                    'price', 'sale_price', 'category', 'category_id', 'stock', 'is_active', '_images',
                  'images', 'is_on_sale', 'discount_percentage', 'created_on', 'updated_on']
        extra_kwargs = {
            'slug': {'read_only': True}
        }

    def get_is_on_sale(self, obj):
        # Handle both cases: when obj is a Product instance and when it's input data
        sale_price = obj.sale_price if hasattr(obj, 'sale_price') else obj.get('sale_price')
        price = obj.price if hasattr(obj, 'price') else obj.get('price')
        return bool(sale_price and sale_price < price)

    def get_discount_percentage(self, obj):
        sale_price = obj.sale_price if hasattr(obj, 'sale_price') else obj.get('sale_price')
        price = obj.price if hasattr(obj, 'price') else obj.get('price')
        if sale_price and price:
            discount = ((price - sale_price) / price) * 100
            return round(discount, 2)
        return 0

    def create(self, validated_data):
        # Extract images data - assuming the field is named '_images' in the input
        images_data = validated_data.pop('_images', [])

        # Create the product first
        product = Product.objects.create(**validated_data)

        # Process each image file
        for image_file in images_data:
            ProductImage.objects.create(
                product=product,
                image=image_file  # Assuming this is the File object
            )

        return product

    def update(self, instance, validated_data):
        # Extract images data if it exists
        images_data = validated_data.pop('_images', None)  # None indicates no images were provided

        # Update the product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Only process images if _images was explicitly provided in the request
        if images_data is not None:
            # First, clear existing images if you want to replace them
            # (Remove this if you want to keep existing images and add new ones)
            # instance.images.all().delete()

            # Add new images
            for image_file in images_data:
                ProductImage.objects.create(
                    product=instance,
                    image=image_file
                )

        return instance

    def validate(self, data):
        if 'sale_price' in data and data['sale_price']:
            if data['sale_price'] >= data['price']:
                raise serializers.ValidationError(
                    "Sale price must be less than regular price"
                )
        return data


class CartItemSerializer(BaseSerializer, serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_active=True),
        write_only=True,
        source='product'
    )
    total_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'price',
                 'total_price', 'created_on', 'updated_on']
        extra_kwargs = {
            'price': {'read_only': True}
        }

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1")
        return value

    def validate(self, data):
        product = data.get('product')
        quantity = data.get('quantity', 1)
        
        if product.stock < quantity:
            raise serializers.ValidationError(
                f"Only {product.stock} items available in stock"
            )
        return data


class CartSerializer(BaseSerializer, WritableNestedModelSerializer):
    items = CartItemSerializer(many=True, required=False)
    total_items = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Cart
        fields = ['id', 'session_id', 'email', 'phone_number', 'first_name',
                 'last_name', 'shipping_address', 'is_guest', 'is_ordered',
                 'items', 'total_items', 'subtotal', 'created_on', 'updated_on']
        extra_kwargs = {
            'session_id': {'read_only': True},
            'is_ordered': {'read_only': True}
        }


class OrderItemSerializer(BaseSerializer, serializers.ModelSerializer):
    total_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'product_name', 'total_price', 'created_on', 'updated_on']
        extra_kwargs = {
            'product': {'read_only': True},
            'product_name': {'read_only': True}
        }


class DiscountSerializer(BaseSerializer, serializers.ModelSerializer):
    is_valid = serializers.SerializerMethodField()
    validation_message = serializers.SerializerMethodField()

    class Meta:
        model = Discount
        fields = ['id', 'code', 'description', 'discount_type', 'value',
                 'min_purchase', 'max_discount', 'start_date', 'end_date',
                 'is_active', 'usage_limit', 'times_used', 'is_first_purchase',
                 'is_single_use', 'is_valid', 'validation_message',
                 'created_on', 'updated_on']
        extra_kwargs = {
            'times_used': {'read_only': True}
        }

    def get_is_valid(self, obj):
        request = self.context.get('request')
        cart_total = self.context.get('cart_total')
        is_valid, _ = obj.is_valid(
            user=request.user if request and request.user.is_authenticated else None,
            cart_total=cart_total
        )
        return is_valid

    def get_validation_message(self, obj):
        request = self.context.get('request')
        cart_total = self.context.get('cart_total')
        _, message = obj.is_valid(
            user=request.user if request and request.user.is_authenticated else None,
            cart_total=cart_total
        )
        return message


class TransactionSerializer(BaseSerializer, serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'order', 'transaction_id', 'amount', 'currency', 'status', 'status_display',
            'payment_method', 'pesapal_merchant_reference', 'pesapal_order_tracking_id',
            'pesapal_redirect_url', 'transaction_init_info', 'ipn_data', 
            'all_transaction_info_after_callback', 'confirmation_code',
            'created_on', 'updated_on'
        ]
        read_only_fields = fields  # Make all fields read-only
        extra_kwargs = {
            'transaction_init_info': {'read_only': True},
            'ipn_data': {'read_only': True},
            'all_transaction_info_after_callback': {'read_only': True},
            'order': {'read_only': True},
            'transaction_id': {'read_only': True},
            'amount': {'read_only': True},
            'currency': {'read_only': True},
            'status': {'read_only': True},
            'payment_method': {'read_only': True},
            'pesapal_merchant_reference': {'read_only': True},
            'pesapal_order_tracking_id': {'read_only': True},
            'pesapal_redirect_url': {'read_only': True},
            'confirmation_code': {'read_only': True},
            'created_on': {'read_only': True},
            'updated_on': {'read_only': True}
        }


class OrderSerializer(BaseSerializer, UniqueFieldsMixin, WritableNestedModelSerializer):
    cart_items = serializers.ListField(
        child=serializers.DictField(), write_only=True, required=True
    )
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    discount_code = DiscountSerializer(read_only=True)
    discount_code_id = serializers.PrimaryKeyRelatedField(
        queryset=Discount.objects.filter(is_active=True),
        write_only=True,
        required=False,
        source='discount_code'
    )

    class Meta:
        model = Order
        fields = ['id', 'cart', 'order_number', 'status', 'status_display',
                 'shipping_address', 'billing_address', 'email', 'phone_number',
                 'first_name', 'last_name', 'subtotal', 'shipping_cost',
                 'tax', 'discount', 'discount_code', 'discount_code_id',
                 'total', 'notes', 'tracking_number', 'is_paid',
                 'estimated_delivery', 'payment_url', 'items', 'created_on', 'updated_on', 'cart_items',
                  "transaction"]
        extra_kwargs = {
            'order_number': {'read_only': True},
            'status': {'read_only': True},
            'subtotal': {'read_only': True},
            'total': {'read_only': True},
            'discount': {'read_only': True},
            'cart': {'read_only': True},
            'transaction': {'read_only': True},
            'is_paid': {'read_only': True},
        }

    def to_representation(self, instance):
        fields = self.get_fields()
        required_fields = set(fields.keys())
        if 'transaction' in required_fields:
            self.fields['transaction'] = TransactionSerializer(many=False)
        return super(OrderSerializer, self).to_representation(instance)


class CallBackUrlsSerializer(BaseSerializer, serializers.ModelSerializer):

    class Meta:
        model = CallBackUrls
        fields = ['id', 'url', 'callback_url_id', 'identifier', 'name', 'created_on', 'updated_on']


class TransactionSerializerBasic(BaseSerializer, serializers.ModelSerializer):
    order_amount = serializers.SerializerMethodField()
    order_items = serializers.SerializerMethodField()
    order_number = serializers.SerializerMethodField()
    
    class Meta:
        model = Transaction
        fields = ['id', 'transaction_id', 'amount', 'currency', 'status',
                 'payment_method', 'pesapal_merchant_reference', 'pesapal_order_tracking_id',
                 'pesapal_redirect_url', 'transaction_init_info', 'ipn_data', 
                 'all_transaction_info_after_callback', 'confirmation_code',
                 'order_amount', 'order_items', 'order_number',
                 'created_on', 'updated_on']
        read_only_fields = fields  # Make all fields read-only
        extra_kwargs = {
            'transaction_id': {'read_only': True},
            'amount': {'read_only': True},
            'currency': {'read_only': True},
            'status': {'read_only': True},
            'payment_method': {'read_only': True},
            'pesapal_merchant_reference': {'read_only': True},
            'pesapal_order_tracking_id': {'read_only': True},
            'pesapal_redirect_url': {'read_only': True},
            'transaction_init_info': {'read_only': True},
            'ipn_data': {'read_only': True},
            'all_transaction_info_after_callback': {'read_only': True},
            'confirmation_code': {'read_only': True},
            'created_on': {'read_only': True},
            'updated_on': {'read_only': True}
        }
    
    def get_order_amount(self, obj):
        if obj.order:
            return obj.order.total
        return None
    
    def get_order_items(self, obj):
        if obj.order:
            return OrderItemSerializer(obj.order.items.all(), many=True).data
        return []
    
    def get_order_number(self, obj):
        if obj.order:
            return obj.order.order_number
        return None