import React from "react";
import type { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Notification, { NotificationPropsWithId } from "../components/Notification";

export const getServerSideProps: GetServerSideProps = async () => {

  const notifications = await fetch(process.env.API_URL, {
    method: "GET",
    headers: { "X-API-Key": process.env.API_KEY },
  }).then(
    (res) => res.json()
  )
  console.log(notifications)
  return {
    props: { notifications },
  };
};

type Props = {
  notifications: NotificationPropsWithId[];
};

const Home: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>RecipeTube notifications console</h1>
        <main>
          {props.notifications.map((notification) => (
            <div key={notification.id} className="post">
              <Notification notification={notification} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Home;
