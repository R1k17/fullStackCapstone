/* API variables */
// const TIMEPLANER_API = 'https://timeplaner.herokuapp.com/';

// ==========================================================
// TimeTable API Interaction
function getTimeTablesFromAPI(callback) {
  $.ajax({
    method: 'GET',
    dataType: 'json',
    url: TIMEPLANER_API + 'timeTables',
    success: callback,
    error: () => console.log('GET Timetables failed')
  });
}

function watchTimeTableNavBtn() {
$('#timeTableBtn').on('click', function() {
    getTimeTablesFromAPI(displayAllTimeTables);
    getEmployeesListFromAPI();
})
}

function displayAllTimeTables(data) {
  getShiftsFromAPI(displayAllShifts);
  const result = data.map((timeTable) => renderTimeTable(timeTable));
    
  parentIds = data.map((days) => {
    return days.day.dayId;
  });
    
    $('.mainPage').html(result);

    // addShift(addShiftForm);
    
  }
  

function renderTimeTable(result) {
  return `
      <div class="day border" data-index-number="${result.id + result.day.dayName}">
          <h2 class="dayName">${result.day.dayName}</h2>
          <br>
          <div class="shiftsContainer">

          </div>
          <br>
          <fieldset>
        <legend>Add a shift</legend>
        <form id="testingForm" action="/shifts" method="post">
          Start:
            <input placeholder="start time" type="number" id="startTimeSub">
          End:
            <input placeholder="end time" type="number" id="endTimeSub">
          Employee:
          <select name="emplyoeeList" id="emplyoeeList" alt="select an employee" class='selectionLists'>
          </select>
          Working hours:
          <span id="hoursSub">0</span>
          <button type="submit" id="shiftSubmit">Save</button>
          </form>
          </fieldset>
          <button class="addShift">Add shift +</button>
      </div>
      `
    }
      

function startApp() {
    watchTimeTableNavBtn();
}

startApp();

// ==========================================================
// ==== shift creation logic ====



/* 
==== timetable creation ====
<div class="ttCreate">
    <button id="createDay" >Add day +</button>
    <button id="saveTimeTable" >Save timetable</button>
</div>
 */

/*
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

$('button').on('click', function() {

})

*/