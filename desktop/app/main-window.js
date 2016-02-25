import Window from './window'
import {ipcMain} from 'electron'
import resolveRoot from '../resolve-root'
import hotPath from '../hot-path'
import flags from '../shared/util/feature-flags'
import {globalResizing} from '../shared/styles/style-guide'

export default function () {
  const mainWindow = new Window(
    resolveRoot(`renderer/index.html?src=${hotPath('index.bundle.js')}`), {
      width: globalResizing.login.width,
      height: globalResizing.login.height,
      show: flags.login
    }
  )

  ipcMain.on('showMain', () => {
    mainWindow.show(true)
  })

  return mainWindow
}
