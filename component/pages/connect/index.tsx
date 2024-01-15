import { useEffect } from 'react';

import queryString from 'query-string';

export const Connect = () => {
  useEffect(() => {
    const { chain, jsonrpc, callback } = queryString.parse(location.search);
    console.log(chain, jsonrpc, callback);
  }, [location]);

  return <>connect</>;
};
