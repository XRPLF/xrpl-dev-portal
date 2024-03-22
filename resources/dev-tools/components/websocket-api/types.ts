export interface CommandMethod {
  name: string
  description: string,
  link: string
  body: any
  ws_only?: boolean,
  status?: 'not_enabled',
  clio_only?: boolean
}

export interface CommandGroup {
  group: string
  methods: CommandMethod[]
}

export interface Connection {
  id: string
  ws_url: string
  jsonrpc_url: string
  shortname: string
  longname: string
}
