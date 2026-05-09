import { keepPreviousData, useQuery } from "@tanstack/react-query"
import NoteList from "../NoteList/NoteList"
import css from "./App.module.css"
import { fetchNotes } from "../../services/noteService";
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
                onClose={() => setIsModalOpen(false)} 
            />
        </Modal>
    )}
        {data?.notes && data.notes.length > 0 && <NoteList notes={data?.notes} />}
    </div>
    </>
  )
}