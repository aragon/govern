#!/bin/sh
APP="$1"
# wait 5 min for the new pod to be ready. If the pod is not ready there is a problem with the new container
kubectl wait pod --for condition=Ready --timeout=300s $(kubectl get pods -l app=$APP --sort-by {.metadata.creationTimestamp} -o jsonpath={.items[-1].metadata.name})
