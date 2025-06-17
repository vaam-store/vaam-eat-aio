{{/*
Expand the name of the chart.
*/}}
{{- define "vaam-eat-aio.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "vaam-eat-aio.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "vaam-eat-aio.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "vaam-eat-aio.labels" -}}
helm.sh/chart: {{ include "vaam-eat-aio.chart" . }}
{{ include "vaam-eat-aio.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "vaam-eat-aio.selectorLabels" -}}
app.kubernetes.io/name: {{ include "vaam-eat-aio.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "vaam-eat-aio.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "vaam-eat-aio.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
PostgreSQL labels
*/}}
{{- define "vaam-eat-aio.postgresql.labels" -}}
{{ include "vaam-eat-aio.labels" . }}
app.kubernetes.io/component: postgresql
{{- end }}

{{/*
PostgreSQL selector labels
*/}}
{{- define "vaam-eat-aio.postgresql.selectorLabels" -}}
{{ include "vaam-eat-aio.selectorLabels" . }}
app.kubernetes.io/component: postgresql
{{- end }}

{{/*
Redis labels
*/}}
{{- define "vaam-eat-aio.redis.labels" -}}
{{ include "vaam-eat-aio.labels" . }}
app.kubernetes.io/component: redis
{{- end }}

{{/*
Redis selector labels
*/}}
{{- define "vaam-eat-aio.redis.selectorLabels" -}}
{{ include "vaam-eat-aio.selectorLabels" . }}
app.kubernetes.io/component: redis
{{- end }}

{{/*
MinIO labels
*/}}
{{- define "vaam-eat-aio.minio.labels" -}}
{{ include "vaam-eat-aio.labels" . }}
app.kubernetes.io/component: minio
{{- end }}

{{/*
MinIO selector labels
*/}}
{{- define "vaam-eat-aio.minio.selectorLabels" -}}
{{ include "vaam-eat-aio.selectorLabels" . }}
app.kubernetes.io/component: minio
{{- end }}

{{/*
API labels
*/}}
{{- define "vaam-eat-aio.api.labels" -}}
{{ include "vaam-eat-aio.labels" . }}
app.kubernetes.io/component: api
{{- end }}

{{/*
API selector labels
*/}}
{{- define "vaam-eat-aio.api.selectorLabels" -}}
{{ include "vaam-eat-aio.selectorLabels" . }}
app.kubernetes.io/component: api
{{- end }}