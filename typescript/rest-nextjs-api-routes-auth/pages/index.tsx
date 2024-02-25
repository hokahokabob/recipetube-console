import React from "react";
import type { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from '../lib/prisma'

export const getServerSideProps: GetServerSideProps = async () => {
  const notifications = await prisma.notifications.findMany({
    orderBy: {
      start_at: 'desc',
    },
  });
  return {
    props: { notifications },
  };
};

type Props = {
  feed: PostProps[];
};

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>RecipeTube notifications console</h1>
        <main>
          {props.notifications.map((notification) => (
            <div key={notification.id} className="post">
              <Post post={notification} />
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

export default Blog;
