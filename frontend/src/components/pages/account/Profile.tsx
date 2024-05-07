import {
    TextField,
    FormControl,
    Button,
    FormLabel,
    Paper,
    Box,
    FormControlLabel,
    Checkbox,
    Typography,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { useFormik } from "formik";
import { EditProfileSchema } from "@/types/profile";
import { useRef } from "react";
import * as userService from "@/services/users";
import axios from "axios";
import AvatarEditor from "react-avatar-editor";
import Dropzone from "react-dropzone";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";
import ChatAvatarEditor from "@/components/ChatAvatarEditor";

const fields = [
    {
        name: "firstName",
        label: "First Name",
    },
    {
        name: "lastName",
        label: "Last Name",
    },
];

const Profile = () => {
    const ref = useRef<HTMLInputElement>(null);
    const editorRef = useRef<AvatarEditor>(null);
    const { session, user, refreshToken, profile } = useAuth();

    const clearUpload = () => {
        if (ref.current) {
            formik.setFieldValue("files", undefined);
            ref.current.value = "";
        }
    };

    const curFirstName = user?.user_metadata.first_name;
    const curLastName = user?.user_metadata.last_name;

    const formik = useFormik({
        initialValues: {
            firstName: String(curFirstName) ?? "",
            lastName: String(curLastName) ?? "",
            files: undefined,
            publicProfile: !!profile?.public_profile,
        },
        validationSchema: EditProfileSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                if (!session?.access_token || !user?.id)
                    throw Error("No access token defined.");

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

                const response = await userService.editProfile(
                    user.id,
                    EditProfileSchema.cast({
                        ...values,
                        files: finalFile,
                        ...rect,
                    }),
                    session.access_token
                );
                if (response.status === 201) {
                    toast.success("You profile updated successfully.");
                    await refreshToken();
                }
            } catch (e) {
                if (axios.isAxiosError(e))
                    toast.error(
                        e.response?.data.error ?? "An unknown error occured."
                    );
                console.error(e);
            }
        },
    });

    const handleImageChange = async ({
        target,
    }: {
        target: EventTarget & HTMLInputElement;
    }) => {
        const error = await formik.setFieldValue(
            "files",
            target.files ? target.files[0] : undefined
        );
        if (error && "files" in error) clearUpload();
    };

    const handleDrop = async (dropped: File[]) => {
        const error = await formik.setFieldValue(
            "files",
            dropped ? dropped[0] : undefined
        );
        if (error && "files" in error) clearUpload();
    };

    return (
        <Paper sx={{ m: 2, p: 2 }}>
            <Box>
                <form className="flex flex-col" onSubmit={formik.handleSubmit}>
                    <FormLabel sx={{ mx: "auto", mb: 4 }}>
                        Edit Your Profile
                    </FormLabel>
                    <Box
                        component="img"
                        sx={{
                            mx: "auto",
                            height: 1 / 8,
                            width: 1 / 8,
                            borderRadius: 20,
                        }}
                        alt="User profile"
                        src={profile?.profile_photo}
                    />
                    <FormControl>
                        {fields.map(
                            ({ name, label }) =>
                                label !== "publicProfile" && (
                                    <TextField
                                        required
                                        sx={{ my: 2 }}
                                        color="secondary"
                                        key={name}
                                        name={name}
                                        label={label}
                                        type="text"
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
                                )
                        )}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formik.values.publicProfile}
                                />
                            }
                            onChange={formik.handleChange}
                            label="Make your profile discoverable"
                            name="publicProfile"
                        />
                        <Typography>User ID: {user?.id}</Typography>
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
                                    Replace Profile Img (png, jpeg, less than
                                    50KB)
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
                        <Button
                            disabled={
                                profile?.public_profile ===
                                    formik.values.publicProfile &&
                                curFirstName === formik.values.firstName &&
                                curLastName === formik.values.lastName &&
                                !formik.values.files
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
    );
};

export default Profile;