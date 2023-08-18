import { useForm as useRefineForm } from '@refinedev/core';
export const useForm = (props) => {
    return useRefineForm({
        ...props,
        onMutationError(error, variables, context, isAutoSave) {
            if (error.statusCode == 422) {
                props?.form?.setValidateMessage(convertErrorFormat(error?.data));
            }
            props?.onMutationError?.(error, variables, context, isAutoSave);
        },
    });
};
export const convertErrorFormat = (data) => {
    return data.reduce((output, item) => {
        for (const key in item) {
            if (Object.prototype.hasOwnProperty.call(item, key)) {
                const messages = item[key];
                output[key] = messages.map((message) => ({
                    type: 'error',
                    message: message,
                }));
            }
        }
        return output;
    }, {});
};
