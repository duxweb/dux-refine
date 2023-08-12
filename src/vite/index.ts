import * as fs from 'fs'
import * as path from 'path'
import * as chokidar from 'chokidar'
import { FSWatcher, Plugin } from 'vite'

const create = (watcher: FSWatcher) => {
  const watched = watcher.getWatched()
  const list = Object.keys(watched).map((key) => {
    const paths = key.split(path.sep)
    return paths.slice(-2)
  })
  const code = `import { appConfig } from '../core/app'
${list.map((v) => `import ${v[1]} from '../${v[0]}/${v[1]}'`).join('\n')}

const app: appConfig[] = [${list.map((v) => v[1]).join(', ')}]

export default app
`
  fs.writeFileSync('./src/config/app.ts', code, { encoding: 'utf8' })
}

export const DuxUI = (): Plugin => {
  return {
    name: 'app-config',
    buildStart() {
      const watcher = chokidar.watch('./src/pages/*/index.(js|ts|jsx|tsx)', {
        ignored: [],
        persistent: true,
      })

      watcher.on('ready', () => {
        create(watcher)
      })
      watcher.on('add', () => {
        create(watcher)
      })
      watcher.on('unlink', () => {
        create(watcher)
      })
    },
  }
}
