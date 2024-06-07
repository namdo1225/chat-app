import { Box } from "@mui/material";
import { Link } from "react-router-dom";

/**
 * Logo component for CAChat
 * @param {boolean | undefined} props.onNav Whether the logo
 * is on the navigation bar.
 * @param {object | undefined} props.display The MaterialUI style for the logo.
 * @param {string | undefined} props.link The link for the navigation bar.
 * @returns {JSX.Element} The React component.
 */
const Logo = ({
    onNav = false,
    display,
    link,
}: {
    onNav?: boolean;
    display?: object;
    link?: string;
}): JSX.Element => {
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
                my: onNav ? 0 : 2,
            }}
            alt="CA Logo"
            src="./logo.png"
        />
    );

    const linkTo = link ? <Link to={link}>{content}</Link> : <>{content}</>;

    return linkTo;
};

export default Logo;
