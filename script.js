$(document).ready(function(){
    $('#myModal').modal('show');
});

function saveUserData() {
    var name = document.getElementById("nameInput").value;
    var id = document.getElementById("idInput").value;

    document.getElementById("userName").textContent = name;
    document.getElementById("userId").textContent = id;

    $('#myModal').modal('hide');
    document.getElementById("greetings").style.display = "block";
}

