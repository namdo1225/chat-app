/**
 * Interface props for a simple dialog component.
 * @param {boolean} open Whether the dialog is opened.
 * @param {() => void} onClose Function to call when dialog closes.
 */
export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
}

/**
 * Interface props for a dialog component that requires authentication.
 * Check {@link SimpleDialogProps} for more props.
 * @param {string} token The supabase user access token.
 */
export interface AuthDialogProps extends SimpleDialogProps {
    token: string;
}
