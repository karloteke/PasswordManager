function addNewSiteToCategory() {
  //urlSearchParams -> http://127.0.0.1:8080/addNewSite.html?categoryId=20 entonces categoryId=20
  const categoryId = new URLSearchParams(window.location.search).get('categoryId');

  let siteName = document.getElementsByName("name")[0].value;
  let siteURL = document.getElementsByName("url")[0].value;
  let userName = document.getElementsByName("user")[0].value;
  let password = document.getElementsByName("password")[0].value;
  let description = document.getElementsByName("description")[0].value;

    // Validar la contraseña
    if (!validatePass(password)) {
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
    const nameInput = document.forms['login'].elements['name'].value;
    const userInput = document.forms['login'].elements['user'].value;
    const passwordInput = document.forms['login'].elements['password'].value;
    
    if(nameInput != "" && userInput != "" && passwordInput != ""){
        document.login.save.disabled = false;
    }else{
        document.login.save.disabled = true;
    }
  }    
  
  function validatePass(password) {
    if (password.length < 8) {
      showMessage('La contraseña debe contener al menos 8 carácteres');
      setTimeout(() => {
        hideMessage();
      }, 3000);
      return false;
    }
    return true;
  }

  function showMessage(text) {
    document.getElementById('messageAlert').style.display = 'block';
    document.getElementById('messageAlert').innerHTML = text;
  }
  
  function hideMessage() {
    document.getElementById('messageAlert').style.display = 'none';
    document.getElementById('messageAlert').innerHTML = '';
  }

  function generatePassword(){
    const length = 8;
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
    
    let password = "";
    for (let i = 0; i < length; i++) {
      const indexRandom = Math.floor(Math.random() * characters.length);
      password += characters.charAt(indexRandom);

    // Mostrar la contraseña generada en el campo de contraseña
    document.getElementById('password').value = password;
    hideMessage(); 
    }
  }

  
