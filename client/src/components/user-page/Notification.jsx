import Alert from "@mui/material/Alert";

function Notification(props) {
  const { notification, onClose } = props;

  return (
    <Alert
      severity="warning"
      onClose={() => {
        onClose(notification);
      }}
    >
      {notification.text}
    </Alert>
  );
}

export default Notification;
