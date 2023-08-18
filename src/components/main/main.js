import { jsx as _jsx } from "react/jsx-runtime";
export const Main = ({ children }) => {
    return (_jsx("div", { className: 'p-4', children: _jsx("div", { children: children }) }));
};
