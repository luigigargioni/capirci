interface SinglePresenzaType {
  start: string
  end: string
  title: string
}

export interface PresenzeType {
  morning: SinglePresenzaType[]
  evening: SinglePresenzaType[]
}
