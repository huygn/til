## Metrics Collector as a Container
Thinks [Collectd](https://github.com/collectd/collectd), [Telegraf](https://github.com/influxdata/telegraf), Prometheus [node exporter](https://github.com/prometheus/node_exporter).

### Why
Normally these collectors will run as agents on a host machine, collect that machine's resource metrics such as cpu, mem, disk usage.
If deployed by normal binary files on every nodes, they work fine but you will loose service discovery features that Consul and Registrator
offer.

So, at some point we want to dockerize these collectors and deploy them to the Swarm cluster, it also make them easier to update.

### The problem
Resource collectors are made to collect resource metrics on the current host they are deployed on, when dockerized,
obviously they will collect metrics from their *container* (which is totally different from the current physical host machine).

### The solution
The common pattern is to mount current host filesystem into collector's container so they can collect the 'right' hardware metrics from host machine.
However, we cannot mount `-v /:/` since Docker does not support bind mount the whole filesystem to container,
which will cause lots of problems as Docker container have their own filesystem inside every containers.

Instead, we will mount the host filesystem to a new folder `-v /:/hostfs` and then modify collector's configuration to collect
metrics from that `/hostfs` filesystem we mounted.

#### Telegraf
```console
docker run -d --net=host --name=telegraf \
  -v /etc/telegraf/telegraf.config:/etc/telegraf/telegraf.config:ro \
  -v /:/hostfs:ro \
  -e HOST_MOUNT_PREFIX=/hostfs \
  -e HOST_ETC=/hostfs/etc \
  telegraf \
  -config /etc/telegraf/telegraf.config
```

#### Prometheus node exporter
```console
docker run -d -p 9100:9100 --net=host --name=node-exporter \
  -v "/proc:/host/proc" \
  -v "/sys:/host/sys" \
  -v "/:/rootfs" \
  prom/node-exporter \
  -collector.procfs /host/proc \
  -collector.sysfs /host/proc \
  -collector.filesystem.ignored-mount-points "^/(sys|proc|dev|host|etc)($|/)"
```

### References
- https://github.com/influxdata/telegraf/blob/master/plugins/inputs/system/DISK_README.md#configuration
- https://www.digitalocean.com/community/tutorials/how-to-install-prometheus-using-docker-on-ubuntu-14-04
