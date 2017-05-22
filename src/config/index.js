import Development from './development'
import Production from './production'

const options = __PROD__ ? Production : Development

export default {
  ...options
}