import React, { useEffect, useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

import KittyCards from './KittyCards';

export default function Kitties (props) {
  const { api, keyring } = useSubstrate();
  const { accountPair } = props;

  const [kittyCnt, setKittyCnt] = useState(0);
  const [kittyDNAs, setKittyDNAs] = useState([]);
  const [kittyOwners, setKittyOwners] = useState([]);
  const [kittyPrices, setKittyPrices] = useState([]);
  const [kitties, setKitties] = useState([]);
  const [status, setStatus] = useState('');
  // const {
  //   address,
  //   meta: { source, isInjected }
  // } = accountPair;

  const fetchKittyCnt = () => {
    let unsubscribe;

    api.query.kittiesModule.kittiesCount( (newValue) => {
      if (newValue.isNone) {

      } else {
        console.log("lalalalaKitties:"+newValue)
        setKittyCnt(newValue);
      }
    }).then(unsub => {
      unsubscribe = unsub;
    })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  };

  const fetchKitties = () => {
    console.log("accountPair:"+JSON.stringify(accountPair),"Fetchkeyring:"+JSON.stringify(keyring))
    let unsubscribe;

    if(accountPair !== null) {
      api.query.kittiesModule.ownedKitties(accountPair.addressRaw, (newValue) => {
        // The storage value is an Option<u32>
        // So we have to check whether it is None first
        // There is also unwrapOr
        if (newValue.isNone) {
          console.log("is None")
        } else {
          console.log("lalalalaKittiesFetch:" + newValue)
          setKitties(newValue.unwrap());
        }
      }).then(unsub => {
        unsubscribe = unsub;
      })
        .catch(console.error);

      return () => unsubscribe && unsubscribe();
    }
  };

  const populateKitties = () => {
    /* TODO: 加代码，从 substrate 端读取数据过来 */
  };

  useEffect(fetchKittyCnt, [api, keyring]);
  useEffect(fetchKitties, [api, kittyCnt,accountPair]);
  useEffect(populateKitties, [kittyDNAs, kittyOwners]);

  return <Grid.Column width={16}>
    <h1>小毛孩共有{kittyCnt.toString()}个</h1>
    <KittyCards kitties={kitties} accountPair={accountPair} setStatus={setStatus}/>
    <Form style={{ margin: '1em 0' }}>
      <Form.Field style={{ textAlign: 'center' }}>
        <TxButton
          accountPair={accountPair} label='创建小毛孩' type='SIGNED-TX' setStatus={setStatus}
          attrs={{
            palletRpc: 'kittiesModule',
            callable: 'create',
            inputParams: [],
            paramFields: []
          }}
        />
        <TxButton
          accountPair={accountPair} label='查询小毛孩' type='QUERY' setStatus={setStatus}
          attrs={{
            palletRpc: 'kittiesModule',
            callable: 'ownedKitties',
            inputParams: [],
            paramFields: []
          }}
        />
      </Form.Field>
    </Form>
    <div style={{ overflowWrap: 'break-word' }}>{status}</div>
  </Grid.Column>;
}
