export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
}

export interface DialogProps extends SimpleDialogProps {
    token: string;
}
