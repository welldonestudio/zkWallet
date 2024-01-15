import { useEffect, useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import queryString from 'query-string';

import { DEFAULT_NETWORK } from '@/store/slice/config';

export const Connect = () => {
  const [error, setError] = useState<string>('');
  const [errorOpen, setErrorOpen] = useState<boolean>(false);

  const [accountOpen, setAccountOpen] = useState<boolean>(false);
  const [signTransactionOpen, setSignTransactionOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const { chain, jsonrpc, callback } = queryString.parse(location.search);
    if (chain !== DEFAULT_NETWORK) {
      setError(`${chain} is not support.`);
      setErrorOpen(true);
      return;
    }

    const RegExp =
      /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

    if (!callback || !(callback as string).match(RegExp)) {
      setError(`Callback url(${callback}) is not verified.`);
      setErrorOpen(true);
      return;
    }

    try {
      const {
        method,
        params,
        jsonrpc: version,
      } = JSON.parse(jsonrpc as string);
      if (version !== '2.0') {
        setError(`JsonRPC version error (${version})`);
        setErrorOpen(true);
        return;
      }

      console.log(1, method); // TODO
      console.log(2, params); // TODO

      switch (method) {
        case 'dapp:accounts':
          setAccountOpen(true);
          break;
        case 'dapp:signTransaction':
          setSignTransactionOpen(true);
          break;
        default:
          setError(`(${method}) is not support method`);
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
    </>
  );
};
