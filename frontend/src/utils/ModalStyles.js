export const profileModalStyle = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 60,
    bottom: 0,

    zIndex: 1000, // Higher z-index
    backgroundColor: "rgba(39, 95, 114, .2)", // Semi-transparent background
    backdropFilter: "blur(1px)", // Apply blur effect
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    position: "relative", // Change from 'absolute' to 'relative'
    zIndex: 1001,
    margin: "10px", // Automatically centers the content
    width: "auto", // Adjust to desired width
    // Adjust to desired max width
    height: "520px",
    padding: "",
    border: "1px solid #000",
    background: "#000",
    borderRadius: "15px",
    outline: "none",
    textAlign: "center",

    display: "flex",
    flexDirection: "column",
  },
};

export const loginModalStyle = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    backdropFilter: "blur(10px)", // Apply blur effect
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    position: "relative", // Change from 'absolute' to 'relative'
    margin: "auto", // Automatically centers the content
    width: "auto", // Adjust to desired width
    maxWidth: "600px", // Adjust to desired max width
    padding: "4px",
    border: "1px solid #ccc",
    background: "#000",
    borderRadius: "4px",
    outline: "none",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
};

export const deleteModalStyle = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.0)", // Semi-transparent background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    position: "absolute", // Change from 'absolute' to 'relative'
    top: "6%", // Adjust this value to position the modal vertically
    left: "62%", // Center horizontally
    margin: "2px", // Automatically centers the content
    width: "250px", // Adjust to desired width
    height: "45px",
    maxWidth: "600px", // Adjust to desired max width
    padding: "4px",
    border: "1px solid #060c4e",
    background: "#1b567e",
    borderRadius: "100px",
    outline: "none",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
  },
};
export const CommentsModalStyle = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: "rgba(0, 0, 0, 0.2)", // Semi-transparent background
    backdropFilter: "blur(2px)", // Apply blur effect
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    position: "relative", // Change from 'absolute' to 'relative'
    margin: "auto", // Automatically centers the content
    width: "800px", // Adjust to desired width
    height: "500px",
    maxHeight: "400px",
    maxWidth: "600px", // Adjust to desired max width
    padding: "4px",
    border: "1px solid #ccc",
    background: "#000000",
    borderRadius: "4px",
    outline: "none",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
};
