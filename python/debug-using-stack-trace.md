## Faster debugging using Stack Traces
Original link: http://www.kurtsp.com/monkey-patching-the-python-logging-module.html
___
If you ever wanted to debug a weird behavior of a function, and that function lies deep down in a forest of packages and inheritances,
this might be *the faster* way for you.

Open up the Python terminal and call that function by make it *throw an error*, for example:
```python
logging.error('asdflkj', 'hello')
```
Boom - stack trace! And the bottom function in that stack trace is what we wanted.
Nice trick that conveniently short-curcuits lots of work.

Lesson learned: **stack traces** are good for finding where errors occur, so if you want to find where something occurs,
**throw an error**, and then look at the stack trace!
