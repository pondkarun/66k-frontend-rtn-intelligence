
import { FormInstance } from 'antd';
import type { InternalNamePath } from 'rc-field-form/lib/interface';
type NamePath = string | number | InternalNamePath | undefined;

export interface FormInterface<Values = any> extends FormInstance<Values> {
    getFieldValue: (name?: NamePath) => any;
}