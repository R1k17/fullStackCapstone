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
})
}

function displayAllTimeTables(data) {
    const result = data.map((timeTable) => renderTimeTable(timeTable));
    $('.mainPage').html(result);
}

function renderTimeTable(result) {
    return `
    <div class="day border">
        <p class="dayName border">${result.dayName}</p>
        <div class="shifts"></div>
        <button class="addShift">Add shift +</button>
    </div>
    `
}

function startApp() {
    watchTimeTableNavBtn();
}

startApp();


/* 
==== timetable creation ====
<div class="ttCreate">
    <button id="createDay" >Add day +</button>
    <button id="saveTimeTable" >Save timetable</button>
</div>
 */