$(document).ready(function(){
    $('#myModal').modal('show');
});

function saveUserData() {
    var name = document.getElementById("modalnameInput").value;

    document.getElementById("userName").textContent = name;

    $('#myModal').modal('hide');
    document.getElementById("greetings").style.display = "block";
}

function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    var timeString = padZero(hours) + ":" + padZero(minutes) + ":" + padZero(seconds);

    document.getElementById('clock').textContent = timeString;
}

function padZero(num) {
    return (num < 10 ? '0' : '') + num;
}

setInterval(updateClock, 1000);

updateClock();


var data = [
    { nim: '123', name: 'John Doe', alamat: '123 Street, City' },
    { nim: '456', name: 'Jane Smith', alamat: '456 Avenue, Town' }
];

function populateTable() {
    var tableBody = $('#dataTableBody');
    tableBody.empty(); 

    $.each(data, function(index, item) {
        var row = $('<tr>');
        row.append($('<td>').text(item.nim));
        row.append($('<td>').text(item.name));
        row.append($('<td>').text(item.alamat));
        row.append($('<td>').html('<button class="btn btn-primary btn-sm edit-btn">Edit</button> <button class="btn btn-danger btn-sm delete-btn">Delete</button>'));

        tableBody.append(row);
    });
}

$('#addDataForm').submit(function(event) {
    event.preventDefault();
    var nim = $('#nimInput').val();
    var name = $('#nameInput').val();
    var alamat = $('#alamatInput').val();
    data.push({ nim: nim, name: name, alamat: alamat });
    populateTable();
    $('#nimInput, #nameInput, #alamatInput').val('');
});

$('th').click(function() {
    var column = $(this).index();
    var sortOrder = $(this).data('sort-order') || 'asc';
    data.sort(function(a, b) {
        var aValue = a[Object.keys(a)[column]];
        var bValue = b[Object.keys(b)[column]];
        if (sortOrder === 'asc') {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });
    $(this).data('sort-order', sortOrder === 'asc' ? 'desc' : 'asc');
    populateTable();
});

populateTable();