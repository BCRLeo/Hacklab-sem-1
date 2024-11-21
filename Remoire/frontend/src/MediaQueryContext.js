import { createContext, useContext, useEffect, useState } from "react";

const MediaQueryContext = createContext();

export const useMediaQueryContext = () => useContext(MediaQueryContext);

export default function MediaQueryProvider({ children }) {
    const [screenSize, setScreenSize] = useState({
        isXs: false,
        isSm: false,
        isMd: false,
        isLg: false,
        isXl: false,
        isXxl: false
    });

    useEffect(() => {
        const xsQuery = window.matchMedia("(max-width: 575px)");
        const smQuery = window.matchMedia("(min-width: 576px) and (max-width: 767px)");
        const mdQuery = window.matchMedia("(min-width: 768px) and (max-width: 990px)");
        const lgQuery = window.matchMedia("(min-width: 991px) and (max-width: 1199px)");
        const xlQuery = window.matchMedia("(min-width: 1200px) and (max-width: 1399px)");
        const xxlQuery = window.matchMedia("(min-width: 1400px)");

        const handleMediaChange = () => {
            setScreenSize({
                isXs: xsQuery.matches,
                isSm: smQuery.matches,
                isMd: mdQuery.matches,
                isLg: lgQuery.matches,
                isXl: xlQuery.matches,
                isXxl: xxlQuery.matches
            });
        };

        handleMediaChange();

        xsQuery.addEventListener("change", handleMediaChange);
        smQuery.addEventListener("change", handleMediaChange);
        mdQuery.addEventListener("change", handleMediaChange);
        lgQuery.addEventListener("change", handleMediaChange);
        xlQuery.addEventListener("change", handleMediaChange);
        xxlQuery.addEventListener("change", handleMediaChange);

        return () => {
            xsQuery.removeEventListener("change", handleMediaChange);
            smQuery.removeEventListener("change", handleMediaChange);
            mdQuery.removeEventListener("change", handleMediaChange);
            lgQuery.removeEventListener("change", handleMediaChange);
            xlQuery.removeEventListener("change", handleMediaChange);
            xxlQuery.removeEventListener("change", handleMediaChange);
        };
    }, []);

    return (
        <MediaQueryContext.Provider value={screenSize}>
            {children}
        </MediaQueryContext.Provider>
    );
}