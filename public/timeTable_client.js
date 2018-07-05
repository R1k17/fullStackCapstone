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
  $('.mainPage').html(result);
  parentIds = data.map((days) => {
    watchShiftSubmit(days.id);    
    // return days.day.dayId;
    // getEmployeesListFromAPI();
  });
  
  }
  

function renderTimeTable(result) {
  return `
      <div class="day border" id="${result.id}">
          <h2 class="dayName">${result.day.dayName}</h2>
          <br>
          <div class="shiftsContainer">

          </div>
          <br>
      <form action="/shifts" method="post">
          <fieldset>
        <legend>Add a shift</legend>
          Start:
            <input name="startingTime" placeholder="start time" type="number">
          End:
            <input name="endingTime" placeholder="end time" type="number">
          Employee:
          <select name="emplyoeeList" alt="select an employee" class='selectionLists'>
          </select>
          Working hours:
          <span name="hoursSub">0</span>
          </fieldset>
          <button type="submit" class="addShift">Add shift +</button>
        </form>
      </div>
      `
    }
      

function startApp() {
    watchTimeTableNavBtn();
}

startApp();