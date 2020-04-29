using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Converters;
using RabbitMQ.Client;
using System.Text;

namespace oixsharp.Controllers
{
    [ApiController]
    [Route("/v1/[controller]")]
    public class ReceiveController : ControllerBase
    {

        private readonly ILogger<ReceiveController> _logger;

        public ReceiveController(ILogger<ReceiveController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public string[]  Post([FromBody]object message)
        {

            dynamic msg = JObject.Parse(message.ToString());

            SendMessage(msg);
            Console.WriteLine(">"+msg.header.recipients.ToString());
         //   _logger.LogInformation(msg.name);
          return null;
        }
        public void SendMessage(dynamic msg)
        {
            var factory = new ConnectionFactory() { HostName = "localhost",UserName="oix",Password="badpass",VirtualHost="oix" };
            using(var connection = factory.CreateConnection())

            using(var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: "incomming",
                                    durable: true,
                                    exclusive: false,
                                    autoDelete: false,
                                    arguments: null);

                foreach (var recipient in msg.header.recipients)
                {
                string message = msg.ToString();
                string routingKey = recipient.ToString();
                var body = Encoding.UTF8.GetBytes(message);

                channel.BasicPublish(exchange: "",
                                    routingKey: routingKey,
                                    basicProperties: null,
                                    body: body);

                Console.WriteLine($"Enqueued>> [{routingKey}] >> {message}");
                }
            }

            
        }
    }
}
