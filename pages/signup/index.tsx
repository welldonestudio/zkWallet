import { useSelector } from 'react-redux';
import { selectAuthState } from '@/store/slice/authSlice';
import { SelectProviderPage } from '@/component/pages/signup/selectProvider';
import { SignUpCallbackPage } from '@/component/pages/signup/callback';

export default function SignUpPage() {
  const authState = useSelector(selectAuthState);

  return (
    <>
      {!authState && <SelectProviderPage />}
      {authState && !authState.jwt && <SignUpCallbackPage />}
    </>
  );
}
