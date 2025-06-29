{{/*

Params:.
- key - String - Required
- value - Dict - Required.
*/}}
{{- define "common.env" -}}
{{ $key := include "common.tplvalues.render" ( dict "value" .key "context" .context ) -}}
{{ $value := include "common.tplvalues.render" ( dict "value" .value "context" .context ) -}}

name: {{ $key }}
{{ if and (not ( kindIs "int" .value )) (not ( kindIs "string" .value )) }}
valueFrom:
  {{ $value | nindent 2 }}
{{ else if or ( kindIs "int" $value ) ( kindIs "string" $value ) }}
value: {{ $value }}
{{ end }}
{{- end -}}
