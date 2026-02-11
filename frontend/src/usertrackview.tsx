export const trackUserView = async (
  pageName: string,
  pageURL: string,
  timeSpentSeconds: number
) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user?.UserID) return;

  try {
    await fetch("http://localhost:4000/api/user/view-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        userId: user.UserID,
        pageName,
        pageURL,
        timeSpentSeconds
      })
    });
  } catch (err) {
    console.error("Tracking error:", err);
  }
};
