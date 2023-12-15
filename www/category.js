let drawCategories = (data) => {
  let parent = document.getElementById('categoryList');
  parent.innerHTML = '';   // Limpiar la lista antes de agregar las categorías

  data.forEach(category => {
    let child = document.createElement('a');
    child.className = "list-group-item list-group-item-action";
    child.innerText = category.name;
    child.style.cursor = 'pointer';
    child.href = `#${category.id}`;  // Agregar un atributo href para crear el enlace

    // Agregar el ícono de eliminar
    let deleteIcon = document.createElement('i'); 
    deleteIcon.className = 'fas fa-trash-alt';
    deleteIcon.style.cursor = 'pointer';

    deleteIcon.addEventListener('click', () => deleteCategory(category.id));// Evento de clic al ícono de eliminar
    child.appendChild(deleteIcon); // Agregar el ícono al final del elemento de la lista
    child.addEventListener('click', () => showCategorySites(category.id));
    parent.appendChild(child);
  });
}

fetch("http://localhost:3000/categories")
  .then(res => res.json())
  .then(data => drawCategories(data))

//Modal para añadir categoría
function openModal() {
  document.getElementById("myModal").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}
function closeModal() {
  document.getElementById("myModal").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

//Modal para eliminar categoría
function openModalConfirmation() {
  document.getElementById("myModalConfirmation").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}
function closeModalConfirmation() {
  document.getElementById("myModalConfirmation").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

function addCategory() {
  let value = document.getElementById("name").value;
  if (value.length === 0) {
    document.getElementById("error").style.display = "block";
  } else {
    insertCategory(value)
  }
}

function insertCategory(categoryName) {
  const apiUrl = 'http://localhost:3000/categories';
  const data = {
    name: categoryName
  };

  // Cabecera petición
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // Convierte el objeto JavaScript a JSON
  };

  fetch(apiUrl, requestOptions)
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta del servidor:', data);
      closeModal("myModal");
      window.location.reload();
    })
    .catch(error => {
      console.error('Error en la petición:', error);
    });
}

function waitForModalConfirmation() {
  return new Promise((resolve, reject) => {
    document.getElementById('yesBtn').onclick = () => { 
        resolve(true);
    }
    document.getElementById('noBtn').onclick = () => { 
        resolve(false);
    }
  });
}
function deleteCategory(categoryId) {
  openModalConfirmation();
  waitForModalConfirmation().then(shouldDelete => {
    if (!shouldDelete) {
      closeModalConfirmation();
      return;
    }
    const apiUrl = `http://localhost:3000/categories/${categoryId}`;

    // Cabecera petición
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(apiUrl, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error en la petición`);
        }
        return Promise.resolve();
      })
      .then(() => { // Después de eliminar, volver a cargar las categorías
        fetch("http://localhost:3000/categories")
          .then(res => res.json())
          .then(data => {
            drawCategories(data); // Actualizar la lista de categorías
            closeModalConfirmation(); // Cerrar el modal después de actualizar la lista
          })
          .catch(error => {
            console.error('Error al cargar categorías:', error);
          });
      })
      .catch(error => {
        console.error('Error en la petición:', error);
      });
  });
}

function showCategorySites(categoryId) {
  fetch(`http://localhost:3000/categories/${categoryId}`)
    .then(result => result.json())
    .then(data => {
      const sites = data.sites
      console.log(data)

      const siteTableBody = document.getElementById('siteTableBody');

      siteTableBody.innerHTML = '';

      sites.forEach(sites => {

        const newRow = document.createElement('tr')

        const nameCell = document.createElement('th')
        nameCell.textContent = sites.name;

        const userCell = document.createElement('td')
        userCell.textContent = sites.user;

        const createdAtCell = document.createElement ('td')
        createdAtCell.textContent = sites.createdAt;

        const actionsCell = document.createElement('td');
          actionsCell.innerHTML = `
          <div class = "icon-container">
            <i class="fas fa-external-link-alt mr-3"></i>
          
          <div class = "icon-container">
            <i class="fas fa-edit mr-3"></i>
          </div>
          <div class = "icon-container">
            <i class="fas fa-trash-alt"></i>
          </div>
          `;

        // Agregar celdas a la fila
        newRow.appendChild(nameCell);
        newRow.appendChild(userCell);
        newRow.appendChild(createdAtCell);
        newRow.appendChild(actionsCell)

        // Agregar fila a la tabla
        siteTableBody.appendChild(newRow);
      });
    })
    .catch(error => console.error(`Error en la petición:', ${error}`));
  }
    