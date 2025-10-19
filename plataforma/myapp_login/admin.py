from django.contrib import admin
from .models import CustomUser

# Personalizar el sitio admin con títulos descriptivos
admin.site.site_header = "Panel de Administración - Solo Staff"
admin.site.site_title = "Admin Seguro"
admin.site.index_title = "Administración del Sistema"

# Registrar modelos en el admin
admin.site.register(CustomUser)