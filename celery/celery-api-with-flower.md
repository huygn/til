## Get Failed Celery tasks
Original from: http://stackoverflow.com/a/32859547/4328963
___
### Celery Flower
Celery doesn't make it easy to find a failed task but [Flower](https://github.com/mher/flower) (a Celery management web app) does simplify this.
It keeps a record of task IDs even after they are completed, and has an API to let you find only failed tasks.

Flower's rather basic HTTP API includes the `/api/tasks` endpoint - you can use `/api/tasks?state=FAILURE` to show only failed tasks,
then parse the JSON to extract what you need. The contents is similar to what you get in the web API,
and it's easy to prototype with `curl` and format/filter with [jq](https://robots.thoughtbot.com/jq-is-sed-for-json):
```shell
curl -s 'http://localhost:5555/api/tasks?state=FAILURE&limit=5' | jq . | less
```

You can also do lots of Celery things with Celery Flower [API](https://github.com/mher/flower#api):
- restart worker's pool
- call a task
- terminate executing task
- receive task completion events in real-time via WebSocket

Flower Web GUI shows tasks (active, finished, reserved, etc) in real time. It enables to filter tasks by time, workers and types.
Flower needs to be installed and running of course.

If you have millions of completed tasks, you may need to capture failed task info in a data store for efficient access - perhaps Flower will help.


### Celery handlers
You can always try a custom `on_failure` handler in Celery to capture just failed task info.
See Celery's [handlers](http://docs.celeryproject.org/en/latest/userguide/tasks.html#handlers).
