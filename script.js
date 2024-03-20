var typed = new Typed('.auto-type', {
  strings: ["senyumin aja", "gwenchana", "marah", "bahagia sekali", "lelah", "ya gitu", "sedih", "biasa aja", "apa ya"],
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

var data = JSON.parse(localStorage.getItem('mahasiswaData')) || [
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
    row.append($('<td>').html('<button class="btn btn-primary btn-sm edit-btn"><i class="fas fa-pencil-alt"></i> Edit</button> <button class="btn btn-danger btn-sm delete-btn"><i class="fas fa-eraser"></i> Delete</button>'));
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
  if (nim && name && alamat) {
    data.push({ nim: nim, name: name, alamat: alamat });
    saveDataToLocalStorage();
    populateTable();
    $('#nimInput, #nameInput, #alamatInput').val('');
    showFeedback('Data berhasil ditambahkan.', 'success');
  } else {
    showFeedback('Gagal menambahkan data. Pastikan semua kolom terisi.', 'danger');
  }
});

$('#addDataFormSubmitBtn').click(function(event) {
  event.preventDefault();
  var nim = $('#nimInput').val();
  var name = $('#nameInput').val();
  var alamat = $('#alamatInput').val();
  if (nim && name && alamat) {
    data.push({ nim: nim, name: name, alamat: alamat });
    saveDataToLocalStorage();
    populateTable();
    $('#nimInput, #nameInput, #alamatInput').val('');
    showFeedback('Data berhasil ditambahkan.', 'success');
  } else {
    showFeedback('Gagal menambahkan data. Pastikan semua kolom terisi.', 'danger');
  }
});


$('#entriesPerPage').change(function () {
  populateTable();
});

populateTable();

function resetForm() {
  document.getElementById("nimInput").value = "";
  document.getElementById("nameInput").value = "";
  document.getElementById("alamatInput").value = "";
}
document.getElementById("resetForm").addEventListener("click", function (event) {
  event.preventDefault();
  resetForm();
});

function saveDataToLocalStorage() {
  localStorage.setItem('mahasiswaData', JSON.stringify(data));
}

$(document).on('click', '.edit-btn', function () {
  var index = $(this).closest('tr').index();
  var item = data[index];

  $('#editNIMInput').val(item.nim).prop('disabled', true);
  $('#editNameInput').val(item.name);
  $('#editAlamatInput').val(item.alamat);

  $('#editModal').modal('show');

  $('#editModalSave').off('click').on('click', function () {
    var newName = $('#editNameInput').val();
    var newAlamat = $('#editAlamatInput').val();
    data[index].name = newName;
    data[index].alamat = newAlamat;
    saveDataToLocalStorage();
    populateTable();
    $('#editModal').modal('hide');
    showFeedback('Data berhasil diubah.', 'info');
  });
});

$(document).on('click', '.delete-btn', function () {
  var index = $(this).closest('tr').index();
  if (confirm('Apakah yakin ingin mengubah ?')) {
    data.splice(index, 1);
    saveDataToLocalStorage();
    populateTable();
    showFeedback('Data berhasil dihapus.', 'deleted');
  }
});

function showFeedback(message, type) {
  var alertClass = '';
  switch (type) {
    case 'success':
      alertClass = 'alert-success';
      break;
    case 'info':
      alertClass = 'alert-info';
      break;
    case 'deleted':
      alertClass = 'alert-warning';
      break;
    case 'danger':
      alertClass = 'alert-danger';
      break;
    default:
      alertClass = 'alert-info';
  }

  var alertHTML = `
  <div class="alert ${alertClass} alert-dismissible fade show" role="alert" style="cursor:pointer;opacity:.85;position:fixed;top:20px;right:20px;z-index:9999;">
    <strong>${type.charAt(0).toUpperCase() + type.slice(1)}!</strong> ${message}
    <button type="button" class="close" data -dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
    <div class="progress active" role="progressbar" style="height:5px">
      <div class="progress-bar bg-${type}" style="width:100%;opacity:0.5"></div>
    </div>
  </div>
`;

  $('body').append(alertHTML);

  var currentChunk = 0;
  var chunks = 5;
  var timer = setInterval(function () {
    update();
  }, 10);

  $('.alert').hover(function () {
    window.clearInterval(timer);
    $(".alert").css('opacity', 1);
  }, function () {
    $(".alert").css('opacity', .9);
    timer = setInterval(function () {
      update();
    }, 10);
  });

  $('.alert').click(function () {
    $(".alert").alert('close');
    clearInterval(timer);
  });

  function update() {
    currentChunk += 0.01;
    var progPercent = 100 - (currentChunk * (100 / chunks));
    $(".progress-bar").css('width', progPercent + '%');

    if (progPercent <= 0) {
      $(".alert").remove();
      clearInterval(timer);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var table = document.querySelector('.table');
  var headers = table.querySelectorAll('th');
  
  headers.forEach(function (header, index) {
      header.addEventListener('click', function () {
          sortTable(index);
      });
  });

  function sortTable(columnIndex) {
      var rows = Array.from(table.querySelectorAll('tbody tr'));

      rows.sort(function (rowA, rowB) {
          var cellA = rowA.cells[columnIndex].textContent.trim();
          var cellB = rowB.cells[columnIndex].textContent.trim();

          if (columnIndex === 0 || columnIndex === 2) {
              return cellA.localeCompare(cellB);
          } else {
              return cellA.localeCompare(cellB, undefined, { numeric: true });
          }
      });

      var tbody = table.querySelector('tbody');
      rows.forEach(function (row) {
          tbody.appendChild(row);
      });
  }
});

// Dark mode toggle functionality
document.getElementById('darkModeToggle').addEventListener('click', function() {
  // Toggle dark mode class on the body
  document.body.classList.toggle('dark-mode');

  // Save dark mode preference to localStorage
  var darkModeEnabled = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', darkModeEnabled);
});

// Check if dark mode preference is saved in localStorage
var darkModeEnabled = localStorage.getItem('darkMode');

// If dark mode preference exists, apply it
if (darkModeEnabled) {
  document.body.classList.add('dark-mode');
}

$(".inner-switch").on("click", function() {
  if ($("body").hasClass("dark")) {
    $("body").removeClass("dark");
    $(".inner-switch").text("OFF");
  } else {
    $("body").addClass("dark");
    $(".inner-switch").text("ON");
  }
});
