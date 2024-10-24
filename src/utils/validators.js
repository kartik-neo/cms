export function validateAssignItems(data,activationUnixTimestamp) {
  let error = {};
  const activationDate = new Date(activationUnixTimestamp * 1000);

  if (data?.actionItem?.length > 0) {
    data?.actionItem?.map((item, i) => {
      if (!item?.actionDescription?.trim()) {
        error[`descError${i}`] = "This field is required";
      }
      if (!item?.actionCompletedOn) {
        error[`completedOn${i}`] = "This field is required";
      }else{
        const actionCompletedOnDate = new Date(item.actionCompletedOn * 1000);
        if (actionCompletedOnDate < activationDate) {
          error[`completedOn${i}`] = `Date and time must be after activation date and time`;
        }
      }
      // const empCodeSet = new Set();

      // item?.actionAssignTo?.forEach((assignee, ai) => {
      //   if (!assignee?.empCode) {
      //     error[`${i}thAssigneeError${ai}`] = "This field is required";
      //   } else {
      //     if (empCodeSet.has(assignee.empCode)) {
      //       error[`${i}thAssigneeError${ai}`] = "Already assigned to this user";
      //     } else {
      //       empCodeSet.add(assignee.empCode);
      //     }
      //   }
      // });
      item?.actionAssignTo?.map((assignee, ai) => {
        const result = item?.actionAssignTo.filter(
          (item) => {
           if((item?.empCode && assignee?.empCode) && item?.empCode == assignee?.empCode){
             return item
           }
          }
        );

        if (assignee?.empCode == 0) {
          error[`${i}thAssigneeError${ai}`] = "This field is required";
        }
        if (result?.length > 1) {
          error[`${i}thAssigneeError${result?.length - 1}`] =
            "Already assigned to this user";
        }
      });
    });
  } else {
    error.length = "Action item required";
  }

  return Object.keys(error)?.length ? { errorStatus: true, error: error } : {};
}

export function validateSubmitAction(data) {
  let error = {};

  data?.map((item, i) => {
    if (!item?.desc?.replace(/<[^>]*>/g, "")?.trim()) {
      error[`descError${i}`] = "This field is required";
    }
  });

  return Object.keys(error)?.length ? { errorStatus: true, error: error } : {};
}
