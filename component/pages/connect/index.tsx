import { useEffect, useState } from 'react';

import queryString from 'query-string';

import {
  GetAccountsModal,
  SignTransactionModal,
} from '@/component/dialog/connection';
import { WarningModal } from '@/component/dialog/warning';
import { DEFAULT_NETWORK } from '@/store/slice/config';

export const Connect = () => {
  const [error, setError] = useState<string>('');
  const [errorOpen, setErrorOpen] = useState<boolean>(false);

  const [accountOpen, setAccountOpen] = useState<boolean>(false);
  const [signTransactionOpen, setSignTransactionOpen] =
    useState<boolean>(false);
  const [id, setId] = useState<number>(0);
  const [callback, setCallback] = useState<string>('');
  const [method, setMethod] = useState<string>('');
  const [params, setParams] = useState<any | undefined>(undefined);

  useEffect(() => {
    const {
      chain,
      jsonrpc,
      callback: url,
    } = queryString.parse(location.search);
    if (chain !== DEFAULT_NETWORK) {
      setError(`${chain} is not support.`);
      setErrorOpen(true);
      return;
    }

    const RegExp =
      /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

    if (!url || !(url as string).match(RegExp)) {
      setError(`Callback url(${url}) is not verified.`);
      setErrorOpen(true);
      return;
    }

    try {
      const parsed = JSON.parse(jsonrpc as string);
      if (parsed.jsonrpc !== '2.0') {
        setError(`JsonRPC version error (${jsonrpc})`);
        setErrorOpen(true);
        return;
      }

      if (isNaN(parsed.id)) {
        setError(`id (${parsed.id}) is not a number`);
        setErrorOpen(true);
        return;
      }

      setCallback(url as string);
      setId(parsed.id);
      setMethod(parsed.method);
      setParams(parsed.params);

      switch (parsed.method) {
        case 'dapp:accounts':
          setAccountOpen(true);
          break;
        case 'dapp:signTransaction':
          setSignTransactionOpen(true);
          break;
        default:
          setError(`(${parsed.method}) is not support method`);
          setErrorOpen(true);
          break;
      }
    } catch (error) {
      setError(`json parse error (${error}).`);
      setErrorOpen(true);
    }
  }, [location]);

  return (
    <>
      <WarningModal
        title="Error"
        desc={error}
        open={errorOpen}
        onClose={() => {
          setErrorOpen(false);
        }}
      />
      <GetAccountsModal
        open={accountOpen}
        onClose={() => {
          setAccountOpen(false);
        }}
        callback={callback}
        method={method}
        params={params}
        id={id}
      />
      <SignTransactionModal
        open={signTransactionOpen}
        onClose={() => {
          setSignTransactionOpen(false);
        }}
        callback={callback}
        method={method}
        params={params}
        id={id}
      />
    </>
  );
};
