import {
    TextField,
    FormControl,
    Button,
    FormLabel,
    Paper,
    Box,
    Typography,
    Alert,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { useFormik } from "formik";
import { RegistrationSchema } from "@/types/yup";
import { useRef } from "react";
import * as userService from "@/services/users";
import { useNavigate } from "react-router-dom";
import Captcha from "@/components/Captcha";
import { useState } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import axios from "axios";
import AvatarEditor from "react-avatar-editor";
import Dropzone from "react-dropzone";
import Logo from "@/components/branding/Logo";
import ChatAvatarEditor from "../../ChatAvatarEditor";
import { unknownError } from "@/utils/string";
import useCaptcha from "@/hooks/useCaptcha";

const fields = [
    {
        name: "firstName",
        label: "First Name",
    },
    {
        name: "lastName",
        label: "Last Name",
    },
    {
        name: "email",
        label: "Email",
        type: "email",
    },
    {
        name: "password",
        label: "Password",
        type: "password",
    },
    {
        name: "passwordConfirm",
        label: "Confirm Password",
        type: "password",
    },
];

/**
 * Component for the /register page.
 * @returns {JSX.Element} The React component.
 */
const Register = (): JSX.Element => {
    const ref = useRef<HTMLInputElement>(null);
    const editorRef = useRef<AvatarEditor>(null);
    const navigate = useNavigate();
    const { captchaToken, setCaptchaToken, captchaRef } = useCaptcha();
    const [registerError, setRegisterError] = useState<string>("");

    const clearUpload = (): void => {
        if (ref.current) {
            formik.setFieldValue("files", undefined);
            ref.current.value = "";
        }
    };

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            passwordConfirm: "",
            files: undefined,
        },
        validationSchema: RegistrationSchema,
        onSubmit: async (values) => {
            try {
                if (!captchaToken)
                    throw new Error("Captcha needs to be filled out.");
                else {
                    let finalBlob: Blob | null = null;
                    const canvas = editorRef.current?.getImageScaledToCanvas();
                    const rect = editorRef.current?.getCroppingRect();

                    if (canvas)
                        finalBlob = await new Promise((resolve) =>
                            canvas.toBlob(resolve)
                        );
                    let finalFile: File | undefined = undefined;
                    if (finalBlob)
                        finalFile = new File([finalBlob], "profile.png", {
                            type: finalBlob.type,
                        });

                    const response = await userService.register(
                        RegistrationSchema.cast({
                            ...values,
                            files: finalFile,
                            ...rect,
                        }),
                        captchaToken
                    );
                    if (response.status === 201) {
                        setRegisterError("");
                        navigate("/login", {
                            state: { email: formik.values.email },
                        });
                    }
                }
            } catch (e) {
                if (axios.isAxiosError(e))
                    setRegisterError(
                        JSON.stringify(e.response?.data) ?? unknownError
                    );
                console.error(e);
            }
            setCaptchaToken("");
            if (captchaRef.current) captchaRef.current.resetCaptcha();
        },
    });

    const handleImageChange = async ({
        target,
    }: {
        target: EventTarget & HTMLInputElement;
    }): Promise<void> => {
        const error = await formik.setFieldValue(
            "files",
            target.files ? target.files[0] : undefined
        );
        if (error && "files" in error) clearUpload();
    };

    const handleDrop = async (dropped: File[]): Promise<void> => {
        const error = await formik.setFieldValue(
            "files",
            dropped ? dropped[0] : undefined
        );
        if (error && "files" in error) clearUpload();
    };

    return (
        <Paper sx={{ m: 2, p: 2 }}>
            <Box className="flex flex-col p-50 m-50">
                <form className="flex flex-col" onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <FormLabel sx={{ mx: "auto", my: 2 }}>
                            Register to NaChat
                        </FormLabel>
                        <Logo />
                        {registerError && (
                            <Alert icon={<ErrorIcon />} severity="error">
                                Error: {registerError}
                            </Alert>
                        )}
                        {fields.map(({ name, label }) => (
                            <TextField
                                required
                                sx={{ my: 2 }}
                                color="secondary"
                                key={name}
                                name={name}
                                label={label}
                                type={
                                    name.includes("password")
                                        ? "password"
                                        : "text"
                                }
                                value={
                                    formik.values[
                                        name as keyof typeof formik.values
                                    ]
                                }
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={Boolean(
                                    formik.errors[
                                        name as keyof typeof formik.errors
                                    ]
                                )}
                                helperText={
                                    formik.errors[
                                        name as keyof typeof formik.errors
                                    ]
                                }
                            />
                        ))}
                        <Typography>
                            Allowed special characters: !@#$%^&*[]{}
                            ()?"\,&lt;&gt;':;|_~`=+-
                        </Typography>
                        <Dropzone onDrop={handleDrop}>
                            {({ getRootProps, getInputProps }) => (
                                <Button
                                    {...getRootProps({
                                        className: "flex flex-wrap",
                                        variant: "contained",
                                        component: "label",
                                    })}
                                    sx={{ my: 2, p: 2 }}
                                    endIcon={<ImageIcon />}
                                >
                                    Upload or Drag Profile Img (png, jpeg, less
                                    than 50KB)
                                    <input
                                        {...getInputProps({
                                            type: "file",
                                            name: "profile",
                                            accept: "png, jpeg, jpeg",
                                            onChange: handleImageChange,
                                        })}
                                        ref={ref}
                                        hidden
                                    />
                                </Button>
                            )}
                        </Dropzone>
                        {formik.values.files && (
                            <Button
                                onClick={clearUpload}
                                sx={{ my: 2 }}
                                variant="contained"
                                component="label"
                            >
                                Clear Upload
                            </Button>
                        )}
                        <div>
                            {formik.errors.files ? (
                                <p style={{ color: "red" }}>
                                    {formik.errors.files}
                                </p>
                            ) : null}
                        </div>
                        {formik.values.files && (
                            <ChatAvatarEditor
                                ref={editorRef}
                                file={formik.values.files}
                            />
                        )}
                        <Captcha
                            captcha={captchaRef}
                            setCaptchaToken={setCaptchaToken}
                        />
                        <Button
                            type="submit"
                            sx={{ my: 2 }}
                            disabled={!captchaToken}
                        >
                            Submit
                        </Button>
                    </FormControl>
                </form>
            </Box>
        </Paper>
    );
};

export default Register;
