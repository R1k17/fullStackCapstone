let employees = [];
let employee = '';

const TIMEPLANER_API = 'https://timeplaner.herokuapp.com/';

function getEmployeesFromAPI(callback) {
  $.ajax({
    method: 'GET',
    dataType: 'json',
    url: TIMEPLANER_API + 'employees',
    beforeSend: function(xhr) {
			xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
		},
    success: (data) => {
      refreshToken();
      displayAllEmployees(data);
    },
    error: () => console.log('GET employees failed')
  });
}

function getEmployeesListFromAPI(callback) {
  $.ajax({
    method: 'GET',
    dataType: 'json',
    url: TIMEPLANER_API + 'employees',
    beforeSend: function(xhr) {
			xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
		},
    success: (data) => {
              let list = data.map(obj => {
                    return obj.employeeName;
                  });
                  employeeListCreator(list);
                  refreshToken();
                  callback;
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
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
    },
    success: () => {
      refreshToken();
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
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
    },
    success: () => {
      refreshToken();
      getEmployeesFromAPI(displayAllEmployees);
    },
    error: () => console.log('PUT employee failed')
  })
}

function deleteEmployee(employeeId, getEmployeesFromAPI) {
  $.ajax({
    method: 'DELETE',
    dataType: 'json',
    contentType: 'application/json',
    url: TIMEPLANER_API + 'employees/' + employeeId,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
    },
    success: () => {
      refreshToken();
      $(`div[id="${employeeId}"]`).remove();
    },
    error: () => console.log('DELETE employee failed')
  });
}

function renderEmployee(result) {
  return `
    <div class="day border" id="${result.id}">
      <h2 class="dayName">${result.employeeName}</h2>
      <ul class="employeeDetails">
        <li aria-label="Employee id">ID: ${result.id}</li>
        <li aria-label="Employee gender">Gender: ${result.gender}</li>
        <li aria-label="Available hours">Hours: ${result.hours}</li>
      </ul>
      <button aria-label="Delete employee" alt="Button to delete employee" class="redBtn submit-form-btn"><i class="fas fa-trash"></i></button>
      <button aria-label="Edit employee" alt="Button to edit the employee" class="greenBtn submit-form-btn"><i class="fas fa-edit"></i></button>
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
  $('.gridItem-emp').on('click', function() {
    getEmployeesFromAPI(displayAllEmployees);
    getEmployeesListFromAPI();
  })
}

function empSubmitForm() {
  return `
    <form id="employeeSubmitForm">
      <fieldset class="employee-submit-form form-template">
        First name<br>
        <input aria-label="Firstname of employee" class="form-input-field" type="text" name="firstName" value="" placeholder="Jane" required>
        <br><br>
        Last name<br>
        <input aria-label="lastname of employee" class="form-input-field" type="text" name="lastName" value="" placeholder="Doe" required>
        <br><br>
        Available hours per week <br>
        <input aria-label="Available hours of employee" class="form-input-field" type="number" name="hours" value="" placeholder="40" required>
        <br>Select the gender<br>
        <div>
          <input aria-label="Female gender selection" class="form-input-field" type="radio" name="gender" id="female" value="Female">Female<br>
          <input aria-label="Male gender selection" type="radio" name="gender" id="male" value="Male">Male<br>
        </div>
        <div>
          <button aria-label="Save button" alt="Save employee to database" class="greenBtn submit-form-btn submit-button" id="create-emp-btn">Save</button>
          <button aria-label="Cancel button" class="cancel-btn submit-form-btn" alt="Cancel employee submit" id="submitEmp-cancel" class="cancel-btn submit-form-btn">Cancel</button>
        </div>
      </fieldset>
    </form>
`
}

function loadNewEmployeeBtn() {
	return `<div aria-label="Create new employee" alt="Button to create a new employee"><span><i class="fa fa-user-plus"></i> Create new Employee</spanp></div>`
}

function activateNewEmpBtn() {
	$('#add-emp').html(loadNewEmployeeBtn());
	$('#add-emp').addClass('emp-create');
}

function deactivateNewEmpBtn() {
	$('#add-emp').html('');
	$('#add-emp').removeClass('emp-create');
}

function newEmpBtnListener() {
	$('#add-emp').on('click', function() {
    deactivateNewEmpBtn();
    $('#mainPage').html(empSubmitForm());
    cancelBtnListener(user);
    watchEmployeeSubmit();
	})
}

function watchEmployeeSubmit() {
  $('#create-emp-btn').on('click', function(event) {
    event.preventDefault();
    
    let bigGender;
    bigGender = $('input[name="gender"]:checked').val();
    
    const query = {
        first_name: $('input[name="firstName"]').val(),
        last_name: $('input[name="lastName"]').val(),
        gender: bigGender,
        hours: $('input[name="hours"]').val()
    }
    
    postEmployeesToAPI(query);
  })
}

function employeeListCreator(data){
    employees = data;
    employee = employees[0];
    
    employeeListMenuCreator();
  }
  
  function employeeListMenuCreator() {
    let result = employees.map(function(menuEmployee){
      return renderEmployeeOption(menuEmployee);
    })
    
    $('select[name="emplyoeeList"]').html(result);
    displaySelectedEmployee();
    employeeUpdate();
  }
  
  function renderEmployeeOption(menuEmployee){
    return `<option value="${menuEmployee}">${menuEmployee}</option>`;
  }
  
  function employeeSelectHandler() {
    $('select[name="employeeList"]').on('change', function() {
      employeeUpdate(this);
    });
  }
  
  function employeeUpdate(currentEmployee = employee){
    if (typeof currentEmployee !== "string") {
      let selectedEmployee = $("option:selected", currentEmployee);
      employee = selectedEmployee[0].innerText;
    }
    displaySelectedEmployee();
  }
  
  function displaySelectedEmployee() {
    $('select[name="employeeList"]').val(employee);
  }
  
  function objectifyForm(formArray) {//serialize data function
  
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++){
      returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
  }

function updateBtn(data, updateForm) {
  $('.greenBtn').on('click', function() {
    $('.mainPage').html('');
    $('.mainPage').html(updateForm);
    
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
        First name<br>
        <input aria-label="Employee firstname" class="form-input-field" type="text" name="firstName" value="">
        <br><br>
        Last name<br>
        <input aria-label="Employee lastname" class="form-input-field" type="text" name="lastName" value="">
        <br><br>
        Available hours per week <br>
        <input aria-label="Employee available hours" class="form-input-field" type="number" name="hours" value="">
        <br>Select the gender<br>
        <div>
            <input aria-label="Employee gender female" type="radio" name="gender" id="female" value="Female">Female<br>
            <input aria-label="Employee gender male" type="radio" name="gender" id="male" value="Male">Male<br>
        </div>
        <div>
            <input aria-label="Update employee" alt="Button to update the employee" class="greenBtn submit-form-btn submit-button" id="updateEmployee" type="submit" value="Submit">
        </div>
    </fieldset>
</form>
<button aria-label="Cancel updating employee" alt="Button to cancel the emplyoee update process" id="updateEmpForm-cancel" class="cancel-btn submit-form-btn">Cancel</button>
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