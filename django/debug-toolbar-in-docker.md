## Django Debug Toolbar not showing when using with Docker
(With a Django app inside a Docker container)

### Preface
Django Debug Toolbar comes with `INTERNAL_IPS` settings variable (can be a list of strings) to specify
which IP addresses are allowed to access the debug toolbar. The debug toolbar's middleware get the IP address from
`request.META['REMOTE_ADDR']` and then check if `INTERNAL_IPS` contains that IP, if `True`, the toolbar shows up.

One thing to note, if `settings.DEBUG = False`, the debug toolbar is totally disabled regardless.

### Fix it
Since we cannot assign a 'static' IP address to `INTERNAL_IPS` (Docker automatically assign bridge interface IPs),
we need to override the callback middleware that assigned to `SHOW_TOOLBAR_CALLBACK`.

Looking to their source code ([here](https://github.com/django-debug-toolbar/django-debug-toolbar/blob/master/debug_toolbar/middleware.py#L23) and [here](https://github.com/django-debug-toolbar/django-debug-toolbar/blob/master/debug_toolbar/settings.py#L26)),
I figured out we just need to remove the `settings.INTERNAL_IPS` checking part, and everything should work:
```python
# mysite/config/local.py
from django.conf import settings

def show_toolbar(request):
    if request.is_ajax():
        return False
    return bool(settings.DEBUG)
```
Then we also need to redefine `SHOW_TOOLBAR_CALLBACK` like so:
```python
# mysite/settings.py
DEBUG_TOOLBAR_CONFIG = {
    'SHOW_TOOLBAR_CALLBACK': 'mysite.config.local.show_toolbar'
}
```

See: https://gist.github.com/gnhuy91/55c9adba441653c558ebfeedf428fd50
