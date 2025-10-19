from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import Group
from django.contrib import messages
from .models import CustomUser
from myapp.models import Producto
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
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')
        
        # Validaciones básicas
        if not username:
            messages.error(request, 'Por favor ingresa tu nombre de usuario.')
            return render(request, 'login.html')
        
        if not password:
            messages.error(request, 'Por favor ingresa tu contraseña.')
            return render(request, 'login.html')
        
        # Verificar si el usuario existe
        try:
            user_obj = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            messages.error(request, f'El usuario "{username}" no existe.')
            return render(request, 'login.html')
        
        # Verificar si está activo
        if not user_obj.is_active:
            messages.error(request, 'Tu cuenta está inactiva. Contacta al administrador.')
            return render(request, 'login.html')
        
        # Autenticar usuario
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Verificar acceso admin si viene del admin
            next_url = request.GET.get('next', '')
            if '/admin/' in next_url and not user.is_staff:
                messages.error(request, 'No tienes permisos para acceder al área administrativa.')
                return render(request, 'login.html')
            
            login(request, user)
            messages.success(request, f'¡Bienvenido {username}!')
            
            # Redirigir
            if next_url:
                return redirect(next_url)
            else:
                return redirect('index')
        else:
            messages.error(request, f'Contraseña incorrecta para "{username}".')
    
    return render(request, 'login.html')

def logout_view(request):
    username = request.user.username if request.user.is_authenticated else None
    
    # Limpiar mensajes previos antes del logout
    storage = messages.get_messages(request)
    for _ in storage:
        pass  # Esto consume/limpia los mensajes anteriores
    
    logout(request)
    
    # Agregar solo el mensaje de despedida
    if username:
        messages.success(request, f'¡Hasta luego, {username}! Has cerrado sesión correctamente.')
    else:
        messages.info(request, 'Has cerrado sesión correctamente.')
    
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
    resultado = verificar_login_permiso(request, 'myapp_login.CrearProductoView')
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
    resultado = verificar_login_permiso(request, 'myapp_login.EditarProductoView')
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
    resultado = verificar_login_permiso(request, 'myapp_login.EliminarProductoView')
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
