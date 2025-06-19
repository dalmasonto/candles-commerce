from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.ProductCategoryViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'carts', views.CartViewSet, basename='cart')
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'discounts', views.DiscountViewSet)
router.register(r'callback-urls', views.CallBackUrlsViewSet)
router.register(r'transactions', views.TransactionViewSet)
router.register(r'product-images', views.ProductImagesViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', views.EcommerceStatsView.as_view(), name='ecommerce-stats'),
    path('register-callback-url/', views.RegisterCallbackURLs.as_view(), name='register-callback-url'),
    path('payment-callback/', views.payment_callback, name="payment-callback")
] 