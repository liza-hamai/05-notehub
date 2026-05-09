import css from "./NoteForm.module.css"
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import type { NoteTag } from "../../types/note";

const validationSchema = Yup.object({
    title: Yup.string().min(3, 'Мінімум 3 символи').max(50, 'Максимум 50 символів').required('Обовязкове поле'),
    content: Yup.string().max(500, 'Максимум 500 символів'),
    tag: Yup.string().oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']).required('Обовязкове поле')
});

interface NoteFormProps {
    onSubmit: (values: { title: string; content: string; tag: NoteTag }) => void;
    onClose: () => void;
}

export default function NoteForm({ onSubmit, onClose }: NoteFormProps) {
    return (
        <Formik
            initialValues={{ title: '', content: '', tag: 'Todo' }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor="title">Title</label>
                    <Field id="title" name="title" className={css.input} />
                    <ErrorMessage name="title" component="span" className={css.error} />
                </div>
                <div className={css.formGroup}>
                    <label htmlFor="content">Content</label>
                    <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
                    <ErrorMessage name="content" component="span" className={css.error} />
                </div>
                <div className={css.formGroup}>
                    <label htmlFor="tag">Tag</label>
                    <Field as="select" id="tag" name="tag" className={css.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    <ErrorMessage name="tag" component="span" className={css.error} />
                </div>
                <div className={css.actions}>
                    <button type="button" className={css.cancelButton} onClick={onClose}>Cancel</button>
                    <button type="submit" className={css.submitButton}>Create note</button>
                </div>
            </Form>
        </Formik>
    )
}