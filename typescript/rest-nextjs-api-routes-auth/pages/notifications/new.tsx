import React, { useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import Router from "next/router";
import { PostProps } from "../../components/Post";
import prisma from '../../lib/prisma'
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

// async function deletePost(id: number): Promise<void> {
//   await fetch(`/api/post/${id}`, {
//     method: "DELETE",
//   });
//   await Router.push("/")
// }

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
      <div>
        <h2>新規入稿</h2>
        <button>Publish</button>
        <button>Delete</button>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label><br/>
          <input type="text" id="title" name="title" maxLength={50} onChange={handleChange}/><br/>
          <label htmlFor="content">Content:</label><br/>
          <textarea id="content" name="content" rows={4} onChange={handleChange}></textarea><br/>
          <label htmlFor="notification_div">Notification Division:</label><br/>
          <select id="notification_div" name="notification_div" onChange={handleChange}>
            <option value="GENERAL">GENERAL</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
            <option value="TROUBLE_REPORT">TROUBLE_REPORT</option>
          </select><br/>
          <input type="checkbox" id="important" name="important" onChange={handleChange}/>
          <label htmlFor="important">Important</label><br/>
          <label htmlFor="start_at">Start At:</label><br/>
          <input type="datetime-local" id="start_at" name="start_at" step="60" onChange={handleChange}/><br/>
          <label htmlFor="end_at">End At:</label><br/>
          <input type="datetime-local" id="end_at" name="end_at" step="60" onChange={handleChange}/><br/>
          <input type="submit" value="Submit"/>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }
        .actions {
          margin-top: 2rem;
        }
        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }
        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default NewNotification;
