import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemList from './components/ItemList';
import AddItemForm from './components/AddItemForm';
import './App.css';

const App = () => {
  const [items, setItems] = useState([]);

  // Fetch items from the backend
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/items')
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
      });
  }, []);

  // Add a new item
  const addItem = (item) => {
    axios
      .post('http://localhost:5000/api/items', item)
      .then((response) => {
        setItems([...items, response.data]);
      })
      .catch((error) => {
        console.error('Error adding item:', error);
      });
  };

  // Delete an item
  const deleteItem = (id) => {
    axios
      .delete(`http://localhost:5000/api/items/${id}`)
      .then(() => {
        setItems(items.filter((item) => item._id !== id));
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });
  };

  return (
    <div className="App">
      <h1>Item List</h1>
      <AddItemForm addItem={addItem} />
      <ItemList items={items} deleteItem={deleteItem} />
    </div>
  );
};

export default App;
