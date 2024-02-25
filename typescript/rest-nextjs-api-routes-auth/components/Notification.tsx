import React from "react";
import Router, { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";

export type NotificationProps = {
  title: string,
  content: string,
  notification_div: string,
  important: boolean,
  start_at: string,
  end_at: string,
}

type NotificationPropsWithId = NotificationProps & {
  id: number,
}

const Notification: React.FC<{ notification: NotificationPropsWithId }> = ({ notification }) => {
  const router = useRouter();

  const deleteNotification = async () => {
    await fetch(`/api/notifications/${notification.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      // body:  JSON.stringify(notification),
    });
    await Router.push("/")
  }

  return (
    <div onClick={ () => {} }>
      <h2>{notification.title}</h2>
      <small>種別[{notification.notification_div}]</small>
      <ReactMarkdown children={notification.content} />
      <button onClick={ () => deleteNotification() }>Delete</button>
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Notification;
