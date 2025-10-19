from django.urls import path
from . import views

# Namespace para las URLs administrativas
app_name = 'panel'

urlpatterns = [
    # AUTENTICACIÓN - Login, Register, Logout
    path('login/', views.LoginView, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),

    # GESTIÓN DE INVENTARIO - Requiere permisos específicos
    path('inventario/', views.inventario_view, name='inventario'),
    path('crear_producto/', views.crear_producto_view, name='crear_producto'),
    path('editar_producto/<int:producto_id>/', views.editar_producto_view, name='editar_producto'),
    path('eliminar_producto/<int:producto_id>/', views.eliminar_producto_view, name='eliminar_producto'),
]