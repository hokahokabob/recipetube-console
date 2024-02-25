import React, { useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import Router from "next/router";
import { useSession } from "next-auth/react";
import { NotificationProps } from "../../components/Notification";


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {},
  };
};

async function publishNotification(notification: NotificationProps): Promise<void> {
  await fetch(`/api/notifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body:  JSON.stringify(notification),
  });
  await Router.push("/")
}

const NewNotification: React.FC<NotificationProps> = (props) => {
  const { data: session, status } = useSession();

  const [formState, setFormState] = useState<NotificationProps>({
    title: '',
    content: '',
    notification_div: 'GENERAL',
    important: false,
    start_at: '',
    end_at: '',
  });
  if (status === 'loading') {
    return <div>loading ...</div>;
  }
  const userHasValidSession = Boolean(session);

  if(!userHasValidSession) {
    return <div>Unauthorized</div>
  }

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    publishNotification(formState);
  };

  return (
<Layout>
  <div className="container">
    <h2>新規入稿</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" maxLength={50} onChange={handleChange}/>
      </div>
      <div className="form-group">
        <label htmlFor="content">Content:</label>
        <textarea id="content" name="content" rows={4} onChange={handleChange}></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="notification_div">Notification Division:</label>
        <select id="notification_div" name="notification_div" onChange={handleChange}>
          <option value="GENERAL">GENERAL</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
          <option value="TROUBLE_REPORT">TROUBLE_REPORT</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="important">Important</label>
        <input type="checkbox" id="important" name="important" onChange={handleChange}/>
      </div>
      <div className="form-group">
        <label htmlFor="start_at">Start At:</label>
        <input type="datetime-local" id="start_at" name="start_at" step="60" onChange={handleChange}/>
      </div>
      <div className="form-group">
        <label htmlFor="end_at">End At:</label>
        <input type="datetime-local" id="end_at" name="end_at" step="60" onChange={handleChange}/>
      </div>
      <div className="form-group">
        <input type="submit" value="Submit" className="submit-button"/>
      </div>
    </form>
  </div>
  <style jsx>{`
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    input, textarea, select {
      width: 100%;
      padding: 0.5rem;
      border-radius: 4px;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
    .submit-button {
      background: #0070f3;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .submit-button:hover {
      background: #0051bb;
    }
  `}</style>
</Layout>
  );
};

export default NewNotification;
