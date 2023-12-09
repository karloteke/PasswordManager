let drawCategories = (data) => {
  let parent = document.getElementById('categoryList');
  data.forEach(category => {
    let child = document.createElement('a');
    child.className = "list-group-item list-group-item-action";
    child.innerText = category.name;
    parent.appendChild(child);
  });
}

fetch("http://localhost:3000/categories")
  .then(res => res.json())
  .then(data => drawCategories(data))

function openModal() {
    document.getElementById("myModal").classList.add("active");
    document.getElementById("overlay").classList.add("active");
  }

  function closeModal() {
    document.getElementById("myModal").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
  }

  function addCategory(){
    let value = document.getElementById("name").value;
    if(value.length === 0){
      document.getElementById("error").style.display="block";
    }else{
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
            closeModal();
            window.location.reload();
        })
        .catch(error => {
            console.error('Error en la petición:', error);
        });
}