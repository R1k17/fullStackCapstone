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
    success: () => {
      getTimeTablesFromAPI(displayAllTimeTables);
      getEmployeesListFromAPI();
      loadMainHeader(user);
      deactivateNewEmpBtn();
    },
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
      success: getTimeTablesFromAPI(displayAllTimeTables),
      error: () => console.log('PUT shift failed')
    })
}

function deleteShift(shiftId) {
    $.ajax({
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      url: TIMEPLANER_API + 'shifts/' + shiftId,
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
    const dayId = $(this).parent().parent().parent().attr('id')
    const shiftId = $(this).parent().attr('id');
    
    $('#mainPage').html('');
    $('#mainPage').html(renderUpdateShiftForm);

    cancelBtnListener();
    getEmployeesListFromAPI();
    watchShiftUpdateSubmit(shiftId);
  })
}

function renderShifts(result) {
    return `
    <div class="shiftSlots gridContainer" id="${result.shiftId}">
        <span aria-label="shift begin" class="shiftParts" >${result.start}</span>
        <span aria-label="shift end" class="shiftParts" >${result.end}</span>
        <span aria-label="working hours" class="shiftParts" >${result.hours}</span>
        <span aria-label="Selected employee" class="shiftParts" >${result.employee}</span>
        <button aria-label="Delete shift" alt="Button to delete shift" class="shift-btns delete-shift-btn gridItem-a"><i class="fas fa-trash"></i></button>
        <button aria-label="Edit shift" alt="Button to change shift" class="shift-btns modify-shift-btn gridItem-b"><i class="fas fa-edit"></i></button>
    </div>
    `
}

function createShiftBtn(user) {
  $('.createShiftForm').on('click', function() {
    const parentId = $(this).parent().attr('id');

   $(`div[id="${parentId}"]`).find('.addShiftForm').append(renderAddShiftForm)
   $('.createShiftForm').remove();
   getEmployeesListFromAPI();
   cancelBtnListener(user);
   watchShiftSubmit(parentId);    
  })}

  function renderAddShiftForm() {
    return `
    <form class="create" action="/shifts" method="post">
      <fieldset>
        <legend>Add a shift</legend>
      Start
      <br>
      <input aria-label="Shift begin" class="add-shift-form-name" name="startingTime" placeholder="start time" type="number">
      <br>
      End
      <br>
        <input aria-label="Shift end" class="add-shift-form-name" name="endingTime" placeholder="end time" type="number">
      <br>
      Employee
      <br>
      <select aria-label="Select an employee" class="add-shift-form-select selectionLists" name="emplyoeeList" alt="select an employee">
      </select>
      <br>
      </fieldset>
      <button aria-label="Add shift button" alt="Button to add a shift" type="submit" class="greenBtn addShift submit-form-btn">Add shift +</button>
    </form>
      <button aria-label="Cancel adding shift" alt="Button to cancel adding a shift" id="addShift-cancel" class="greyBtn submit-form-btn">Cancel</button>
    `
  }

  function renderUpdateShiftForm() {
    return `
    <form class="update" action="/shifts" method="post">
      <fieldset>
        <legend>Update the shift</legend>
      Start
      <br>
      <input aria-label="Shift begin" class="add-shift-form-name" name="startingTime" placeholder="start time" type="number">
      <br>
      End
      <br>
        <input aria-label="Shift end" class="add-shift-form-name" name="endingTime" placeholder="end time" type="number">
      <br>
      Employee
      <br>
      <select aria-label="Select an employee" class="add-shift-form-select selectionLists" name="emplyoeeList" alt="select an employee">
      </select>
      <br>
      </fieldset>
      <button aria-label="Update shift button" alt="Button to update a shift" type="submit" class="updateBtn addShift updateShiftBtn submit-form-btn">Update</button>
      </form>
      <button aria-label="Cancel updating shift" alt="Button to cancel updating a shift" id="updateShift-cancel" class="cancel-btn submit-form-btn">Cancel</button>
    `
  }

  function watchShiftSubmit(dayId) {
    const currentDayId = dayId;
    $(`#${dayId} .create`).on('submit', function(event) {
      event.preventDefault();
      
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
  
  function watchShiftUpdateSubmit(shiftId) {
    console.log(shiftId);
    
    $(`.update`).on('submit', function(event) {
      event.preventDefault();
      
      const shiftLength = $("input[name='endingTime']").val() - $("input[name='startingTime']").val();

      const query = {
        id: shiftId,
        // dayId: dayId,
        start: $("input[name='startingTime']").val(),
        end: $("input[name='endingTime']").val(),
        hours: shiftLength,
        employee: $(".selectionLists").val()
    }
    updateShift(shiftId, query)
    })
  }

