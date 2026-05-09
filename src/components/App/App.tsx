import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import NoteList from "../NoteList/NoteList"
import css from "./App.module.css"
import { createNote, fetchNotes, type CreateNoteParams } from "../../services/noteService";
import { useState } from "react";
import Pagination from "../Pagination/Pagination";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function App() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['note', search, page],
    queryFn: () => fetchNotes({search, page, perPage: 12}),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({title, content, tag} : CreateNoteParams) => createNote({ title, content, tag }),
    onSuccess: () => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['note'] })
    }
    })

  const handleCreateTodo = ({title, content, tag} : CreateNoteParams) => {
      mutation.mutate({title, content, tag})
  };

  const updateSearchQuery = useDebouncedCallback(
    (value: string) => {
      setSearch(value);
      setPage(1);
    }, 300
  )

  return (
    <>
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={updateSearchQuery}/>
        {(data?.totalPages ?? 0) > 1 &&
          <Pagination totalPages={data?.totalPages ?? 0} page={page} setPage={setPage} />
        }
      <button className={css.button} onClick={() => setIsModalOpen(true)}>Create note +</button>
        </header>
        {isLoading && <Loader/>}
        {isError && <ErrorMessage/>}
        {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm 
                onSubmit={handleCreateTodo} 
                onClose={() => setIsModalOpen(false)} 
            />
        </Modal>
    )}
        {data?.notes && data.notes.length > 0 && <NoteList notes={data?.notes} />}
    </div>
    </>
  )
}