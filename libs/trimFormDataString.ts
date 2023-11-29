import { isArray, isPlainObject, isString } from 'lodash'
import type { FormInstance } from 'antd'

const trimDataString = (form: FormInstance<any>) => {
  const body = form.getFieldValue(undefined)

  const trimData = (obj: any) => {
    if (isPlainObject(obj)) {
      Object.entries(obj).forEach(([key, value]: any) => {
        if (isString(value)) obj[key] = value.trim()

        if (isArray(value)) {
          const array_items = obj[key] as any[]

          for (let n = 0; n < array_items.length; n++) {
            const element = array_items[n]

            if (isPlainObject(element)) {
              Object.entries(element).forEach(([key, value]) => {
                if (isString(value)) element[key] = value.trim()
              })
            }
          }
        }
      })
      return obj
    } else {
      if (isString(obj)) {
        return obj.trim()
      }
    }
  }

  if (isArray(body)) {
    for (let index = 0; index < body.length; index++) {
      const e = body[index]
      body[index] = trimData(e)
    }
  } else {
    trimData(body)
  }

  form.setFieldsValue(body)
}

export default trimDataString
