import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * A null component to automatically scroll back to top on transition of a page.
 * References: https://stackoverflow.com/questions/36904185/react-router-scroll-to-top-on-every-transition
 * @returns {null} The null component.
 */
const ScrollToTop = (): null => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;