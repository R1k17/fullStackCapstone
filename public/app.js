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

function getEmployeesListFromAPI() {
  $.ajax({
    method: 'GET',
    dataType: 'json',
    url: TIMEPLANER_API + 'employees',
    success: (data) => {
              let list = data.map(obj => {
                    return obj.employeeName;
                  });
                  employeeListCreator(list);
            },
    error: () => console.log('GET employees failed')
  });
}

function postEmployeesToAPI(query) {
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

function updateEmployee(employeeId, query) {
  $.ajax({
    method: 'PUT',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(query),
    url: TIMEPLANER_API + 'employees/' + employeeId,
    error: () => console.log('PUT employee failed')
  })
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
    <div class="day border" id="${result.id}">
      <h2 class="dayName">${result.employeeName}</h2>
      <ul class="employeeDetails">
        <li>ID: ${result.id}</li>
        <li>Gender: ${result.gender}</li>
        <li>Hours: ${result.hours}</li>
      </ul>
      <button class="deleteBtn submit-form-btn"><i class="fas fa-trash"></i></button>
      <button class="updateBtn submit-form-btn"><i class="fas fa-edit"></i></button>
    </div>
  `
}

function displayAllEmployees(data) {
  const result = data.map((employee) => renderEmployee(employee));
  $('.mainPage').html(result);
  deleteBtn();
  console.log("this is display");
  console.log(data);
  
  updateBtn(data,updateForm);
}

function watchNavBtns() {
  $('#employeeListBtn').on('click', function() {
    getEmployeesFromAPI(displayAllEmployees);
    getEmployeesListFromAPI();
  })
}

// $('#employeeSubmit').on('click', function(event) {
//   event.preventDefault();
//   let bigGender;
//   bigGender = $('input[name=gender]:checked', '#testingForm').val();
//   console.log($('#firstName').val());
  
// })

function watchEmployeeSubmit() {
  $('#employeeSubmit').on('click', function(event) {
    event.preventDefault();
    
    let bigGender;
    bigGender = $('input[name="gender"]:checked').val();
    console.log($('input[name="gender"]:checked').val());
    
    const query = {
        first_name: $('#firstName').val(),
        last_name: $('#lastName').val(),
        gender: bigGender,
        hours: $('#workHours').val()
    }
    console.log(query);
    
    postEmployeesToAPI(query);
  })
}

/* ============ Employee updating functionality ============ */

function updateBtn(data, updateForm) {
  $('.updateBtn').on('click', function() {
    alert('clicked')
    $('.mainPage').html('');
    $('.mainPage').html(updateForm);
    
    // const employeeId = $(this).parent().attr("data-index-number");
    const employeeId = $(this).parent().attr("id");
    
    let selectedEmployee = 
      data.find((obj) => {
        return employeeId === obj.id;
      });

    $('input[name="firstName"]').attr('value', selectedEmployee.first_name);
    $('input[name="lastName"]').attr('value', selectedEmployee.last_name);
    $('input[name="hours"]').attr('value', selectedEmployee.hours);

    if(selectedEmployee.gender === 'Female') {
      $('#female').attr('checked', true);
    } else {
      $('#male').attr('checked', true);
    }
    generateUpdateQuery(employeeId)
  })
}

function generateUpdateQuery(employeeId) {
  $('#updateEmployee').on('click', function(event) {
    event.preventDefault();
        
    let bigGender;
    bigGender = $('input[name="gender"]:checked', '#updateForm').val();
    
    const query = {
        id: employeeId,
        first_name: $('input[name="firstName"]').val(),
        last_name: $('input[name="lastName"]').val(),
        gender: bigGender,
        hours: $('input[name="hours"]').val()
    }
    updateEmployee(employeeId, query);
  })
}

const updateForm = `
<form id="updateForm">
    <fieldset class="employee-update-form form-template">
        First name:<br>
        <input class="form-input-field" type="text" name="firstName" value="">
        <br><br>
        Last name:<br>
        <input class="form-input-field" type="text" name="lastName" value="">
        <br><br>
        Available hours per week: <br>
        <input class="form-input-field" type="number" name="hours" value="">
        <br><br>
        <div>
            <input type="radio" name="gender" id="female" value="Female">Female<br>
            <input type="radio" name="gender" id="male" value="Male">Male<br>
        </div>
        <div>
            <input class="updateBtn submit-form-btn submit-button" id="updateEmployee" type="submit" value="Submit">
        </div>
    </fieldset>
</form>
`;

function startApp() {
  watchNavBtns();
  watchEmployeeSubmit();
  generateUpdateQuery();
  // updateBtn();
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
  // $(`div[id="${employeeId}"]`).remove();
  })
}