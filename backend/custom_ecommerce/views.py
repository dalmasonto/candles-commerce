from decimal import Decimal

from django.db.models import F, Sum
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_bulk import BulkModelViewSet

from customauth.permissions import HasCustomAPIKey
from main.authentication import AUTH_CLASS
from main.utils import StandardResultsSetPagination
from utils.checkout import Pesapal
from .filters import ProductFilter
from .models import (
    ProductCategory, Product, Cart, CartItem, Order, OrderItem, Discount, Transaction, CallBackUrls, ProductImage
)
from .permissions import IsAdminOrReadOnly, IsOwnerOrAdmin
from .serializers import (
    ProductCategorySerializer, ProductSerializer,
    CartSerializer, CartItemSerializer, OrderSerializer,
    DiscountSerializer, CallBackUrlsSerializer, TransactionSerializerBasic, ProductImageSerializer
)


class ProductCategoryViewSet(BulkModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer

    authentication_classes = [AUTH_CLASS]
    permission_classes = [HasCustomAPIKey | IsAdminOrReadOnly]

    pagination_class = StandardResultsSetPagination

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_on']
    ordering = ['name']

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        return queryset

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.products.exists():
            return Response(
                {"detail": "Cannot delete category that has associated products. Please remove or reassign the products first."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)


class ProductViewSet(BulkModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    authentication_classes = [AUTH_CLASS]
    permission_classes = [HasCustomAPIKey | IsAdminOrReadOnly]

    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'fragrance_notes', 'materials']
    ordering_fields = ['price', 'created_on', 'name']
    ordering = ['-created_on']

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        return queryset

    @action(detail=False, methods=['get'])
    def on_sale(self, request):
        queryset = self.get_queryset().filter(
            sale_price__isnull=False,
            sale_price__lt=F('price')
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        # You can implement your own logic for featured products
        queryset = self.get_queryset().order_by('?')[:8]  # Random 8 products
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsOwnerOrAdmin]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_on']
    ordering = ['-created_on']

    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        if self.request.user.is_staff:
            return Cart.objects.all()
        return Cart.objects.filter(session_id=self.request.session.session_key)

    def perform_create(self, serializer):
        if not self.request.session.session_key:
            self.request.session.create()
        serializer.save(session_id=self.request.session.session_key)

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        cart = self.get_object()
        serializer = CartItemSerializer(data=request.data)
        
        if serializer.is_valid():
            product = serializer.validated_data['product']
            quantity = serializer.validated_data.get('quantity', 1)
            
            # Check if item already exists in cart
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': quantity, 'price': product.sale_price or product.price}
            )
            
            if not created:
                cart_item.quantity += quantity
                cart_item.save()
            
            return Response(CartSerializer(cart).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def remove_item(self, request, pk=None):
        cart = self.get_object()
        product_id = request.data.get('product_id')
        
        try:
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
            cart_item.delete()
            return Response(CartSerializer(cart).data)
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Item not found in cart'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def update_quantity(self, request, pk=None):
        cart = self.get_object()
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')
        
        try:
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
            if quantity <= 0:
                cart_item.delete()
            else:
                cart_item.quantity = quantity
                cart_item.save()
            return Response(CartSerializer(cart).data)
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Item not found in cart'},
                status=status.HTTP_404_NOT_FOUND
            )


class DiscountViewSet(viewsets.ModelViewSet):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['code', 'description']
    ordering_fields = ['created_on', 'end_date']
    ordering = ['-created_on']

    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        return queryset

    @action(detail=False, methods=['post'])
    def validate_code(self, request):
        code = request.data.get('code')
        cart_total = request.data.get('cart_total')
        
        try:
            discount = Discount.objects.get(code=code, is_active=True)
            is_valid, message = discount.is_valid(
                user=request.user if request.user.is_authenticated else None,
                cart_total=cart_total
            )
            
            if is_valid:
                serializer = self.get_serializer(discount, context={
                    'request': request,
                    'cart_total': cart_total
                })
                return Response({
                    'is_valid': True,
                    'message': message,
                    'discount': serializer.data
                })
            else:
                return Response({
                    'is_valid': False,
                    'message': message
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Discount.DoesNotExist:
            return Response({
                'is_valid': False,
                'message': 'Invalid discount code'
            }, status=status.HTTP_404_NOT_FOUND)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    authentication_classes = [AUTH_CLASS]
    permission_classes = [IsOwnerOrAdmin | HasCustomAPIKey]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['status']
    ordering_fields = ['created_on', 'order_number']
    search_fields = ['order_number', 'tracking_number']
    ordering = ['-created_on']

    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        # return Order.objects.filter(email=self.request.user.email)
        return Order.objects.none()

    def perform_create(self, serializer):
        items_data = serializer.validated_data.pop("cart_items")

        # Create empty cart first
        cart_instance = Cart.objects.create()

        subtotal = Decimal("0.00")

        for item in items_data:
            product_id = item.get("product_id")
            quantity = item.get("quantity")

            product = get_object_or_404(Product, id=product_id)
            price = product.sale_price if product.sale_price is not None else product.price
            line_total = price * quantity
            subtotal += line_total

            CartItem.objects.create(
                cart=cart_instance,
                product=product,
                quantity=quantity,
                price=price
            )

        shipping_cost = Decimal(self.request.data.get("shipping_cost", "0.00"))
        tax = Decimal(self.request.data.get("tax", "0.00"))
        discount = Decimal("0.00")

        discount_code = serializer.validated_data.get("discount_code")
        if discount_code:
            discount = discount_code.calculate_discount(subtotal)
            discount_code.times_used += 1
            if self.request.user.is_authenticated:
                discount_code.used_by.add(self.request.user)
            discount_code.save()

        total = subtotal + shipping_cost + tax - discount

        cart_instance.total = total
        cart_instance.is_ordered = True
        cart_instance.save()

        # Set computed fields before saving
        serializer.validated_data["subtotal"] = subtotal
        serializer.validated_data["shipping_cost"] = shipping_cost
        serializer.validated_data["tax"] = tax
        serializer.validated_data["discount"] = discount
        serializer.validated_data["total"] = total
        serializer.validated_data["cart"] = cart_instance

        order = serializer.save()

        for cart_item in cart_instance.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.price,
                product_name=cart_item.product.name
            )
            
        # Initiate payment transaction with Pesapal
        try:
            pesapal = Pesapal()
            response = pesapal.submit_order_request(
                order.order_number,
                order.total,
                order.email,
                order.phone_number,
                f"Order #{order.order_number}",
                True
            )

            if response.get("status") == "200":
                # Create transaction record
                Transaction.objects.create(
                    order=order,
                    transaction_id=response.get("order_tracking_id"),
                    amount=order.total,
                    currency="KES",  # Adjust as needed
                    status="PENDING",
                    pesapal_order_tracking_id=response.get("order_tracking_id"),
                    pesapal_redirect_url=response.get("redirect_url"),
                    pesapal_merchant_reference=response.get("merchant_reference"),
                    transaction_init_info=response
                )
                
                # Add redirect URL to order response
                order.payment_url = response.get("redirect_url")
                order.save(update_fields=["payment_url"])
        except Exception as e:
            # Log the error but don't fail the order creation
            print(f"Payment initiation error: {str(e)}")
            # You might want to add proper logging here

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        print(request.user.is_staff, request.user.is_superuser)
        if not request.user.is_staff or not request.user.is_superuser:
            return Response(
                {'error': 'Only staff can update order status'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        order.save()
        
        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=['post'])
    def initiate_payment(self, request, pk=None):
        pesapal = Pesapal()

        response = pesapal.submit_order_request(5, 1, "dante@gmail.com", "+254706522473", "Order on Fragrance", True)

        error = response.get("error", None)
        if error and error.get("code", None) == "missing_unique_id":
            response = pesapal.submit_order_request(6, 1, "dante@gmail.com", "+254706522473", "Order on Fragrance", True)
        return Response({
            "data": response
        })

    @action(detail=True, methods=['post'])
    def check_payment_status(self, request, pk=None):
        pesapal = Pesapal()

        response = pesapal.check_payment_status("ee164173-2e0d-468f-a4e2-e05f575c6af6")

        return Response({
            "data": response
        })


class EcommerceStatsView(APIView):
    def get(self, request):
        # Get total sales
        total_sales = Order.objects.aggregate(total_sales=Sum('total'))['total_sales'] or 0
        total_orders = Order.objects.count()
        total_products = Product.objects.count()
        total_categories = ProductCategory.objects.count()
        total_discounts = Discount.objects.count()
        pending_transactions = Transaction.objects.filter(status="PENDING").count()
        completed_transactions = Transaction.objects.filter(status="COMPLETED").count()
        failed_transactions = Transaction.objects.filter(status="FAILED").count()

        return Response({
            'total_sales': total_sales,
            'total_orders': total_orders,
            'total_products': total_products,
            'total_categories': total_categories,
            'total_discounts': total_discounts,
            'transactions': {
                'pending_transactions': pending_transactions,
                'completed_transactions': completed_transactions,
                'failed_transactions': failed_transactions
            }
        })


class CallBackUrlsViewSet(viewsets.ModelViewSet):
    serializer_class = CallBackUrlsSerializer
    permission_classes = [IsAdminUser]
    queryset = CallBackUrls.objects.all()
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['identifier']
    ordering_fields = ['created_on']
    ordering = ['id']

    pagination_class = StandardResultsSetPagination


class ProductImagesViewSet(viewsets.ModelViewSet):
    serializer_class = ProductImageSerializer
    permission_classes = [IsAdminUser]
    queryset = ProductImage.objects.all()
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = []
    ordering_fields = ['created_on']
    ordering = ['id']

    pagination_class = StandardResultsSetPagination


class RegisterCallbackURLs(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        try:
            # Get URL and name from request data
            url = request.data.get('url')
            name = request.data.get('name', 'CallBack')
            
            if not url:
                return Response(
                    {'error': 'URL is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Initialize Pesapal and register the IPN URL
            pesapal = Pesapal()
            ipn_id = pesapal.register_ipn_url(url)
            
            if not ipn_id:
                return Response(
                    {'error': 'Failed to register callback URL with Pesapal'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Save to CallBackUrls model
            callback_url = CallBackUrls.objects.create(
                url=url,
                callback_url_id=ipn_id,
                name=name,
                identifier='active'
            )
            
            return Response({
                'message': 'Callback URL registered successfully',
                'ipn_id': ipn_id,
                'url': url
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


def initiate_checkout(request, order_id):
    pesapal = Pesapal()
    order = Order.objects.get(id=order_id)
    redirect_url = pesapal.submit_order_request(
        order_id=order.id,
        amount=order.total_amount,
        email=order.customer_email,
        phone=order.customer_phone,
        description=f"Payment for Order #{order.id}"
    )
    return Response({
        "payment_url": redirect_url
    })  # Redirects to Pesapal payment page


@api_view(['POST'])
def payment_callback(request):
    pesapal = Pesapal()
    if pesapal.handle_pesapal_callback(request.data):
        return Response({"message": "Payment processed successfully!"}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "Payment failed or already processed."}, status=status.HTTP_400_BAD_REQUEST)


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializerBasic
    permission_classes = [IsAdminUser]
    pagination_class = StandardResultsSetPagination
    queryset = Transaction.objects.all()
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['order_id']
    ordering_fields = ['created_on']
    ordering = ['id']
    
    def update(self, request, *args, **kwargs):
        """Disable update operations on transactions"""
        return Response(
            {"detail": "Transaction updates are not allowed for security reasons."}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    def partial_update(self, request, *args, **kwargs):
        """Disable partial update operations on transactions"""
        return Response(
            {"detail": "Transaction updates are not allowed for security reasons."}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    def destroy(self, request, *args, **kwargs):
        """Disable delete operations on transactions"""
        return Response(
            {"detail": "Transaction deletion is not allowed for security reasons."}, 
            status=status.HTTP_403_FORBIDDEN
        )
    