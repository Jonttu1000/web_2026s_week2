const API = 'https://media2.edu.metropolia.fi/restaurant/api/v1';

const tbody = document.querySelector('#restaurants');
const dialog = document.querySelector('#restaurant-dialog');
const statusText = document.querySelector('#status');

// Generic fetch function
async function fetchData(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json();
}

// Calculate distance
function getDistance(lat1, lon1, lat2, lon2) {
  const latDifference = lat1 - lat2;
  const lonDifference = lon1 - lon2;

  return Math.sqrt(latDifference ** 2 + lonDifference ** 2);
}

// Get users current location
function getUserPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(error)
    );
  });
}

// Load and sort restaurants
async function loadRestaurants() {
  try {
    statusText.textContent = 'Loading restaurants...';

    const restaurants = await fetchData(`${API}/restaurants`);

    statusText.textContent = 'Getting your location...';

    const userPosition = await getUserPosition();

    // Sort restaurants from nearest to farthest
    restaurants.sort((a, b) => {
      const [lonA, latA] = a.location.coordinates;
      const [lonB, latB] = b.location.coordinates;

      const distanceA = getDistance(
        userPosition.latitude,
        userPosition.longitude,
        latA,
        lonA
      );

      const distanceB = getDistance(
        userPosition.latitude,
        userPosition.longitude,
        latB,
        lonB
      );

      return distanceA - distanceB;
    });

    // Display restaurants
    restaurants.forEach((restaurant) => {
      const row = document.createElement('tr');

      const nameCell = document.createElement('td');
      nameCell.textContent = restaurant.name;

      const addressCell = document.createElement('td');
      addressCell.textContent = restaurant.address;

      row.addEventListener('click', () => {
        document.querySelectorAll('.highlight').forEach((element) => {
          element.classList.remove('highlight');
        });

        nameCell.classList.add('highlight');

        showRestaurant(restaurant);
      });

      row.append(nameCell, addressCell);
      tbody.appendChild(row);
    });

    statusText.textContent = `${restaurants.length} restaurants sorted by distance`;
  } catch (error) {
    statusText.textContent = `Could not load restaurants: ${error.message}`;

    console.error(error);
  }
}

// Display restaurant information and daily menu
async function showRestaurant(restaurant) {
  dialog.replaceChildren();

  const title = document.createElement('h2');
  title.textContent = restaurant.name;
  dialog.appendChild(title);

  const details = [
    ['Address', restaurant.address],
    ['Postal code', restaurant.postalCode],
    ['City', restaurant.city],
    ['Phone', restaurant.phone],
    ['Company', restaurant.company],
  ];

  details.forEach(([label, value]) => {
    const p = document.createElement('p');
    p.textContent = `${label}: ${value || 'Not available'}`;
    dialog.appendChild(p);
  });

  const menuTitle = document.createElement('h3');
  menuTitle.textContent = "Today's menu";
  dialog.appendChild(menuTitle);

  const menuContainer = document.createElement('div');
  menuContainer.textContent = 'Loading menu...';
  dialog.appendChild(menuContainer);

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.addEventListener('click', () => dialog.close());
  dialog.appendChild(closeButton);

  dialog.showModal();

  try {
    const menu = await fetchData(
      `${API}/restaurants/daily/${restaurant._id}/fi`
    );

    console.log('Menu response:', menu);

    menuContainer.replaceChildren();

    if (!Array.isArray(menu.courses) || menu.courses.length === 0) {
      menuContainer.textContent = 'No menu available today.';
      return;
    }

    menu.courses.forEach((course) => {
      const p = document.createElement('p');
      p.textContent = course.name || 'Unnamed course';
      menuContainer.appendChild(p);
    });
  } catch (error) {
    menuContainer.textContent = `Could not load menu: ${error.message}`;
    console.error(error);
  }
}

loadRestaurants();
