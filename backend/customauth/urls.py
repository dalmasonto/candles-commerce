from django.urls import path, include
from django_rest_passwordreset.views import ResetPasswordRequestTokenViewSet, ResetPasswordConfirmViewSet, \
    ResetPasswordValidateTokenViewSet
from rest_framework import routers
from .views import CustomLogin, ChangePasswordView, ActivateAccount, logout_user, check_user_logged_in, APIKeyListView, \
    DeleteAPIKeyView, CreateAPIKeyView

router = routers.DefaultRouter()
router.register(
    r'password-reset/validate-token',
    ResetPasswordValidateTokenViewSet,
    basename='reset-password-validate'
)
router.register(
    r'password-reset/confirm',
    ResetPasswordConfirmViewSet,
    basename='reset-password-confirm'
)
router.register(
    r'password-reset',
    ResetPasswordRequestTokenViewSet,
    basename='reset-password-request'
)
router.register(r"api-keys", APIKeyListView)


urlpatterns = [
    path('account/activate/', ActivateAccount.as_view()),
    path('login/', CustomLogin.as_view()),
    path('change-password/', ChangePasswordView.as_view()),
    path('logout/', logout_user),
    path('check-login-status/', check_user_logged_in),
    path('', include(router.urls)),
    # path('api-keys/', APIKeyListView.as_view()),
    path('api-keys-delete/', DeleteAPIKeyView.as_view()),
    path('create-api-key/', CreateAPIKeyView.as_view()),
]
