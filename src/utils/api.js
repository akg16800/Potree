import axios from "axios";

export const getAllLocations = async () => {
  var body = {};

  const BACKEND_ENDPOINT = `https://bx9wr5htzi.execute-api.ap-south-1.amazonaws.com/dev/users-onboarding/location/getAllLocations`;
  try {
    const response = await axios.post(`${BACKEND_ENDPOINT}`, body);
    console.log("response data is", response.data);
    return response;
  } catch (error) {
    // // console.log(`Error in creation of mission ${error}`);
    return [];
  }
};

export const postLocation = async (name, details, cameraPos, pivotPos) => {
  var body = {
    name: name,
    details: `<p>${details}</p>`,
    cameraPos: JSON.stringify(cameraPos),
    pivotPos: JSON.stringify(pivotPos)
  };

  const BACKEND_ENDPOINT = `https://bx9wr5htzi.execute-api.ap-south-1.amazonaws.com/dev/users-onboarding/location/postLocation`;
  try {
    const response = await axios.post(`${BACKEND_ENDPOINT}`, body);
    console.log("response data is", response.data);
    return response;
  } catch (error) {
    // // console.log(`Error in creation of mission ${error}`);
    return [];
  }
};

export const editLocationData = async (name, details, locationID) => {
  var body = {
    name: name,
    details: `<p>${details}</p>`,
    locationID: locationID
  };

  const BACKEND_ENDPOINT = `https://bx9wr5htzi.execute-api.ap-south-1.amazonaws.com/dev/users-onboarding/location/editLocationDetails`;
  try {
    const response = await axios.post(`${BACKEND_ENDPOINT}`, body);
    console.log("response data is", response.data);
    return response;
  } catch (error) {
    // // console.log(`Error in creation of mission ${error}`);
    return [];
  }
};

export const deleteLocationItem = async (locationID) => {
  var body = {
    locationID: locationID
  };

  const BACKEND_ENDPOINT = `https://bx9wr5htzi.execute-api.ap-south-1.amazonaws.com/dev/users-onboarding/location/deleteLocation`;
  try {
    const response = await axios.post(`${BACKEND_ENDPOINT}`, body);
    console.log("response data is", response.data);
    return response;
  } catch (error) {
    // // console.log(`Error in creation of mission ${error}`);
    return [];
  }
};
const generateRandomId = () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters = Array.from({ length: 3 }, () =>
    alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  ); // Generate 3 random alphabet characters
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate a random number between 1000 and 9999
  return `random-${randomLetters.join("")}${randomNumber}`;
};

export const postEventActivity = async (eventId, eventDetails) => {
  let username = "";
  let userDetails = {};
  // console.log("storageItem", JSON.parse(localStorage.getItem("info")));

  if (
    localStorage.getItem("info") &&
    JSON.parse(localStorage.getItem("info")).username
  ) {
    username = JSON.parse(localStorage.getItem("info")).username;
    userDetails = {
      phone: JSON.parse(localStorage.getItem("info")).phone,
      email: JSON.parse(localStorage.getItem("info")).email,
      city: JSON.parse(localStorage.getItem("info")).city
    };
  } else {
    username = generateRandomId();
    userDetails = {
      email: "anonymous@gmail.com",
      phone: "not found",
      city: "Not found"
    };
  }

  var body = {
    eventId: eventId,
    eventDetails: eventDetails,
    username: username,
    userDetails: userDetails
  };

  const BACKEND_ENDPOINT = `https://bx9wr5htzi.execute-api.ap-south-1.amazonaws.com/dev/users-onboarding/user_activity/post-user-events`;
  try {
    const response = await axios.post(`${BACKEND_ENDPOINT}`, body);
    console.log("response data is", response.data);
    return response;
  } catch (error) {
    return [];
  }
};
