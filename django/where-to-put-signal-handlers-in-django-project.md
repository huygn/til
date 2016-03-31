## Where to put signal handlers in a Django project
Original from:
- http://stackoverflow.com/a/29698337/4328963
- http://stackoverflow.com/a/22924754/4328963

___
Django 1.7+ now has the `AppConfig.ready` mechanism for this kind of case.

There's a good explanation here: http://chriskief.com/2014/02/28/django-1-7-signals-appconfig/

Basically:
```python
# myapp/signals/handlers.py
from django.db.models.signals import pre_save
from django.dispatch import receiver
from myapp.models import MyModel

@receiver(pre_save, sender=MyModel)
def my_handler(sender, **kwargs):
    pass
```
and
```python
# myapp/apps.py
from django.apps import AppConfig

class MyAppConfig(AppConfig):
    name = 'myapp'

    def ready(self):
        # import signal handlers
        import myapp.signals.handlers
```

Note: Defining `default_app_config = 'myapp.apps.MyAppConfig'` in `myapp/__init__.py` is not neccessary.
More info: https://docs.djangoproject.com/en/1.9/ref/applications/#configuring-applications

> You can make your application load this **AppConfig** subclass by default as follows:
```python
# rock_n_roll/__init__.py
default_app_config = 'rock_n_roll.apps.RockNRollConfig'
```
That will cause **RockNRollConfig** to be used when **INSTALLED_APPS** just contains `'rock_n_roll'`.
This allows you to make use of **AppConfig** features without requiring your users to update their **INSTALLED_APPS** setting.
Besides this use case, it’s best to avoid using **default_app_config** and instead specify the app config class in **INSTALLED_APPS** as described next.
