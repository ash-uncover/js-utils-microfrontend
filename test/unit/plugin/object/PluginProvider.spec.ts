import PluginDefine from '../../../../src/lib/plugin/object/PluginDefine'
import PluginProvide from '../../../../src/lib/plugin/object/PluginProvide'
import PluginProvider from '../../../../src/lib/plugin/object/PluginProvider'
import PluginProviderAttribute from '../../../../src/lib/plugin/object/PluginProviderAttribute'
import PluginProviderElement from '../../../../src/lib/plugin/object/PluginProviderElement'

describe('PluginProvider', () => {

  describe('constructor', () => {

    test('when there are no attributes and no elements', () => {
      // Declaration
      const pluginUrl = 'pluginUrl'
      const definition = new PluginDefine(
        'definitionPlugin',
        'definitionName',
        {}
      )
      const provide = new PluginProvide(
        'providePlugin',
        'provideDefine',
        {
          name: 'provideName'
        }
      )
      // Execution
      const result = new PluginProvider(pluginUrl, definition, provide)
      // Assertion
      expect(result.plugin).toEqual('providePlugin')
      expect(result.definition).toEqual('definitionPlugin/definitionName')
      expect(result.name).toEqual('definitionPlugin/definitionName/provideName')
      expect(result.attributes).toEqual({})
      expect(result.elements).toEqual({})
    })

    test('when there are valid attributes and valid elements', () => {
      // Declaration
      const pluginUrl = 'pluginUrl'
      const definition = new PluginDefine(
        'definitionPlugin',
        'definitionName',
        {
          attributes: {
            att1: 'string',
            'att2?': 'string'
          },
          elements: {
            element1: {}
          }
        }
      )
      const provide = new PluginProvide(
        'providePlugin',
        'provideDefine',
        {
          name: 'provideName',
          attributes: {
           att1: 'value1'
          },
          elements: {
            element1: {
              url: 'element1Url',
              type: 'iframe'
            }
          }
        }
      )
      // Execution
      const result = new PluginProvider(pluginUrl, definition, provide)
      // Assertion
      expect(result.plugin).toEqual('providePlugin')
      expect(result.definition).toEqual('definitionPlugin/definitionName')
      expect(result.name).toEqual('definitionPlugin/definitionName/provideName')
      const expectedAttributes = {
        att1: 'value1'
      }
      expect(result.attributes).toEqual(expectedAttributes)
      expect(result.getAttribute('att1')).toEqual(expectedAttributes.att1)
      const expectedElements = {
        element1: {
          url: 'pluginUrlelement1Url',
          type: 'iframe'
        }
      }
      expect(result.elements).toEqual(expectedElements)
      expect(result.getElement('element1')).toEqual(expectedElements.element1)
    })

    test('when an attribute type does not match the definition', () => {
      // Declaration
      const pluginUrl = 'pluginUrl'
      const definition = new PluginDefine(
        'definitionPlugin',
        'definitionName',
        {
          attributes: {
            att1: 'string[]'
          },
          elements: {
            element1: {}
          }
        }
      )
      const provide = new PluginProvide(
        'providePlugin',
        'provideDefine',
        {
          name: 'provideName',
          attributes: {
           att1: 'value1'
          },
          elements: {
            element1: {
              url: 'element1Url',
              type: 'iframe'
            }
          }
        }
      )
      // Execution
      // Assertion
      expect(() => new PluginProvider(pluginUrl, definition, provide)).toThrow()
    })

    test('when an attribute type does not match the definition #2', () => {
      // Declaration
      const pluginUrl = 'pluginUrl'
      const definition = new PluginDefine(
        'definitionPlugin',
        'definitionName',
        {
          attributes: {
            att1: 'string'
          },
          elements: {
            element1: {}
          }
        }
      )
      const provide = new PluginProvide(
        'providePlugin',
        'provideDefine',
        {
          name: 'provideName',
          attributes: {
           att1: ['value1', 'value2']
          },
          elements: {
            element1: {
              url: 'element1Url',
              type: 'iframe'
            }
          }
        }
      )
      // Execution
      // Assertion
      expect(() => new PluginProvider(pluginUrl, definition, provide)).toThrow()
    })

    test('when a mandatory attribute is missing', () => {
      // Declaration
      const pluginUrl = 'pluginUrl'
      const definition = new PluginDefine(
        'definitionPlugin',
        'definitionName',
        {
          attributes: {
            att1: 'string'
          },
          elements: {
            element1: {}
          }
        }
      )
      const provide = new PluginProvide(
        'providePlugin',
        'provideDefine',
        {
          name: 'provideName',
          attributes: {},
          elements: {
            element1: {
              url: 'element1Url',
              type: 'iframe'
            }
          }
        }
      )
      // Execution
      // Assertion
      expect(() => new PluginProvider(pluginUrl, definition, provide)).toThrow()
    })

    test('when an element is missing', () => {
      // Declaration
      const pluginUrl = 'pluginUrl'
      const definition = new PluginDefine(
        'definitionPlugin',
        'definitionName',
        {
          attributes: {
            att1: 'string'
          },
          elements: {
            element1: {}
          }
        }
      )
      const provide = new PluginProvide(
        'providePlugin',
        'provideDefine',
        {
          name: 'provideName',
          attributes: {
           att1: 'value1'
          }
        }
      )
      // Execution
      // Assertion
      expect(() => new PluginProvider(pluginUrl, definition, provide)).toThrow()
    })
  })
})