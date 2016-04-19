## Messing with Docker container layers size
ref: http://stackoverflow.com/a/31586365/4328963
___
### Why?
- Interviewer: What if I added a `1GB` of files, then later remove `500MB` of files, what would be the final container size?
- Me: Err...

#### Create a Dockerfile
```dockerfile
FROM ubuntu:trusty

# layer size: 5.996 MB
RUN apt-get install -y wget
# layer size: 6.207 MB
RUN wget -q https://releases.hashicorp.com/consul/0.6.4/consul_0.6.4_linux_amd64.zip

# layer size: 72.21 MB, exactly same size as the copying 2 files
COPY skype-ubuntu-precise_4.3.0.37-1_i386.deb firefox-mozilla-build_42.0-0ubuntu1_amd64.deb /tmp/
# layer size: 0 B, remove 1 copied file
RUN rm -f /tmp/skype-ubuntu-precise_4.3.0.37-1_i386.deb
```

#### Build the container
```
$ docker build -t gnhuy91/test-size .
$ docker push gnhuy91/test-size:latest
```
`push` is optional - to inspect with [ImageLayers.io](https://imagelayers.io/).


### How to check the size
#### Run the container
```
$ docker run -d gnhuy91/test-size
```
#### Layers size
```
$ docker history -H gnhuy91/test-size
IMAGE               CREATED             CREATED BY                                      SIZE            COMMENT
3bf6a60b8fd5        26 minutes ago      /bin/sh -c rm -f /tmp/skype-ubuntu-precise_4.   0 B             delete 1 copied file
<missing>           26 minutes ago      /bin/sh -c #(nop) COPY multi:b647e6a077d35a3d   72.21 MB        copy 2 files
<missing>           26 minutes ago      /bin/sh -c wget https://releases.hashicorp.co   6.207 MB        download file
<missing>           27 minutes ago      /bin/sh -c apt-get install -y wget              5.996 MB        install wget
<missing>           5 days ago          /bin/sh -c #(nop) CMD ["/bin/bash"]             0 B             ubuntu:trusty base
<missing>           5 days ago          /bin/sh -c sed -i 's/^#\s*\(deb.*universe\)$/   1.895 kB        ubuntu:trusty base
<missing>           5 days ago          /bin/sh -c set -xe   && echo '#!/bin/sh' > /u   194.5 kB        ubuntu:trusty base
<missing>           5 days ago          /bin/sh -c #(nop) ADD file:ed7184ebed5263e677   187.8 MB        ubuntu:trusty base
```
#### Total size
```
$ docker ps -s -l
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                     PORTS               NAMES               SIZE
03449a8fc4fd        gnhuy91/test-size   "/bin/bash"         6 seconds ago       Exited (0) 5 seconds ago                       determined_jepsen   0 B (virtual 272.4 MB)
```
Check the SIZE column, `virtual 272.4 MB`, this is equal to all layers size sumed up.

### Conclusion
- Copying files to container increase the container size by exactly the files size.
- Removing files does **NOT** reduce container size, since the remove files layer is `0 B`.
