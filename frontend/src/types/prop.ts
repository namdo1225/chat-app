
/**
 * Interface props for a simple dialog component.
 * @param {boolean} open Whether the dialog is opened.
 * @param {() => void} onClose Function to call when dialog closes.
 */
export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
}

export interface DialogProps extends SimpleDialogProps {
    token: string;
}
