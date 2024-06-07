import { useState } from "react";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { Box } from "@mui/material";

/**
 * A back to top button.
 * @returns {JSX.Element} The null component.
 */
const BackToTop = (): JSX.Element => {
    const [visible, setVisible] = useState(false);

    const toggleVisible = (): void => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300) {
            setVisible(true);
        } else if (scrolled <= 300) {
            setVisible(false);
        }
    };

    const scrollToTop = (): void => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    window.addEventListener("scroll", toggleVisible);

    return (
        <Box
            className="bottom-5 right-5 md:bottom-10 md:right-10 cursor-pointer rounded-xl"
            onClick={scrollToTop}
            sx={{ bgcolor: "secondary.light", position: "fixed", zIndex: (theme) => theme.zIndex.drawer + 5 }}
        >
            <ArrowCircleUpIcon
                className="hover:text-[#e5ffbb]"
                sx={{ display: visible ? "block" : "none" }}
            />
        </Box>
    );
};

export default BackToTop;
