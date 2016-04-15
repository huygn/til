## Delete multiple jobs at once
ref: http://stackoverflow.com/questions/5076246/hudson-ci-how-to-delete-all-jobs
___

Go to `Jenkins > Manage Jenkins > Script Console`

```groovy
for (j in jenkins.model.Jenkins.theInstance.getAllItems()) { 
    if (j.name.startsWith('nsight-1-')) {
        println(j.name)
        j.delete()
    }
}
```
This will print and delete all jobs that starts with `nsight-1-`.
