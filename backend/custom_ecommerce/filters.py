import django_filters
from django.db.models import F
from .models import Product


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')
    category = django_filters.CharFilter(field_name='category__slug')
    on_sale = django_filters.BooleanFilter(method='filter_on_sale')
    in_stock = django_filters.BooleanFilter(method='filter_in_stock')
    fragrance_notes = django_filters.CharFilter(lookup_expr='icontains')
    materials = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Product
        fields = {
            'name': ['exact', 'icontains'],
            'category': ['exact'],
            'is_active': ['exact'],
        }

    def filter_on_sale(self, queryset, name, value):
        if value:
            return queryset.filter(sale_price__isnull=False, sale_price__lt=F('price'))
        return queryset

    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(stock__gt=0)
        return queryset 