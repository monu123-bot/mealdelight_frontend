import React, { useEffect } from 'react'
import DeliveryStatus from './DeliveryStatus'
import * as Ably from 'ably';
import { AblyProvider, ChannelProvider, useChannel, useConnectionStateListener } from 'ably/react';


const DeliveryComp = ({userId,planId}) => {

    const client = new Ably.Realtime({ key: `${process.env.REACT_APP_ABLY_API_KEY}` });
    useEffect(()=>{
         console.log('this is user id ',userId,'this is plan id ',planId)
    },[])
  return (
    <div>
        <AblyProvider client={client}>
            <ChannelProvider channelName="delivery-status">
                <DeliveryStatus userId={userId} planId={planId}/>
            </ChannelProvider>
        </AblyProvider>

    </div>
  )
}

export default DeliveryComp