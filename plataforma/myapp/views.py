from django.shortcuts import render, redirect
from django.db import models
from .models import Producto
from .forms import ContactoForm


# Create your views here.
def index(request):
    return render(request, 'index.html')

def productos(request):
    return render(request, 'productos.html')

def contacto(request):
    if request.method == 'POST':
        form = ContactoForm(request.POST)
        if form.is_valid():
            # Procesar el formulario
            nombre = form.cleaned_data['nombre']
            correo = form.cleaned_data['correo']
            mensaje = form.cleaned_data['mensaje']
            # Procesar el formulario (enviar email, guardar en base de datos, etc.)
            return render(request, 'contacto_exito.html', {'nombre': nombre})
    else:
        form = ContactoForm()
    return render(request, 'contacto.html', {'form': form})