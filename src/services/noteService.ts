import axios from "axios";
import type { Note, NoteTag } from "../types/note";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

export interface FetchNotesResponse {
    notes: Note[],
    totalPages: number
}

interface FetchNotesParams {
    search?: string,
    tag?: string,
    page: number,
    perPage: number,
    sortBy?: string
}

export async function fetchNotes({search, tag, page, perPage, sortBy} : FetchNotesParams) {
    const response = await axios.get<FetchNotesResponse>(
        "https://notehub-public.goit.study/api/notes",
        {
            params: {
                page: page,
                perPage: perPage,
                ...(search && { search }),
                ...(tag && { tag }),
                ...(sortBy && { sortBy }),

            },
            headers: {
                Authorization : `Bearer ${TOKEN}`
            }
        }
    )
    return response.data;
}

export interface CreateNoteParams {
    title: string,
    content: string,
    tag: NoteTag
}

export async function createNote({title, content, tag} : CreateNoteParams) {
    const response = await axios.post<Note>(
        "https://notehub-public.goit.study/api/notes/",
        {
            title,
            content,
            tag
        },
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        }
        
    )
    return response.data;
}

export interface DeleteNoteParams {
    id: string
}

export async function deleteNote({ id }: DeleteNoteParams) {
    const response = await axios.delete<Note>(
        `https://notehub-public.goit.study/api/notes/${id}`,
        {
            headers: {
                Authorization : `Bearer ${TOKEN}`
            }
        }
    )
    return response.data;
} 