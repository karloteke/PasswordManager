
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