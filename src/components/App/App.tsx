import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import NoteList from "../NoteList/NoteList"
import css from "./App.module.css"
import { createNote, fetchNotes, type CreateNoteParams } from "../../services/noteService";
import { useState } from "react";
import Pagination from "../Pagination/Pagination";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "../SearchBox/SearchBox";

export default function App() {
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [sortBy, setSortBy] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['note', search, tag, page, perPage, sortBy],
    queryFn: () => fetchNotes({search, tag, page, perPage, sortBy}),
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: ({title, content, tag} : CreateNoteParams) => createNote({ title, content, tag }),
    onSuccess: () => {console.log("Todo added successfully");}
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
      <button className={css.button} onClick={() => handleCreateTodo}>Create note +</button>
      </header>
        {data?.notes && data.notes.length > 0 && <NoteList notes={data?.notes} />}
    </div>
    </>
  )
}