/* @flow */

import getenv from 'getenv'

// To enable a feature, include it in the environment variable KEYBASE_FEATURES.
// For example, KEYBASE_FEATURES=tracker2,login,awesomefeature

const adminKey = 'admin'
const loginKey = 'login'
const mobileAppsExistKey = 'mobileAppsExist'

type FeatureFlags = {
  'admin': boolean,
  'dz2': boolean,
  'login': boolean,
  'mobileAppsExist': boolean,
  'tracker2': boolean
}

let features = getenv.array('KEYBASE_FEATURES', 'string', '')

const admin = features.includes(adminKey)
const dz2 = true
const login = features.includes(loginKey)
const mobileAppsExist = features.includes(mobileAppsExistKey)
const tracker2 = true

const ff: FeatureFlags = {
  admin,
  dz2,
  login,
  mobileAppsExist,
  tracker2
}

if (__DEV__) {
  console.log('Features', ff)
}

export default ff
export {
  admin,
  dz2,
  login,
  mobileAppsExist,
  tracker2
}
