function getTimeTablesFromAPI(callback) {
  $.ajax({
    method: 'GET',
    dataType: 'json',
    url: TIMEPLANER_API + 'timeTables',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
    },
    success: (data) => {
      refreshToken();
      displayAllTimeTables(data);
    },
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
    return days;
  });
  
  createShiftBtn(user)
}

function renderTimeTable(result) {
  return `
      <div class="day border" id="${result.id}">
          <h2 aria-label="Name of the day" class="dayName">${result.day.dayName}</h2>
          <br>
          <div class="shiftsContainer">
            <div class="shifts-header gridContainer">
              <span aria-label="Shift begin">begin</span>
              <span aria-label="Shift end">end</span>
              <span aria-label="Amount of working hours">hours</span>
              <span aria-label="Selected employee for shift">employee</span>
            </div>
          </div>
          <div class="addShiftForm"></div>
          <br>
          <button aria-label="Create shift button" alt="Button to create a new shift" type="button" class="greenBtn createShiftForm submit-form-btn">Create Shift <i class="fas fa-plus"></i></button>
      </div>
      `
    }