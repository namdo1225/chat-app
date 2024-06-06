import {
    TextField,
    FormControl,
    Button,
    FormLabel,
    Paper,
    Box,
    Divider,
    Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import { useState } from "react";
import { LoginSchema, optionalStr } from "@/types/yup";
import { useFormik } from "formik";
import Logo from "@/components/branding/Logo";
import * as y from "yup";
import useAuth from "@/context/useAuth";

/**
 * Component for the /login page.
 * @returns {JSX.Element} The React component.
 */
const Login = (): JSX.Element => {
    const { signInWithPassword } = useAuth();
    const { state } = useLocation();

    const email = state
        ? y
              .object()
              .shape({ email: optionalStr })
              .nullable()
              .validateSync(state)?.email
        : "";

    const [loginError, setLoginError] = useState<string>("");
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: LoginSchema,
        onSubmit: async (values) => {
            try {
                const response = await signInWithPassword(
                    values.email,
                    values.password
                );
                if (response && response.message) {
                    setLoginError(response.message);
                }
            } catch (e) {
                setLoginError("An error occured while trying to login.");
            }
        },
    });

    return (
        <Paper sx={{ m: 2, p: 2 }}>
            <Box className="flex flex-col p-50 m-50">
                <form className="flex flex-col" onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <FormLabel sx={{ mx: "auto", my: 2 }}>
                            Login to NaChat
                        </FormLabel>
                        <Logo />
                        {email && (
                            <Alert icon={<WarningIcon />} severity="warning">
                                A verification email has been sent to {email}.
                                You cannot login until you are verified.
                            </Alert>
                        )}
                        {loginError && (
                            <Alert icon={<ErrorIcon />} severity="error">
                                Error: {loginError}
                            </Alert>
                        )}
                        <TextField
                            data-cy="login-email"
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
                            data-cy="login-password"
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
                            Submit
                        </Button>
                        <Divider />
                        <Button
                            onClick={() => navigate("/register")}
                            sx={{ my: 2 }}
                        >
                            Register
                        </Button>
                        <Button
                            onClick={() => navigate("/forget")}
                            sx={{ my: 2 }}
                        >
                            Forget Password or Verify Email
                        </Button>
                    </FormControl>
                </form>
            </Box>
        </Paper>
    );
};

export default Login;
