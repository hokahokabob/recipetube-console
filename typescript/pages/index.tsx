import React from "react";
import type { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Notification, { NotificationPropsWithId } from "../components/Notification";

export const getServerSideProps: GetServerSideProps = async () => {

  const notifications = await fetch(process.env.NEXT_PUBLIC_API_URL, {
    method: "GET",
    headers: {
      "X-API-Key": process.env.API_KEY,
    },
  }).then(
    (res) => res.json()
  )
  return {
    props: { notifications },
  };
};

type Props = {
  notifications: NotificationPropsWithId[];
};

const Home: React.FC<Props> = (props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const isDev = apiUrl?.includes("localhost") || apiUrl?.includes("dev-fastapi");
  return (
    <Layout>
      <div className="page">
        <h1 className={isDev ? "" : "prod"}>RecipeTube notifications console [{isDev ? "Dev" : "Production!!"}]</h1>
        <main>
          {props.notifications && props.notifications.length > 0 ? props.notifications.map((notification) => (
            <div key={notification.id} className="post">
              <Notification notification={notification} />
            </div>
          )) : null}
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

        .prod {
          color: #ff4d4f;
        }
      `}</style>
    </Layout>
  );
};

export default Home;
