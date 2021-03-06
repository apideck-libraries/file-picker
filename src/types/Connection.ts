import { FormField } from './FormField'

export interface RawJSON {
  [key: string]: string | string[] | number | boolean | undefined
}

export interface Settings extends RawJSON {
  instance_url?: string
  base_url?: string
}

export interface Connection {
  id: string
  service_id: string
  unified_api: string
  auth_type: string | null
  name: string
  state: 'available' | 'added' | 'authorized' | 'callable'
  icon: string
  logo?: string
  website?: string
  tag_line?: string
  authorize_url?: string
  revoke_url?: string | null
  configured: boolean
  enabled?: boolean
  settings?: Settings
  settings_required_for_authorization?: string[]
  configurable_resources: string[]
  configuration?: FormField[]
  form_fields: FormField[]
  created_at: number
}
