async function fetchData(id) {
  try {
    const response = await fetch(`https://reqres.in/api/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'reqres-free-v1',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('User data:', data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchData(23);
