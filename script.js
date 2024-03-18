var typed = new Typed('.auto-type', {
  strings: ["You", "Ourselves", "😭😭😔😔", "Love", "Passion", "Happiness", "Yourself", "We", "Mankind"],
  typeSpeed: 150,
  backSpeed: 150,
  loop: true,
});

$(document).ready(function () {
  $('#myModal').modal('show');
});

function saveUserData() {
  var name = document.getElementById("modalnameInput").value;
  document.getElementById("userName").textContent = name;
  $('#myModal').modal('hide');
  $('#greetings').fadeIn().css("display", "flex").addClass("animated bounceInLeft");
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
  { nim: '00000092718', name: 'Ryann Chandiari', alamat: 'Makassar Pride' },
  { nim: 'Rine123', name: '123Sugar', alamat: 'Redoxon' }
];

function populateTable() {
  var tableBody = $('#dataTableBody');
  tableBody.empty();

  var entriesPerPage = parseInt($('#entriesPerPage').val());
  var currentPage = 1;

  var startIndex = (currentPage - 1) * entriesPerPage;
  var endIndex = startIndex + entriesPerPage;
  if (endIndex > data.length) {
    endIndex = data.length;
  }

  for (var i = startIndex; i < endIndex; i++) {
    var item = data[i];
    var row = $('<tr>');
    row.append($('<td>').text(item.nim));
    row.append($('<td>').text(item.name));
    row.append($('<td>').text(item.alamat));
    row.append($('<td>').html('<button class="btn btn-primary btn-sm edit-btn">Edit</button> <button class="btn btn-danger btn-sm delete-btn">Delete</button>'));
    tableBody.append(row);
  }

  var entryCountMessage = "Showing " + (startIndex + 1) + " to " + endIndex + " of " + data.length + " entries.";
  $('#tableInfo').text(entryCountMessage);
}

$('#addDataForm').submit(function (event) {
  event.preventDefault();
  var nim = $('#nimInput').val();
  var name = $('#nameInput').val();
  var alamat = $('#alamatInput').val();
  data.push({ nim: nim, name: name, alamat: alamat });
  populateTable();
  $('#nimInput, #nameInput, #alamatInput').val('');
});

$('#entriesPerPage').change(function () {
  populateTable();
});

populateTable();
