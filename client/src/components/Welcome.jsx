import React from "react";
import { Box } from "@mui/material";
import { ReactComponent as IconWelcome } from "../images/landing.svg";
import { Typography, Stack } from "@mui/material";
import Layout from "./layout/Layout";
import { useEffect, useState } from "react";
import Notification from "./user-page/Notification";
import {
  deleteNotification,
  getNotifications,
} from "../services/notificationsService";

function Welcome(props) {
  const [notifications, setNotifications] = useState([]);
  const { user } = props;

  useEffect(() => {
    async function getUserNotifications(userId) {
      const { data } = await getNotifications(userId);

      setNotifications(data.reverse());
    }

    if (user.role === "user") {
      getUserNotifications(user._id);
      setInterval(() => {
        getUserNotifications(user._id);
      }, 5000);
    }
  }, []);

  async function handleClose(notification) {
    const tmpNotifications = notifications.filter(
      (notif) => notif._id != notification._id
    );
    setNotifications(tmpNotifications);
    await deleteNotification(notification._id);
    //contact backend delete notification
  }

  if (user.role != "user")
    return (
      <Layout user={user}>
        <Box
          display="flex"
          height="100vh"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h6" color="primary.main">
              Welcome{" "}
              {user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1)}
            </Typography>
            <Typography variant="body1">
              This is the welcome page for each user.
            </Typography>
            <Typography>
              The menu is positioned top-left. Hover with your mouse to see your
              options
            </Typography>
          </Box>
          <Box>
            <IconWelcome width={400} height={400} />
          </Box>
        </Box>
      </Layout>
    );
  else
    return (
      <Layout user={user}>
        <Box
          display="flex"
          height="100vh"
          justifyContent="space-around"
          marginTop={15}
          // alignItems="center"
          flexDirection="row"
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h6" color="primary.main">
              Welcome{" "}
              {user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1)}
            </Typography>
            <Typography variant="body1">
              This is the welcome page for each user.
            </Typography>
            <Typography>
              The menu is positioned top-left. Hover with your mouse to see your
              options
            </Typography>
            <IconWelcome width={400} height={400} />
          </Box>
          <Box>
            <Typography variant="h6" color="primary.main" marginBottom={2}>
              Notifications
            </Typography>
            <Stack spacing={2}>
              {notifications.map((notification) => (
                <Notification
                  key={notification._id}
                  notification={notification}
                  onClose={handleClose}
                />
              ))}
              {notifications.length === 0 && (
                <Typography variant="body1">
                  There are currently zero newer notifications
                </Typography>
              )}
            </Stack>
          </Box>
        </Box>
      </Layout>
    );
}

// function getNotifications() {
//   return [
//     {
//       _id: 1,
//       text: "Your product 1 is withdrawn",
//     },
//     {
//       _id: 2,
//       text: "Your product 2 is withdrawn",
//     },
//     {
//       _id: 3,
//       text: "Your product 3 is withdrawn",
//     },
//     {
//       _id: 4,
//       text: "Your product 4 is withdrawn",
//     },
//   ];
// }

export default Welcome;
