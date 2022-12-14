import React from 'react'
import PluginManager from '../../../../../src/lib/plugin/PluginManager'
import { Link } from 'react-router-dom'

import './PluginSideEntry.css'

export interface PluginSideEntryProperties {
  pluginId: string
  selectedPluginId?: string
}

export const PluginSideEntry = ({
  pluginId,
  selectedPluginId
}: PluginSideEntryProperties) => {

  // Rendering //

  const plugin = PluginManager.getPlugin(pluginId)

  if (!plugin) {
    return (
      <li>PROBLEM</li>
    )
  }

  const classes = ['plugin-side-entry']
  if (selectedPluginId === pluginId) {
    classes.push('selected')
  }

  return (
    <li
      className={classes.join(' ')}
      title={plugin.url}
    >
      <Link
        to={`${window.btoa(encodeURIComponent(plugin.name))}`}
      >
        {plugin.name}
      </Link>
      {plugin.dependencies ? (
        <ul className='plugin-side-entry__entries'>
          {plugin.dependencies.map(childUrl => {
            const child = PluginManager.getPluginByUrl(childUrl)
            return (
              <PluginSideEntry
                key={child!.name}
                selectedPluginId={selectedPluginId}
                pluginId={child!.name}
              />
            )
          })}
        </ul>
      ) : null}
    </li>
  )
}