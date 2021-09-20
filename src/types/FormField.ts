export interface FormField {
  id: string
  label: string
  value: string | string[] | number | boolean | undefined | null
  default_value?: string | string[] | number | boolean | undefined | null
  placeholder: string
  mask: boolean
  type:
    | 'select'
    | 'multi-select'
    | 'filtered-select'
    | 'text'
    | 'textarea'
    | 'number'
    | 'phone'
    | 'email'
    | 'url'
    | 'boolean'
    | 'hidden'
    | 'date'
    | 'datetime'
    | unknown
  required: boolean
  description?: string
  disabled: boolean
  options: FormFieldOption[] | FormFieldOptionGroup[]
  custom_field: boolean
  hidden: boolean
  target?: 'custom_fields' | 'resource'
  filter?: Record<string, string>
}

export interface FormFieldOption {
  label: string
  value: string | number | readonly string[] | undefined
}

export interface FormFieldOptionGroup {
  id: string
  label: string
  options: FormFieldOption[]
}
