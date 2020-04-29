using System;
using oixsharp.Entities;

namespace oixsharp.Repositories
{
     public class ConsumersRepository:IConsumersRepository
    {
        public Consumer GetByAddress(string address)
        {
            return new Consumer();
        }
        public Consumer[] GetAll(){
            return new Consumer[0];
        }
        
    }
}