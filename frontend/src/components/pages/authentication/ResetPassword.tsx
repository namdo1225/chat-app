import { useEffect } from "react";
import { supabase } from "@/config/supabase";
import { useFormik } from "formik";
import { useState } from "react";
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
import { password } from "@/types/yup";
import * as y from "yup";
import Logo from "@/components/branding/Logo";
import Loading from "@/components/Loading";

/**
 * Component for /resetpassword page.
 * @returns {JSX.Element} The React component.
 */
const ResetPassword = (): JSX.Element => {
    const [message, setMessage] = useState<string>("");
    const [reset, setReset] = useState(false);

    const formik = useFormik({
        initialValues: {
            password: "",
        },
        validationSchema: y.object().shape({
            password: password,
        }),
        onSubmit: async (values) => {
            try {
                const { data, error } = await supabase.auth.updateUser({
                    password: values.password,
                });

                if (data) setMessage("Password updated successfully!");
                if (error)
                    setMessage("There was an error updating your password.");
            } catch (e) {
                setMessage(
                    "An error occured while trying to reset your password."
                );
            }
        },
    });

    useEffect(() => {
        supabase.auth.onAuthStateChange((event, _session): void => {
            if (event == "PASSWORD_RECOVERY") setReset(true);
        });
    }, []);

    if (!reset) return <Loading />;

    return (
        <Paper sx={{ m: 2, p: 2 }}>
            <Box className="flex flex-col p-50 m-50">
                <form className="flex flex-col" onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <FormLabel sx={{ mx: "auto", my: 2 }}>
                            Reset Password
                        </FormLabel>
                        <FormLabel sx={{ mx: "auto", my: 2 }}>
                            Enter your new password.
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
                            label="Password"
                            type="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(formik.errors.password)}
                            helperText={formik.errors.password}
                        />
                        <Button type="submit" sx={{ my: 2 }}>
                            Reset Password
                        </Button>
                    </FormControl>
                </form>
            </Box>
        </Paper>
    );
};

export default ResetPassword;
