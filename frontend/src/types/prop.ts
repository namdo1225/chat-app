import { Session } from "@supabase/supabase-js";

export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
}

export interface DialogProps extends SimpleDialogProps {
    session: Session;
}
