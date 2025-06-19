from django.contrib import admin
from .models import ProductCategory, Product, ProductImage, Cart, CartItem, Order, OrderItem, Discount

# Register your models here.
admin.site.register([ProductCategory, Product, ProductImage, Cart, CartItem, Order, OrderItem, Discount])
