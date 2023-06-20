import { Notify } from 'quasar'

export function validateEmail (email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@incedoinc\.com$/
  return re.test(String(email).toLowerCase())
}

export function notifyAlert (type, msg) {
  Notify.create({
    timeout: 2000,
    position: 'bottom',
    type: type,
    message: msg
  })
}
