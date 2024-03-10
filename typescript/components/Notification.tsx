import React, { useState } from "react";
import Router, { useRouter } from "next/router";

export type NotificationProps = {
  title: string,
  content: string,
  notification_div: string,
  important: boolean,
  start_at: string,
  end_at: string,
}

export type NotificationPropsWithPassword = NotificationProps & {
  password: string,
}

export type NotificationPropsWithId = NotificationProps & {
  id: number,
}

const Notification: React.FC<{ notification: NotificationPropsWithId }> = ({ notification }) => {
  const [password, setPassword] = useState<string>("")

  const deleteNotification = async (pw) => {
    console.log("deleteNotification" + pw)
    await fetch(`/api/notifications/${notification.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "password": password }),
    });
    await Router.push("/")
  }

  const handlePwChange = (e) => {
    setPassword(e.target.value)
  }

  return (
    <div onClick={ () => {} } className="notification-card">
      <h2>{notification.title}</h2>
      <div className="notification-details">
        <small>種別: {notification.notification_div} </small>
        <small>掲載期間: {formatDate(notification.start_at)} 〜 {formatDate(notification.end_at)}</small>
        {notification.important ? <small className="important-notice" >重要</small> : null}
      </div>
      <p className="notification-content">{notification.content}</p>
      <form onSubmit={(password) => deleteNotification(password)}>
        <div className="form-group">
          <label htmlFor="title">password:</label>
          <input type="password" name="password" maxLength={50} onChange={handlePwChange} className="password-input"/>
          <button type="submit" className="delete-button">Delete with password</button>
        </div>
      </form>
      <style jsx>{`
        .notification-card {
          color: inherit;
          padding: 2rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        h2 {
          margin-bottom: 1rem;
        }
        .notification-details {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
        .important-notice {
          display: inline-block;
          color: black;
          background-color: #ffdd00;
          padding: 0.5rem;
          border-radius: 4px;
          width: fit-content;
        }
        .notification-content {
          white-space: pre-line;
          margin-bottom: 1rem;
        }
        .password-input {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin: 0.5rem 0;
          width: 100%;
        }
        .delete-button {
          background: #ff4d4f;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .delete-button:hover {
          background: #cc0000;
        }
      `}</style>
    </div>
  );
};

function formatDate(dateString) {
  let date = new Date(dateString);
  let year = date.getFullYear();
  let month = ('0' + (date.getMonth() + 1)).slice(-2);
  let day = ('0' + date.getDate()).slice(-2);
  let hours = ('0' + date.getHours()).slice(-2);
  let minutes = ('0' + date.getMinutes()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export default Notification;
