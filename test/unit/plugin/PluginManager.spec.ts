import PluginManager, { helpers } from '../../../src/lib/plugin/PluginManager'
import { LogConfig } from '@uncover/js-utils-logger'
import Plugin from '../../../src/lib/plugin/object/Plugin'
import PluginDefine from '../../../src/lib/plugin/object/PluginDefine'
import PluginProvider from '../../../src/lib/plugin/object/PluginProvider'
import PluginProvide from '../../../src/lib/plugin/object/PluginProvide'

LogConfig.off()

describe('PluginManager', () => {

  /* TEST DATA */


  /* TEST SETUP */

  let spyHelpersFetchPlugin: any

  beforeEach(() => {
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })


  /* TEST CASES */

  // helpers.fetchPlugin //

  describe('helpers.fetchPlugin', () => {

    test('When fetch is correct', async () => {
      // Declaration
      const url = 'url'
      const data = {}
      // @ts-ignore
      global.fetch = jest.fn((input: URL) => Promise.resolve({
        json: () => Promise.resolve(data)
      }))
      // Execution
      const result = await helpers.fetchPlugin(url)
      // Assertion
      expect(result).toEqual(data)
    })

    test('When fetch throws', async () => {
      // Declaration
      const url = 'url'
      // @ts-ignore
      global.fetch = jest.fn(() => Promise.reject())
      // Execution
      await expect(helpers.fetchPlugin(url))
        .rejects
        .toThrow()
    })
  })

  describe('PluginManager', () => {

    beforeEach(() => {
      spyHelpersFetchPlugin = jest.spyOn(helpers, 'fetchPlugin')
    })

    afterEach(() => {
      PluginManager.reset()
    })

    describe('constructor', () => {

      test('initial values', () => {
        // Declaration
        // Execution
        // Assertion
        expect(PluginManager.plugins).toEqual([])
        expect(PluginManager.rootPlugins).toEqual([])
        expect(PluginManager.definitions).toEqual({})
        expect(PluginManager.providers).toEqual({})
      })
    })

    describe('loadPlugin', () => {

      test('basic plugin', async () => {
        // Declaration
        const data = {
          name: 'pluginName',
          url: 'pluginUrl'
        }
        spyHelpersFetchPlugin.mockImplementation(() => data)
        // Execution
        await PluginManager.loadPlugin('url')
        // Assertion
        expect(spyHelpersFetchPlugin).toHaveBeenCalledTimes(1)
        expect(spyHelpersFetchPlugin).toHaveBeenCalledWith('url')
        const expectedPlugin = new Plugin(data)
        expect(PluginManager.plugins).toHaveLength(1)
        expect(PluginManager.plugins[0]).toEqual(expectedPlugin)
        expect(PluginManager.rootPlugins).toHaveLength(1)
        expect(PluginManager.rootPlugins[0]).toEqual(expectedPlugin)
        expect(PluginManager.getPlugin('pluginName')).toEqual(expectedPlugin)
        expect(PluginManager.getPluginByUrl('url')).toEqual(expectedPlugin)
      })

      test('plugin with defines', async () => {
        // Declaration
        const data = {
          name: 'pluginName',
          url: 'pluginUrl',
          defines: {
            define1: {}
          }
        }
        spyHelpersFetchPlugin.mockImplementation(() => data)
        // Execution
        await PluginManager.loadPlugin('url')
        // Assertion
        const expectedDefine = new PluginDefine(
          'pluginName',
          'define1',
          data.defines.define1
        )
        expect(PluginManager.definitions).toEqual({
          'pluginName/define1': expectedDefine
        })
        expect(PluginManager.getDefinition('pluginName/define1')).toEqual(expectedDefine)
      })

      test('plugin with provides', async () => {
        // Declaration
        const data = {
          name: 'pluginName',
          url: 'pluginUrl',
          defines: {
            define1: {}
          }
        }
        const dataChild = {
          name: 'childName',
          url: 'childUrl',
          provides: {
            'pluginName/define1': {
              name: 'child'
            }
          }
        }
        // Execution
        spyHelpersFetchPlugin.mockImplementation(() => data)
        await PluginManager.loadPlugin('url')
        spyHelpersFetchPlugin.mockImplementation(() => dataChild)
        await PluginManager.loadPlugin('urlChild')
        // Assertion
        expect(spyHelpersFetchPlugin).toHaveBeenCalledTimes(2)
        expect(spyHelpersFetchPlugin).toHaveBeenCalledWith('url')
        expect(spyHelpersFetchPlugin).toHaveBeenCalledWith('urlChild')
        const expectedDefine = new PluginDefine(
          'pluginName',
          'define1',
          data.defines.define1
        )
        const expectedProvide = new PluginProvide(
          'childName',
          'pluginName/define1',
          dataChild.provides['pluginName/define1']
        )
        const expectedProvider = new PluginProvider(
          'childName',
          expectedDefine,
          expectedProvide
        )
        expect(PluginManager.providers).toEqual({
          'pluginName/define1/child': expectedProvider
        })
        expect(PluginManager.getProviders('pluginName/define1')).toEqual([expectedProvider])
        expect(PluginManager.getProvider('pluginName/define1/child')).toEqual(expectedProvider)
      })

      test('load plugin with undefined provide', async () => {
        // Declaration
        const data = {
          name: 'pluginName',
          url: 'pluginUrl',
          provides: {
            define1: {
              name: 'test'
            }
          }
        }
        spyHelpersFetchPlugin.mockImplementation(() => data)
        // Execution
        await PluginManager.loadPlugin('url')
        // Assertion
        expect(PluginManager.providers).toEqual({})
      })

      test('load same url twice', async () => {
        // Declaration
        const data = {
          name: 'pluginName',
          url: 'pluginUrl'
        }
        spyHelpersFetchPlugin.mockImplementation(() => data)
        // Execution
        await PluginManager.loadPlugin('url')
        await PluginManager.loadPlugin('url')
        // Assertion
        expect(spyHelpersFetchPlugin).toHaveBeenCalledTimes(1)
      })

      test('load plugin with dependency', async () => {
        // Declaration
        const data = {
          name: 'pluginName',
          url: 'pluginUrl',
          dependencies: ['depUrl']
        }
        const dataDependency = {
          name: 'dependencyName',
          url: 'dependencyUrl'
        }
        spyHelpersFetchPlugin.mockImplementation((url: string) => {
          if (url === 'url') {
            return data
          }
          return dataDependency
        })
        // Execution
        await PluginManager.loadPlugin('url')
        // Assertion
        expect(spyHelpersFetchPlugin).toHaveBeenCalledTimes(2)
        expect(PluginManager.plugins).toHaveLength(2)
      })

      test('load two plugins with same name', async () => {
        // Declaration
        const data = {
          name: 'pluginName',
          url: 'pluginUrl'
        }
        spyHelpersFetchPlugin.mockImplementation(() => data)
        // Execution
        await PluginManager.loadPlugin('url')
        await PluginManager.loadPlugin('url2')
        // Assertion
        expect(spyHelpersFetchPlugin).toHaveBeenCalledTimes(2)
        expect(PluginManager.plugins).toHaveLength(1)
      })

      test('load plugin with invalid data', async () => {
        // Declaration
        const data = {
          name: 'pluginName'
        }
        spyHelpersFetchPlugin.mockImplementation(() => data)
        // Execution
        await PluginManager.loadPlugin('url')
        // Assertion
        expect(spyHelpersFetchPlugin).toHaveBeenCalledTimes(1)
        expect(PluginManager.plugins).toHaveLength(0)
      })
    })
  })
})
