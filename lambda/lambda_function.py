import sys
import logging
import pymysql
import json
import os
from pymysql.cursors import DictCursor

# rds settings
user_name = os.environ['USER_NAME']
password = os.environ['PASSWORD']
rds_proxy_host = os.environ['RDS_PROXY_HOST']
db_name = os.environ['DB_NAME']

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# create the database connection outside of the handler to allow connections to be
# re-used by subsequent function invocations.
try:
        conn = pymysql.connect(host=rds_proxy_host, user=user_name, passwd=password, db=db_name, connect_timeout=5)
except pymysql.MySQLError as e:
    logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
    logger.error(e)
    sys.exit(1)

logger.info("SUCCESS: Connection to RDS for MySQL instance succeeded")


def lambda_handler(event, context):
    """
    This function controls CRUD for notifications based on request header
    """
    # API Gatewayのエンドポイントを分けるのが面倒だったので、サボりとしてrequest header経由で処理内容を分岐している。
    function_name = event['headers']['X-Function-Name']
    logger.info('Function-Name: ' + function_name)

    if function_name == 'notification/list':
        with conn.cursor(DictCursor) as cur:
            select_sql = 'select ' \
                         '  id,title,content,notification_div,important, ' \
                         '  DATE_FORMAT(start_at, "%Y-%m-%d %H:%i") as start_at, ' \
                         '  DATE_FORMAT(end_at, "%Y-%m-%d %H:%i") as end_at ' \
                         'from ' \
                         '  notifications'
            cur.execute(select_sql)
            result = cur.fetchall()
            logger.info("fetched notifications")
            logger.info(result)
            return result

    if function_name == 'notification/add':
        request_body = event['body']
        title = request_body['title']
        content = request_body['content']
        notification_div = request_body['notification_div']
        important = '1' if request_body['important'] else '0'
        start_at = request_body['start_at']
        end_at = request_body['end_at']

        item_count = 0
        sql_string = f"insert into notifications(title,content,notification_div,important, start_at, end_at, created) values\
          ('{title}','{content}', '{notification_div}', '{important}', '{start_at}', '{end_at}', now())"

        with conn.cursor() as cur:
            cur.execute(sql_string)
            conn.commit()
            cur.execute("select * from notifications")
            logger.info("The following items have been added to the database:")
            for row in cur:
                item_count += 1
                logger.info(row)
        conn.commit()

        return "Added %d items to RDS for MySQL table" % item_count

    if function_name == 'notification/delete':
        notification_id = event['headers']['X-Target-Notification-Id']
        sql_string = f"delete from notifications where id = '{notification_id}'"
        with conn.cursor() as cur:
            cur.execute(sql_string)
            conn.commit()
        logger.info(f"deleted notification with id {notification_id}")
        return {
            "result": "successfully deleted"
        }
