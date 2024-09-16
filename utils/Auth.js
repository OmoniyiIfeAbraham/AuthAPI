function Errordisplay(error) {
  console.log(error); // can be removed
  if (error.message) {
    const msg = error.message.split(":")[2];
    return {
      msg: msg
        ? msg.split(",")[0]
          ? msg
              .split(",")[0]
              .split(" ")
              .find((i) => i == "dup")
            ? "Oops! It seems like the details you provided already exist in our system. Please try again"
            : msg.split(",")[0]
          : "Oops! An error occurred. Please try again"
        : `Issue on our end. Please try again.`,
    };
  } else {
    console.log(error);
    return {
      msg: "Oops! An unexpected error occurred. Please try again later.",
    };
  }
}

module.exports = { Errordisplay };
