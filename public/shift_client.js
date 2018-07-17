/* ToDo 
[ ] on submitting the shift, reload page so that an id is available for the shift 

*/
function getShiftsFromAPI(callback) {
    $.ajax({
      method: 'GET',
      dataType: 'json',
      url: TIMEPLANER_API + 'shifts',
      success: callback,
      error: () => console.log('GET shifts failed')
    });
  }

function postShiftToAPI(query, currentDay) {
  $.ajax({
    method: 'POST',
    dataType: 'json',
    contentType: "application/json",
    data: JSON.stringify(query),
    url: TIMEPLANER_API + 'shifts',
    success: function (data) {
      $(`div[id="${data.shiftId}"]`).find('.shiftsContainer').append(renderShifts(query))
    },
    // success: () => {
    //   getShiftsFromAPI(displayAllShifts);
    // },
    error: () => console.log('POST shift failed')
  });
}

function updateShift(shiftId, query) {
    $.ajax({
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(query),
      url: TIMEPLANER_API + 'shifts/' + shiftId,
      error: () => console.log('PUT shift failed')
    })
}

function deleteShift(shiftId) {
    $.ajax({
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      url: TIMEPLANER_API + 'shifts/' + shiftId,
      // reload the page when obj deleted
      // success: $('.deleteBtn').on('click', function() {
      //   location.reload();
      // }),
      error: () => console.log('DELETE shift failed')
    });
}

function displayAllShifts(data) {
  data.map((shifts) => {
    $(`div[id="${shifts.dayId}"]`).find(".shiftsContainer").append(renderShifts(shifts));
  });
  deleteShiftBtn();
  modifyShiftBtn();
}

function deleteShiftBtn() {
  $(`.delete-shift-btn`).on('click', function() {
    const shiftId = $(this).parent().attr('id');
    
    deleteShift(shiftId);
    $(`div[id="${shiftId}"]`).remove();
  })
}

function modifyShiftBtn() {
  $('.modify-shift-btn').on('click', function() {
    // use closest() or parents()
    const dayId = $(this).parent().parent().parent().attr('id')
    const shiftId = $(this).parent().attr('id');
    console.log(dayId)
    console.log(shiftId)
    $(`div[id="${shiftId}"]`).parent('div[class="shiftsContainer"]').siblings(`div[class="addShiftForm"]`).html(renderAddShiftForm)
    
    getEmployeesListFromAPI();
    watchShiftUpdateSubmit(dayId, shiftId);
  })
}

function renderShifts(result) {
  
    return `
    <div class="shiftSlots gridContainer" id="${result.shiftId}">
        <span class="shiftParts" >${result.start}</span>
        <span class="shiftParts" >${result.end}</span>
        <span class="shiftParts" >${result.hours}</span>
        <span class="shiftParts" >${result.employee}</span>
        <button class="shift-btns delete-shift-btn gridItem-a"><i class="fas fa-trash"></i></button>
        <button class="modify-shift-btn gridItem-b"><i class="fas fa-edit"></i></button>
    </div>
    `
}
let employees = [];
let employee = '';

function employeeListCreator(data){
  employees = data;
  employee = employees[0];
  console.log(data);
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

function createShiftBtn() {
  $('.createShiftForm').on('click', function() {
    const parentId = $(this).parent().attr('id');

   $(`div[id="${parentId}"]`).find('.addShiftForm').append(renderAddShiftForm)
   $('.createShiftForm').remove();
   getEmployeesListFromAPI();
   watchShiftSubmit(parentId);    
  })}

  function renderAddShiftForm() {
    return `
    <form action="/shifts" method="post">
      <fieldset>
        <legend>Add a shift</legend>
      Start
      <br>
      <input class="add-shift-form-name" name="startingTime" placeholder="start time" type="number">
      <br>
      End
      <br>
        <input class="add-shift-form-name" name="endingTime" placeholder="end time" type="number">
      <br>
      Employee
      <br>
      <select class="add-shift-form-select selectionLists" name="emplyoeeList" alt="select an employee">
      </select>
      <br>
      Working hours
      <br>
      <span class="add-shift-form-elem" name="hoursSub">0</span>
      </fieldset>
      <button type="submit" class="updateBtn addShift submit-form-btn">Add shift +</button>
    </form>
    `
  }

  function renderUpdateShiftForm() {
    return `
    <form action="/shifts" method="post">
      <fieldset>
        <legend>Update the shift</legend>
      Start
      <br>
      <input class="add-shift-form-name" name="startingTime" placeholder="start time" type="number">
      <br>
      End
      <br>
        <input class="add-shift-form-name" name="endingTime" placeholder="end time" type="number">
      <br>
      Employee
      <br>
      <select class="add-shift-form-select selectionLists" name="emplyoeeList" alt="select an employee">
      </select>
      <br>
      Working hours
      <br>
      <span class="add-shift-form-elem" name="hoursSub">0</span>
      </fieldset>
      <button type="submit" class="updateBtn addShift updateShiftBtn submit-form-btn">Update</button>
    </form>
    `
  }

  function watchShiftSubmit(dayId) {
    const currentDayId = dayId;
    // #${dayId} form >> old version when I had a form for every day
    $(`#${dayId} form`).on('submit', function(event) {
      event.preventDefault();
      // const data = objectifyForm($(this).serializeArray());
      
      const shiftLength = $("input[name='endingTime']").val() - $("input[name='startingTime']").val();

      const query = {
        dayId: dayId,
        start: $("input[name='startingTime']").val(),
        end: $("input[name='endingTime']").val(),
        hours: shiftLength,
        employee: $(".selectionLists").val()
    }

    postShiftToAPI(query, currentDayId);
    deleteShiftBtn();
    })
  }
  
  function watchShiftUpdateSubmit(dayId, shiftId) {
    $(`#${dayId} form`).on('submit', function(event) {
      event.preventDefault();
      
      const shiftLength = $("input[name='endingTime']").val() - $("input[name='startingTime']").val();

      const query = {
        id: shiftId,
        dayId: dayId,
        start: $("input[name='startingTime']").val(),
        end: $("input[name='endingTime']").val(),
        hours: shiftLength,
        employee: $(".selectionLists").val()
    }
    updateShift(shiftId, query)
    })
  }

