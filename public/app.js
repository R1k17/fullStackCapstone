/* API variables */
const TIMEPLANER_API = 'https://timeplaner.herokuapp.com/';

function getEmployeesFromAPI(callback) {
  $.ajax({
    method: 'GET',
    dataType: 'jsonp',
    url: TIMEPLANER_API + 'employees',
    success: callback,
    error: () => console.log('GET states failed')
  });
}

function renderEmployee(result) {
  return `
    <div>
      <h2>${result.first_name} ${result.last_name}</h2>
      <ul>
        <li>ID: ${result.id}</li>
        <li>Gender: ${result.gender}</li>
        <li>Hours: ${result.hours}</li>
      </ul>
    </div>
  `
}

function displayAllEmployees(data) {
  const result = data.map((employee) => renderEmployee(employee));
  $('#employeeContainer').html(result);
}

function watchGetEmployees() {
  $('#testbtn').on('click', function() {
    getEmployeesFromAPI(displayAllEmployees);
  })
}

function startApp() {
  watchGetEmployees();
}

$(startApp());
/* function getDataFromAPI(callback) {
  const query = {
    first_name: first_name,
    last_name: last_name,
    gender: gender,
    hours: horus
  }
  $.getJSON(TIMEPLANER_API+'employees', query, callback);
} */


//==== id logic ====
let dayCounter = 0;
let shiftCounter = 0;



// 1. create timetable >> week gets loaded 
const weekDay = 
`<div class="day border">`+
  '<p class="dayName border">Mo</p>' +
  '<div class="shifts"></div>' +
  '<button class="addShift">Add shift +</button>' +
'</div>';


$('#createDay').on('click', function(){
  dayCounter += 1;
  $('.container').append(weekDay);
  $('.container > div').last("div").attr('id', 'd'+dayCounter);
  // it is changing the value of all buttons in every day container
  $('button').attr('value', 'd'+dayCounter);
})

// 2. inside the day create shifts
const newShift = 
'<span class="border shiftSlots">shift</span>';

$('.container').on('click', '.addShift', function() {
  shiftCounter += 1;
  $('.shifts').append(newShift);
  $('.shifts > span').last("span").attr('id', 'd'+dayCounter+'s'+shiftCounter);
})