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
    // watchShiftSubmit(days.id);    
    return days;
    // getEmployeesListFromAPI();
  });
  
  createShiftBtn()
}

function renderTimeTable(result) {
  return `
      <div class="day border" id="${result.id}">
          <h2 class="dayName">${result.day.dayName}</h2>
          <br>
          <div class="shiftsContainer">
            <div class="shifts-header gridContainer">
              <span>begin</span>
              <span>end</span>
              <span>hours</span>
              <span>employee</span>
            </div>
          </div>
          <div class="addShiftForm"></div>
          <br>
          <button type="button" class="createShiftForm submit-form-btn">Create Shift <i class="fas fa-plus"></i></button>
      </div>
      `
    }


function startApp() {
    watchTimeTableNavBtn();
}

startApp();