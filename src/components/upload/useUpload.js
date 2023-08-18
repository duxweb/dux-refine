import { useAppContext } from '../../core/app';
import { useApiUrl, useGetIdentity } from '@refinedev/core';
export const useUpload = () => {
    const { config } = useAppContext();
    const { data } = useGetIdentity();
    const apiUrl = useApiUrl();
    return {
        action: `${apiUrl}/${config.apiPath.upload}`,
        headers: {
            Accept: 'application/json',
            Authorization: data?.token || '',
        },
        formatResponse: (res) => {
            if (res?.code != 200) {
                res.error = res?.message || res.error;
            }
            else {
                res.url = res?.data?.list?.[0]?.url;
                res.name = res?.data?.list?.[0]?.name;
            }
            return res;
        },
    };
};
export const formatUploadFile = (file) => {
    if (Array.isArray(file)) {
        return file.map((item) => {
            return {
                url: item,
            };
        });
    }
    return [
        {
            url: file,
        },
    ];
};
