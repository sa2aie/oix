using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using oixsharp.Entities;
using oixsharp.Repositories;

namespace oixsharp.Controllers
{
    [ApiController]
    [Route("/v1/[controller]")]
    public class ConsumersController : ControllerBase
    {

        private readonly ILogger<ConsumersController> _logger;

        public ConsumersController(ILogger<ConsumersController> logger)
        {
            _logger = logger;
        }

        [HttpGet("{address}")]
        public Consumer  GetById(string address, [FromServices] IConsumersRepository repo)
        {
            return repo.GetByAddress(address);
        }

        [HttpGet]
        public Consumer[]  Get([FromServices] IConsumersRepository repo)
        {
            return repo.GetAll();
        }
    }
}
