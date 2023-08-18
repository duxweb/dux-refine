import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Form, Button } from 'tdesign-react/esm';
import { Modal, useModal } from '../modal';
import { useForm } from './useForm';
export const FormModal = ({ children, onClose, id, params, action = 'create' }) => {
    const modal = useModal();
    const [form] = Form.useForm();
    const { formLoading, onFinish, queryResult } = useForm({
        form: form,
        action: action,
        id: id,
        redirect: false,
        queryMeta: {
            params: params,
        },
    });
    const data = queryResult?.data?.data;
    useEffect(() => {
        if (data) {
            form.setFieldsValue(data);
        }
    }, [data, form]);
    const onSubmit = async (e) => {
        if (e.validateResult === true) {
            await onFinish(e.fields);
            await onClose?.();
            await modal.onClose?.();
        }
    };
    return (_jsxs(Form, { onSubmit: onSubmit, disabled: formLoading, initialData: data, form: form, labelAlign: 'right', children: [_jsx("div", { className: 'p-6', children: children }), _jsxs(Modal.Footer, { children: [_jsx(Button, { variant: 'outline', onClick: () => {
                            onClose?.();
                            modal.onClose?.();
                        }, disabled: formLoading, children: "\u53D6\u6D88" }), _jsx(Button, { type: 'submit', loading: formLoading, children: "\u786E\u5B9A" })] })] }));
};
