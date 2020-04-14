#!/bin/bash

#!/bin/bash

VHOST=project
EXCHANGE=project-exchange
ADMIN_USER=admin
ADMIN_PASS=secret
MGMT_USER=mgmt
MGMT_PASS=secret
QUEUE1=queue1
QUEUE2=queue2
QUEUE3=queue3

# RabbitMQ

apt install -y -t stretch-backports rabbitmq-server

# Remove guest user

rabbitmqctl delete_user guest

# Enable admin

rabbitmq-plugins enable rabbitmq_management

curl http://localhost:15672/cli/rabbitmqadmin > /usr/local/sbin/rabbitmqadmin
chmod +x /usr/local/sbin/rabbitmqadmin

# Add users

rabbitmqctl add_vhost ${VHOST}

rabbitmqctl add_user ${ADMIN_USER} ${ADMIN_PASS}
rabbitmqctl add_user ${MGMT_USER} ${MGMT_PASS}

rabbitmqctl set_user_tags ${ADMIN_USER} administrator
rabbitmqctl set_user_tags ${MGMT_USER} management

rabbitmqctl set_permissions -p ${VHOST} ${ADMIN_USER} ".*" ".*" ".*"
rabbitmqctl set_permissions -p ${VHOST} ${MGMT_USER} ".*" ".*" ".*"

# Add queues

rabbitmqadmin -u${ADMIN_USER} -p${ADMIN_PASS} declare exchange --vhost=${VHOST} name=${EXCHANGE} type=direct durable=true

rabbitmqadmin -u${ADMIN_USER} -p${ADMIN_PASS} declare queue --vhost=${VHOST} name=${QUEUE1} durable=true auto_delete=false
rabbitmqadmin -u${ADMIN_USER} -p${ADMIN_PASS} declare queue --vhost=${VHOST} name=${QUEUE2} durable=true auto_delete=false
rabbitmqadmin -u${ADMIN_USER} -p${ADMIN_PASS} declare queue --vhost=${VHOST} name=${QUEUE3} durable=true auto_delete=false

rabbitmqadmin -u${ADMIN_USER} -p${ADMIN_PASS} declare binding --vhost=${VHOST} source=${EXCHANGE} destination=${QUEUE1}
rabbitmqadmin -u${ADMIN_USER} -p${ADMIN_PASS} declare binding --vhost=${VHOST} source=${EXCHANGE} destination=${QUEUE2}
rabbitmqadmin -u${ADMIN_USER} -p${ADMIN_PASS} declare binding --vhost=${VHOST} source=${EXCHANGE} destination=${QUEUE3}

## SSL config

cat << EOF >/etc/rabbitmq/rabbitmq.config
[
  {rabbit, [
     {ssl_listeners, [5671]},
     {ssl_options, [{cacertfile, "/etc/apache2/ssl/domain.ca"},
                    {certfile,   "/etc/apache2/ssl/domain.crt"},
                    {keyfile,    "/etc/apache2/ssl/domain.key"},
                    {verify,     verify_peer},
                    {fail_if_no_peer_cert, false}]}
   ]}
].
EOF

## Commands
#
# Get message and requeue (< 3.7.0)
# rabbitmqadmin -u<user> -p<pass> -V<vhost> get queue=<queuename> requeue=true count=1
# Get message and requeue (>= 3.7.0)
# rabbitmqadmin -u<user> -p<pass> -V<vhost> get queue=<queuename> ackmode=ack_requeue_true count=1
#
# Purge queue
# rabbitmqadmin -u<user> -p<pass> purge queue name=<queuename>
