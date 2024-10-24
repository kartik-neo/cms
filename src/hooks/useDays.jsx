
import { useEffect, useState } from 'react';

// Custom hook definition
const useDays = (days) => {
  const [dateFromUnix, setDateFromUnix] = useState(null);
  const [dateToUnix, setDateToUnix] = useState(null);

  useEffect(() => {
    const now = new Date();
    // get todays date
    const today = new Date(now);
    today.setDate(now.getDate())
    // Get tomorrow's date
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    // Get date 'days' days from tomorrow
    const dateTo = new Date(tomorrow);
    dateTo.setDate(tomorrow.getDate() + days);

   
    let fromUnix 
    let toUnix 

     // Convert to UNIX timestamp (seconds)
     if(days > 1){
     fromUnix  = Math.floor(tomorrow.getTime() / 1000);
     toUnix = Math.floor(dateTo.getTime() / 1000);
    }else{
    fromUnix  = Math.floor(today.getTime() / 1000);
    toUnix = Math.floor(today.getTime() / 1000);
    }
    setDateFromUnix(fromUnix);
    setDateToUnix(toUnix);
  }, [days]);

  return { dateFromUnix, dateToUnix };
};

export default useDays;