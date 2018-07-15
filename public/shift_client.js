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
    $(`div[id="${shifts.dayId}"]`).find(".shiftsContainer").append(renderShifts(shifts));
  });
  deleteShiftBtn();
}

function deleteShiftBtn() {
  $(`.delete-shift-btn`).on('click', function() {
    const shiftId = $(this).parent().attr('id');
    
    deleteShift(shiftId);
    $(`div[id="${shiftId}"]`).remove();
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
      Start:
        <input class="add-shift-form-elem" name="startingTime" placeholder="start time" type="number">
      End:
        <input class="add-shift-form-elem" name="endingTime" placeholder="end time" type="number">
      Employee:
      <select class="add-shift-form-elem" name="emplyoeeList" alt="select an employee" class='selectionLists'>
      </select>
      Working hours:
      <span class="add-shift-form-elem" name="hoursSub">0</span>
      </fieldset>
      <button type="submit" class="addShift submit-form-btn">Add shift +</button>
    </form>
    `
  }

  function watchShiftSubmit(dayId) {
    const currentDayId = dayId;
    // #${dayId} form >> old version when I had a form for every day
    $(`#${dayId} form`).on('submit', function(event) {
      event.preventDefault();
      const data = objectifyForm($(this).serializeArray());
      
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
  

