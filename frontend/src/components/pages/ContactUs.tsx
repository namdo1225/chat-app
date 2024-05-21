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
import { EmailSchema } from "@/types/yup";
import { useFormik } from "formik";
import Captcha from "@/components/Captcha";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { sendEmail } from "@/services/contact";
import axios from "axios";
import Logo from "@/components/branding/Logo";

const ContactUs = () => {
    const [message, setMessage] = useState<string>("");
    const [captchaToken, setCaptchaToken] = useState("");
    const captcha = useRef<HCaptcha>(null);

    const formik = useFormik({
        initialValues: {
            email: "",
            body: "",
        },
        validationSchema: EmailSchema,
        onSubmit: async (values) => {
            try {
                if (!captchaToken)
                    throw new Error("Captcha needs to be filled out.");
                const response = await sendEmail(
                    values.email,
                    values.body,
                    captchaToken
                );
                if (response.status === 200)
                    setMessage("Your message is successfully sent.");
            } catch (e) {
                if (axios.isAxiosError(e))
                    setMessage(
                        e.response?.data.error ?? "An unknown error occured."
                    );
                console.error(e);
            }
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
                            Contact Us
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
                        <TextField
                            color="secondary"
                            multiline
                            maxRows={5}
                            required
                            sx={{ my: 2 }}
                            label="Body"
                            name="body"
                            value={formik.values.body}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(formik.errors.body)}
                            helperText={formik.errors.body}
                        />
                        <Captcha
                            captcha={captcha}
                            setCaptchaToken={setCaptchaToken}
                        />
                        <Button type="submit" sx={{ my: 2 }}>
                            Submit
                        </Button>
                    </FormControl>
                </form>
            </Box>
        </Paper>
    );
};

export default ContactUs;
