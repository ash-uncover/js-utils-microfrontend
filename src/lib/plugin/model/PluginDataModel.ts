export interface PluginData {
  name: string
  url: string

  dependencies?: string[]
  defines?: PluginDataDefines
  provides?: PluginDataProvides
}

export interface PluginDataDefines {
  [key: string]: PluginDataDefine
}
export interface PluginDataDefine {
  properties?: PluginDataDefineProperties
  attributes?: PluginDataDefineAttributes
  elements?: PluginDataDefineElements
}
export interface PluginDataDefineProperties {
  [key: string]: string
}
export interface PluginDataDefineAttributes {
  [key: string]: string
}
export interface PluginDataDefineElements {
  [key: string]: PluginDataDefineElement
}
export interface PluginDataDefineElement {

}

export interface PluginDataProvides {
  [key: string]: PluginDataProvide | PluginDataProvide[]
}
export interface PluginDataProvide {
  name: string
  attributes?: PluginDataProvideAttributes
  elements?: PluginDataProvideElements
}
export interface PluginDataProvideAttributes {
  [key: string]: string | string[]
}
export interface PluginDataProvideElements {
  [key: string]: PluginDataProvideElement
}
export interface PluginDataProvideElement {
  url: string
  type: 'iframe' | 'webcomponent' | 'component'
}

export const PluginDataErrors = {
  DATA_MISSING: 'plugin data is undefined',

  NAME_MISSING: 'plugin "name" is missing',
  NAME_TYPE: 'plugin "name" must be a string',

  URL_MISSING: 'plugin "url" is missing',
  URL_TYPE: 'plugin "url" must be a string',

  DEFINES_TYPE: 'plugin "defines" must be an object',
}

export const PluginDataValidator = {

  checkPluginData: (data: PluginData) => {
    const errors: string[] = []
    if (!data.name) {
      errors.push(PluginDataErrors.NAME_MISSING)
    } else if (typeof data.name !== 'string') {
      errors.push(PluginDataErrors.NAME_TYPE)
    }
    if (!data.url) {
      errors.push(PluginDataErrors.URL_MISSING)
    } else if (typeof data.url !== 'string') {
      errors.push(PluginDataErrors.URL_TYPE)
    }
    if (data.defines) {
      errors.push(...PluginDataValidator.checkPluginDataDefines(data.defines))
    }
    if (data.provides) {
      errors.push(...PluginDataValidator.checkPluginDataProvides(data.provides))
    }
    return errors
  },

  checkPluginDataDefines: (defines: PluginDataDefines) => {
    if (typeof defines !== 'object') {
      return [PluginDataErrors.DEFINES_TYPE]
    }
    return Object.values(defines).reduce((acc: string[], define) => {
      const defineErrors = PluginDataValidator.checkPluginDataDefine(define)
      return [
        ...acc,
        ...defineErrors
      ]
    }, [])
  },

  checkPluginDataDefine: (define: PluginDataDefine) => {
    const errors: string[] = []
    return errors
  },

  checkPluginDataDefineProperties: (properties: PluginDataDefineProperties) => {
    const errors: string[] = []
    return errors
  },

  checkPluginDataDefineAttributes: (attributes: PluginDataDefineAttributes) => {
    const errors: string[] = []
    return errors
  },

  checkPluginDataDefineElements: (elements: PluginDataDefineElements) => {
    const errors: string[] = []
    return errors
  },

  checkPluginDataDefineElement: (element: PluginDataDefineElement) => {
    const errors: string[] = []
    return errors
  },

  checkPluginDataProvides: (provides: PluginDataProvides) => {
    const errors: string[] = []
    return errors
  },

  checkPluginDataProvide: (provide: PluginDataProvide) => {
    const errors: string[] = []
    return errors
  },

  checkPluginDataProvideAttributes: (attributes: PluginDataProvideAttributes) => {
    const errors: string[] = []
    return errors
  },

  checkPluginDataProvideElements: (elements: PluginDataProvideElements) => {
    const errors: string[] = []
    return errors
  },

  checkPluginDataProvideElement: (element: PluginDataProvideElement) => {
    const errors: string[] = []
    return errors
  }
}
