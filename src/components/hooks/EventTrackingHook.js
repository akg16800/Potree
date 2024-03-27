import React, { useEffect } from "react";
import axios from "axios";

function EventTrackingHook(eventDetails, eventId) {
  useEffect(() => {
    // Define your backend API endpoint for event tracking
    const callFun = async () => {
      const trackingEndpoint = "https://your-backend-api.com/track-event";
      const body = {
        eventDetails: eventDetails,
        eventId: eventId
      };
      // Make a POST request to your backend API to track the event
      try {
        const response = await axios.post(`${trackingEndpoint}`, body);
        console.log("response data is", response.data);
        return response;
      } catch (error) {
        // // console.log(`Error in creation of mission ${error}`);
        return null;
      }

      // Clean-up function if needed
    };

    if (eventId != null && eventDetails != null) {
      return () => {
        // Any clean-up logic here
      };
    }
  }, [eventId, eventDetails]);
}

export default EventTrackingHook;
