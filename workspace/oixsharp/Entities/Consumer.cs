using System;

namespace oixsharp.Entities
{
    public class Consumer
    {
        public Consumer() {

        }

        public string endpoint {get;set;}
        public string address {get;set;}
        public string type {get;set;}
        public string public_key_type {get;set;}
        public string public_key {get;set;}
        public string environment {get;set;}
        public string[] accepts {get;set;}
        public string[] versions {get;set;}
       
    }
}