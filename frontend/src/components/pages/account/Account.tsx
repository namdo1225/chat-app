import {
    TextField,
    Button,
    Paper,
    Box,
    Dialog,
    DialogTitle,
    FormControl,
    FormLabel,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import { useState } from "react";
import { supabase } from "@/config/supabase";
import * as userService from "@/services/users";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as y from "yup";
import { email, password } from "@/types/yup";
import { EditProfileSchema } from "@/types/profile";
import { AuthDialogProps } from "@/types/prop";
import useAuth from "@/context/useAuth";

/**
 * Component to delete a user account in a dialog.
 * Check {@link AuthDialogProps} for prop info.
 * @returns {JSX.Element} The React component.
 */
const DeleteAccountDialog = ({
    onClose,
    open,
    token,
}: AuthDialogProps): JSX.Element => {
    const [email, setEmail] = useState("");
    const { user, setNull } = useAuth();

    const handleClose = (): void => {
        setEmail("");
        onClose();
    };

    const deleteAccount = async (): Promise<void> => {
        try {
            if (user) {
                const response = await userService.deleteAccount(
                    user.id,
                    token
                );
                if (response.status === 200) {
                    supabase.auth.signOut();
                    setNull();
                    toast.success(
                        "Successfully deleted your account. We're sorry to see you go!"
                    );
                } else throw Error("Failed to delete your account.");
            } else {
                throw Error("No access token defined.");
            }
        } catch (e) {
            toast.error("Failed to delete your account.");
            console.error(e);
        }
        handleClose();
    };

    return (
        <Dialog onClose={onClose} open={open}>
            <Box sx={{ p: 3, display: "flex", flexDirection: "column" }}>
                <DialogTitle>
                    Type in your email to delete your account:
                </DialogTitle>
                <TextField
                    data-cy="del-email"
                    color="secondary"
                    required
                    sx={{ my: 2 }}
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                />
                <Button
                    data-cy="del-button"
                    onClick={deleteAccount}
                    type="submit"
                    variant="contained"
                    color="error"
                    sx={{ my: 2 }}
                    disabled={user?.email !== email}
                >
                    Delete
                </Button>
                <Button
                    onClick={handleClose}
                    variant="contained"
                    color="info"
                    sx={{ my: 2 }}
                >
                    Cancel
                </Button>
            </Box>
        </Dialog>
    );
};

/**
 * Component for /account page.
 * @returns {JSX.Element} The React component.
 */
const Account = (): JSX.Element => {
    const [open, setOpen] = useState(false);
    const [passwordChecked, setPasswordChecked] = useState(true);
    const { user, session, signOut } = useAuth();
    const handleClickOpen = (): void => {
        setOpen(true);
    };

    const formikEmail = useFormik({
        initialValues: {
            email: user?.email ?? "",
            confirmEmail: "",
        },
        validationSchema: y.object().shape({
            email: email,
            confirmEmail: email.oneOf(
                [y.ref("email")],
                "Your emails do not match."
            ),
        }),
        onSubmit: async (values) => {
            try {
                if (!session?.access_token || !user?.id)
                    throw Error("No access token defined.");

                const { error } = await supabase.auth.updateUser({
                    email: values.email,
                });

                if (!error) {
                    toast.success("You email updated successfully.");
                }
            } catch (e) {
                console.error(e);
            }
        },
    });

    const formikPassword = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: y.object().shape({
            password: password,
            confirmPassword: password.oneOf(
                [y.ref("password")],
                "Your passwords do not match."
            ),
        }),
        onSubmit: async (values) => {
            try {
                if (!session?.access_token || !user?.id)
                    throw Error("No access token defined.");

                const response = await userService.editProfile(
                    user.id,
                    EditProfileSchema.cast({ password: values.password }),
                    session.access_token
                );
                if (response.status === 201) {
                    toast.success("You password updated successfully.");
                    if (passwordChecked) signOut();
                }
            } catch (e) {
                console.error(e);
            }
        },
    });

    return (
        <Box>
            <Paper sx={{ m: 2, p: 2 }}>
                <Box className="flex flex-col p-50 m-50">
                    <form
                        className="flex flex-col"
                        onSubmit={formikEmail.handleSubmit}
                    >
                        <FormControl>
                            <FormLabel sx={{ mx: "auto", my: 2 }}>
                                Update your email
                            </FormLabel>
                            <FormLabel sx={{ mx: "auto", my: 2 }}>
                                Instruction: We will send you a link to both of
                                your email addresses for confirmation. Your
                                email address will stay the same until you have
                                clicked the link in the email.
                            </FormLabel>
                            <TextField
                                color="secondary"
                                required
                                sx={{ my: 2 }}
                                label="Email"
                                type="email"
                                name="email"
                                value={formikEmail.values.email}
                                onChange={formikEmail.handleChange}
                                onBlur={formikEmail.handleBlur}
                                error={Boolean(formikEmail.errors.email)}
                                helperText={formikEmail.errors.email}
                            />
                            <TextField
                                color="secondary"
                                required
                                sx={{ my: 2 }}
                                label="Confirm Email"
                                type="email"
                                name="confirmEmail"
                                value={formikEmail.values.confirmEmail}
                                onChange={formikEmail.handleChange}
                                onBlur={formikEmail.handleBlur}
                                error={Boolean(formikEmail.errors.confirmEmail)}
                                helperText={formikEmail.errors.confirmEmail}
                            />
                            <Button
                                disabled={
                                    formikEmail.values.email === user?.email ||
                                    formikEmail.values.confirmEmail ===
                                        user?.email ||
                                    formikEmail.values.email !=
                                        formikEmail.values.confirmEmail ||
                                    !formikEmail.values.email ||
                                    !formikEmail.values.confirmEmail
                                }
                                type="submit"
                                sx={{ my: 2 }}
                            >
                                Submit
                            </Button>
                        </FormControl>
                    </form>
                </Box>
            </Paper>
            <Paper sx={{ m: 2, p: 2 }}>
                <Box className="flex flex-col p-50 m-50">
                    <form
                        className="flex flex-col"
                        onSubmit={formikPassword.handleSubmit}
                    >
                        <FormControl>
                            <FormLabel sx={{ mx: "auto", my: 2 }}>
                                Update your password
                            </FormLabel>
                            <TextField
                                color="secondary"
                                required
                                sx={{ my: 2 }}
                                label="Password"
                                type="password"
                                name="password"
                                value={formikPassword.values.password}
                                onChange={formikPassword.handleChange}
                                onBlur={formikPassword.handleBlur}
                                error={Boolean(formikPassword.errors.password)}
                                helperText={formikPassword.errors.password}
                            />
                            <TextField
                                color="secondary"
                                required
                                sx={{ my: 2 }}
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                value={formikPassword.values.confirmPassword}
                                onChange={formikPassword.handleChange}
                                onBlur={formikPassword.handleBlur}
                                error={Boolean(
                                    formikPassword.errors.confirmPassword
                                )}
                                helperText={
                                    formikPassword.errors.confirmPassword
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={passwordChecked}
                                        onChange={() =>
                                            setPasswordChecked(!passwordChecked)
                                        }
                                    />
                                }
                                label="Sign out of all your session"
                            />
                            <Button
                                disabled={
                                    formikPassword.values.password !==
                                        formikPassword.values.confirmPassword ||
                                    !formikPassword.values.password ||
                                    !formikPassword.values.confirmPassword
                                }
                                type="submit"
                                sx={{ my: 2 }}
                            >
                                Submit
                            </Button>
                        </FormControl>
                    </form>
                </Box>
            </Paper>

            {session && (
                <Paper sx={{ m: 2, p: 2 }}>
                    <Box className="flex flex-col p-50 m-50">
                        <Button
                            onClick={handleClickOpen}
                            variant="contained"
                            color="error"
                            sx={{ my: 2 }}
                        >
                            Delete Account
                        </Button>
                        <DeleteAccountDialog
                            open={open}
                            onClose={() => setOpen(false)}
                            token={session.access_token}
                        />
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

export default Account;
