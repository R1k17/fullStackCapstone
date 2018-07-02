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
        // this finds the div with the id
        // $('div').find(`[data-index-number='${shifts.dayId}']`);
        // let test = $('div').find(`[data-index-number='5b31061ee7179a5b7ab926abMonday']`).attr('data-index-number');
        // let currentId = shifts.dayId
        // parentIds.map((id) => {
        //     currentId = id;
        // })
        $(`div[data-index-number="${shifts.dayId}"]`).find(".shiftsContainer").append(renderShifts(shifts));
        // if(shifts.dayId === currentId) {
            //     console.log(currentId);
            //     console.log('true');
            
            // }
            
            
            // if(shifts.dayId === "5b31061ee7179a5b7ab926abMonday") {
                //     $('div[data-index-number="5b31061ee7179a5b7ab926abMonday"]').find(".shiftsContainer").append(renderShifts(shifts));
                // }
    })
}

function renderShifts(result) {
    return `
    <div data-index-number="${result.shiftId}">
        <span>${result.dayId}</span>
        <span>${result.start}</span>
        <span>${result.end}</span>
        <span>${result.hours}</span>
        <span>${result.employee}</span>
        <button class="delete-shift-btn">X</button>
        <button class="modify-shift-btn">modify</button>
    </div>
    `
}

function addShift(addShiftForm) {
    $('.addShift').on('click', function() {
      
      // ===========================  
      // ===========================
      // Get back to day obj model
  
      // How to add a shift to the array?
      // 1. get the whole week
  
      // 2. find the right day you want to update
      const dayId = $(this).parent().attr("data-index-number");
      
      // 3. 
      // 1. make get request to get all the data in array,
        // 1.1 addShift btn is clicked >> get request for getting the array
      // 2. add new shift to old array
      // 3. put request with updated array
      
      
    //   const weekId = "5b31061ee7179a5b7ab926abMonday"
  
      $(`div[data-index-number=${dayId}]`).find('.shiftsContainer').append(addShiftForm);
      // fill out form
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
    console.log(query);

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
          Emplyoee:
            <input placeholder="employee" name="employee" id="employeeSub" value="employee">
          Working hours:
            <input type="number" id="hoursSub" placeholder="endTime - startTime" >
            <button type="submit" id="shiftSubmit">Save</button>
          </form>
        </fieldset>
        `
    }
 
function deleteShiftBtn() {
    // deleteShift
    $('.delete-shift-btn').on('click', () => {
        const shiftId = $('.delete-shift-btn').parent().attr('data-index-number');
    })
}


    // function startShifts() {
    //     watchShiftSubmit();
    // }

    // startShifts();