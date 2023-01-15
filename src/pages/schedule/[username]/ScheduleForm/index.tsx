import { useState } from "react";
import { CalendarStep } from "./CalenderStep";
import { ConfirmStep } from "./ConfirmStep";

export function ScheduleForm(){
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>()

    function handleCleanSelectedDateTime(){
        setSelectedDateTime(null)
    }

    if(selectedDateTime){
        return <ConfirmStep 
        schedulingDate={selectedDateTime}
        onCancelConfirmation={handleCleanSelectedDateTime} />
    }

    return <CalendarStep onSelectedDateTime={setSelectedDateTime}/>
}