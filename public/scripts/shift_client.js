function getShiftsFromAPI(callback) {
    $.ajax({
      method: 'GET',
      dataType: 'json',
      url: TIMEPLANER_API + 'shifts',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
      },
      success: (data) => {
        refreshToken();
        displayAllShifts(data);
    },
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
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
    },
    success: (data) => {
      refreshToken();
      $(`div[id="${data.shiftId}"]`).find('.shiftsContainer').append(renderShifts(query))
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
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
      },
      success: () => {
        refreshToken();
        getTimeTablesFromAPI(displayAllTimeTables);
      },
      error: () => console.log('PUT shift failed')
    })
}

function deleteShift(shiftId) {
    $.ajax({
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      url: TIMEPLANER_API + 'shifts/' + shiftId,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
      },
      success: () => {
        refreshToken();
      },
      error: () => console.log('DELETE shift failed')
    });
}

function displayAllShifts(data) {
  data.map((shifts) => {
    $(`div[id="${shifts.dayId}"]`).find(".shiftsContainer").append(renderShifts(shifts));
  });
  deleteShiftBtn();
  modifyShiftBtn(data);
}

function deleteShiftBtn() {
  $(`.delete-shift-btn`).on('click', function() {
    const shiftId = $(this).parent().attr('id');
    
    if(confirm(`You are about to delete the current shift! Are you sure you want to delete it?`)){
      deleteShift(shiftId);
      $(`div[id="${shiftId}"]`).remove();
    }
  })
}

function modifyShiftBtn(data) {
  $('.modify-shift-btn').on('click', function() {
    const shiftId = $(this).parent().attr('id');
    
    $('#mainPage').html('');
    $('#mainPage').html(renderUpdateShiftForm);

    let selectedShift = 
    data.find((obj) => {
      return shiftId === obj.shiftId;
    });
    
    $('input[name="startingTime"]').attr('value', selectedShift.start);
    $('input[name="endingTime"]').attr('value', selectedShift.end);
    $('input[name="emplyoeeList"]').attr('value', selectedShift.employee);

    cancelBtnListener(user);
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
    <form id="addShiftFormStyle" class="create" action="/shifts" method="post">
      <fieldset>
        <legend>Add a shift</legend>
        Start
        <br>
        <input aria-label="Shift begin" max= 23 min=0 class="add-shift-form-name" name="startingTime" placeholder="start time" type="number">
        <br>
        End
        <br>
          <input aria-label="Shift end" class="add-shift-form-name" name="endingTime" max=24 min=1 placeholder="end time" type="number">
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
    <form id="#update-shift" class="update" action="/shifts" method="post">
      <fieldset class="form-template">
        Start
        <br>
        <input aria-label="Shift begin" class="form-input-field" max= 23 min=0 name="startingTime" placeholder="start time" type="number">
        <br>
        End
        <br>
          <input aria-label="Shift end" class="form-input-field" max=24 min=1 name="endingTime" placeholder="end time" type="number">
        <br>
        Employee
        <br>
        <select aria-label="Select an employee" class="form-input-field selectionLists" name="emplyoeeList" alt="select an employee">
        </select>
        <br>
        <button aria-label="Update shift button" alt="Button to update a shift" type="submit" class="updateBtn addShift updateShiftBtn submit-form-btn">Update</button>
        <button aria-label="Cancel updating shift" alt="Button to cancel updating a shift" id="updateShift-cancel" class="cancel-btn submit-form-btn">Cancel</button>
      </fieldset>
    </form>
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
    $(`.update`).on('submit', function(event) {
      event.preventDefault();
      
      const shiftLength = $("input[name='endingTime']").val() - $("input[name='startingTime']").val();

      const query = {
        id: shiftId,
        start: $("input[name='startingTime']").val(),
        end: $("input[name='endingTime']").val(),
        hours: shiftLength,
        employee: $(".selectionLists").val()
    }
    updateShift(shiftId, query)
    })
  }