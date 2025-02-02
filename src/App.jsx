import { useState, useEffect } from 'react';
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import AddBook from './AddBook';

function App() {
  const [books, setBookStore] = useState([]);

  const columnDefs = [
    { field: 'title', sortable: true, filter: true},
    { field: 'author', sortable: true, filter: true},
    { field: 'year', sortable: true, filter: true},
    { field: 'isbn', sortable: true, filter: true},
    { field: 'price', sortable: true, filter: true},

    { 
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params => 
      <IconButton onClick={() => deleteBook(params.value)} size="small" color="error">
        <DeleteIcon />
      </IconButton> 
    }
  ]

  useEffect(() => {
    fetchItems();
  }, [])

  const fetchItems = () => {
    fetch('https://bookstore-fcda5-default-rtdb.firebaseio.com/books/.json')
    .then(response => response.json())
    .then(data => addKeys(data))
    .catch(err => console.error(err))
  }

   // Add keys into the book objects
  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) => 
    Object.defineProperty(item, 'id', {value: keys[index]}));
    setBookStore(valueKeys);
  }
  
  const addBook = (newBook) => {
    fetch('https://bookstore-fcda5-default-rtdb.firebaseio.com/books/.json',
    {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  const deleteBook = (id) => {
    fetch(`https://bookstore-fcda5-default-rtdb.firebaseio.com/books/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  return (
    <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5">
          Bookstore
        </Typography>
      </Toolbar>
    </AppBar> 
    <AddBook addBook={addBook} />  
    <div className="ag-theme-material" style={{ height: 400, width: 1200 }}>
      <AgGridReact 
        rowData={books}
        columnDefs={columnDefs}
      />
    </div>
  </>
  );
}

export default App;