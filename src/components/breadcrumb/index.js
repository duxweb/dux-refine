import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBreadcrumb } from '@refinedev/core';
import { Link } from 'react-router-dom';
import { Breadcrumb as TdBreadcrumb } from 'tdesign-react/esm';
const { BreadcrumbItem } = TdBreadcrumb;
export const Breadcrumb = () => {
    const { breadcrumbs } = useBreadcrumb();
    return (_jsxs(TdBreadcrumb, { maxItemWidth: '200px', separator: _jsx("div", { className: 'i-tabler:chevron-right' }), children: [_jsx(BreadcrumbItem, { children: _jsx(Link, { to: '/admin', children: _jsx("div", { className: 'i-tabler:home h-4 w-4' }) }) }), breadcrumbs.map((breadcrumb, index) => {
                return (_jsx(BreadcrumbItem, { children: breadcrumb.href ? (_jsx(Link, { to: breadcrumb.href, children: breadcrumb.label })) : (breadcrumb.label) }, index));
            })] }));
};
