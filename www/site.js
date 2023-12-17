function addNewSiteToCategory() {
  //urlSearchParams -> http://127.0.0.1:8080/addNewSite.html?categoryId=20 entonces categoryId=20
  const categoryId = new URLSearchParams(window.location.search).get('categoryId');

  let siteName = document.getElementsByName("name")[0].value;
  let siteURL = document.getElementsByName("url")[0].value;
  let userName = document.getElementsByName("user")[0].value;
  let password = document.getElementsByName("password")[0].value;
  let description = document.getElementsByName("description")[0].value;

  // Verificar si los campos requeridos están vacíos
  if (!siteName || !userName || !password) {
    showMessage('Debes rellenar nombre, usuario y contraseña');
    setTimeout(() => {
      hideMessage();
    }, 3000);


    return;
  }

  const data = {
    name: siteName,
    url: siteURL,
    user: userName,
    password: password,
    description: description
  };

  const apiUrl = `http://localhost:3000/categories/${categoryId}`; 

  // Cabecera de la petición
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };

  fetch(apiUrl, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al guardar el sitio');
      }
      return response.json();
    })
    .then(data => {
      console.log('Sitio añadido:', data);
      window.location = "/index.html";
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

    function openModalWarning() {
      document.getElementById("myModalWarning").classList.add("active");
      document.getElementById("overlay").classList.add("active");
    }
    function closeModalWarning() {
      document.getElementById("myModalWarning").classList.remove("active");
      document.getElementById("overlay").classList.remove("active");
    }

    function resetForm(){
      document.login.reset();
    }

  //Funcion para habilitar y deshabilitar el botón de guardar
  function checkFields() {
    console.log('Exec');
    const urlInput = document.forms['login'].elements['url'].value;
    const userInput = document.forms['login'].elements['user'].value;
    const passwordInput = document.forms['login'].elements['password'].value;
    const descriptionInput = document.forms['login'].elements['description'].value;

    document.login.save;
    
    if(urlInput != "" && userInput != "" && passwordInput != "" && descriptionInput != ""){
        document.login.save.disabled = true;
    }else{
        document.login.save.disabled = false;
    }
  }       
