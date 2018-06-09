// get the api
function getAllEmployees(callbackFn) {
  // we use a `setTimeout` to make this asynchronous
  // as it would be with a real AJAX call.
	setTimeout(function(){ callbackFn(MOCK_EMPLOYEES)}, 1);
}

// render data to screen
function displayAllEmployees(data) {
    for (index in data.employees) {
	   $('body').append(
        '<ul>' + 
            '<li>' + data.employees[index].id + '</li>' +
            '<li>' + data.employees[index].first_name + '</li>' +
            '<li>' + data.employees[index].last_name + '</li>' +
            '<li>' + data.employees[index].gender + '</li>' +
            '<li>' + data.employees[index].hours + '</li>' +
        '<ul>'
    );
    }
}

function getAndDisplayAllEmployees() {
	getAllEmployees(displayAllEmployees);
}

$(function() {
	getAndDisplayAllEmployees();
})



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