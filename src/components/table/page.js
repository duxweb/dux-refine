import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { Main, MainHeader } from '../main';
import { CardTable } from './table';
export const PageTable = forwardRef(({ headerRender, ...props }, ref) => {
    return (_jsxs(Main, { children: [_jsx(MainHeader, { children: headerRender?.() }), _jsx(CardTable, { ref: ref, ...props })] }));
});
PageTable.displayName = 'PageTable';
