import { useCallback, useEffect, useMemo, useState } from 'react';
export const createApp = () => {
    let routers = [];
    const addRouter = (routes) => {
        routers = [...routers, ...routes];
    };
    const getRouter = () => {
        return routers;
    };
    let resources = [];
    const addResources = (resource) => {
        resources = [...resources, ...resource];
    };
    const getResources = () => {
        return resources;
    };
    return {
        addRouter,
        getRouter,
        addResources,
        getResources,
    };
};
export const useWindowSize = () => {
    const [width, setWidth] = useState(0);
    const sizeEmit = useMemo(() => {
        return {
            sm: 0,
            md: 1,
            lg: 2,
            xl: 3,
            xxl: 4,
        };
    }, []);
    const getSize = useCallback((width) => {
        if (width < 640) {
            return [sizeEmit.sm, sizeEmit];
        }
        else if (width < 768) {
            return [sizeEmit.md, sizeEmit];
        }
        else if (width < 1024) {
            return [sizeEmit.lg, sizeEmit];
        }
        else if (width < 1280) {
            return [sizeEmit.xl, sizeEmit];
        }
        else {
            return [sizeEmit.xxl, sizeEmit];
        }
    }, [sizeEmit]);
    useEffect(() => {
        const handler = () => {
            setWidth(window.innerWidth);
        };
        handler();
        window.addEventListener('resize', handler);
        return () => {
            window.removeEventListener('resize', handler);
        };
    }, []);
    return getSize(width);
};
