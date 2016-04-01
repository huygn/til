## Serving static files

Django does not support serving static files in production. However, the fantastic **WhiteNoise** project can integrate into your Django application (and WSGI applications as well), and was designed with exactly this purpose in mind.

See the **WhiteNoise** documentation for more details:
- http://whitenoise.evans.io/en/stable/index.html
- https://github.com/evansd/whitenoise

For serving static files in development, see: https://docs.djangoproject.com/en/1.9/howto/static-files/
