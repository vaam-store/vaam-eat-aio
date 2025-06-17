# VAAM Eat All-in-One Helm Chart

This Helm chart deploys the VAAM Eat All-in-One application on a Kubernetes cluster using the Helm package manager.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+
- PV provisioner support in the underlying infrastructure

## Installing the Chart

To install the chart with the release name `vaam-eat`:

```bash
helm install vaam-eat ./helm-chart
```

The command deploys VAAM Eat on the Kubernetes cluster in the default configuration. The [Parameters](#parameters) section lists the parameters that can be configured during installation.

## Uninstalling the Chart

To uninstall/delete the `vaam-eat` deployment:

```bash
helm delete vaam-eat
```

The command removes all the Kubernetes components associated with the chart and deletes the release.

## Parameters

### Global parameters

| Name                      | Description                                     | Value |
| ------------------------- | ----------------------------------------------- | ----- |
| `global.imageRegistry`    | Global Docker image registry                    | `""`  |
| `global.imagePullSecrets` | Global Docker registry secret names as an array | `[]`  |
| `global.storageClass`     | Global StorageClass for Persistent Volume(s)    | `""`  |

### Common parameters

| Name                | Description                                | Value |
| ------------------- | ------------------------------------------ | ----- |
| `commonLabels`      | Labels to add to all deployed objects      | `{}`  |
| `commonAnnotations` | Annotations to add to all deployed objects | `{}`  |

### PostgreSQL parameters

| Name                             | Description                                          | Value               |
| -------------------------------- | ---------------------------------------------------- | ------------------- |
| `postgresql.enabled`             | Enable PostgreSQL subchart                           | `true`              |
| `postgresql.auth.username`       | Name for a custom user to create                     | `vaam-eat`          |
| `postgresql.auth.password`       | Password for the custom user to create               | `vaam-eat-password` |
| `postgresql.auth.database`       | Name for a custom database to create                 | `vaam-eat`          |
| `postgresql.persistence.enabled` | Enable PostgreSQL Primary data persistence using PVC | `true`              |
| `postgresql.persistence.size`    | PVC Storage Request for PostgreSQL volume            | `8Gi`               |

### Redis parameters

| Name                        | Description                             | Value  |
| --------------------------- | --------------------------------------- | ------ |
| `redis.enabled`             | Enable Redis subchart                   | `true` |
| `redis.persistence.enabled` | Enable Redis data persistence using PVC | `true` |
| `redis.persistence.size`    | PVC Storage Request for Redis volume    | `1Gi`  |

### MinIO parameters

| Name                        | Description                             | Value      |
| --------------------------- | --------------------------------------- | ---------- |
| `minio.enabled`             | Enable MinIO subchart                   | `true`     |
| `minio.auth.rootUser`       | MinIO root username                     | `minio`    |
| `minio.auth.rootPassword`   | MinIO root password                     | `minio123` |
| `minio.persistence.enabled` | Enable MinIO data persistence using PVC | `true`     |
| `minio.persistence.size`    | PVC Storage Request for MinIO volume    | `10Gi`     |

### API parameters

| Name                   | Description                      | Value          |
| ---------------------- | -------------------------------- | -------------- |
| `api.enabled`          | Enable API deployment            | `true`         |
| `api.replicaCount`     | Number of API replicas to deploy | `1`            |
| `api.image.repository` | API image repository             | `vaam-eat-api` |
| `api.image.tag`        | API image tag                    | `latest`       |

## Configuration and installation details

### Resource requests and limits

All components have resource requests and limits configured based on the original Docker Compose configuration. You can modify these values in the `values.yaml` file.

### Persistence

The chart mounts a Persistent Volume at the following mount paths:

- PostgreSQL: `/var/lib/postgresql/data`
- Redis: `/data`
- MinIO: `/bitnami/minio/data`
- PMTiles: `/pmtiles-data`

### Jobs and Hooks

The chart includes several Helm hooks for initialization:

1. **Migration Job** (`pre-install`, `pre-upgrade`): Runs database migrations
2. **MinIO Init Job** (`post-install`, `post-upgrade`): Initializes MinIO buckets
3. **Extract PMTiles Job** (`post-install`, `post-upgrade`): Extracts PMTiles data
4. **Upload PMTiles Job** (`post-install`, `post-upgrade`): Uploads PMTiles to MinIO

### Services

The following services are exposed:

- **API**: Main application service
- **PostgreSQL**: Database service (ClusterIP)
- **Redis**: Cache service (ClusterIP)
- **MinIO**: Object storage service (ClusterIP)
- **Jaeger**: Tracing UI service (ClusterIP)
- **Adminer**: Database admin interface (ClusterIP)
- **Maildev**: Email testing service (ClusterIP)

## Troubleshooting

### Common issues

1. **PVC not binding**: Ensure your cluster has a default StorageClass or specify one using `global.storageClass`
2. **Jobs failing**: Check job logs using `kubectl logs job/<job-name>`
3. **Services not starting**: Verify resource limits and requests are appropriate for your cluster

### Useful commands

```bash
# Check all pods
kubectl get pods

# Check services
kubectl get services

# Check PVCs
kubectl get pvc

# Check jobs
kubectl get jobs

# View logs for a specific pod
kubectl logs <pod-name>

# Describe a resource for more details
kubectl describe <resource-type> <resource-name>
```
