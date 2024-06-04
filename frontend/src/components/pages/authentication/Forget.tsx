import {
    TextField,
    FormControl,
    Button,
    FormLabel,
    Paper,
    Box,
    Alert,
} from "@mui/material";
import Notifications from "@mui/icons-material/Notifications";
import { useRef, useState } from "react";
import { useFormik } from "formik";
import * as y from "yup";
import { resendVerify, resetPassword } from "@/services/users";
import { email } from "@/types/yup";
import Captcha from "@/components/Captcha";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import axios from "axios";
import Logo from "@/components/branding/Logo";
import { unknownError } from "@/utils/string";
import { HCAPTCHA_TOKEN } from "@/config/config";

const MSG_INTRO =
    "If your email exists within our system, an email has been sent to ";
const ACTION_INTRO = "Please click on the link within the email to ";

/**
 * Component for /forget page.
 * @returns {JSX.Element} The React component.
 */
const Forget = (): JSX.Element => {
    const [message, setMessage] = useState<string>("");
    const [submit, setSubmit] = useState<string>("reset");
    const [captchaToken, setCaptchaToken] = useState("");
    const captcha = useRef<HCaptcha>(null);

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: y.object().shape({
            email: email,
        }),
        onSubmit: (values) => {
            try {
                if (!captchaToken)
                    throw new Error("Captcha needs to be filled out.");
                if (submit === "reset")
                    resetPassword(values.email, HCAPTCHA_TOKEN ?? captchaToken);
                else if (submit === "verify")
                    resendVerify(values.email, HCAPTCHA_TOKEN ?? captchaToken);
            } catch (e) {
                setMessage(
                    axios.isAxiosError(e) ? e.response?.data : unknownError
                );
                console.error(e);
            }

            if (submit === "reset")
                setMessage(
                    `${MSG_INTRO}${values.email}. ${ACTION_INTRO}reset your password.`
                );
            else if (submit === "verify")
                setMessage(
                    `${MSG_INTRO}${values.email}. ${ACTION_INTRO}verify your account.`
                );
            setCaptchaToken("");
            if (captcha.current) captcha.current.resetCaptcha();
        },
    });

    return (
        <Paper sx={{ m: 2, p: 2 }}>
            <Box className="flex flex-col p-50 m-50">
                <form className="flex flex-col" onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <FormLabel sx={{ mx: "auto", my: 2 }}>
                            Forget Password or Verify Your Email
                        </FormLabel>
                        <FormLabel sx={{ mx: "auto", my: 2 }}>
                            Enter your email to either reset your password or
                            verify your account.
                        </FormLabel>
                        <Logo />
                        {message && (
                            <Alert icon={<Notifications />} severity="info">
                                Note: {message}
                            </Alert>
                        )}
                        <TextField
                            color="secondary"
                            required
                            sx={{ my: 2 }}
                            label="Email"
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(formik.errors.email)}
                            helperText={formik.errors.email}
                        />
                        <Captcha
                            captcha={captcha}
                            setCaptchaToken={setCaptchaToken}
                        />
                        <Button
                            onClick={() => setSubmit("reset")}
                            type="submit"
                            sx={{ my: 2 }}
                        >
                            Reset Password
                        </Button>
                        <Button
                            onClick={() => setSubmit("verify")}
                            type="submit"
                            sx={{ my: 2 }}
                        >
                            Send Verify Email
                        </Button>
                    </FormControl>
                </form>
            </Box>
        </Paper>
    );
};

export default Forget;
