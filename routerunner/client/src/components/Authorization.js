const token = localStorage.getItem('token');

axios.get('http://localhost:5000/api/protected-route', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
.then(response => {
  console.log('Protected data:', response.data);
})
.catch(error => {
  console.error('Error accessing protected route:', error);
});