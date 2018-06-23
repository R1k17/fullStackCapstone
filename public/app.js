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

function postEmployeesToAPI(query) {
  console.log(query);
  $.ajax({
    method: 'POST',
    dataType: 'json',
    contentType: "application/json",
    data: JSON.stringify(query),
    url: TIMEPLANER_API + 'employees',
    // success: callback,
    error: () => console.log('POST employee failed')
  });
}

function deleteEmployee(employeeId, getEmployeesFromAPI) {
  $.ajax({
    method: 'DELETE',
    dataType: 'json',
    contentType: 'application/json',
    url: TIMEPLANER_API + 'employees/' + employeeId,
    // reload the page when obj deleted
    // success: $('.deleteBtn').on('click', function() {
    //   location.reload();
    // }),
    error: () => console.log('DELETE employee failed')
  });
}

function renderEmployee(result) {
  return `
    <div  data-index-number="${result.id}">
      <h2>${result.employee}</h2>
      <ul>
        <li>ID: ${result.id}</li>
        <li>Gender: ${result.gender}</li>
        <li>Hours: ${result.hours}</li>
      </ul>
      <button class="deleteBtn">delete</button>
      <button class="updateBtn">update</button>
    </div>
  `
}

function displayAllEmployees(data) {
  const result = data.map((employee) => renderEmployee(employee));
  $('.mainPage').html(result);
  deleteBtn();
  updateBtn(data,updateForm);
}
// ==========================================================
// Employee updating functionality



// ==========================================================


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

// ==== delete employee button logic ====
// if button with class="deleteBtn" is clicked 
function deleteBtn() {
  // $(".mainPage").on('click', 'button', function() {
  $('.deleteBtn').on('click', function() {
  //  > get parent ID
  const employeeId = $(this).parent().attr("data-index-number");
  deleteEmployee(employeeId);
  })
}

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








// updating Employee

// update Form
function updateEmployee() {



}

const updateForm = `
<form id="update">
    <fieldset class="employee-update-form">
        First name:<br>
        <input type="text" name="firstName" value="">
        <br><br>
        Last name:<br>
        <input type="text" name="lastName" value="">
        <br><br>
        Available hours per week: <br>
        <input type="number" name="hours" value="">
        <br><br>
        <div>
            <input type="radio" name="gender_female" value="Female">Female<br>
            <input type="radio" name="gender_male" value="Male">Male<br>
        </div>
        <div>
            <input class="submit-button" type="submit" value="Submit">
        </div>
    </fieldset>
</form>
`;


// ==== update employee button logic ====
function updateBtn(data, updateForm) {
  $('.updateBtn').on('click', function() {
// if update btn is clicked >>> load blank new page >> populate it with form
$('.mainPage').html('');
$('.mainPage').html(updateForm);
console.log(data);

// get current employee id 
const employeeId = $(this).parent().attr("data-index-number");

// find current employee
let selectedEmployee = 
  data.find((obj) => {
    return employeeId === obj.id;
  });
// read values of form inputs of currentEmployee
console.log('Selected Employee: ' + selectedEmployee.employee);



/* 
console.log(data[1].employee);



   let updatedObj = {};

    for(let i=0; i<data.length; i++) {
      if(data[i].id === employeeId) {
         updatedObj = {
           name: data[i].employee,
           first_name: data[i].first_name,
           last_name: data[i].last_name,
           gender: data[i].gender,
           hours: data[i].hours
         }
      }
    }
    console.log(data[2]);
    
    console.log('Found someone: ' + updatedObj.name);
    
  
    
  
  // show current values of obj in fields
     */
  })
}