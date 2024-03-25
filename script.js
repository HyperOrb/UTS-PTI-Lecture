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

$('#addDataFormSubmitBtn').click(function (event) {
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

document.querySelectorAll('.sortable').forEach(header => {
  header.addEventListener('click', () => {
    const columnIndex = Array.from(header.parentNode.children).indexOf(header);
    sortTable(columnIndex);
  });
});
function toggleDarkMode() {
  var darkModeEnabled = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', darkModeEnabled);
}

document.getElementById('darkModeToggle').addEventListener('click', function () {
  toggleDarkMode();
});

var darkModeEnabled = localStorage.getItem('darkMode');

if (darkModeEnabled && darkModeEnabled === 'true') {
  document.body.classList.add('dark-mode');
} else {
  document.body.classList.remove('dark-mode');
}


var currentPage = 1;
var entriesPerPage = parseInt($('#entriesPerPage').val());

function updatePaginationInfo() {
  var totalPages = Math.ceil(data.length / entriesPerPage);
  $('#currentPage').text(currentPage);
  $('#totalPages').text(totalPages);
}

function generatePageNumbers() {
  var totalPages = Math.ceil(data.length / entriesPerPage);
  var pageNumbers = '';

  for (var i = 1; i <= totalPages; i++) {
    pageNumbers += `<button class="btn btn-secondary page-btn">${i}</button>`;
  }

  $('#pageNumbers').html(pageNumbers);

  $('.page-btn').click(function () {
    currentPage = parseInt($(this).text());
    updateTable();
  });
}

function updateTable() {
  var startIndex = (currentPage - 1) * entriesPerPage;
  var endIndex = startIndex + entriesPerPage;
  if (endIndex > data.length) {
    endIndex = data.length;
  }

  var tableBody = $('#dataTableBody');
  tableBody.empty();

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

  updatePaginationInfo();
  generatePageNumbers();
}

$('#entriesPerPage').change(function () {
  currentPage = 1;
  entriesPerPage = parseInt($(this).val());
  updateTable();
});

$('#nextPageBtn').click(function () {
  var totalPages = Math.ceil(data.length / entriesPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    updateTable();
  }
});

$('#prevPageBtn').click(function () {
  if (currentPage > 1) {
    currentPage--;
    updateTable();
  }
});

updateTable();

particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});

particlesJS("particles-js2", {
  "particles": {
    "number": {
      "value": 236,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#000000"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 4,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#000000",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});