
export const markNotificationAsRead = async (notificationId: number) => {
  const token = localStorage.getItem("access");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications/read/${notificationId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }
};

export const deleteNotification = async (notificationId: number) => {
  const token = localStorage.getItem("access");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete notification");
  }
};
