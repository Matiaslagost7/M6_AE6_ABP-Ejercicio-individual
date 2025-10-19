from django import forms

class ContactoForm(forms.Form):
    nombre = forms.CharField(label='Nombre', max_length=100, widget=forms.TextInput(attrs={'class': 'form-control'}))
    correo = forms.EmailField(label='Correo electrónico', widget=forms.EmailInput(attrs={'class': 'form-control'}))
    mensaje = forms.CharField(label='Mensaje', widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 5}))
