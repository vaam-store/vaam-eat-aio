{{/*

Params:.
- key - String - Required
- value - Dict - Required.
*/}}
{{- define "common.env" -}}
{{- $key := include "common.tplvalues.render" ( dict "value" .key "context" .context ) -}}
{{- $value := include "common.tplvalues.render" ( dict "value" .value "context" .context ) -}}

{{- if or ( kindIs "int" $value ) ( kindIs "string" $value ) -}}
{{ $key }}: {{ $value }}
{{- else -}}
{{ $key }}: 
  {{ $value }}
{{- end -}}
{{- end -}}