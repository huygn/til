## Things to note when working with Docker

### Agent modes
- client (default)
- server (with [`-server`](https://www.consul.io/docs/agent/options.html#_server) run option)

Consul have its own cluster architecture with server and client modes (like master and nodes).


### Roles
- Key-Value store
- Health check
- Services registration/deregistration
  - Automatically: using Registrator
  - Manually: via `json` config files or Consul APIs
- Support for multiple Datacenters (each Datacenter have its own set of Consul servers, these servers act as gateways to other Datacenters and forward traffic as appropriate.)

Ideally, Consul client should runs on each *physical* node in a (swarm) cluster and [`join`](https://www.consul.io/docs/agent/options.html#_join)
with other Consul servers/clients to form a cluster. For more info, see https://www.consul.io/intro/getting-started/join.html.

### Pairing with Registrator
Registrator watches for new Docker containers and inspects them to determine what services they provide,
it performs bridging between the Docker event hub and the Consul agent.
For every newly-started container/service, Registrator will add them to Consul KV store, and when any containter/service
got stopped/removed, Registrator will remove them from Consul KV store eaccordingly.

### Using Consul, Registrator with Docker Swarm
- Registrator is designed to be [run once on every host](http://gliderlabs.com/registrator/latest/user/run/).
- Run Registrator in a container and point it to Consul KV store.
- Consul might as well run inside a container.
- With Docker Swarm use Consul as its Service Backend, Swarm will store its nodes in Consul KV store.