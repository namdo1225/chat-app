import { Box } from "@mui/material";
import { Link } from "react-router-dom";

const Logo = ({
    onNav = false,
    display,
    link,
}: {
    onNav?: boolean;
    display?: object;
    link?: string;
}) => {
    const content = (
        <Box
            component="img"
            sx={{
                width: 25,
                height: 25,
                mx: onNav ? "" : "auto",
                backgroundColor: onNav ? "" : "primary.main",
                borderRadius: onNav ? null : 20,
                display,
            }}
            alt="CA Logo"
            src="./logo.png"
        />
    );

    const linkTo = link ? <Link to={link}>{content}</Link> : <>{content}</>;

    return linkTo;
};

export default Logo;
