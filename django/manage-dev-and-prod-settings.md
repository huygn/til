## Manage development and production settings

Original from: http://stackoverflow.com/questions/10664244/django-how-to-manage-development-and-production-settings
___
Use the `DJANGO_SETTINGS_MODULE` environment variable and use two (or more) settings files,
e.g. `production_settings.py` and `test_settings.py`.

Since the `settings.py` file is stored in `mysite/settings.py` by default,
if you place your alternate settings files in the same directory, the line added to `bin/activate`
should read `DJANGO_SETTINGS_MODULE=mysite.test_settings`.

To extend original `settings.py` to, for example, `test_settings.py`:
```python
# mysite/test
from .settings import *

# override CACHES variable
# use dummy cache (equal to disable cache without removing cache methods)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}
```
