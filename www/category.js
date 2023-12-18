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

document.addEventListener('DOMContentLoaded', function() { //Se ejecuta cuando el Dom este cargado
  let parent = document.getElementById('categoryList');
  if (parent) {  //Se ejecuta solo cuando el elemento esta en categoryList
      fetch("http://localhost:3000/categories")
          .then(res => res.json())
          .then(data => drawCategories(data));
  }
});

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

let selectedCategoryId = null; // Variable global para almacenar el ID de la categoría seleccionada

function showCategorySites(categoryId) {
  selectedCategoryId = categoryId; // Almacena el ID de la categoría seleccionada
  fetch(`http://localhost:3000/categories/${categoryId}`)
    .then(result => result.json())
    .then(data => {
      const sites = data.sites
      console.log(data)

      const siteTableBody = document.getElementById('siteTableBody');

      siteTableBody.innerHTML = '';

      sites.forEach(site => {

        const newRow = document.createElement('tr')

        const nameCell = document.createElement('th')
        nameCell.textContent = site.name;

        const userCell = document.createElement('td')
        userCell.textContent = site.user;

        const createdAtCell = document.createElement ('td')
        createdAtCell.textContent = site.createdAt;

        const actionsCell = document.createElement('td');
          actionsCell.innerHTML = `
          <div class = "icon-container">
            <i class="fas fa-external-link-alt mr-3"></i>
          
          <div class = "icon-container">
            <i class="fas fa-edit mr-3"></i>
          </div>
          <div class = "icon-container">
            <i class="fas fa-trash-alt" onclick="deleteSite('${site.id}', '${categoryId}')"></i>
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
    
  function navigateAddSite() {
    if (selectedCategoryId !== null) {
      window.location.href = `/addNewSite.html?categoryId=${selectedCategoryId}`;
    } else {
      // Error, debes seleccionar antes una categoría
      showMessage('Debes seleccionar primero una categoría!');
      setTimeout(() => {
        hideMessage();
      }, 3000);
    }
  
  }
  
  function showMessage(text) {
    document.getElementById('messageAlert').style.display = 'block';
    document.getElementById('messageAlert').innerHTML = text;
  }
  
  function hideMessage() {
    document.getElementById('messageAlert').style.display = 'none';
    document.getElementById('messageAlert').innerHTML = '';
  }

  
  function deleteSite(idSite, idCategory) {
    console.log('delete, id: ', idSite);
    openModalConfirmation();
    waitForModalConfirmation().then(shouldDelete => {
      if (!shouldDelete) {
        closeModalConfirmation();
        return;
      }

      const apiUrl = `http://localhost:3000/sites/${idSite}`;
  
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
        .then(() => { // Después de eliminar, volver a cargar los sitios
          fetch("http://localhost:3000/sites")
            .then(res => res.json())
            .then(data => {
              showCategorySites(idCategory);
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


  