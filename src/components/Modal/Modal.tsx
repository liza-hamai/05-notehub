import { useEffect } from "react";
import css from "./Modal.module.css"
import { createPortal } from "react-dom";

interface ModalProps {
    children: React.ReactNode,
    onClose: () => void
}

export default function Modal({ children, onClose }: ModalProps) {
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    
    return createPortal(
        <div
        className={css.backdrop}
        role="dialog"
        aria-modal="true"
        onClick={onClose}
        >
        <div className={css.modal} onClick={(e) => e.stopPropagation()}>
            {children}
        </div>
        </div>,
    document.getElementById("modal-root")!
    )
}