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
    success: () => {
      $('#mainPage').html('');
      getEmployeesFromAPI(displayAllEmployees);
      activateNewEmpBtn();
    },
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
    success: $(`div[id="${employeeId}"]`).remove(),
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
      <button class="redBtn submit-form-btn"><i class="fas fa-trash"></i></button>
      <button class="greenBtn submit-form-btn"><i class="fas fa-edit"></i></button>
    </div>
  `
}

function displayAllEmployees(data) {
  const result = data.map((employee) => renderEmployee(employee));
  $('#mainPage').html(result);
  deleteBtn(data);
  updateBtn(data,updateForm);
}

function watchNavBtns() {
  $('#employeeListBtn').on('click', function() {
    getEmployeesFromAPI(displayAllEmployees);
    getEmployeesListFromAPI();
  })
}

function empSubmitForm() {
  return `
    <form id="employeeSubmitForm">
      <fieldset class="employee-submit-form">
        First name:<br>
        <input type="text" name="firstName" value="" placeholder="Jane" required>
        <br><br>
        Last name:<br>
        <input type="text" name="lastName" value="" placeholder="Doe" required>
        <br><br>
        Available hours per week: <br>
        <input type="number" name="hours" value="" placeholder="40" required>
        <br><br>
        <div>
          <input type="radio" name="gender" id="female" value="Female">Female<br>
          <input type="radio" name="gender" id="male" value="Male">Male<br>
        </div>
        <div>
          <button id="create-emp-btn">Save</button>
          </div>
      </fieldset>
    </form>
    <button id="submitEmp-cancel" class="cancel-btn submit-form-btn">Cancel</button>
`
}

function loadNewEmployeeBtn() {
	return `<div class="greenBtn submit-form-btn"><span><i class="fa fa-user-plus"></i> Create new Employee</spanp></div>`
}

function activateNewEmpBtn() {
	$('#add-emp').html(loadNewEmployeeBtn());
	$('#add-emp').toggleClass('green-btn submit-form-btn');
}

function deactivateNewEmpBtn() {
	$('#add-emp').html('');
	$('#add-emp').toggleClass('green-btn submit-form-btn');
}

function newEmpBtnListener() {
	$('#add-emp').on('click', function() {
    deactivateNewEmpBtn();
    $('#mainPage').html(empSubmitForm());
    cancelBtnListener(user);
    watchEmployeeSubmit();
	})
}

function employeeSubmitBtnListener() {
  // needed?
}

function watchEmployeeSubmit() {
  $('#create-emp-btn').on('click', function(event) {
    event.preventDefault();
    console.log('employeeSubmitForm started');
    
    let bigGender;
    bigGender = $('input[name="gender"]:checked').val();
    console.log($('input[name="gender"]:checked').val());
    
    const query = {
        first_name: $('input[name="firstName"]').val(),
        last_name: $('input[name="lastName"]').val(),
        gender: bigGender,
        hours: $('input[name="hours"]').val()
    }
    console.log(query);
    
    postEmployeesToAPI(query);
  })
}

/* ============ Employee updating functionality ============ */

function updateBtn(data, updateForm) {
  $('.greenBtn').on('click', function() {
    $('.mainPage').html('');
    $('.mainPage').html(updateForm);
    
    const employeeId = $(this).parent().attr("id");
    console.log(employeeId);

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

    generateUpdateQuery(employeeId);
    cancelBtnListener(user);
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
            <input class="greenBtn" submit-form-btn submit-button" id="updateEmployee" type="submit" value="Submit">
        </div>
    </fieldset>
</form>
<button id="updateEmpForm-cancel" class="cancel-btn submit-form-btn">Cancel</button>
`;

function deleteBtn(data) {
  $('.redBtn').on('click', function() {
    const employeeId = $(this).parent().attr("id");
    const employee = data.find((emp) => {
      return employeeId === emp.id;
    });
      
  
    if(confirm(`You are about to delete the contact of ${employee.employeeName} permenantly! Are you sure you want to delete this contact?`)){
      deleteEmployee(employeeId);
    }
  })
}

function cancelBtnListener(user) {
  $('#submitEmp-cancel').on('click', function() {
    getEmployeesFromAPI(displayAllEmployees);
		getEmployeesListFromAPI();
		loadMainHeader(user);
		newEmpBtnListener();
		activateNewEmpBtn();
  })
  
  $('#updateEmpForm-cancel').on('click', function() {
    getEmployeesFromAPI(displayAllEmployees);
		getEmployeesListFromAPI();
		loadMainHeader(user);
		newEmpBtnListener();
		activateNewEmpBtn();
  })

  $('#addShift-cancel').on('click', function() {
    getTimeTablesFromAPI(displayAllTimeTables);
    getEmployeesListFromAPI();
    loadMainHeader(user);
  })

  $('#updateShift-cancel').on('click', function() {
    getTimeTablesFromAPI(displayAllTimeTables);
    getEmployeesListFromAPI();
    loadMainHeader(user);
  })
}

function startApp() {
  watchNavBtns();
  watchEmployeeSubmit();
  generateUpdateQuery();
  // updateBtn();
  // watchTimeTableNavBtn();
  // ========================
  loadHeader();
	// loadLoginForm with the header or on page start?
	loadLoginForm();
	loginPageListener();
	loginListener();
	homePageBtnListener()
	// deleteAccountListener()
	signUpPageListener();
	// createAccountListener();
	// cancelAccountSignUpListener()
}

$(startApp());