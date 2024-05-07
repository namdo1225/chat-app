import {
    Box,
    Button,
    Drawer,
    Dialog,
    DialogTitle,
    Paper,
    Typography,
    Divider,
    TextField,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { useState } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "@/context/AuthProvider";
import { useFormik } from "formik";
import { CreateChatSchema } from "@/types/chat";
import { createChat } from "@/services/chat";
import axios from "axios";
import toast from "react-hot-toast";
import { Session } from "@supabase/supabase-js";

export interface CreateChatDialogProps {
    open: boolean;
    onClose: () => void;
    session: Session;
}

const CreateChatDialog = ({
    onClose,
    open,
    session,
}: CreateChatDialogProps) => {
    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            public: false,
        },
        validationSchema: CreateChatSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                if (!session?.access_token)
                    throw Error("No access token defined.");

                const response = await createChat(values, session.access_token);

                if (response)
                    toast.success("Chat created successfully.");
            } catch (e) {
                if (axios.isAxiosError(e))
                    toast.error(
                        e.response?.data.error ?? "An unknown error occured."
                    );
                console.error(e);
            }
        },
    });

    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    return (
        <Dialog onClose={onClose} open={open}>
            <Box sx={{ p: 3, display: "flex", flexDirection: "column" }}>
                <DialogTitle textAlign="center">Create a chat:</DialogTitle>
                <TextField
                    color="secondary"
                    required
                    sx={{ my: 2 }}
                    label="Chat name"
                    type="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={!!formik.errors.name}
                    helperText={formik.errors.name}
                />
                <TextField
                    color="secondary"
                    sx={{ my: 2 }}
                    label="Chat description"
                    name="description"
                    value={formik.values.description}
                    multiline
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={!!formik.errors.description}
                    helperText={formik.errors.description}
                />
                <Typography>Add friends to chat:</Typography>
                <FormControlLabel
                    control={<Checkbox checked={formik.values.public} />}
                    onChange={formik.handleChange}
                    label="Make your chat discoverable"
                    name="public"
                />
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

const Chats = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openCreateChat, setOpenCreateChat] = useState(false);
    const { session } = useAuth();

    return (
        <Box>
            <Drawer
                disableScrollLock={true}
                open={openDrawer}
                sx={{
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                    },
                }}
                anchor="left"
            >
                <Box
                    onClick={() => setOpenDrawer(false)}
                    my={10}
                    sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Divider />
                    {session && (
                        <Button
                            onClick={() => setOpenCreateChat(true)}
                            endIcon={<AddIcon />}
                        >
                            Create a chat
                        </Button>
                    )}
                    <Button
                        onClick={() => setOpenDrawer(false)}
                        endIcon={<ExitToAppIcon />}
                    >
                        Hide bar
                    </Button>
                </Box>
            </Drawer>
            <Paper sx={{ m: 2 }}>
                <Button onClick={() => setOpenDrawer(true)}>Open drawer</Button>
                <Typography>Open the sidebar to select a chat</Typography>
            </Paper>
            {session && <CreateChatDialog
                open={openCreateChat}
                onClose={() => setOpenCreateChat(false)}
                session={session}
            />}
        </Box>
    );
};

export default Chats;
