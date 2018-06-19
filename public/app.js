/* API variables */
const TIMEPLANER_API = 'https://timeplaner.herokuapp.com/';

// ==========================================================
// Employee API Interaction
function getEmployeesFromAPI(callback) {
  $.ajax({
    method: 'GET',
    dataType: 'json',
    url: TIMEPLANER_API + 'employees',
    success: callback,
    error: () => console.log('GET employees failed')
  });
}
// What to do for post?
// > attach query string to url
function postEmployeesToAPI(query) {
  console.log(query);
  $.ajax({
    method: 'POST',
    dataType: 'json',
    data: JSON.stringify(query),
    url: TIMEPLANER_API + 'employees',
    // success: callback,
    error: () => console.log('POST employee failed')
  });
}
// > send url to post endpoint
// > retrieve data 
// > model retrieved data
/* ===  Post endpoint ===

==> How to modify the querryString?

*/
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
  $('.mainPage').html(result);
}
// ====         ====         ====
// posting/updating/deleting employees
// ====         ====         ====        
/*    what to do?
// How to send data from form to api?

// create query string
// get current id
// watch for submit


*/

/* function getDataFromAPI(callback) {
  const query = {
    first_name: first_name,
    last_name: last_name,
    gender: gender,
    hours: horus
  }
  $.getJSON(TIMEPLANER_API+'employees', query, callback);
} */

// ==========================================================
// TimeTable API Interaction


// ==========================================================
// Basic page behaviour

function watchNavBtns() {
  $('#employeeListBtn').on('click', function() {
    getEmployeesFromAPI(displayAllEmployees);
  })
  $('#timeTableBtn').on('click', function() {
    alert('Second nav button connected!')
  })
}

function watchEmployeeSubmit() {
  $('#employeeSubmit').on('click', function(event) {
    event.preventDefault();
    const query = {
      first_name: $('#firstName').val(),
      last_name: $('#lastName').val(),
      /* how to set gender 
      if (f1 === on){
        value = female
      }else {
        value = male
      }
      */
      gender: $('#f1').val() || $('#m1').val(),
      hours: $('#workHours').val()
    }
    postEmployeesToAPI(query);
  })
}

function startApp() {
  watchNavBtns();
  watchEmployeeSubmit();
}

$(startApp());

// ==========================================================
//==== id logic ====
let dayCounter = [0];
let shiftCounter = 0;



// 1. create timetable >> week gets loaded 
const weekDay = 
`<div class="day border">`+
  '<p class="dayName border">Mo</p>' +
  '<div class="shifts"></div>' +
  '<button class="addShift">Add shift +</button>' +
'</div>';

// create day
$('#createDay').on('click', function(){
  //  > add 1 to dayCounter array
  dayCounter.push('d'+dayCounter.length);
  //  > check for last inserted day
  $('.container').append(weekDay);
  $('.container > div').last("div").attr('id', dayCounter[dayCounter.length-1]);
  // it is changing the value of all buttons in every day container
  // $('button').attr('value', dayCounter[dayCounter.length-1]);
})

// 2. inside the day create shifts
const newShift = 
'<span class="border shiftSlots">shift</span>';

$('.container').on('click', '.addShift', function() {
  // add 1 to shift counter
  shiftCounter += 1;
  // check the parent id of clicked button
  let parentID = $(this).parent().attr('id');
  console.log('parentID: '+ parentID);
  // add shift if parentID matches parent of clicked button
  if(parentID === $(this).parent().attr('id')) {
    console.log(parentID + " vs. " + $(this).parent().attr('id'));
    $('#' + parentID + '>.shifts').append(newShift);
    // add shift ids 
    // $('.shifts > span').last("span").attr('id', 'd'+dayCounter+'s'+shiftCounter);
    
  }
  
})