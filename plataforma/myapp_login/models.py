from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    class Meta:
        permissions = [
            ("InventarioView", "Permiso para ver el inventario"),
        ]