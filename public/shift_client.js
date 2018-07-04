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
  console.log(data);
    
  data.map((shifts) => {
      // $(`div[data-index-number="${shifts.dayId}"]`).find(".shiftsContainer").append(renderShifts(shifts));
      $(`div[id="${shifts.dayId}"]`).find(".shiftsContainer").append(renderShifts(shifts));
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

  function watchShiftSubmit(dayId) {
    console.log($(`#${dayId}`));
    
    $(`#${dayId} form`).on('submit', function(event) {
      event.preventDefault();
      const data = objectifyForm($(this).serializeArray());
      // console.log(event);
      
// http://api.prototypejs.org/language/Object/extend/
// use this to post my data
    // const query = Object.extend(data, ) {
    const query = {
        dayId: dayId,
        start: $("input[name='startingTime']").val(),
        end: $("input[name='endingTime']").val(),
        hours: $("span[name='hoursSub']").val(),
        // employee: $("select[name='employeeList']").val()
        employee: $(".selectionLists").val()
    }

    postShiftToAPI(query);
    })
  }
  
function deleteShiftBtn() {
    $('.delete-shift-btn').on('click', () => {
        const shiftId = $('.delete-shift-btn').parent().attr('data-index-number');
    })
}