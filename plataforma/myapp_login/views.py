from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import Group
from django.contrib import messages
from .models import CustomUser
from myapp.models import Producto
from myapp.forms import ContactoForm
from .mixins import verificar_login_permiso, verificar_login

# Create your views here.
def register_view(request):
    class CustomUserCreationForm(UserCreationForm):
        class Meta:
            model = CustomUser
            fields = ('username', 'email', 'first_name', 'last_name', 'password1', 'password2')
    
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            group_name = request.POST.get('group')
            if group_name:
                group = Group.objects.get(name=group_name)
                user.groups.add(group) # Assign user to the selected group
            login(request, user)  # Log the user in after registration
            return redirect('index')  # Redirect to a success page.  
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})


def LoginView(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('index')
        else:
            messages.error(request, 'Credenciales inválidas. Inténtalo de nuevo.')
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('panel:login')

def inventario_view(request):
    """Vista para gestionar el inventario de productos. Requiere permisos específicos."""
    resultado = verificar_login_permiso(request, 'myapp_login.InventarioView')
    if resultado:
        return resultado

    productos = Producto.objects.all()
    return render(request, 'inventario.html', {'productos': productos})

def crear_producto_view(request):
    """Vista para crear un nuevo producto en el inventario."""
    resultado = verificar_login_permiso(request, 'myapp_login.InventarioView')
    if resultado:
        return resultado

    if request.method == 'POST':
        try:
            nombre = request.POST['nombre']
            descripcion = request.POST.get('descripcion', '')
            precio = float(request.POST['precio'])
            stock = int(request.POST.get('cantidad', 0))
            
            Producto.objects.create(
                nombre=nombre, 
                descripcion=descripcion, 
                precio=precio, 
                stock=stock
            )
            messages.success(request, f'Producto "{nombre}" creado exitosamente.')
            return redirect('panel:inventario')
        except (ValueError, KeyError) as e:
            messages.error(request, 'Error al crear el producto. Verifica los datos ingresados.')
    
    return render(request, 'crear_producto.html')

def editar_producto_view(request, producto_id):
    """Vista para editar un producto existente en el inventario."""
    resultado = verificar_login_permiso(request, 'myapp_login.InventarioView')
    if resultado:
        return resultado

    producto = get_object_or_404(Producto, id=producto_id)
    
    if request.method == 'POST':
        try:
            producto.nombre = request.POST['nombre']
            producto.descripcion = request.POST.get('descripcion', '')
            producto.precio = float(request.POST['precio'])
            producto.stock = int(request.POST.get('cantidad', 0))
            producto.save()
            
            messages.success(request, f'Producto "{producto.nombre}" actualizado exitosamente.')
            return redirect('panel:inventario')
        except (ValueError, KeyError) as e:
            messages.error(request, 'Error al actualizar el producto. Verifica los datos ingresados.')
    
    return render(request, 'editar_producto.html', {'producto': producto})

def eliminar_producto_view(request, producto_id):
    """Vista para eliminar un producto existente en el inventario."""
    resultado = verificar_login_permiso(request, 'myapp_login.InventarioView')
    if resultado:
        return resultado

    producto = get_object_or_404(Producto, id=producto_id)
    
    if request.method == 'POST':
        nombre_producto = producto.nombre
        confirmacion = request.POST.get('confirmacion', '')
        
        if confirmacion == nombre_producto:
            producto.delete()
            messages.success(request, f'Producto "{nombre_producto}" eliminado exitosamente.')
            return redirect('panel:inventario')
        else:
            messages.error(request, 'La confirmación no coincide con el nombre del producto.')
    
    return render(request, 'eliminar_producto.html', {'producto': producto})
