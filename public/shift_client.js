function getShiftsFromAPI(callback) {
    $.ajax({
      method: 'GET',
      dataType: 'json',
      url: TIMEPLANER_API + 'shifts',
      success: callback,
      error: () => console.log('GET shifts failed')
    });
  }

function postShiftToAPI(query) {
  $.ajax({
    method: 'POST',
    dataType: 'json',
    contentType: "application/json",
    data: JSON.stringify(query),
    url: TIMEPLANER_API + 'shifts',
    // success: callback,
    error: () => console.log('POST shift failed')
  });
}

function updateShift(shiftId, query) {
    $.ajax({
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(query),
      url: TIMEPLANER_API + 'shift/' + shiftId,
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

function modifyShift() {
    /* 
    const query = {
            id: shift.id,
            employee
            start
            end
            hours
        }
 */
}

function displayAllShifts(data) {
    data.map((shifts) => {
      $(`div[data-index-number="${shifts.dayId}"]`).find(".shiftsContainer").append(renderShifts(shifts));
    })
    // addShift(addShiftForm);
}

{/* <span>${result.dayId}</span> */}
function renderShifts(result) {
    return `
    <div class="shiftSlots" data-index-number="${result.shiftId}">
        <span class="shiftParts " >${result.start}</span>
        <span class="shiftParts " >${result.end}</span>
        <span class="shiftParts " >${result.hours}</span>
        <span class="shiftParts " >${result.employee}</span>
        <button class="shift-btns delete-shift-btn">X</button>
        <button class="shift-btns modify-shift-btn">M</button>
    </div>
    `
}
let employees = [];
let employee = '';

function employeeListCreator(data){
  employees = data;
  employee = employees[0];
  employeeListMenuCreator();
}

function employeeListMenuCreator() {
  let result = employees.map(function(menuEmployee){
    return renderEmployeeOption(menuEmployee);
  })
  
  $('#emplyoeeList').html(result);
  displaySelectedEmployee();
  employeeUpdate();
}

function renderEmployeeOption(menuEmployee){
  return `<option value="${menuEmployee}">${menuEmployee}</option>`;
}

function employeeSelectHandler() {
  $('#employeeList').on('change', function() {
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
  $('#employeeList').val(employee);
}

function addShift(addShiftForm) {
    $('.addShift').on('click', function() {
      const dayId = $(this).parent().attr("data-index-number");
  
      $(`div[data-index-number=${dayId}]`).find('.shiftsContainer').append(addShiftForm);
      getEmployeesListFromAPI();
      watchShiftSubmit(dayId);
    })
  }

  function watchShiftSubmit(dayId) {
    $('#shiftSubmit').on('click', function(event) {
      event.preventDefault();

    const query = {
        dayId: dayId,
        start: $("#startTimeSub").val(),
        end: $("#endTimeSub").val(),
        hours: $("#hoursSub").val(),
        employee: $("#employeeSub").val()
    }

    postShiftToAPI(query);
    })
  }
  
  function addShiftForm() {
      return `
      <fieldset>
        <legend>Add a shift</legend>
        <form id="testingForm" action="/shifts" method="post">
          Start:
            <input placeholder="start time" type="number" id="startTimeSub">
          End:
            <input placeholder="end time" type="number" id="endTimeSub">
          Employee:
          <select name="emplyoeeList" id="emplyoeeList" alt="select an employee" class='selectionLists'>
          </select>
          Working hours:
          <span id="hoursSub">0</span>
          <button type="submit" id="shiftSubmit">Save</button>
          </form>
          </fieldset>
          `
    }
          // <input placeholder="employee" name="employee" id="employeeSub" value="employee">
          // <input type="number" id="hoursSub" placeholder="endTime - startTime" >
 
function deleteShiftBtn() {
    $('.delete-shift-btn').on('click', () => {
        const shiftId = $('.delete-shift-btn').parent().attr('data-index-number');
    })
}