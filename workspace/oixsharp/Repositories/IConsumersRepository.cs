using System;
using oixsharp.Entities;

namespace oixsharp.Repositories
{
    public interface IConsumersRepository
    {
         Consumer GetByAddress(string address);
         Consumer[] GetAll();
        
    }
}