import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { Suspense, lazy, createContext, useState, useCallback, useImperativeHandle, forwardRef, useContext, } from 'react';
import { Dialog } from 'tdesign-react/esm';
const context = createContext({});
const ModalComp = forwardRef(({ title, trigger, children, component, componentProps, onClose, defaultOpen = false }, ref) => {
    const [open, setOpen] = useState(defaultOpen);
    const AsyncContent = component ? lazy(component) : undefined;
    const onCloseFun = useCallback(() => {
        setOpen(false);
        onClose?.();
    }, [onClose]);
    useImperativeHandle(ref, () => ({
        onClose: onCloseFun,
    }));
    return (_jsxs(_Fragment, { children: [React.isValidElement(trigger) &&
                React.cloneElement(trigger, {
                    onClick: () => {
                        setOpen(true);
                    },
                }), _jsx(context.Provider, { value: { onClose: onCloseFun }, children: _jsx(Dialog, { visible: open, onClose: onCloseFun, destroyOnClose: true, header: title, footer: null, closeOnOverlayClick: false, closeOnEscKeydown: false, draggable: true, children: component ? (_jsx(Suspense, { children: AsyncContent && _jsx(AsyncContent, { ...componentProps, onClose: onCloseFun }) })) : typeof children === 'function' ? (children(onCloseFun)) : (children) }) })] }));
});
ModalComp.displayName = 'Modal';
export const useModal = () => {
    return useContext(context);
};
const ModalFooter = ({ children }) => {
    return _jsx("div", { className: 't-dialog__footer', children: children });
};
export const Modal = ModalComp;
Modal.Footer = ModalFooter;
