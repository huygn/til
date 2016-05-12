## `docker exec` in Swarm

When we call `docker exec` in Swarm, the command is sent to the appropriate node correctly,
but no output are shown:
```console
docker exec swarm-node-2/telegraf_telegraf_1 pwd
# no output
```

To get the output shows up on the current shell, use `exec -it`:
```console
docker exec -it swarm-node-2/telegraf_telegraf_1 pwd
/
```

#### Reference
- https://github.com/docker/swarm/issues/767#issuecomment-106652841
