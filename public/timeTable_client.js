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

// function getOneTimeTableFromAPI(callback, weekId) {
//   console.log(dayId);
  
//   $.ajax({
//     method: 'GET',
//     dataType: 'json',
//     url: TIMEPLANER_API + 'timeTables/' + weekId,
//     success: callback,
//     error: () => console.log('GET one Timetable failed')
//   });
  
// }
// shift submit is nested in timetable submit
  // >> no post request only put request to update timeTable collection objs
/* 
  1. create put request
  create a collection for the shifts
  
  try post request with find() and then creating or adding to shifts
>>> https://courses.thinkful.com/node-001v5/assignment/2.2.1
>>> http://mongoosejs.com/docs/queries.html
  router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['first_name', 'last_name', 'gender', 'hours'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    Employee
        .find()
        .create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            gender: req.body.gender,
            hours: req.body.hours
        })
        .then(employee => res.status(201).json(employee.serialize()))
        .catch(err => {
            console.log(err);
            res.status(500).json({error: 'Something went wrong'});
        });
});

  router.put('/:id', (req,res) => {
    if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (`Request path id (${req.params.id}) and request body id ` + `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).json({message: message});
    }
    const toUpdate = {};
    const updateableFields = ['first_name', 'last_name', 'gender', 'hours'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    Employee
        .findByIdAndUpdate(req.params.id, {$set: toUpdate})
        .then(employee => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

  2. add the shifts to the timeTable collection like I do with the employees 
*/


function watchTimeTableNavBtn() {
$('#timeTableBtn').on('click', function() {
    getTimeTablesFromAPI(displayAllTimeTables);
})
}

function displayAllTimeTables(data) {
  getShiftsFromAPI(displayAllShifts);
  const result = data.map((timeTable) => renderTimeTable(timeTable));
    
  parentIds = data.map((days) => {
    return days.day.dayId;
  });
    
    $('.mainPage').html(result);
  //  after loading renderTimeTable I can load the shifts

   
   
   
    addShift(addShiftForm);
    
    
    
  }
  

function renderTimeTable(result) {
  return `
      <div class="day border" data-index-number="${result.id + result.day.dayName}">
          <h2 class="dayName">${result.day.dayName}</h2>
          <br>
          <div class="shiftsContainer">

          </div>
          <br>
          <button class="addShift">Add shift +</button>
      </div>
      `
    }
      /* <div class="day border" data-index-number="${result.id + result.tuesday.dayName}">
          <h2 class="dayName">${result.tuesday.dayName}</h2>
          <br>
          <div class="shiftsContainer"></div>
          <br>
          <button class="addShift">Add shift +</button>
      </div>
      <div class="day border" data-index-number="${result.id + result.wednesday.dayName}">
          <h2 class="dayName">${result.wednesday.dayName}</h2>
          <br>
          <div class="shiftsContainer"></div>
          <br>
          <button class="addShift">Add shift +</button>
      </div>
      <div class="day border" data-index-number="${result.id + result.thursday.dayName}">
          <h2 class="dayName">${result.thursday.dayName}</h2>
          <br>
          <div class="shiftsContainer"></div>
          <br>
          <button class="addShift">Add shift +</button>
      </div>
      <div class="day border" data-index-number="${result.id + result.friday.dayName}">
          <h2 class="dayName">${result.friday.dayName}</h2>
          <br>
          <div class="shiftsContainer"></div>
          <br>
          <button class="addShift">Add shift +</button>
      </div>
      <div class="day border" data-index-number="${result.id + result.saturday.dayName}">
          <h2 class="dayName">${result.saturday.dayName}</h2>
          <br>
          <div class="shiftsContainer"></div>
          <br>
          <button class="addShift">Add shift +</button>
      </div>
      <div class="day border" data-index-number="${result.id + result.sunday.dayName}">
          <h2 class="dayName">${result.sunday.dayName}</h2>
          <br>
          <div class="shiftsContainer"></div>
          <br>
          <button class="addShift">Add shift +</button>
      </div> 
    ` */


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