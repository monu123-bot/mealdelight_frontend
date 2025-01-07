import React, { useEffect, useState } from 'react'
import {  useChannel } from 'ably/react';

const DeliveryStatus = ({userId,planId}) => {
 const [messages, setMessages] = useState('');

//   useConnectionStateListener('connected', () => {
//     console.log('Connected to Ably!');
//   });
   
   const eventName = `status:${userId}:${planId}`;
   console.log('eventName: ',eventName)
   useChannel('delivery-status', eventName, (message) => {
    setMessages(message);
  });
   
  useEffect(()=>{
    console.log(messages)
  },[messages])

  return (
    <div>
       {messages.data}
    </div>
  )
}

export default DeliveryStatus