using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace oixsharp.Controllers
{
    [ApiController]
    [Route("/v1/[controller]")]
    public class ReceiveController : ControllerBase
    {

        private readonly ILogger<WeatherForecastController> _logger;

        public ReceiveController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public string[]  Post(JObject message)
        {
        }
    }
}
