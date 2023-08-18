import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from 'clsx';
import React, { forwardRef } from 'react';
import { Image } from 'tdesign-react/esm';
const MediaTextComp = ({ size = 'default', children }, ref) => {
    return (_jsxs("div", { className: clsx(['app-media-text', size == 'small' ? 'app-media-text-sm' : '']), ref: ref, children: [React.Children.map(children, (child) => React.isValidElement(child) &&
                child.type.displayName === 'MediaText.Image' &&
                child), _jsxs("div", { className: 'app-media-text-content', children: [React.Children.map(children, (child) => React.isValidElement(child) &&
                        child.type.displayName === 'MediaText.Title' &&
                        child), _jsx("div", { className: 'empty:hidden', children: React.Children.map(children, (child) => React.isValidElement(child) &&
                            child.type.displayName === 'MediaText.Desc' &&
                            child) })] })] }));
};
const MediaTextImage = (props) => {
    const { width = 45, height = 45, shape = 'round' } = props;
    return _jsx(Image, { ...props, shape: shape, style: { width: width, height: height }, loading: ' ' });
};
MediaTextImage.displayName = 'MediaText.Image';
const MediaTextTitle = ({ children }) => {
    return (_jsx("div", { className: clsx(['app-media-text-title']), "data-highlight": true, children: _jsx("div", { className: 'inline-block', children: children }) }));
};
MediaTextTitle.displayName = 'MediaText.Title';
const MediaTextDesc = ({ children }) => {
    return _jsx("div", { className: clsx(['app-media-text-desc']), children: children });
};
MediaTextDesc.displayName = 'MediaText.Desc';
export const MediaText = forwardRef(MediaTextComp);
MediaText.Image = MediaTextImage;
MediaText.Title = MediaTextTitle;
MediaText.Desc = MediaTextDesc;
