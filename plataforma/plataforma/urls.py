from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # PANEL DE ADMINISTRACIÓN DJANGO
    path('admin/', admin.site.urls),
    
    # URLs PÚBLICAS - Sin autenticación requerida
    path('', include('myapp.urls')),
    
    # URLs ADMINISTRATIVAS - Panel de gestión con autenticación
    path('panel/', include('myapp_login.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
