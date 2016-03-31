## Shortcut to ForeignKey's ID

Original from https://groups.google.com/forum/#!topic/django-users/lasb4HPWkng
___
Django does offer some optimization shortcuts for related fields. For example, if you were working with a **Choice** object in a variable called **choice**, you can access the database ID of the related question in two ways (in either a view or a template):

```
choice.question.id
choice.question_id
```

Both of these calls will result in the same value, the database ID of the **Question** model that the **Choice** belongs to. However, there is a big difference in how they get there.

- The first is the "standard" way to access information about related objects. The ORM tries to be lazy, so it doesn't try to fetch anything about the related **Question** unless needed (ie accessing anything `choice.question.*`). The first time it is called, a database hit is incurred to populate the **Question** object that is related to the **Choice** object. Once the **Question** object is populated, the ID of that object is returned.

- The second is less-known, but is used by programmers who are looking to lessen the stress on their database. It takes advantage of a *little magic provided by Django* that makes the raw ID of a related object available for use *without* hitting the database a second time (since the FK relationship has the raw ID stored, and it is used to pull the right related object). It uses the format of **foo_id** where **foo** is the name of the relationship.

It is mentioned here in this section of the docs:
https://docs.djangoproject.com/en/1.9/ref/models/querysets/#values

> If you have a field called **foo** that is a **ForeignKey**, the default `values()` call will return a dictionary key called **foo_id**, since this is the name of the *hidden model attribute* that stores the actual value (the **foo** attribute refers to the related model).
