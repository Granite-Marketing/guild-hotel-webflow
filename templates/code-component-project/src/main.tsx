import { mountPreview } from './preview/PreviewApp'

const root = document.getElementById('root')
if (!root) throw new Error('Preview root not found')

mountPreview(root)
