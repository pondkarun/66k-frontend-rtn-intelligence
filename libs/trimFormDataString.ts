import { FormInstance } from 'antd';
import { isArray, isPlainObject, isString } from 'lodash';

const trimDataString = (form: FormInstance<any>) => {
  const body = form.getFieldValue(undefined);

  const trimData = (obj: any) => {
    if (isPlainObject(obj)) {
      Object.entries(obj).forEach(([key, value]) => {
        if (isString(value)) {
          obj[key] = value.trim()
        }
      });
      return obj;
    } else {
      if (isString(obj)) {
        return obj.trim()
      }
    }
  }

  if (isArray(body)) {
    for (let index = 0; index < body.length; index++) {
      const e = body[index];
      body[index] = trimData(e);
    }
  } else {
    trimData(body)
  }

  form.setFieldsValue(body)
}

export default trimDataString;