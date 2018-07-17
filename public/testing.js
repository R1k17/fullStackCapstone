$('.createShiftForm').remove();



const shiftLength = $("input[name='endingTime']").val() - $("input[name='startingTime']").val();

function watchShiftUpdateSubmit(shiftId) {
    const currentShiftId = shiftId;
    // #${dayId} form >> old version when I had a form for every day
    $(`#${shiftId} form`).on('submit', function(event) {
      event.preventDefault();
      // const data = objectifyForm($(this).serializeArray());
      
      const shiftLength = $("input[name='endingTime']").val() - $("input[name='startingTime']").val();

      const query = {
        shiftId: shiftId,
        start: $("input[name='startingTime']").val(),
        end: $("input[name='endingTime']").val(),
        hours: shiftLength,
        employee: $(".selectionLists").val()
    }

    postShiftToAPI(query, currentShiftId);
    // deleteShiftBtn();
    })
  }