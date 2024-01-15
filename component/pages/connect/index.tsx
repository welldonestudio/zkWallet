import { useEffect, useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import queryString from 'query-string';

import { GetAccountsModal } from '@/component/dialog/getAccounts';
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

      console.log(1, parsed.method); // TODO
      console.log(2, parsed.params); // TODO

      setId(params.id);
      setCallback(url as string);
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
      <Dialog
        open={errorOpen}
        onClose={() => {
          setErrorOpen(false);
        }}
      >
        <DialogTitle>Error</DialogTitle>
        <DialogContent>{error}</DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <GetAccountsModal
        open={accountOpen}
        onClose={() => {
          setAccountOpen(false);
        }}
        callback={callback}
        method={method}
        id={id}
      />
    </>
  );
};
